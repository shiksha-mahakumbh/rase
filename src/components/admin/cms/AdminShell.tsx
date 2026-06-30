"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAdmin } from "@/lib/adminAuth";
import {
  CMS_NAV_GROUPS,
  filterCmsNavForRole,
  getManageOnlyNavHrefs,
  canAccessNavItem,
} from "./admin-nav";
import { CmsReadOnlyBanner } from "./AdminUi";

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-navy text-white"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}

const MANAGE_ONLY_PATHS = getManageOnlyNavHrefs();

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = filterCmsNavForRole(role);

  useEffect(() => {
    if (!role) return;
    const blocked = MANAGE_ONLY_PATHS.some(
      (href) => pathname === href || pathname.startsWith(`${href}/`)
    );
    if (blocked && !canAccessNavItem(role, "manage")) {
      toast.error("You do not have access to that page.");
      router.replace("/admin/cms");
    }
  }, [pathname, role, router]);

  const groups = Object.keys(CMS_NAV_GROUPS) as Array<keyof typeof CMS_NAV_GROUPS>;

  const sidebar = (
    <nav className="flex flex-col gap-6 p-4" aria-label="Admin navigation">
      <div>
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Shiksha Mahakumbh
        </p>
        <p className="px-3 text-sm font-semibold text-brand-navy">CMS Admin</p>
      </div>
      {groups.map((group) => {
        const items = navItems.filter((item) => item.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {CMS_NAV_GROUPS[group]}
            </p>
            <div className="space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={
                    item.href === "/admin"
                      ? pathname === "/admin" || pathname.startsWith("/admin/registrations")
                      : item.href === "/admin/cms"
                        ? pathname === "/admin/cms"
                        : pathname.startsWith(item.href)
                  }
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="admin-sidebar"
            >
              Menu
            </button>
            <Link href="/admin/cms" className="text-sm font-bold text-brand-navy">
              CMS Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-600 sm:inline">
              {user?.email} · {role}
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside
          id="admin-sidebar"
          className={`${
            mobileOpen ? "block" : "hidden"
          } w-full shrink-0 border-b border-slate-200 bg-white md:block md:w-60 md:border-b-0 md:border-r`}
        >
          {sidebar}
        </aside>
        <main id="main-content" className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <CmsReadOnlyBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
