import React, { createContext, useState, useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { ref, get } from 'firebase/database';

import { auth, db } from '../firebase';



const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();



  // Helper to fetch profile from Realtime Database

  const getUserProfile = async (uid) => {

    try {

      // FIX: Use backticks for template literals and .val() for data

      const userRef = ref(db, `customers/${uid}`);

      const snapshot = await get(userRef);

      return snapshot.exists() ? snapshot.val() : null;

    } catch (error) {

      console.error("Error fetching user profile:", error);

      return null;

    }

  };



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      try {

        if (!firebaseUser) {

          setUser(null);

          localStorage.removeItem('user');

          setLoading(false);

          return;

        }



        const profile = await getUserProfile(firebaseUser.uid);

        const userData = { ...firebaseUser, ...profile };

        setUser(userData);

        setLoading(false);

      } catch (error) {

        console.error("Auth state change error:", error);

        setLoading(false);

      }

    });

    return () => unsubscribe();

  }, []);



  const login = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Firebase Auth successful, fetching profile for:", userCredential.user.uid);

    const profile = await getUserProfile(userCredential.user.uid);
    console.log("Profile fetched:", profile); // TRACKING POINT C

    if (!profile) {
      throw new Error("Profile not found in database.");
    }
    
    const userData = { uid: userCredential.user.uid, ...profile };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true, userRole: userData.role };
  } catch (error) {
    console.error("Login function error:", error);
    throw error;
  }
};



  const logout = async () => {

    await signOut(auth);

    setUser(null);

    localStorage.removeItem('user');

    navigate('/login');

  };



  return (

    <AuthContext.Provider value={{ user, login, logout, loading }}>

      {children}

    </AuthContext.Provider>

  );

};



export default AuthContext;