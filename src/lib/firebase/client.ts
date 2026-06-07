import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDL6UJwLh8KaNHARuedHNTjWIcFixkfv5s",
  authDomain: "shiksha-mahakumbh-abhiyan.firebaseapp.com",
  projectId: "shiksha-mahakumbh-abhiyan",
  storageBucket: "shiksha-mahakumbh-abhiyan.firebasestorage.app",
  messagingSenderId: "316847987997",
  appId: "1:316847987997:web:90e1d6b1971bbe1091d5f4",
  measurementId: "G-WVH4YJCJHV",
};

export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/** Firestore only — avoids bundling Auth/Storage/Analytics on contact/footer routes */
export const db: Firestore = getFirestore(app);
