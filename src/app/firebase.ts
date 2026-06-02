import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDL6UJwLh8KaNHARuedHNTjWIcFixkfv5s",
  authDomain: "shiksha-mahakumbh-abhiyan.firebaseapp.com",
  projectId: "shiksha-mahakumbh-abhiyan",
  storageBucket: "shiksha-mahakumbh-abhiyan.firebasestorage.app",
  messagingSenderId: "316847987997",
  appId: "1:316847987997:web:90e1d6b1971bbe1091d5f4",
  measurementId: "G-WVH4YJCJHV",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);

let analytics: Analytics | null = null;

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;

  const supported = await isSupported();
  if (supported) {
    analytics = getAnalytics(app);
  }
  return analytics;
}

export { auth, firebaseConfig, app, storage };
