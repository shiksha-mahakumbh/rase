"use client";

import { useEffect, useMemo, useState } from "react";
import { RegistrationRow } from "@/lib/exportRegistrations";
import { ANALYTICS_EVENTS, getLocalFunnelCounts } from "@/lib/analytics/events";

interface AdminGrowthAnalyticsProps {
  rows: RegistrationRow[];
}

export default function AdminGrowthAnalytics({ rows }: AdminGrowthAnalyticsProps) {
  const [localFunnel, setLocalFunnel] = useState<Record<string, number>>({});

  useEffect(() => {
    setLocalFunnel(getLocalFunnelCounts());
  }, []);

  const metrics = useMemo(() => {
    const total = rows.length;
    const paid = rows.filter((r) => r.paymentStatus === "Paid").length;
    const pending = rows.filter(
      (r) =>
        r.paymentStatus === "Pending Payment" || r.paymentStatus === "Pending"
    ).length;
    const accommodation = rows.filter(
      (r) =>
        r.accommodationRequired === "Yes" ||
        r.accommodationStatus === "Requested"
    ).length;
    const volunteers = rows.filter((r) =>
      /volunteer/i.test(String(r.registrationType ?? ""))
    ).length;
    const papers = rows.filter((r) =>
      /abstract|paper|research/i.test(String(r.registrationType ?? ""))
    ).length;

    const completionRate = total > 0 ? Math.round((paid / total) * 100) : 0;

    const funnelSteps = [
      {
        label: "Registration started (browser)",
        count:
          localFunnel[ANALYTICS_EVENTS.registrationStarted] ??
          total,
      },
      {
        label: "Registration completed (database)",
        count:
          localFunnel[ANALYTICS_EVENTS.registrationCompleted] ?? total,
      },
      {
        label: "Payment marked paid",
        count: paid,
      },
    ];

    const sources = new Map<string, number>();
    rows.forEach((r) => {
      const src = String(r.trafficSource ?? r.utmSource ?? "unknown");
      sources.set(src, (sources.get(src) ?? 0) + 1);
    });

    const topSources = Array.from(sources.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      total,
      paid,
      pending,
      accommodation,
      volunteers,
      papers,
      completionRate,
      funnelSteps,
      topSources,
      localFunnel,
    };
  }, [rows, localFunnel]);

  return (
    <section className="space-y-4" aria-label="Growth analytics">
      <h2 className="text-lg font-bold text-primary">Growth &amp; Conversion</h2>
      <p className="text-sm text-gray-500">
        Funnel combines browser events (this device) with loaded registration
        records. Connect GA4 for full traffic sources in production.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Conversion funnel
          </h3>
          <ul className="mt-4 space-y-3">
            {metrics.funnelSteps.map((step, i) => {
              const max = metrics.funnelSteps[0]?.count || 1;
              const pct = Math.round((step.count / max) * 100);
              return (
                <li key={step.label}>
                  <div className="flex justify-between text-sm">
                    <span>{step.label}</span>
                    <span className="font-semibold">{step.count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {i === metrics.funnelSteps.length - 1 && (
                    <p className="mt-2 text-xs text-gray-500">
                      Completion rate (paid / loaded): {metrics.completionRate}%
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Key conversions
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Accommodation requests</span>
              <strong>{metrics.accommodation}</strong>
            </li>
            <li className="flex justify-between">
              <span>Volunteer-related rows</span>
              <strong>{metrics.volunteers}</strong>
            </li>
            <li className="flex justify-between">
              <span>Paper / abstract rows</span>
              <strong>{metrics.papers}</strong>
            </li>
            <li className="flex justify-between">
              <span>Brochure downloads (local)</span>
              <strong>
                {metrics.localFunnel[ANALYTICS_EVENTS.brochureDownload] ?? 0}
              </strong>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Top traffic sources (registration records)
        </h3>
        {metrics.topSources.length ? (
          <ul className="mt-3 space-y-2 text-sm">
            {metrics.topSources.map(([source, count]) => (
              <li key={source} className="flex justify-between">
                <span className="truncate pr-4">{source}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            No UTM/source fields on loaded records yet. Use{" "}
            <code className="text-xs">?utm_source=</code> on campaign links.
          </p>
        )}
      </div>
    </section>
  );
}
