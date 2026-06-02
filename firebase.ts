import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const db = getFirestore(app);
const storage = getStorage(app);

export { firebaseConfig, app, db, storage };
