import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            fullName: userData.fullName,
            accountNumber: userData.accountNumber,
            email: userData.email,
            name: userData.name,
            role: userData.role || 'customer'
          });
          localStorage.setItem('user', JSON.stringify({
            uid: firebaseUser.uid,
            fullName: userData.fullName,
            accountNumber: userData.accountNumber,
            role: userData.role || 'customer'
          }));
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Customer Login
  const login = async (credentials, role) => {
    try {
      if (role === 'staff') {
        // Staff login - uses Firebase Auth with real staff account
        const email = "staff@globalbank.com";
        const password = credentials.password;
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userInfo = {
            uid: firebaseUser.uid,
            name: userData.name,
            email: email,
            role: 'staff'
          };
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
          return { success: true };
        } else {
          return { success: false, error: 'Staff account not properly configured' };
        }
      }

      // Customer login
      const email = `${credentials.accountNumber}@banking.local`;
      const userCredential = await signInWithEmailAndPassword(auth, email, credentials.password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userInfo = {
          uid: firebaseUser.uid,
          fullName: userData.fullName,
          accountNumber: userData.accountNumber,
          role: 'customer'
        };
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Invalid account number or password';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Account not found. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const email = `${userData.accountNumber}@banking.local`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, userData.password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: userData.fullName });
      
      await setDoc(doc(db, "users", firebaseUser.uid), {
        fullName: userData.fullName,
        idNumber: userData.idNumber,
        accountNumber: userData.accountNumber,
        role: 'customer',
        createdAt: new Date().toISOString()
      });
      
      const userInfo = {
        uid: firebaseUser.uid,
        fullName: userData.fullName,
        accountNumber: userData.accountNumber,
        role: 'customer'
      };
      
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Account number already registered';
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};