import Link from "next/link";
import { probeServiceStatus } from "@/lib/monitoring/service-status";
import { createPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function generateMetadata() {
  return createPageMetadata({
    title: "Service Status",
    description: "Operational status for Shiksha Mahakumbh web services.",
    path: "/status",
    noIndex: true,
  });
}

function statusLabel(status: string) {
  if (status === "ok") return "Operational";
  if (status === "degraded") return "Degraded";
  return status;
}

function databaseLabel(value: string) {
  if (value === "connected") return "Connected";
  if (value === "not_configured") return "Not configured";
  if (value === "error") return "Error";
  return value;
}

export default async function StatusPage() {
  const payload = await probeServiceStatus();
  const overallClass =
    payload.status === "ok"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : "text-amber-800 bg-amber-50 border-amber-200";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-sm font-semibold text-brand-navy hover:underline">
            Shiksha Mahakumbh
          </Link>
          <span className="text-xs uppercase tracking-wide text-slate-500">Service Status</span>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Operations</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Service Status</h1>
          <p className="mt-2 text-sm text-slate-600">
            Live health for the public website and core dependencies.
          </p>
        </div>

        <div className={`rounded-xl border px-4 py-3 ${overallClass}`}>
          <p className="text-sm font-medium uppercase tracking-wide">Overall</p>
          <p className="text-2xl font-semibold">{statusLabel(payload.status)}</p>
          <p className="mt-1 text-sm opacity-80">
            Last checked{" "}
            {new Date(payload.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Check</th>
                <th className="px-4 py-3 font-medium">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3">Database</td>
                <td className="px-4 py-3">{databaseLabel(payload.checks.database)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Error monitoring (Sentry)</td>
                <td className="px-4 py-3">
                  {payload.checks.sentryConfigured ? "Configured" : "Not configured"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Rate limiting</td>
                <td className="px-4 py-3">
                  {payload.checks.rateLimitMode === "upstash"
                    ? "Distributed (Upstash)"
                    : "In-memory fallback"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Scheduled jobs auth</td>
                <td className="px-4 py-3">
                  {payload.checks.cronConfigured ? "Configured" : "Not configured"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">RLS policies (public schema)</td>
                <td className="px-4 py-3">
                  {payload.checks.rlsPolicyCount === null
                    ? "Unknown"
                    : `${payload.checks.rlsPolicyCount} active`}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">RLS policies (storage)</td>
                <td className="px-4 py-3">
                  {payload.checks.storagePolicyCount === null
                    ? "Unknown"
                    : `${payload.checks.storagePolicyCount} active`}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Anon API — roles table blocked</td>
                <td className="px-4 py-3">
                  {payload.checks.anonRolesBlocked === null
                    ? "Unknown"
                    : payload.checks.anonRolesBlocked
                      ? "Blocked"
                      : "Exposed"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-600">
          Machine-readable probe:{" "}
          <Link className="font-medium text-brand-navy underline" href="/api/v2/status">
            /api/v2/status
          </Link>
        </p>
      </main>
    </div>
  );
}
