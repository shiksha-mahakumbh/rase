"use client";

import { useEffect, useMemo, useState } from "react";
import { RegistrationRow } from "@/lib/exportRegistrations";
import { computeAdminMetrics } from "@/lib/analytics/adminMetrics";
import { ANALYTICS_EVENTS, getLocalFunnelCounts } from "@/lib/analytics/events";

const HUB_VIEWS_KEY = "smk_knowledge_hub_views";

function getKnowledgeHubViews(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(HUB_VIEWS_KEY) ?? 0);
}

interface Props {
  rows: RegistrationRow[];
}

export default function AdminGrowthDashboard({ rows }: Props) {
  const [funnel, setFunnel] = useState<Record<string, number>>({});
  const [hubViews, setHubViews] = useState(0);

  useEffect(() => {
    setFunnel(getLocalFunnelCounts());
    setHubViews(getKnowledgeHubViews());
  }, []);

  const m = useMemo(() => computeAdminMetrics(rows), [rows]);

  const started = funnel[ANALYTICS_EVENTS.registrationStarted] ?? 0;
  const completed = funnel[ANALYTICS_EVENTS.registrationCompleted] ?? m.completed;
  const conversionPct =
    started > 0 ? Math.round((completed / started) * 100) : m.completionRate;

  return (
    <section className="space-y-4" aria-label="Growth dashboard">
      <h2 className="text-lg font-bold text-primary">Growth Dashboard</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Registrations (loaded)" value={m.total} />
        <Kpi label="Conversion rate" value={`${conversionPct}%`} />
        <Kpi label="Paid" value={m.paid} />
        <Kpi label="Knowledge Hub views (browser)" value={hubViews} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top campaigns (UTM)">
          <MiniTable rows={m.utmCampaigns.slice(0, 6)} />
        </Panel>
        <Panel title="Top traffic sources">
          <MiniTable rows={m.trafficSources.slice(0, 6)} />
        </Panel>
        <Panel title="Country performance">
          <MiniTable rows={m.countries.slice(0, 6)} />
        </Panel>
        <Panel title="Language (browser)">
          <MiniTable rows={m.languages.slice(0, 6)} />
        </Panel>
        <Panel title="Device mix">
          <MiniTable rows={m.devices.slice(0, 6)} />
        </Panel>
        <Panel title="Registration types">
          <MiniTable rows={m.registrationTypes.slice(0, 6)} />
        </Panel>
      </div>
    </section>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function MiniTable({ rows }: { rows: { label: string; count: number }[] }) {
  if (!rows.length) return <p className="text-xs text-gray-500">No data in loaded set</p>;
  return (
    <ul className="space-y-1 text-sm">
      {rows.map((r) => (
        <li key={r.label} className="flex justify-between gap-2">
          <span className="truncate text-gray-600">{r.label}</span>
          <span className="font-semibold">{r.count}</span>
        </li>
      ))}
    </ul>
  );
}

export function recordKnowledgeHubView() {
  if (typeof window === "undefined") return;
  const n = getKnowledgeHubViews() + 1;
  localStorage.setItem(HUB_VIEWS_KEY, String(n));
}
