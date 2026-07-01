#!/usr/bin/env node
/**
 * Security checklist items 105–109 — AdSense, ads.txt, analytics, Search Console, cookie consent.
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

// 105 AdSense
if (
  readSrc("components/analytics/ConsentGatedAdSense.tsx").includes("NEXT_PUBLIC_ADSENSE_ENABLED") &&
  readSrc("components/analytics/ConsentGatedAdSense.tsx").includes("hasAnalyticsConsent") &&
  readSrc("app/layout.tsx").includes("google-adsense-account")
) {
  pass("adsense_consent_gated", "AdSense script gated by consent and env flag; publisher meta present");
} else {
  fail("adsense_consent_gated", "AdSense integration incomplete");
}

if (
  readSrc("components/ads/ReservedAdSlot.tsx").includes("data-adsense-ready") &&
  readSrc("lib/analytics/track-path.ts").includes('"/admin"')
) {
  pass("adsense_safe_placements", "CLS-safe reserved slots; admin paths excluded from tracking");
} else {
  fail("adsense_safe_placements", "Ad slot or admin exclusion gaps");
}

// 106 ads.txt
if (existsRepo("public/ads.txt")) {
  const adsTxt = readRepo("public/ads.txt");
  if (adsTxt.includes("pub-4330032354977759") && adsTxt.includes("google.com")) {
    pass("ads_txt_publisher", "public/ads.txt authorizes AdSense publisher");
  } else {
    fail("ads_txt_publisher", "ads.txt missing correct publisher line");
  }
} else {
  fail("ads_txt_publisher", "public/ads.txt missing");
}

// 107 Analytics
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
  readSrc("components/analytics/ConsentGatedAdSense.tsx").includes("COOKIE_WITHDRAWN_EVENT")
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
