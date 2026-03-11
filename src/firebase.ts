import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// As chaves do Firebase Web SDK são públicas por design e necessárias no build do React.
const firebaseConfig = {
  apiKey: "AIzaSyAZTcyd71J2c5e9f-mbHmgMPp5A6M3Ndh4",
  authDomain: "barbearia---g.firebaseapp.com",
  projectId: "barbearia---g",
  storageBucket: "barbearia---g.firebasestorage.app",
  messagingSenderId: "629483060813",
  appId: "1:629483060813:web:120725833ca34914092604",
  measurementId: "G-YM6T0BFQWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);
