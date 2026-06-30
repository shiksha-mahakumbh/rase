"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/lib/adminAuth";

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
  const { user, role, logout } = useAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <span className="text-sm font-bold text-brand-navy">
            {variant === "standalone" ? "Event check-in gate" : "Check-in"}
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden max-w-[140px] truncate text-slate-600 sm:inline" title={user?.email ?? ""}>
              {role}
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
        {variant === "embedded" && (
          <nav className="mx-auto flex max-w-lg gap-1 overflow-x-auto px-4 pb-2" aria-label="Check-in navigation">
            {GATE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                  pathname === item.href ? "bg-brand-navy text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content" className="mx-auto max-w-lg p-4 pb-8">
        {children}
      </main>
    </div>
  );
}
