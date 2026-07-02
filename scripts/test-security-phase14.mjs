#!/usr/bin/env node
/**
 * Security checklist items 139–150 — domain, SSL, DNS, CDN, final passes, sign-off.
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

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function readSrc(rel) {
  return fs.readFileSync(path.join(src, rel), "utf8");
}

const pkg = JSON.parse(readRepo("package.json"));
const nextConfig = readRepo("next.config.js");

// 139 Domain
if (
  readSrc("config/site.ts").includes("CANONICAL_SITE_URL") &&
  readSrc("config/site.ts").includes("toCanonicalSiteUrl") &&
  readRepo(".env.example").includes("www.rase.co.in") &&
  readSrc("app/sitemap.ts").includes("SITE_URL")
) {
  pass("domain_canonical", "Canonical SITE_URL resolver, env template, and sitemap wired");
} else {
  fail("domain_canonical", "Domain configuration incomplete");
}

if (existsRepo("docs/go-live/DNS_AND_DOMAIN.md")) {
  pass("domain_dns_docs", "DNS and domain checklist documented");
} else {
  fail("domain_dns_docs", "Missing docs/go-live/DNS_AND_DOMAIN.md");
}

// 140 SSL
if (
  nextConfig.includes("upgrade-insecure-requests") &&
  nextConfig.includes("Strict-Transport-Security")
) {
  pass("ssl_headers", "CSP upgrade-insecure-requests and HSTS configured");
} else {
  fail("ssl_headers", "SSL security headers incomplete");
}

const goLive = readRepo("scripts/validate-go-live.mjs");
if (goLive.includes("https-scheme") && goLive.includes("hsts-header")) {
  pass("ssl_go_live_probes", "validate-go-live checks HTTPS and HSTS");
} else {
  fail("ssl_go_live_probes", "validate-go-live missing SSL probes");
}

// 141 DNS
if (readRepo("docs/go-live/DNS_AND_DOMAIN.md").includes("CNAME")) {
  pass("dns_checklist", "DNS checklist covers Vercel CNAME and apex");
} else {
  fail("dns_checklist", "DNS checklist incomplete");
}

// 142 CDN
if (
  nextConfig.includes("image/avif") &&
  nextConfig.includes("**.supabase.co") &&
  nextConfig.includes("minimumCacheTTL")
) {
  pass("cdn_image_delivery", "next/image AVIF/WebP and Supabase CDN patterns configured");
} else {
  fail("cdn_image_delivery", "CDN/image delivery config incomplete");
}

if (existsRepo("vercel.json")) {
  pass("cdn_vercel_edge", "vercel.json present for edge deployment and crons");
} else {
  fail("cdn_vercel_edge", "vercel.json missing");
}

// 143 Final security pass
const phaseScripts = fs
  .readdirSync(path.join(repo, "scripts"))
  .filter((name) => /^test-security-phase\d+\.mjs$/.test(name));
if (phaseScripts.length >= 14 && pkg.scripts["test:security"]?.includes("test-security-phase14.mjs")) {
  pass("final_security_pass", `${phaseScripts.length} security phase scripts wired through phase14`);
} else {
  fail("final_security_pass", "Security phase scripts or phase14 wiring incomplete");
}

// 144 Final SEO pass
if (
  existsRepo("src/app/robots.ts") &&
  existsRepo("src/app/sitemap.ts") &&
  pkg.scripts["test:security"]?.includes("test-security-phase5.mjs")
) {
  pass("final_seo_pass", "robots.ts, sitemap.ts, and phase5 SEO checks present");
} else {
  fail("final_seo_pass", "Final SEO pass incomplete");
}

// 145 Final Lighthouse pass
if (
  pkg.scripts["audit:site-performance"] &&
  pkg.scripts["lighthouse:local"] &&
  readRepo(".github/workflows/ci.yml").includes("audit:site-performance")
) {
  pass("final_lighthouse_pass", "Site performance audit and Lighthouse runner in CI");
} else {
  fail("final_lighthouse_pass", "Lighthouse / performance audit wiring incomplete");
}

// 146 Final accessibility pass
if (
  existsRepo("e2e/accessibility.spec.ts") &&
  pkg.scripts["test:e2e"] &&
  pkg.scripts["test:security"]?.includes("test-security-phase7.mjs")
) {
  pass("final_accessibility_pass", "Playwright a11y specs and phase7 checks present");
} else {
  fail("final_accessibility_pass", "Accessibility pass incomplete");
}

// 147 Production smoke test
if (
  pkg.scripts["test:smoke"] &&
  existsRepo("scripts/production-smoke-test.mjs") &&
  readRepo(".github/workflows/ci.yml").includes("production-smoke-test.mjs")
) {
  pass("production_smoke", "Smoke script, npm target, and CI post-deploy smoke present");
} else {
  fail("production_smoke", "Production smoke test wiring incomplete");
}

// 148 Rollback verification
if (pkg.scripts["verify:rollback"] && existsRepo("scripts/verify-rollback-readiness.mjs")) {
  pass("rollback_verification", "Rollback readiness script and npm target present");
} else {
  fail("rollback_verification", "Rollback verification missing");
}

// 149 Monitoring verification
if (
  pkg.scripts["verify:monitoring"] &&
  existsRepo("scripts/verify-monitoring-live.mjs") &&
  readRepo("scripts/production-smoke-test.mjs").includes("/api/v2/status")
) {
  pass("monitoring_verification", "Live monitoring probes and status smoke checks wired");
} else {
  fail("monitoring_verification", "Monitoring verification incomplete");
}

// 150 Final sign-off
if (
  existsRepo("docs/go-live/GO_LIVE_SIGN_OFF.md") &&
  pkg.scripts["certify:go-live"] &&
  existsRepo("scripts/certify-go-live.mjs")
) {
  pass("final_signoff", "GO_LIVE_SIGN_OFF checklist and certify:go-live bundle present");
} else {
  fail("final_signoff", "Final sign-off documentation or certify script missing");
}

const failed = results.filter((result) => result.status === "FAIL");
console.log(`\nPhase 14 go-live checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const result of results) {
  console.log(`${result.status === "PASS" ? "✓" : "✗"} ${result.test}: ${result.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
