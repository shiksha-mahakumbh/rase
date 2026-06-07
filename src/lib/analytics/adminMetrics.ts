import { RegistrationRow } from "@/lib/exportRegistrations";

export type MetricRow = { label: string; count: number };

function tally(rows: RegistrationRow[], field: keyof RegistrationRow): MetricRow[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const v = String(r[field] ?? "").trim() || "unknown";
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeAdminMetrics(rows: RegistrationRow[]) {
  const total = rows.length;
  const completed = rows.filter((r) => r.registrationId).length;
  const paid = rows.filter((r) => r.paymentStatus === "Paid").length;

  return {
    total,
    completed,
    paid,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    paidRate: total > 0 ? Math.round((paid / total) * 100) : 0,
    utmSources: tally(rows, "utmSource"),
    utmCampaigns: tally(rows, "utmCampaign"),
    trafficSources: tally(rows, "trafficSource"),
    devices: tally(rows, "deviceType"),
    languages: tally(rows, "browserLanguage"),
    countries: tally(rows, "country"),
    registrationTypes: tally(rows, "registrationType"),
  };
}
