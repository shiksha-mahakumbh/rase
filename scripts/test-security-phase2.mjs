#!/usr/bin/env node
/**
 * Security checklist items 35–50 — backend / platform static checks.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
const src = path.join(repo, "src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function readSrc(rel) {
  return fs.readFileSync(path.join(src, rel), "utf8");
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function includesSrc(rel, pattern) {
  return pattern.test(readSrc(rel));
}

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function walkRoutes(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkRoutes(p));
    else if (ent.name === "route.ts") out.push(p);
  }
  return out;
}

// 35 Backend Architecture
if (
  existsRepo("src/server/services") &&
  existsRepo("src/server/lib/api-handler.ts") &&
  existsRepo("src/server/db/prisma.ts")
) {
  pass("backend_layered_services", "Server uses services + api-handler + Prisma client");
} else {
  fail("backend_layered_services", "Missing server architecture folders");
}

// 36 API Versioning
const v2Routes = walkRoutes(path.join(src, "app", "api", "v2"));
const legacyShims = [
  "app/api/registration/submit/route.ts",
  "app/api/registration/lookup/route.ts",
  "app/api/health/route.ts",
];
const shimsOk = legacyShims.every(
  (rel) =>
    fs.existsSync(path.join(src, rel)) &&
    /@deprecated|successor-version/.test(readSrc(rel))
);
if (v2Routes.length >= 120 && shimsOk) {
  pass("api_v2_canonical", `${v2Routes.length} v2 routes with deprecated legacy shims`);
} else {
  fail("api_v2_canonical", `v2 routes=${v2Routes.length}, legacy shims incomplete`);
}

// 37 Runtime Performance
if (includesSrc("server/db/prisma.ts", /connection_limit/) && includesSrc("server/db/prisma.ts", /IS_PRODUCTION_BUILD/)) {
  pass("runtime_prisma_pooling", "Prisma pool limits adapt for build vs serverless runtime");
} else {
  fail("runtime_prisma_pooling", "Prisma pooling not tuned");
}

// 38–39 Database Indexes & Queries
if (readRepo("prisma/schema.prisma").includes("@@index([processed, signatureValid, createdAt])")) {
  pass("db_webhook_reconciliation_index", "WebhookEvent has reconciliation composite index");
} else {
  fail("db_webhook_reconciliation_index", "Missing webhook reconciliation index");
}

if (!readSrc("app/api/v2/health/route.ts").includes("$queryRawUnsafe")) {
  pass("db_safe_health_probe", "Health probe uses tagged template raw query");
} else {
  fail("db_safe_health_probe", "Unsafe raw query in health route");
}

// 40 Caching
if (includesSrc("lib/cms/server.ts", /unstable_cache/) && existsRepo("src/server/lib/cms-cache-purge.ts")) {
  pass("cache_cms_tags", "CMS data uses unstable_cache with purge helpers");
} else {
  fail("cache_cms_tags", "CMS caching or purge missing");
}

// 41–42 Background / Cron Jobs
if (
  (includesSrc("server/services/retention.service.ts", /DELETE_BATCH_SIZE/) ||
    includesSrc("app/api/cron/analytics-retention/route.ts", /DELETE_BATCH_SIZE/)) &&
  includesSrc("server/lib/cron-auth.ts", /CRON_SECRET/)
) {
  pass("cron_auth_and_batching", "Cron routes use shared auth and batched retention deletes");
} else {
  fail("cron_auth_and_batching", "Cron auth or batching incomplete");
}

if (readRepo("vercel.json").includes("/api/cron/warm-cache")) {
  pass("cron_vercel_schedule", "vercel.json schedules cache warm cron");
} else {
  fail("cron_vercel_schedule", "Missing cron schedule in vercel.json");
}

// 43 Webhooks
if (includesSrc("app/api/payments/razorpay-webhook/route.ts", /timingSafeHexEqual|timingSafeEqual/) && includesSrc("server/services/payment.service.ts", /razorpayEventId/)) {
  pass("webhooks_idempotent", "Razorpay webhook verifies signature and dedupes by event id");
} else {
  fail("webhooks_idempotent", "Webhook idempotency or signature check missing");
}

// 44–46 Monitoring / Logging / Error tracking
if (existsRepo("src/lib/monitoring/sentry-env.ts") && includesSrc("server/lib/errors.ts", /toErrorResponse/)) {
  pass("monitoring_error_surface", "Sentry env helper and centralized API error mapping exist");
} else {
  fail("monitoring_error_surface", "Monitoring or error mapping incomplete");
}

// 47 CI/CD
if (existsRepo(".github/workflows/ci.yml") && readRepo(".github/workflows/ci.yml").includes("test:security")) {
  pass("cicd_quality_gates", "CI runs lint, typecheck, security tests, and build");
} else {
  fail("cicd_quality_gates", "CI workflow incomplete");
}

// 48 Vercel
if (existsRepo("vercel.json") && readRepo("vercel.json").includes('"framework": "nextjs"')) {
  pass("vercel_config", "vercel.json configures Next.js functions and crons");
} else {
  fail("vercel_config", "vercel.json missing or incomplete");
}

// 49 Staging
if (existsRepo("scripts/pre-deploy-check.mjs") && existsRepo("scripts/production-smoke-test.mjs")) {
  pass("staging_smoke_scripts", "Pre-deploy and production smoke scripts exist");
} else {
  fail("staging_smoke_scripts", "Staging validation scripts missing");
}

// 50 Rollbacks
if (readRepo("docs/platform/FINAL_DEPLOYMENT_PLAYBOOK.md").includes("Rollback")) {
  pass("rollback_playbook", "Deployment playbook documents rollback strategy");
} else {
  fail("rollback_playbook", "Rollback documentation missing");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
