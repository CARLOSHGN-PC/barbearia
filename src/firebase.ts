import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { User, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredEnvKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

for (const key of requiredEnvKeys) {
  if (!import.meta.env[key]) {
    throw new Error(`Variável obrigatória ausente: ${key}`);
  }
}

const app = initializeApp(firebaseConfig);

export const analytics = typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  ? getAnalytics(app)
  : null;
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export const isAdminUser = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  const token = await user.getIdTokenResult(true);
  return token.claims.admin === true;
};
