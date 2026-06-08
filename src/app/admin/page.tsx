"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, writeBatch, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  fetchRegistrationsPage,
  fetchAllRegistrations,
  REGISTRATIONS_PAGE_SIZE,
} from "@/lib/services/firestore/registrations";
import {
  AdminProvider,
  useAdmin,
  canExport,
  canManageStatus,
} from "@/lib/adminAuth";
import RegistrationTable from "@/components/admin/RegistrationTable";
import AdminReportsPanel from "@/components/admin/AdminReportsPanel";
import dynamic from "next/dynamic";
import AdminGrowthAnalytics from "@/components/admin/AdminGrowthAnalytics";
import AdminAnalyticsIntelligence from "@/components/admin/AdminAnalyticsIntelligence";
import AdminGrowthDashboard from "@/components/admin/AdminGrowthDashboard";
import AdminSystemHealth from "@/components/admin/AdminSystemHealth";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import AdminRegistrationCategories from "@/components/admin/AdminRegistrationCategories";

const AnalyticsCharts = dynamic(
  () => import("@/components/admin/AnalyticsCharts"),
  { ssr: false, loading: () => <ChartsSkeleton /> }
);
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const loadRegistrations = async (append = false) => {
    if (append) setLoadingMore(true);
    else setFetching(true);
    try {
      const page = await fetchRegistrationsPage(append ? cursor : null);
      setRegistrations((prev) =>
        append ? [...prev, ...page.rows] : page.rows
      );
      setCursor(page.lastDoc);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load registrations");
    } finally {
      setFetching(false);
      setLoadingMore(false);
    }
  };

  const loadAllForExport = async (): Promise<RegistrationRow[]> => {
    try {
      return await fetchAllRegistrations();
    } catch (error) {
      console.error(error);
      toast.error("Failed to load full export data");
      return registrations;
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
        (r) =>
          r.paymentStatus === "Pending Payment" || r.paymentStatus === "Pending"
      ).length,
      submittedFree: registrations.filter(
        (r) => r.paymentStatus === "Submitted"
      ).length,
      completedPayments: registrations.filter(
        (r) => r.paymentStatus === "Paid"
      ).length,
      pendingVerifications: registrations.filter(
        (r) => r.registrationStatus === "Pending"
      ).length,
      approved: registrations.filter(
        (r) => r.registrationStatus === "Approved"
      ).length,
      verified: registrations.filter(
        (r) => r.registrationStatus === "Verified"
      ).length,
      pendingAccommodation: registrations.filter(
        (r) => r.accommodationStatus === "Requested"
      ).length,
      revenue: registrations.reduce((sum, r) => {
        const amt = Number(r.paymentAmount ?? r.amount ?? 0);
        return r.paymentStatus === "Paid" && !Number.isNaN(amt)
          ? sum + amt
          : sum;
      }, 0),
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
              onClick={() => loadRegistrations(false)}
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
        <AdminSystemHealth />

        <AdminGrowthDashboard rows={registrations} />

        <AdminDashboardOverview stats={stats} />

        <AdminRegistrationCategories />

        <AdminReportsPanel rows={registrations} />

        <AdminGrowthAnalytics rows={registrations} />

        <AdminAnalyticsIntelligence rows={registrations} />

        <AnalyticsCharts registrations={registrations} />

        {/* Bulk actions */}
        {canExport(role) && (
          <div className="flex flex-wrap gap-2 rounded-xl border bg-white p-4">
            <button
              type="button"
              onClick={async () => {
                const rows = selected.size
                  ? selectedRows
                  : await loadAllForExport();
                downloadCsv(rows, "registrations.csv");
              }}
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Export CSV {selected.size ? `(${selected.size})` : "(All)"}
            </button>
            <button
              type="button"
              onClick={async () => {
                const rows = selected.size
                  ? selectedRows
                  : await loadAllForExport();
                downloadExcel(rows, "registrations.xlsx");
              }}
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

        <p className="text-sm text-gray-500">
          Showing {registrations.length} registration
          {registrations.length !== 1 ? "s" : ""}
          {hasMore ? ` (${REGISTRATIONS_PAGE_SIZE} per page)` : ""}
        </p>

        {hasMore && (
          <button
            type="button"
            onClick={() => loadRegistrations(true)}
            disabled={loadingMore}
            className="rounded-lg border border-primary bg-white px-6 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
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

function ChartsSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-2xl border bg-gray-100" aria-hidden />
  );
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <DashboardContent />
    </AdminProvider>
  );
}
