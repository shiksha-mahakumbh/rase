"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AdminRole } from "@/types/registration";
import type { PermissionSlug } from "@/lib/permissions";
import {
  canMutateCms,
  canPerformCheckIn,
  roleHasPermission,
  canUpdateRegistrations,
} from "@/lib/admin-role-capabilities";

export type AdminUser = {
  uid: string;
  email: string;
};

interface AdminContextValue {
  user: AdminUser | null;
  role: AdminRole | null;
  permissions: PermissionSlug[];
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
  const [permissions, setPermissions] = useState<PermissionSlug[]>([]);
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
          setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
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
    setPermissions(Array.isArray(data.permissions) ? data.permissions : []);

    const bootstrap = await fetch("/api/admin/session/bootstrap", {
      credentials: "include",
      cache: "no-store",
    });
    const bootData = await bootstrap.json();
    if (bootData.authenticated && Array.isArray(bootData.permissions)) {
      setPermissions(bootData.permissions);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setUser(null);
    setRole(null);
    setPermissions([]);
    window.location.assign("/admin");
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        role,
        permissions,
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

export { canMutateCms, canPerformCheckIn };

export function canAccessSensitiveAdmin(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return roleHasPermission(role, "audit_logs.read", permissions);
}

export function canManageStatus(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return canUpdateRegistrations(role, permissions);
}

export function canExport(
  role: AdminRole | null,
  permissions?: readonly PermissionSlug[] | null
): boolean {
  return roleHasPermission(role, "registrations.export", permissions);
}
