"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/lib/adminAuth";

const REG_NAV = [
  { href: "/admin", label: "Registration dashboard" },
  { href: "/admin/cms/receipts", label: "Receipts & QR" },
  { href: "/admin/cms/payments", label: "Payments" },
  { href: "/admin/cms/checkin", label: "Event check-in" },
  { href: "/admin/cms/attendees", label: "Attendees" },
  { href: "/admin/cms", label: "Full CMS panel →" },
] as const;

export default function AdminRegistrationsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, logout } = useAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="text-sm font-bold text-brand-navy">
            Registration admin
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-600 sm:inline">
              {user?.email} · {role}
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2" aria-label="Registration admin">
          {REG_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-brand-navy text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
