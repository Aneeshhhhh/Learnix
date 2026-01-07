// Safe firebase wrapper: exports stubs unless properly configured.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const rawConfig = {
  apiKey: "SENSITIVE_INFO",
  authDomain: "SENSITIVE_INFO",
  projectId: "SENSITIVE_INFO",
  storageBucket: "SENSITIVE_INFO",
  messagingSenderId: "SENSITIVE_INFO",
  appId: "SENSITIVE_INFO",
  measurementId: "SENSITIVE_INFO",
};

const hasRealConfig = Object.values(rawConfig).some((v) => typeof v === "string" && v !== "SENSITIVE_INFO" && v.trim().length > 0);
export const firebaseEnabled = hasRealConfig && Boolean((import.meta as any)?.env?.VITE_ENABLE_FIREBASE);

let auth: any = undefined;
let db: any = undefined;

try {
  if (firebaseEnabled) {
    const app = initializeApp(rawConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  // Leave stubs undefined if init fails
}

export { auth, db };