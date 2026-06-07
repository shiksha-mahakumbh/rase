export { app, db, firebaseConfig } from "./firebase/client";
export { auth, storage } from "./firebase/registration-services";
export {
  getFirebaseAuth,
  getFirebaseStorage,
  getFirebaseAnalytics,
} from "./firebase/lazy";
