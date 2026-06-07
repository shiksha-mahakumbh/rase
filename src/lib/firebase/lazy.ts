import { app } from "./client";

/** Lazy Auth — loaded only when admin/auth flows need it */
export async function getFirebaseAuth() {
  const { getAuth } = await import("firebase/auth");
  return getAuth(app);
}

/** Lazy Storage — loaded only for file upload forms */
export async function getFirebaseStorage() {
  const { getStorage } = await import("firebase/storage");
  return getStorage(app);
}

/** Lazy Analytics — loaded only after user interaction / analytics loader */
export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(app);
}
