"use client";

import { Toaster } from "react-hot-toast";
import AdminGate from "@/components/admin/cms/AdminGate";

export default function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      {children}
      <Toaster position="top-right" />
    </AdminGate>
  );
}
