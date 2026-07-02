#!/usr/bin/env node
/**
 * Live monitoring verification (item 149).
 * Usage: node scripts/verify-monitoring-live.mjs [baseUrl]
 */
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);

const probes = [
  {
    name: "health-v2",
    path: "/api/v2/health",
    validate: (res, json) => res.ok && (json?.status === "ok" || json?.ok === true),
  },
  {
    name: "status-api",
    path: "/api/v2/status",
    validate: (res, json) =>
      res.ok &&
      json?.service &&
      json?.checks &&
      json.checks.database === "connected" &&
      json.checks.sentryConfigured === true &&
      json.checks.rateLimitMode === "upstash" &&
      json.checks.cronConfigured === true &&
      typeof json.checks.rlsPolicyCount === "number" &&
      json.checks.rlsPolicyCount >= 5 &&
      typeof json.checks.storagePolicyCount === "number" &&
      json.checks.storagePolicyCount >= 3 &&
      json.checks.anonRolesBlocked === true,
  },
  {
    name: "status-page",
    path: "/status",
    validate: (res, text) => res.ok && /Service Status|Operational|Degraded/i.test(text),
    text: true,
  },
];

let failed = 0;

console.log(`Monitoring verification: ${base}\n`);

for (const probe of probes) {
  const url = `${base}${probe.path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    let json = null;
    if (!probe.text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }
    const ok = probe.text ? probe.validate(res, text) : probe.validate(res, json);
    console.log(`${ok ? "PASS" : "FAIL"} ${probe.name} ${res.status} ${url}`);
    if (!ok) failed += 1;
  } catch (error) {
    console.log(`FAIL ${probe.name} ${url} — ${error instanceof Error ? error.message : "error"}`);
    failed += 1;
  }
}

if (failed > 0) {
  process.exit(1);
}
