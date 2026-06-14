"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminPageHeader, AdminCard, AdminButton, AdminLoading } from "@/components/admin/cms/AdminUi";

type Insight = { type: string; text: string; severity: string };
type Recommendation = { priority: string; text: string };
type Data = {
  generatedAt: string;
  insights: Insight[];
  recommendations: Recommendation[];
  metrics: Record<string, unknown>;
  cached?: boolean;
};

export default function AiInsightsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    try {
      setData(
        await adminCmsFetch<Data>(`ai-insights${refresh ? "?refresh=1" : ""}`)
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="AI Insights"
        description="Daily trend analysis, forecasts, and operational recommendations."
        actions={
          <AdminButton onClick={() => void load(true)} disabled={loading}>
            Refresh Insights
          </AdminButton>
        }
      />
      {loading ? (
        <AdminLoading />
      ) : data ? (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Generated {new Date(data.generatedAt).toLocaleString("en-IN")}
            {data.cached ? " (cached)" : ""}
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminCard>
              <h2 className="mb-3 font-bold text-brand-navy">Insights</h2>
              <ul className="space-y-3">
                {data.insights.map((i, idx) => (
                  <li
                    key={idx}
                    className={`rounded-lg border p-3 text-sm ${
                      i.severity === "warning"
                        ? "border-amber-200 bg-amber-50"
                        : i.severity === "positive"
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200"
                    }`}
                  >
                    {i.text}
                  </li>
                ))}
              </ul>
            </AdminCard>
            <AdminCard>
              <h2 className="mb-3 font-bold text-brand-navy">Recommendations</h2>
              <ul className="space-y-3">
                {data.recommendations.map((r, idx) => (
                  <li key={idx} className="rounded-lg border p-3 text-sm">
                    <span className="mr-2 rounded bg-brand-navy px-2 py-0.5 text-xs uppercase text-white">
                      {r.priority}
                    </span>
                    {r.text}
                  </li>
                ))}
              </ul>
            </AdminCard>
          </div>
        </>
      ) : null}
    </div>
  );
}
