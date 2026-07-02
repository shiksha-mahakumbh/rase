#!/usr/bin/env node
/**
 * Security checklist items 135–138 — privacy, terms, cookies, licenses.
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

// 135 Privacy Policy
const privacy = readSrc("app/privacy-policy/page.tsx");
if (
  existsRepo("src/app/privacy-policy/page.tsx") &&
  privacy.includes("Data controller") &&
  privacy.includes("DPDP")
) {
  pass("privacy_policy", "Privacy policy page with controller and DPDP sections");
} else {
  fail("privacy_policy", "Privacy policy page incomplete");
}

if (
  readSrc("components/layout/footer-content.ts").includes("/privacy-policy") &&
  readSrc("components/forms/RegistrationLegalNotice.tsx").includes("Privacy Policy")
) {
  pass("privacy_policy_links", "Privacy policy linked from footer and registration forms");
} else {
  fail("privacy_policy_links", "Privacy policy links missing from footer or registration");
}

// 136 Terms
const terms = readSrc("app/terms-and-conditions/page.tsx");
if (
  existsRepo("src/app/terms-and-conditions/page.tsx") &&
  terms.includes("Acceptance") &&
  terms.includes("Governing law")
) {
  pass("terms_conditions", "Terms page covers acceptance and governing law");
} else {
  fail("terms_conditions", "Terms page incomplete");
}

if (terms.includes("/privacy-policy") && terms.includes("/refund-policy")) {
  pass("terms_cross_links", "Terms cross-link privacy and refund policies");
} else {
  fail("terms_cross_links", "Terms missing policy cross-links");
}

// 137 Cookies
const cookiePolicy = readSrc("app/cookie-policy/page.tsx");
if (
  existsRepo("src/app/cookie-policy/page.tsx") &&
  cookiePolicy.includes("Essential") &&
  cookiePolicy.includes("Analytics")
) {
  pass("cookie_policy", "Cookie policy documents essential and optional cookies");
} else {
  fail("cookie_policy", "Cookie policy page incomplete");
}

if (
  readSrc("components/common/CookieConsent.tsx").includes("/cookie-policy") &&
  readSrc("lib/cookie-consent.ts").includes("COOKIE_CONSENT_KEY") &&
  readSrc("components/common/CookiePreferences.tsx").includes("Cookie preferences")
) {
  pass("cookie_consent_ui", "Cookie banner, preferences panel, and policy link wired");
} else {
  fail("cookie_consent_ui", "Cookie consent UI incomplete");
}

// 138 Licenses
if (
  existsRepo("LICENSE") &&
  readRepo("LICENSE").includes("All rights reserved") &&
  existsRepo("docs/legal/THIRD_PARTY_LICENSES.md")
) {
  pass("license_proprietary", "Proprietary LICENSE and third-party license doc present");
} else {
  fail("license_proprietary", "LICENSE or third-party license documentation missing");
}

if (
  existsRepo("src/app/licenses/page.tsx") &&
  readSrc("app/licenses/page.tsx").includes("Third-party") &&
  readRepo("package.json").includes('"private": true')
) {
  pass("license_page", "Public /licenses page and private npm package declared");
} else {
  fail("license_page", "Licenses page or private package declaration missing");
}

const smoke = readRepo("scripts/production-smoke-test.mjs");
const legalPaths = ["/privacy-policy", "/terms-and-conditions", "/cookie-policy", "/licenses"];
if (legalPaths.every((p) => smoke.includes(p))) {
  pass("legal_smoke", "Production smoke covers all legal pages");
} else {
  fail("legal_smoke", "Production smoke missing legal page checks");
}

if (readRepo("docs/legal/README.md").includes("Privacy Policy")) {
  pass("legal_docs_index", "docs/legal README indexes public legal pages");
} else {
  fail("legal_docs_index", "Legal documentation index missing");
}

const failed = results.filter((result) => result.status === "FAIL");
console.log(`\nPhase 13 legal checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const result of results) {
  console.log(`${result.status === "PASS" ? "✓" : "✗"} ${result.test}: ${result.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
