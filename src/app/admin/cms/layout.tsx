"use client";

import AdminShell from "@/components/admin/cms/AdminShell";

export default function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
