import { Suspense } from "react";
import { NO_INDEX_META } from "@/lib/seo/publicPages";
import { AdminProvider } from "@/lib/adminAuth";
import AdminRootShell from "@/components/admin/AdminRootShell";

export const metadata = NO_INDEX_META.admin;
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-sm text-slate-600">Loading admin…</p>
          </div>
        }
      >
        <AdminRootShell>{children}</AdminRootShell>
      </Suspense>
    </AdminProvider>
  );
}
