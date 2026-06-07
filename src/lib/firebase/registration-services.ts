import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { app } from "./client";

/** Auth + Storage — import only from registration/admin routes, not contact/footer */
export const auth = getAuth(app);
export const storage = getStorage(app);
