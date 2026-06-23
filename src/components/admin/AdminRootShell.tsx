"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import AdminGate from "@/components/admin/cms/AdminGate";

export default function AdminRootShell({ children }: { children: ReactNode }) {
  return (
    <AdminGate>
      {children}
      <Toaster position="top-right" />
    </AdminGate>
  );
}
