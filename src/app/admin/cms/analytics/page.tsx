"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminSelect,
  AdminLoading,
} from "@/components/admin/cms/AdminUi";

const VisitorTrafficChart = dynamic(
  () => import("@/components/admin/cms/VisitorTrafficChart"),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-xl bg-slate-100" /> }
);

type ChartPoint = { date?: string; label?: string; views?: number; value?: number };
type DashboardData = {
  analytics: {
    widgets: Record<string, unknown>;
    charts: {
      day: ChartPoint[];
      week: ChartPoint[];
      month: ChartPoint[];
      year: ChartPoint[];
    };
  };
  operations: Record<string, number>;
};

export default function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await adminCmsFetch<DashboardData>("analytics/dashboard");
        setData(res);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <AdminLoading />;
  if (!data) return null;

  const w = data.analytics.widgets;
  const rawChart =
    period === "day"
      ? data.analytics.charts.day
      : period === "week"
        ? data.analytics.charts.week
        : period === "year"
          ? data.analytics.charts.year
          : data.analytics.charts.month;

  const chartData = (rawChart ?? []).map((d) => ({
    name: String(d.label ?? d.date ?? ""),
    value: Number(d.value ?? d.views ?? 0),
  }));

  const topPages = (w.topPages as Array<{ path: string; views: number }>) ?? [];
  const trafficSources = (w.trafficSources as Array<{ source: string; count: number }>) ?? [];
  const topDownloads = (w.topDownloads as Array<{ title: string; count: number }>) ?? [];
  const deviceBreakdown = (w.deviceBreakdown as Array<{ device: string; count: number }>) ?? [];

  const statCards = [
    { label: "Total visitors", value: Number(w.totalVisitors ?? 0) },
    { label: "Active users", value: Number(w.activeVisitors ?? 0) },
    { label: "Visitors today", value: Number(w.visitorsToday ?? 0) },
    { label: "This month", value: Number(w.visitorsThisMonth ?? 0) },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Analytics Dashboard"
        description="Visitor intelligence from Supabase analytics engine (Phase B.5)."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <AdminCard key={s.label}>
            <p className="text-xs font-semibold uppercase text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-brand-navy">{s.value.toLocaleString()}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-brand-navy">Traffic over time</h2>
          <AdminSelect
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            options={[
              { value: "day", label: "Day (30d)" },
              { value: "week", label: "Week (12w)" },
              { value: "month", label: "Month (12m)" },
              { value: "year", label: "Year (5y)" },
            ]}
          />
        </div>
        <VisitorTrafficChart data={chartData} />
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 font-semibold text-brand-navy">Top pages</h2>
          <ul className="space-y-2 text-sm">
            {topPages.slice(0, 10).map((p) => (
              <li key={p.path} className="flex justify-between">
                <span className="truncate text-slate-700">{p.path}</span>
                <span className="font-medium">{p.views}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard>
          <h2 className="mb-3 font-semibold text-brand-navy">Traffic sources</h2>
          <ul className="space-y-2 text-sm">
            {trafficSources.slice(0, 10).map((s) => (
              <li key={s.source} className="flex justify-between">
                <span>{s.source}</span>
                <span className="font-medium">{s.count}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard>
          <h2 className="mb-3 font-semibold text-brand-navy">Top downloads</h2>
          <ul className="space-y-2 text-sm">
            {topDownloads.slice(0, 8).map((d) => (
              <li key={d.title} className="flex justify-between">
                <span className="truncate">{d.title}</span>
                <span className="font-medium">{d.count}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard>
          <h2 className="mb-3 font-semibold text-brand-navy">Device breakdown</h2>
          <ul className="space-y-2 text-sm">
            {deviceBreakdown.map((d) => (
              <li key={d.device} className="flex justify-between">
                <span>{d.device}</span>
                <span className="font-medium">{d.count}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}
