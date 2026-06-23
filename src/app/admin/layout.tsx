import { NO_INDEX_META } from "@/lib/seo/publicPages";
import { AdminProvider } from "@/lib/adminAuth";
import AdminRootShell from "@/components/admin/AdminRootShell";

export const metadata = NO_INDEX_META.admin;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminRootShell>{children}</AdminRootShell>
    </AdminProvider>
  );
}
