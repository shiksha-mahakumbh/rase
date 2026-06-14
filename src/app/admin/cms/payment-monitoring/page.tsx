"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminLoading,
} from "@/components/admin/cms/AdminUi";
import { formatInr } from "@/components/admin/ops/OpsUi";

const SimpleBarChart = dynamic(
  () => import("@/components/admin/ops/SimpleBarChart"),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-slate-100" /> }
);

type AnalyticsData = {
  cards: {
    totalRegistrations: number;
    totalRevenue: number;
    todayRevenue: number;
    pendingRegistrations: number;
    failedPayments: number;
    recoveredPayments: number;
    emailsSent: number;
    emailsFailed: number;
    orphanVerifiedPayments: number;
    paymentSuccessRate: number;
  };
  charts: {
    registrationsByCategory: Array<{ category: string; count: number }>;
    revenueByDay: Array<{ date: string; revenue: number }>;
    paymentSuccessRate: number;
  };
};

export default function PaymentMonitoringPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await adminCmsFetch<AnalyticsData>("payments/analytics");
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

  const cards = [
    { label: "Total Registrations", value: data.cards.totalRegistrations },
    { label: "Total Revenue", value: formatInr(data.cards.totalRevenue) },
    { label: "Today's Revenue", value: formatInr(data.cards.todayRevenue) },
    { label: "Pending Registrations", value: data.cards.pendingRegistrations },
    { label: "Failed Payments", value: data.cards.failedPayments },
    { label: "Recovered Payments", value: data.cards.recoveredPayments },
    { label: "Emails Sent", value: data.cards.emailsSent },
    { label: "Emails Failed", value: data.cards.emailsFailed },
    { label: "Orphan Verified Payments", value: data.cards.orphanVerifiedPayments },
    {
      label: "Payment Success Rate",
      value: `${data.cards.paymentSuccessRate}%`,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Payment Monitoring"
        description="Revenue, registration, email, and payment health at a glance."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <AdminCard key={c.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {c.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-brand-navy">{c.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-sm font-bold text-brand-navy">
            Registrations by Category
          </h2>
          <SimpleBarChart
            data={data.charts.registrationsByCategory.map((d) => ({
              name: d.category,
              value: d.count,
            }))}
            valuePrefix=""
          />
        </AdminCard>
        <AdminCard>
          <h2 className="mb-4 text-sm font-bold text-brand-navy">Revenue by Day (14d)</h2>
          <SimpleBarChart
            data={data.charts.revenueByDay.map((d) => ({
              name: d.date.slice(5),
              value: d.revenue,
            }))}
            valuePrefix="₹"
          />
        </AdminCard>
      </div>
    </div>
  );
}
