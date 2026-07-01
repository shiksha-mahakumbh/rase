"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAdmin } from "@/lib/adminAuth";
import {
  CMS_NAV_GROUPS,
  filterCmsNavForRole,
  canAccessNavItem,
  isNavItemActive,
  isManageOnlyPath,
  getNavGroupForPath,
} from "./admin-nav";
import { CmsReadOnlyBanner } from "./AdminUi";
import AdminHeader from "./AdminHeader";

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
      aria-current={active ? "page" : undefined}
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

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4" aria-hidden="true">
      <div className="space-y-2 px-3">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      </div>
      {[1, 2, 3].map((group) => (
        <div key={group} className="space-y-2">
          <div className="mx-3 h-2 w-16 animate-pulse rounded bg-slate-200" />
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="mx-3 h-8 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = filterCmsNavForRole(role);
  const manageBlocked =
    Boolean(role) && isManageOnlyPath(pathname) && !canAccessNavItem(role, "manage");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!role || !manageBlocked) return;
    toast.error("You do not have access to that page.");
    router.replace("/admin/cms");
  }, [manageBlocked, role, router]);

  const groups = Object.keys(CMS_NAV_GROUPS) as Array<keyof typeof CMS_NAV_GROUPS>;

  const sidebar =
    loading || !role ? (
      <SidebarSkeleton />
    ) : (
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
                    active={isNavItemActive(pathname, item)}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    );

  const navGroup = getNavGroupForPath(pathname);
  const showCmsReadOnlyBanner =
    navGroup === "content" || navGroup === "organizational" || navGroup === "site";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="CMS Admin Panel"
        titleHref="/admin/cms"
        userEmail={user?.email}
        role={role}
        onLogout={() => logout()}
        menuButton={
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="admin-sidebar"
          >
            Menu
          </button>
        }
      />

      <div className="mx-auto flex max-w-[1600px]">
        <aside
          id="admin-sidebar"
          className={`${
            mobileOpen ? "block" : "hidden"
          } w-full shrink-0 border-b border-slate-200 bg-white md:block md:w-60 md:border-b-0 md:border-r`}
        >
          {sidebar}
        </aside>
        <main id="admin-main-content" className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          {loading || manageBlocked ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-500">
              {manageBlocked ? "Redirecting…" : "Loading admin session…"}
            </div>
          ) : (
            <>
              {showCmsReadOnlyBanner ? <CmsReadOnlyBanner /> : null}
              {children}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
