"use client";

import Link from "next/link";
import { filterCmsNavForRole, type AdminNavItem } from "@/components/admin/cms/admin-nav";
import { AdminPageHeader, AdminCard } from "@/components/admin/cms/AdminUi";
import { useAdmin } from "@/lib/adminAuth";

const GROUP_LABELS: Record<AdminNavItem["group"], string> = {
  content: "Content",
  organizational: "Organizational",
  site: "Site configuration",
  insights: "Insights",
  operations: "Operations",
};

const GROUP_ORDER: AdminNavItem["group"][] = [
  "content",
  "organizational",
  "site",
  "insights",
  "operations",
];

export default function CmsDashboardPage() {
  const { role } = useAdmin();
  const modules = filterCmsNavForRole(role).filter((item) => item.href !== "/admin/cms");

  return (
    <div>
      <AdminPageHeader
        title="CMS Dashboard"
        description="Manage public site content wired in Phase B.6. Changes publish via v2 APIs."
      />
      <div className="space-y-10">
        {GROUP_ORDER.map((group) => {
          const items = modules.filter((item) => item.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group}>
              <h2 className="mb-3 text-lg font-bold text-brand-navy">{GROUP_LABELS[group]}</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <AdminCard className="h-full transition hover:border-brand-navy/30 hover:shadow-md">
                      <h3 className="font-semibold text-brand-navy">{item.label}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                    </AdminCard>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
