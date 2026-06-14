"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminPageHeader, AdminCard, AdminLoading } from "@/components/admin/cms/AdminUi";

const SimpleBarChart = dynamic(() => import("@/components/admin/ops/SimpleBarChart"), { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-slate-100" /> });

type Data = {
  cards: Record<string, number>;
  charts: {
    registrationsByCategory: Array<{ category: string; count: number }>;
    registrationsByState: Array<{ state: string; count: number }>;
    dailyRegistrations: Array<{ date: string; count: number }>;
    revenueByCategory: Array<{ category: string; revenue: number }>;
  };
};

export default function EventAnalyticsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setData(await adminCmsFetch<Data>("lifecycle-analytics"));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <AdminLoading />;
  if (!data) return null;

  const cards = [
    { label: "Total Registrations", value: data.cards.totalRegistrations },
    { label: "Check-In %", value: `${data.cards.checkInPercent}%` },
    { label: "Checked In", value: data.cards.checkedIn },
    { label: "Accommodation Occupancy", value: `${data.cards.accommodationOccupancy}%` },
    { label: "Certificates Issued", value: data.cards.certificatesIssued },
    { label: "Session Records", value: data.cards.sessionAttendanceRecords },
  ];

  return (
    <div>
      <AdminPageHeader title="Event Analytics" description="Registration, check-in, accommodation, and certificate metrics." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <AdminCard key={c.label}><p className="text-xs uppercase text-slate-500">{c.label}</p><p className="mt-2 text-2xl font-bold text-brand-navy">{c.value}</p></AdminCard>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard><h2 className="mb-4 font-bold">By Category</h2><SimpleBarChart data={data.charts.registrationsByCategory.map((d) => ({ name: d.category.slice(0, 12), value: d.count }))} /></AdminCard>
        <AdminCard><h2 className="mb-4 font-bold">By State</h2><SimpleBarChart data={data.charts.registrationsByState.map((d) => ({ name: d.state.slice(0, 10), value: d.count }))} /></AdminCard>
        <AdminCard><h2 className="mb-4 font-bold">Daily Registrations</h2><SimpleBarChart data={data.charts.dailyRegistrations.map((d) => ({ name: d.date.slice(5), value: d.count }))} /></AdminCard>
        <AdminCard><h2 className="mb-4 font-bold">Revenue by Category</h2><SimpleBarChart data={data.charts.revenueByCategory.map((d) => ({ name: d.category.slice(0, 12), value: d.revenue }))} valuePrefix="₹" /></AdminCard>
      </div>
    </div>
  );
}
