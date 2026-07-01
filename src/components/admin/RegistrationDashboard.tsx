"use client";

import { useEffect, useState } from "react";
import {
  fetchRegistrationsPage,
  fetchAllRegistrations,
  fetchRegistrationAdminStats,
  REGISTRATIONS_PAGE_SIZE,
} from "@/lib/admin/registrations-client";
import { useAdmin, canExport, canManageStatus } from "@/lib/adminAuth";
import RegistrationTable from "@/components/admin/RegistrationTable";
import AdminReportsPanel from "@/components/admin/AdminReportsPanel";
import dynamic from "next/dynamic";
import AdminGrowthAnalytics from "@/components/admin/AdminGrowthAnalytics";
import AdminAnalyticsIntelligence from "@/components/admin/AdminAnalyticsIntelligence";
import AdminGrowthDashboard from "@/components/admin/AdminGrowthDashboard";
import AdminSystemHealth from "@/components/admin/AdminSystemHealth";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import AdminRegistrationCategories from "@/components/admin/AdminRegistrationCategories";
import {
  RegistrationRow,
  downloadCsv,
  downloadExcel,
} from "@/lib/exportRegistrations";
import toast from "react-hot-toast";
import type { RegistrationAdminStats } from "@/types/admin-dashboard";

const AnalyticsCharts = dynamic(
  () => import("@/components/admin/AnalyticsCharts"),
  { ssr: false, loading: () => <ChartsSkeleton /> }
);

const EMPTY_STATS: RegistrationAdminStats = {
  total: 0,
  delegate: 0,
  conclave: 0,
  olympiad: 0,
  awards: 0,
  bestPractices: 0,
  accommodation: 0,
  today: 0,
  pendingPayments: 0,
  submittedFree: 0,
  completedPayments: 0,
  pendingVerifications: 0,
  approved: 0,
  verified: 0,
  pendingAccommodation: 0,
  revenue: 0,
};

export default function RegistrationDashboard() {
  const { role, permissions } = useAdmin();
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [stats, setStats] = useState<RegistrationAdminStats>(EMPTY_STATS);
  const [fetching, setFetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const loadRegistrations = async (pageIndex = 0, append = false) => {
    if (append) setLoadingMore(true);
    else setFetching(true);
    try {
      const offset = pageIndex * REGISTRATIONS_PAGE_SIZE;
      const result = await fetchRegistrationsPage(offset);
      setRegistrations((prev) =>
        append ? [...prev, ...result.rows] : result.rows
      );
      setPage(pageIndex);
      setHasMore(result.hasMore);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load registrations";
      console.error("ADMIN_FETCH_FAILED", { context: "loadRegistrations", message, error });
      toast.error(
        message.startsWith("Failed to load registrations")
          ? message
          : `Failed to load registrations: ${message}`
      );
    } finally {
      setFetching(false);
      setLoadingMore(false);
    }
  };

  const loadStats = async () => {
    try {
      const serverStats = await fetchRegistrationAdminStats();
      setStats(serverStats);
    } catch (error) {
      console.error("ADMIN_STATS_FAILED", error);
      toast.error("Failed to load registration statistics");
    }
  };

  const loadAllForExport = async (): Promise<RegistrationRow[]> => {
    try {
      return await fetchAllRegistrations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load full export data";
      console.error("ADMIN_FETCH_FAILED", { context: "loadAllForExport", message, error });
      toast.error(
        message.startsWith("Failed to load")
          ? message
          : `Failed to load full export data: ${message}`
      );
      return registrations;
    }
  };

  useEffect(() => {
    void loadRegistrations(0, false);
    void loadStats();
  }, []);

  const selectedRows = registrations.filter((r) => selected.has(r.id));

  const handleBulkStatus = async (
    field: "registrationStatus" | "paymentStatus",
    value: string
  ) => {
    if (!canManageStatus(role, permissions) || !selected.size) return;

    try {
      const res = await fetch("/api/admin/gateway/registrations/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ids: selectedRows.map((r) => r.id),
          field,
          value,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.error === "string" ? err.error : "Bulk update failed");
      }
      toast.success(`Updated ${selected.size} registrations`);
      void loadRegistrations(0, false);
      void loadStats();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update registrations"
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-primary">Registration Admin</h1>
          <p className="text-sm text-gray-500">Browse, verify, and export registrations</p>
        </div>
        <button
          type="button"
          onClick={() => {
            void loadRegistrations(0, false);
            void loadStats();
          }}
          disabled={fetching}
          className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          {fetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <AdminSystemHealth />

        <AdminGrowthDashboard rows={registrations} />

        <AdminDashboardOverview stats={stats} />

        <AdminRegistrationCategories />

        <AdminReportsPanel rows={registrations} />

        <AdminGrowthAnalytics rows={registrations} />

        <AdminAnalyticsIntelligence rows={registrations} />

        <AnalyticsCharts registrations={registrations} />

        {canExport(role, permissions) && (
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
            {canManageStatus(role, permissions) && selected.size > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => handleBulkStatus("registrationStatus", "Verified")}
                  className="rounded-lg bg-brand-saffron px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
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
          {stats.total > 0 && ` · ${stats.total} total in database`}
        </p>

        {hasMore && (
          <button
            type="button"
            onClick={() => loadRegistrations(page + 1, true)}
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
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-2xl border bg-gray-100" aria-hidden />
  );
}
