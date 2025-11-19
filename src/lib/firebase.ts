// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "SENSITIVE_INFO",
  authDomain: "SENSITIVE_INFO",
  projectId: "SENSITIVE_INFO",
  storageBucket: "SENSITIVE_INFO",
  messagingSenderId: "SENSITIVE_INFO",
  appId: "SENSITIVE_INFO",
  measurementId: "SENSITIVE_INFO"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize and Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);