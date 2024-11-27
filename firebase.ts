// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB6FJEBNv-4QtqQ4FR3-Jj6Y0r1sVu030",
  authDomain: "dhe-sm.firebaseapp.com",
  projectId: "dhe-sm",
  storageBucket: "dhe-sm.appspot.com",
  messagingSenderId: "59719303159",
  appId: "1:59719303159:web:b2917b02e61eb1f76c38f2",
  measurementId: "G-Q7GLHKCFZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export initialized instances and configuration
export { firebaseConfig, app, db, storage };
