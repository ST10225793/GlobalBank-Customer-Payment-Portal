import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMBW769bWYyz32GBkgesh8ztRJg8CRUdo",
  authDomain: "banking-payment-system.firebaseapp.com",
  databaseURL: "https://banking-payment-system-default-rtdb.firebaseio.com",
  projectId: "banking-payment-system",
  storageBucket: "banking-payment-system.firebasestorage.app",
  messagingSenderId: "310545241999",
  appId: "1:310545241999:web:caa7c185fdc59e0ffeddfa"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);