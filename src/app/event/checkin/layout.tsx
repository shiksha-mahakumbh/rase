"use client";

import { Toaster } from "react-hot-toast";
import { AdminProvider } from "@/lib/adminAuth";
import AdminGate from "@/components/admin/cms/AdminGate";
import AdminCheckInShell from "@/components/admin/cms/AdminCheckInShell";

export default function EventCheckInLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGate>
        <AdminCheckInShell variant="standalone">{children}</AdminCheckInShell>
        <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
      </AdminGate>
    </AdminProvider>
  );
}
