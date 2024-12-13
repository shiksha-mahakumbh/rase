// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import storage

const firebaseConfig = {
  apiKey: "AIzaSyAnxFHB9rz60iStUZ70zop6rBlqkTSl2zI",
  authDomain: "rase-c8594.firebaseapp.com",
  projectId: "rase-c8594",
  storageBucket: "rase-c8594.appspot.com",
  messagingSenderId: "428952546898",
  appId: "1:428952546898:web:ccf223d18fe876cbce798b",
  measurementId: "G-VL5Z20KGVR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize storage