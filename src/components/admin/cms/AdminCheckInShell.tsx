"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdmin, canAccessCheckInGate, canPerformCheckIn } from "@/lib/adminAuth";
import AdminHeader from "./AdminHeader";

const GATE_LINKS = [
  { href: "/admin/cms/checkin", label: "CMS check-in" },
  { href: "/event/checkin", label: "Mobile gate" },
  { href: "/admin", label: "Registrations" },
  { href: "/admin/cms/attendees", label: "Attendees" },
] as const;

export default function AdminCheckInShell({
  children,
  variant = "embedded",
}: {
  children: React.ReactNode;
  variant?: "embedded" | "standalone";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, permissions, loading, logout } = useAdmin();
  const canAccess = canAccessCheckInGate(role, permissions);
  const canMutate = canPerformCheckIn(role, permissions);
  const accessDenied = Boolean(role) && !loading && !canAccess;

  useEffect(() => {
    if (accessDenied) router.replace("/admin");
  }, [accessDenied, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading check-in…</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-center text-sm text-slate-600">
          Your account does not have permission to access check-in.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title={variant === "standalone" ? "Event check-in gate" : "Check-in"}
        userEmail={user?.email}
        role={role}
        onLogout={() => logout()}
        trailing={
          variant === "embedded" ? (
            <nav
              className="mx-auto flex max-w-lg gap-1 overflow-x-auto px-4 pb-2"
              aria-label="Check-in navigation"
            >
              {GATE_LINKS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                      active ? "bg-brand-navy text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : undefined
        }
      />
      {!canMutate && (
        <p className="mx-auto max-w-lg px-4 pt-3 text-center text-xs text-amber-800">
          Lookup only — gate actions require registrations update permission.
        </p>
      )}
      <main id="admin-main-content" className="mx-auto max-w-lg p-4 pb-8">
        {children}
      </main>
    </div>
  );
}
