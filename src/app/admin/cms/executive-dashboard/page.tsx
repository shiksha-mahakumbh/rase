"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminPageHeader, AdminCard, AdminLoading } from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge, formatInr } from "@/components/admin/ops/OpsUi";

const SimpleBarChart = dynamic(() => import("@/components/admin/ops/SimpleBarChart"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-xl bg-slate-100" />,
});

type Data = {
  metrics: Record<string, number>;
  alerts: Array<{ id: string; severity: string; title: string; message: string }>;
  charts: {
    registrationsByState: Array<{ state: string; count: number }>;
    dailyRegistrations: Array<{ date: string; count: number }>;
  };
};

export default function ExecutiveDashboardPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setData(await adminCmsFetch<Data>("executive-dashboard"));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <AdminLoading />;
  if (!data) return null;

  const cards = [
    { label: "Registrations", value: data.metrics.totalRegistrations },
    { label: "Revenue", value: formatInr(data.metrics.totalRevenue) },
    { label: "Check-In %", value: `${data.metrics.checkInPercent}%` },
    { label: "Occupancy %", value: `${data.metrics.occupancyPercent}%` },
    { label: "Certificates", value: data.metrics.certificatesIssued },
    { label: "Research Papers", value: data.metrics.researchPapersSubmitted },
    { label: "Pending Reviews", value: data.metrics.pendingReviews },
    { label: "Bed Utilization", value: `${data.metrics.accommodationUtilization}%` },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Executive Command Center"
        description="Live metrics for organizers, conveners, and operations team."
      />
      {data.alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {data.alerts.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border px-4 py-3 ${
                a.severity === "critical"
                  ? "border-red-200 bg-red-50"
                  : a.severity === "warning"
                    ? "border-amber-200 bg-amber-50"
                    : "border-blue-200 bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <OpsStatusBadge value={a.severity} />
                <strong>{a.title}</strong>
              </div>
              <p className="mt-1 text-sm text-slate-700">{a.message}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <AdminCard key={c.label}>
            <p className="text-xs uppercase text-slate-500">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-navy">{c.value}</p>
          </AdminCard>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 font-bold">Registrations by State</h2>
          <SimpleBarChart
            data={data.charts.registrationsByState.map((d) => ({
              name: d.state.slice(0, 10),
              value: d.count,
            }))}
          />
        </AdminCard>
        <AdminCard>
          <h2 className="mb-4 font-bold">Daily Registrations</h2>
          <SimpleBarChart
            data={data.charts.dailyRegistrations.map((d) => ({
              name: d.date.slice(5),
              value: d.count,
            }))}
          />
        </AdminCard>
      </div>
    </div>
  );
}
