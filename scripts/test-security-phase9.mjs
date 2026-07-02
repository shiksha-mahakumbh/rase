#!/usr/bin/env node
/**
 * Security checklist items 105–109 — analytics, Search Console, cookie consent.
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

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

// 105 No AdSense on site
const layoutSrc = readSrc("app/layout.tsx");
const clientChromeSrc = readSrc("app/ClientChrome.tsx");
if (
  !layoutSrc.includes("google-adsense-account") &&
  !layoutSrc.includes("adsense") &&
  !clientChromeSrc.includes("AdSense") &&
  !clientChromeSrc.includes("ConsentGatedAdSense") &&
  !existsRepo("src/components/analytics/ConsentGatedAdSense.tsx")
) {
  pass("adsense_removed", "AdSense script, meta tag, and components removed");
} else {
  fail("adsense_removed", "AdSense references still present in app shell");
}

if (!existsRepo("public/ads.txt") || !readRepo("public/ads.txt").includes("pub-")) {
  pass("ads_txt_removed", "public/ads.txt absent or no AdSense publisher line");
} else {
  fail("ads_txt_removed", "public/ads.txt still authorizes AdSense");
}

// 106 Analytics
if (
  readSrc("components/analytics/AnalyticsLoader.tsx").includes("hasAnalyticsConsent") &&
  readSrc("components/analytics/VisitorPageTracker.tsx").includes("hasAnalyticsConsent") &&
  readSrc("lib/analytics/track-path.ts").includes('"/admin"')
) {
  pass("analytics_consent_admin_excluded", "Analytics and visitor tracking consent-gated; admin paths excluded");
} else {
  fail("analytics_consent_admin_excluded", "Analytics consent or admin exclusion gaps");
}

if (
  readSrc("lib/analytics/consent-mode.ts").includes("ad_storage") &&
  readSrc("lib/analytics/consent-mode.ts").includes("analytics_storage")
) {
  pass("analytics_consent_mode_v2", "Google Consent Mode v2 defaults deny ad/analytics storage");
} else {
  fail("analytics_consent_mode_v2", "Consent Mode v2 incomplete");
}

// 108 Search Console
if (
  readSrc("app/layout.tsx").includes("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION") &&
  readRepo(".env.example").includes("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION")
) {
  pass("search_console_verification", "Search Console verification meta wired via env");
} else {
  fail("search_console_verification", "Search Console verification meta missing");
}

if (existsRepo("src/app/sitemap.ts") || existsRepo("src/app/sitemap.xml")) {
  pass("search_console_sitemap", "Sitemap route available for Search Console submission");
} else {
  fail("search_console_sitemap", "Sitemap route missing");
}

// 109 Cookie consent
if (
  readSrc("components/common/CookieConsent.tsx").includes("setAnalyticsConsent") &&
  readSrc("components/common/CookiePreferences.tsx").includes("Cookie preferences") &&
  readSrc("lib/cookie-consent.ts").includes("COOKIE_WITHDRAWN_EVENT")
) {
  pass("cookie_consent_ui", "Cookie banner, preferences panel, and withdraw events present");
} else {
  fail("cookie_consent_ui", "Cookie consent UI incomplete");
}

if (
  readSrc("components/analytics/TrafficSourceCapture.tsx").includes("COOKIE_WITHDRAWN_EVENT") &&
  readSrc("components/analytics/AnalyticsLoader.tsx").includes("COOKIE_WITHDRAWN_EVENT")
) {
  pass("cookie_consent_growth_sync", "Growth scripts sync on accept and withdraw consent");
} else {
  fail("cookie_consent_growth_sync", "Consent withdraw not wired to growth scripts");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 9 growth checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
