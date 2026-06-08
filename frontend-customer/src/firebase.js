import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDMBW769bWYyz32GBkgesh8ztRJg8CRUdo",
  authDomain: "banking-payment-system.firebaseapp.com",
  databaseURL: "https://banking-payment-system-default-rtdb.firebaseio.com",
  projectId: "banking-payment-system",
  storageBucket: "banking-payment-system.firebasestorage.app",
  messagingSenderId: "310545241999",
  appId: "1:310545241999:web:caa7c185fdc59e0ffeddfa"
};

// This check is the "lock" that prevents the fatal error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);