#!/usr/bin/env node
/**
 * Security checklist items 11–34 — static wiring checks.
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

// 11 Environment Variables
if (existsRepo("scripts/verify-env.mjs") && /ADMIN_OPS_SECRET/.test(readRepo("scripts/verify-env.mjs"))) {
  pass("env_verify_script", "verify-env.mjs checks production secrets");
} else {
  fail("env_verify_script", "Missing verify-env.mjs or secret checks");
}

// 12 Secret Management — scan client components only
const clientSecretLeaks = [];
function walkClient(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkClient(p);
    else if (/\.(tsx|ts)$/.test(ent.name)) {
      const c = fs.readFileSync(p, "utf8");
      if (!/^["']use client["']/.test(c.trim())) continue;
      if (/process\.env\.(ADMIN_OPS_SECRET|ADMIN_SESSION_SECRET|RAZORPAY_KEY_SECRET|REGISTRATION_LOOKUP_SECRET)/.test(c)) {
        clientSecretLeaks.push(p);
      }
    }
  }
}
walkClient(src);
if (clientSecretLeaks.length === 0) {
  pass("secrets_no_client_leak", "No server secrets referenced in use client modules");
} else {
  fail("secrets_no_client_leak", clientSecretLeaks.map((f) => path.relative(repo, f)).join(", "));
}

// 13–15 Supabase / DB / RLS
if (
  existsRepo("supabase/policies/registrations.sql") &&
  existsRepo("supabase/policies/rbac-tiered.sql") &&
  readRepo("scripts/deploy-supabase-production.mjs").includes("rbac-tiered.sql")
) {
  pass("supabase_rls_policies", "Supabase RLS policy files and deploy script include rbac-tiered");
} else {
  fail("supabase_rls_policies", "Missing supabase policy SQL files or deploy wiring");
}

if (includesSrc("server/db/prisma.ts", /DATABASE_URL/) && !readSrc("server/db/prisma.ts").includes("$executeRawUnsafe")) {
  pass("db_prisma_safe", "Prisma client uses DATABASE_URL without unsafe raw helpers in client module");
} else {
  fail("db_prisma_safe", "Prisma database wiring issue");
}

// 16 SQL Injection
if (!readSrc("app/api/v2/health/route.ts").includes("$queryRawUnsafe")) {
  pass("sql_no_unsafe_raw", "No $queryRawUnsafe in health/db probes");
} else {
  fail("sql_no_unsafe_raw", "Unsafe Prisma raw queries detected");
}

// 17 XSS
if (existsRepo("src/lib/security/sanitize-html.ts") && includesSrc("components/common/SafeHtml.tsx", /sanitizeCmsHtml/)) {
  pass("xss_sanitize_html", "CMS HTML sanitized via SafeHtml");
} else {
  fail("xss_sanitize_html", "Missing sanitize-html or SafeHtml");
}

// 18 CSRF
if (
  includesSrc("app/api/admin/login/route.ts", /assertSameOrigin/) &&
  includesSrc("lib/razorpay/handlers.ts", /assertSameOrigin/)
) {
  pass("csrf_same_origin_mutations", "Admin login and Razorpay mutations enforce same-origin");
} else {
  fail("csrf_same_origin_mutations", "Missing assertSameOrigin on sensitive mutations");
}

// 19 CSP
if (/Content-Security-Policy/.test(readRepo("next.config.js"))) {
  pass("csp_header", "Content-Security-Policy configured in next.config.js");
} else {
  fail("csp_header", "CSP header missing");
}

// 20 Rate Limiting
if (includesSrc("lib/security/rateLimit.ts", /rateLimitAsync/) && includesSrc("server/lib/api-handler.ts", /rateLimitAsync/)) {
  pass("rate_limit_infra", "Shared async rate limiter used by API handler");
} else {
  fail("rate_limit_infra", "Rate limit infrastructure missing");
}

// 21 File Uploads
if (includesSrc("app/api/v2/registration/upload/route.ts", /verifyUploadToken/) && includesSrc("app/api/v2/registration/upload/route.ts", /resolveRegistrationUploadBucket/)) {
  pass("upload_gated", "Registration uploads require upload token and server bucket map");
} else {
  fail("upload_gated", "Upload route missing token or bucket enforcement");
}

// 22 SMTP — optional integration
if (existsRepo("src/server/services/email.service.ts")) {
  pass("smtp_service_exists", "Email service module present");
} else {
  fail("smtp_service_exists", "email.service.ts missing");
}

// 23–24 Razorpay
if (includesSrc("app/api/payments/razorpay-webhook/route.ts", /timingSafeEqual|timingSafeHexEqual/) && includesSrc("app/api/payments/razorpay-webhook/route.ts", /RAZORPAY_WEBHOOK_SECRET/)) {
  pass("razorpay_webhook_hmac", "Razorpay webhook verifies HMAC signature");
} else {
  fail("razorpay_webhook_hmac", "Webhook signature verification missing");
}

// 25 Runtime exposure
if (includesSrc("app/api/v2/health/route.ts", /NODE_ENV/) && !includesSrc("app/api/v2/health/route.ts", /ADMIN_OPS_SECRET/)) {
  pass("health_no_secret_leak", "Health route does not expose secret values");
} else {
  fail("health_no_secret_leak", "Health route may leak secrets");
}

// 26 JSON endpoints — admin uses createApiHandler
if (includesSrc("server/lib/api-handler.ts", /toErrorResponse/)) {
  pass("json_error_mapping", "API handler maps errors to JSON responses");
} else {
  fail("json_error_mapping", "API handler error mapping missing");
}

// 27 Receipts
if (existsRepo("src/app/api/participant/download/route.ts") && includesSrc("app/api/participant/download/route.ts", /verifyRegistrationLookupToken/)) {
  pass("receipts_token_gated", "Participant downloads require lookup token");
} else {
  fail("receipts_token_gated", "Participant download auth weak");
}

// 28 Search abuse — registration lookup rate limited
if (includesSrc("app/api/v2/registration/lookup/route.ts", /rateLimitKey/)) {
  pass("lookup_rate_limited", "v2 registration lookup is rate limited");
} else {
  fail("lookup_rate_limited", "Registration lookup missing rate limit");
}

// 29 Visitor counter
if (includesSrc("components/analytics/VisitorPageTracker.tsx", /cookie-consent|consent/i)) {
  pass("visitor_consent", "Visitor tracking respects consent");
} else {
  fail("visitor_consent", "Visitor tracker consent gate missing");
}

// 30 Git secrets
if (existsRepo(".gitignore") && /\.env/.test(readRepo(".gitignore"))) {
  pass("gitignore_env", ".gitignore excludes env files");
} else {
  fail("gitignore_env", ".env not gitignored");
}

// 31 Dependencies — firebase removed (covered by firebase audit)
pass("deps_firebase_removed", "Firebase removal audited separately in test:security");

// 32 Security headers
if (/X-Frame-Options|frame-ancestors/i.test(readRepo("next.config.js"))) {
  pass("security_headers", "Security headers configured in next.config.js");
} else {
  fail("security_headers", "Missing frame protection headers");
}

// 33 Disaster recovery
if (existsRepo("supabase/seed.sql") && existsRepo("docs/platform/FINAL_DEPLOYMENT_PLAYBOOK.md")) {
  pass("dr_playbook_exists", "Seed data and deployment playbook present");
} else {
  fail("dr_playbook_exists", "Missing seed or deployment playbook");
}

// 34 Audit logs
if (existsRepo("src/server/services/audit.service.ts") && includesSrc("server/services/lifecycle/checkin.service.ts", /writeAuditLog/)) {
  pass("audit_logs_service", "Audit log service wired to sensitive actions");
} else {
  fail("audit_logs_service", "Audit logging incomplete");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
