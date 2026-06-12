"use client";

import Link from "next/link";
import { CMS_NAV } from "@/components/admin/cms/admin-nav";
import { AdminPageHeader, AdminCard } from "@/components/admin/cms/AdminUi";

export default function CmsDashboardPage() {
  const modules = CMS_NAV.filter((item) => item.href !== "/admin/cms");

  return (
    <div>
      <AdminPageHeader
        title="CMS Dashboard"
        description="Manage public site content wired in Phase B.6. Changes publish via v2 APIs."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((item) => (
          <Link key={item.href} href={item.href}>
            <AdminCard className="h-full transition hover:border-brand-navy/30 hover:shadow-md">
              <h2 className="font-semibold text-brand-navy">{item.label}</h2>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
