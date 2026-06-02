"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AdminProvider,
  useAdmin,
  canExport,
  canManageStatus,
} from "@/lib/adminAuth";
import RegistrationTable from "@/components/admin/RegistrationTable";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import {
  RegistrationRow,
  downloadCsv,
  downloadExcel,
  isToday,
} from "@/lib/exportRegistrations";
import toast, { Toaster } from "react-hot-toast";

function DashboardContent() {
  const { user, role, loading, login, logout, isAdmin } = useAdmin();
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const loadRegistrations = async () => {
    setFetching(true);
    try {
      const snap = await getDocs(collection(db, "registrations"));
      const rows: RegistrationRow[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      rows.sort((a, b) => {
        const ta = a.createdAt as { seconds?: number } | undefined;
        const tb = b.createdAt as { seconds?: number } | undefined;
        return (tb?.seconds ?? 0) - (ta?.seconds ?? 0);
      });
      setRegistrations(rows);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load registrations");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadRegistrations();
  }, [isAdmin]);

  const stats = useMemo(() => {
    const countByType = (type: string) =>
      registrations.filter((r) => r.registrationType === type).length;

    return {
      total: registrations.length,
      delegate: countByType("Delegate Registration"),
      conclave: countByType("Conclave"),
      olympiad: countByType("Olympiad"),
      awards: countByType("Awards"),
      bestPractices: countByType("Best Practices"),
      accommodation: registrations.filter(
        (r) => r.accommodationRequired === "Yes" || r.accommodationStatus === "Requested"
      ).length,
      today: registrations.filter((r) => isToday(r.createdAt)).length,
      pendingPayments: registrations.filter(
        (r) => r.paymentStatus === "Pending"
      ).length,
      completedPayments: registrations.filter(
        (r) => r.paymentStatus === "Paid"
      ).length,
      pendingVerifications: registrations.filter(
        (r) => r.registrationStatus === "Pending"
      ).length,
      pendingAccommodation: registrations.filter(
        (r) => r.accommodationStatus === "Requested"
      ).length,
    };
  }, [registrations]);

  const selectedRows = registrations.filter((r) => selected.has(r.id));

  const handleBulkStatus = async (
    field: "registrationStatus" | "paymentStatus",
    value: string
  ) => {
    if (!canManageStatus(role) || !selected.size) return;

    const batch = writeBatch(db);
    selectedRows.forEach((row) => {
      batch.update(doc(db, "registrations", row.id), {
        [field]: value,
        updatedAt: new Date(),
      });
    });
    await batch.commit();
    toast.success(`Updated ${selected.size} registrations`);
    loadRegistrations();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50/30 px-4">
        <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl text-center">
          <h1 className="text-2xl font-bold text-primary">
            Shiksha Mahakumbh 6.0 Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with an authorized Google account to access the dashboard.
          </p>
          {user && !isAdmin && (
            <p className="mt-4 text-sm text-red-600">
              Your account ({user.email}) is not registered as an admin.
            </p>
          )}
          <button
            type="button"
            onClick={login}
            className="mt-6 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary/90"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" />
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary">
              Registration Admin
            </h1>
            <p className="text-sm text-gray-500">
              {user.email} · {role}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadRegistrations}
              disabled={fetching}
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              {fetching ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Notifications */}
        <div className="grid gap-4 md:grid-cols-3">
          <NotificationCard
            title="New Registrations"
            value={stats.today}
            hint="Submitted today"
          />
          <NotificationCard
            title="Pending Verifications"
            value={stats.pendingVerifications}
            hint="Registration status pending"
          />
          <NotificationCard
            title="Pending Accommodation"
            value={stats.pendingAccommodation}
            hint="Awaiting confirmation"
          />
        </div>

        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Delegate" value={stats.delegate} />
          <StatCard label="Conclave" value={stats.conclave} />
          <StatCard label="Olympiad" value={stats.olympiad} />
          <StatCard label="Awards" value={stats.awards} />
          <StatCard label="Best Practices" value={stats.bestPractices} />
          <StatCard label="Accommodation" value={stats.accommodation} />
          <StatCard label="Today" value={stats.today} />
          <StatCard label="Pending Payments" value={stats.pendingPayments} />
          <StatCard label="Completed Payments" value={stats.completedPayments} />
        </div>

        <AnalyticsCharts registrations={registrations} />

        {/* Bulk actions */}
        {canExport(role) && (
          <div className="flex flex-wrap gap-2 rounded-xl border bg-white p-4">
            <button
              type="button"
              onClick={() =>
                downloadCsv(
                  selected.size ? selectedRows : registrations,
                  "registrations.csv"
                )
              }
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Export CSV {selected.size ? `(${selected.size})` : "(All)"}
            </button>
            <button
              type="button"
              onClick={() =>
                downloadExcel(
                  selected.size ? selectedRows : registrations,
                  "registrations.xlsx"
                )
              }
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Print
            </button>
            {canManageStatus(role) && selected.size > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => handleBulkStatus("registrationStatus", "Verified")}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Verify Selected
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatus("registrationStatus", "Approved")}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Approve Selected
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatus("paymentStatus", "Paid")}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  Mark Payments Paid
                </button>
              </>
            )}
          </div>
        )}

        <RegistrationTable
          rows={registrations}
          selected={selected}
          onSelectChange={(id, checked) => {
            setSelected((prev) => {
              const next = new Set(prev);
              if (checked) next.add(id);
              else next.delete(id);
              return next;
            });
          }}
          onSelectAll={(checked) => {
            if (checked) {
              setSelected(new Set(registrations.map((r) => r.id)));
            } else {
              setSelected(new Set());
            }
          }}
        />
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function NotificationCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">{title}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-xs text-amber-800">{hint}</p>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <DashboardContent />
    </AdminProvider>
  );
}
