"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/cms/AdminShell";
import AdminCheckInShell from "@/components/admin/cms/AdminCheckInShell";

export default function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckIn =
    pathname === "/admin/cms/checkin" || pathname.startsWith("/admin/cms/checkin/");

  if (isCheckIn) {
    return <AdminCheckInShell variant="embedded">{children}</AdminCheckInShell>;
  }

  return <AdminShell>{children}</AdminShell>;
}
