"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/lib/adminAuth";
import { REGISTRATION_NAV } from "./admin-nav";
import AdminHeader from "./AdminHeader";

export default function AdminRegistrationsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, logout } = useAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Registration admin"
        titleHref="/admin"
        userEmail={user?.email}
        role={role}
        onLogout={() => logout()}
        trailing={
          <nav
            className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2"
            aria-label="Registration admin"
          >
            {REGISTRATION_NAV.map((item) => {
              const active =
                item.href === "/admin/cms"
                  ? pathname === "/admin/cms"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
                    active
                      ? "bg-brand-navy text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        }
        className="border-b border-slate-200"
      />

      <main id="admin-main-content" className="mx-auto max-w-6xl p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
