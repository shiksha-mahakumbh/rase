export { app, db, firebaseConfig } from "@/lib/firebase/client";
export { auth, storage } from "@/lib/firebase/registration-services";
export {
  getFirebaseAuth,
  getFirebaseStorage,
  getFirebaseAnalytics,
} from "@/lib/firebase/lazy";
