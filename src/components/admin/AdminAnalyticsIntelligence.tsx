"use client";

import { useMemo } from "react";
import { RegistrationRow } from "@/lib/exportRegistrations";
import { computeAdminMetrics } from "@/lib/analytics/adminMetrics";

function MetricTable({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  if (!rows.length) return null;
  const max = rows[0]?.count ?? 1;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
        {rows.slice(0, 12).map((row) => (
          <li key={row.label}>
            <div className="flex justify-between gap-2">
              <span className="truncate text-gray-700">{row.label}</span>
              <span className="shrink-0 font-semibold">{row.count}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round((row.count / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminAnalyticsIntelligence({
  rows,
}: {
  rows: RegistrationRow[];
}) {
  const metrics = useMemo(() => computeAdminMetrics(rows), [rows]);

  return (
    <section className="space-y-4" aria-label="Analytics intelligence">
      <h2 className="text-lg font-bold text-primary">Analytics Intelligence</h2>
      <p className="text-sm text-gray-500">
        UTM, device, language, and country breakdowns from loaded registration
        records. New submissions capture attribution automatically.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Loaded records" value={metrics.total} />
        <Stat label="Completion rate" value={`${metrics.completionRate}%`} />
        <Stat label="Paid rate" value={`${metrics.paidRate}%`} />
        <Stat label="Paid count" value={metrics.paid} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricTable title="UTM source" rows={metrics.utmSources} />
        <MetricTable title="UTM campaign" rows={metrics.utmCampaigns} />
        <MetricTable title="Traffic source" rows={metrics.trafficSources} />
        <MetricTable title="Device type" rows={metrics.devices} />
        <MetricTable title="Browser language" rows={metrics.languages} />
        <MetricTable title="Country" rows={metrics.countries} />
        <MetricTable title="Registration type" rows={metrics.registrationTypes} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
