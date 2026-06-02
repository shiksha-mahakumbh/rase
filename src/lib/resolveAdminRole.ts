import { User } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminRole } from "@/types/registration";

function getBootstrapEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isBootstrapAdminEmail(
  email: string | null | undefined
): boolean {
  if (!email) return false;
  return getBootstrapEmails().includes(email.toLowerCase());
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore request timed out")), ms)
    ),
  ]);
}

async function persistAdminUser(user: User, role: AdminRole): Promise<void> {
  try {
    await setDoc(doc(db, "adminUsers", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? "",
      role,
      source: "bootstrap",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Could not write adminUsers document:", error);
  }
}

export async function resolveAdminRole(user: User): Promise<AdminRole | null> {
  if (isBootstrapAdminEmail(user.email)) {
    void persistAdminUser(user, "Super Admin");
    return "Super Admin";
  }

  try {
    const adminRef = doc(db, "adminUsers", user.uid);
    const adminDoc = await withTimeout(getDoc(adminRef), 6000);

    if (adminDoc.exists()) {
      return (adminDoc.data().role as AdminRole) ?? null;
    }
  } catch (error) {
    console.warn("adminUsers lookup failed:", error);
    if (isBootstrapAdminEmail(user.email)) {
      return "Super Admin";
    }
  }

  return null;
}
