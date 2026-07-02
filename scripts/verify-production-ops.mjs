#!/usr/bin/env node
/**
 * Live production ops verification — status API, RLS, rate limits, monitoring.
 * Usage: node scripts/verify-production-ops.mjs [baseUrl]
 */
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);

const MIN_RLS_POLICIES = Number(process.env.MIN_RLS_POLICIES ?? "5");
const MIN_STORAGE_POLICIES = Number(process.env.MIN_STORAGE_POLICIES ?? "3");

let failed = 0;

function pass(name, detail) {
  console.log(`PASS ${name}: ${detail}`);
}

function fail(name, detail) {
  console.log(`FAIL ${name}: ${detail}`);
  failed += 1;
}

console.log(`Production ops verification: ${base}\n`);

try {
  const res = await fetch(`${base}/api/v2/status`, { redirect: "follow" });
  if (!res.ok) {
    fail("status-api", `HTTP ${res.status}`);
    process.exit(1);
  }

  const payload = await res.json();
  const checks = payload?.checks ?? {};

  if (payload.status === "ok") {
    pass("status-overall", "service status ok");
  } else {
    fail("status-overall", `status=${payload.status}`);
  }

  if (checks.database === "connected") {
    pass("database", "connected");
  } else {
    fail("database", String(checks.database ?? "unknown"));
  }

  if (checks.sentryConfigured === true) {
    pass("sentry", "configured");
  } else {
    fail("sentry", "not configured");
  }

  if (checks.rateLimitMode === "upstash") {
    pass("rate-limits", "upstash distributed");
  } else {
    fail("rate-limits", `mode=${checks.rateLimitMode ?? "unknown"}`);
  }

  if (checks.cronConfigured === true) {
    pass("cron", "CRON_SECRET configured");
  } else {
    fail("cron", "CRON_SECRET missing");
  }

  if (typeof checks.rlsPolicyCount === "number" && checks.rlsPolicyCount >= MIN_RLS_POLICIES) {
    pass("rls-public", `${checks.rlsPolicyCount} public policies (min ${MIN_RLS_POLICIES})`);
  } else {
    fail(
      "rls-public",
      `policy count=${checks.rlsPolicyCount ?? "null"} (min ${MIN_RLS_POLICIES}) — run npm run db:deploy-supabase -- --rls-only`
    );
  }

  if (
    typeof checks.storagePolicyCount === "number" &&
    checks.storagePolicyCount >= MIN_STORAGE_POLICIES
  ) {
    pass("rls-storage", `${checks.storagePolicyCount} storage policies (min ${MIN_STORAGE_POLICIES})`);
  } else {
    fail(
      "rls-storage",
      `policy count=${checks.storagePolicyCount ?? "null"} (min ${MIN_STORAGE_POLICIES})`
    );
  }

  if (checks.anonRolesBlocked === true) {
    pass("rls-anon-roles", "anon cannot read roles table");
  } else if (checks.anonRolesBlocked === false) {
    fail("rls-anon-roles", "anon can read roles — RLS misconfigured");
  } else {
    fail("rls-anon-roles", "probe unavailable (missing Supabase anon env on server)");
  }
} catch (error) {
  fail("status-api", error instanceof Error ? error.message : String(error));
}

console.log(`\n${failed === 0 ? "✓" : "✗"} verify:production-ops — ${failed === 0 ? "all checks passed" : `${failed} failed`}`);
process.exit(failed > 0 ? 1 : 0);
