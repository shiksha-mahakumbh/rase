"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AdminRole } from "@/types/registration";
import { resolveAdminRole } from "@/lib/resolveAdminRole";

interface AdminContextValue {
  user: User | null;
  role: AdminRole | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

const AUTH_INIT_TIMEOUT_MS = 12000;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let settled = false;

    const finishLoading = () => {
      if (!settled) {
        settled = true;
        setLoading(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      console.warn("Admin auth init timed out — showing login screen.");
      finishLoading();
    }, AUTH_INIT_TIMEOUT_MS);

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      void (async () => {
        try {
          setUser(firebaseUser);
          if (firebaseUser) {
            const resolvedRole = await resolveAdminRole(firebaseUser);
            setRole(resolvedRole);
          } else {
            setRole(null);
          }
        } catch (error) {
          console.error("Admin auth error:", error);
          setRole(null);
        } finally {
          window.clearTimeout(timeoutId);
          finishLoading();
        }
      })();
    });

    return () => {
      settled = true;
      window.clearTimeout(timeoutId);
      unsub();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,
        isAdmin: !!role,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export function canManageStatus(role: AdminRole | null): boolean {
  return role === "Super Admin" || role === "Admin";
}

export function canExport(role: AdminRole | null): boolean {
  return role === "Super Admin" || role === "Admin" || role === "Data Entry";
}
