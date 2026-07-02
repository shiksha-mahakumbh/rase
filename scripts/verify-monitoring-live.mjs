#!/usr/bin/env node
/**
 * Live monitoring verification (item 149).
 * Usage: node scripts/verify-monitoring-live.mjs [baseUrl]
 */
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);

const MAX_ATTEMPTS = Number(process.env.MONITORING_PROBE_ATTEMPTS ?? "3");
const RETRY_DELAY_MS = Number(process.env.MONITORING_PROBE_RETRY_MS ?? "3000");

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
    retryOn5xx: true,
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status, probe) {
  return probe.retryOn5xx && status >= 500;
}

async function runProbe(probe) {
  const url = `${base}${probe.path}`;
  let lastStatus = 0;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 1) {
      console.log(`  retry ${probe.name} (${attempt}/${MAX_ATTEMPTS})…`);
      await sleep(RETRY_DELAY_MS * (attempt - 1));
    }

    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(45_000),
      });
      lastStatus = res.status;
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
      if (ok || !shouldRetry(res.status, probe) || attempt === MAX_ATTEMPTS) {
        return { ok, status: res.status, url };
      }
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS) {
        const message = error instanceof Error ? error.message : "error";
        return { ok: false, status: 0, url, message };
      }
    }
  }

  if (lastError) {
    const message = lastError instanceof Error ? lastError.message : "error";
    return { ok: false, status: lastStatus, url, message };
  }

  return { ok: false, status: lastStatus, url };
}

let failed = 0;

console.log(`Monitoring verification: ${base}\n`);

for (const probe of probes) {
  const result = await runProbe(probe);
  if (result.ok) {
    console.log(`PASS ${probe.name} ${result.status} ${result.url}`);
  } else if (result.message) {
    console.log(`FAIL ${probe.name} ${result.url} — ${result.message}`);
    failed += 1;
  } else {
    console.log(`FAIL ${probe.name} ${result.status} ${result.url}`);
    failed += 1;
  }
}

if (failed > 0) {
  process.exit(1);
}
