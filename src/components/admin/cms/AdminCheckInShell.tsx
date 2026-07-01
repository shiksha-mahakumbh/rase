"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/lib/adminAuth";
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
  const { user, role, logout } = useAdmin();

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
      <main id="admin-main-content" className="mx-auto max-w-lg p-4 pb-8">
        {children}
      </main>
    </div>
  );
}
