"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AdminRole } from "@/types/registration";

export type AdminUser = {
  uid: string;
  email: string;
};

interface AdminContextValue {
  user: AdminUser | null;
  role: AdminRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

const AUTH_INIT_TIMEOUT_MS = 8000;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
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

    void (async () => {
      try {
        const res = await fetch("/api/admin/session/bootstrap", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (data.authenticated) {
          setUser({ uid: data.uid, email: data.email });
          setRole(data.role as AdminRole);
        }
      } catch (error) {
        console.error("Admin session bootstrap failed:", error);
      } finally {
        window.clearTimeout(timeoutId);
        finishLoading();
      }
    })();

    return () => {
      settled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(typeof err.error === "string" ? err.error : "Login failed");
    }
    const data = await res.json();
    setUser({ uid: data.uid ?? "", email: data.email });
    setRole(data.role as AdminRole);
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setUser(null);
    setRole(null);
    window.location.assign("/admin");
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

export function canMutateCms(role: AdminRole | null): boolean {
  return role === "Super Admin" || role === "Admin";
}

/** Sensitive admin reads and CMS mutations (Super Admin & Admin). */
export function canAccessSensitiveAdmin(role: AdminRole | null): boolean {
  return canMutateCms(role);
}

/** @deprecated use canMutateCms */
export function canManageStatus(role: AdminRole | null): boolean {
  return canMutateCms(role);
}

export function canExport(role: AdminRole | null): boolean {
  return role === "Super Admin" || role === "Admin" || role === "Data Entry";
}

export function canPerformCheckIn(role: AdminRole | null): boolean {
  return canExport(role);
}
