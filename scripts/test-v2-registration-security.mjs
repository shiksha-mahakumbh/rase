#!/usr/bin/env node
/**
 * P0 v2 registration API security — static source checks (no DB).
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function includes(rel, pattern) {
  return pattern.test(read(rel));
}

if (includes("app/api/v2/registration/submit/route.ts", /guardRegistrationSubmit/)) {
  pass("v2_submit_uses_guard", "v2 submit imports guardRegistrationSubmit");
} else {
  fail("v2_submit_uses_guard", "v2 submit missing guardRegistrationSubmit");
}

if (
  includes("server/services/registration.service.ts", /consumeVerifiedPaymentInTransaction/) &&
  includes("app/api/v2/registration/submit/route.ts", /razorpayPaymentId:\s*guarded\.razorpayPaymentId/)
) {
  pass("v2_submit_payment_consume", "v2 submit consumes verified payment inside registration transaction");
} else {
  fail("v2_submit_payment_consume", "v2 submit does not atomically consume payment");
}

if (
  includes("server/lib/registration-submit-guard.ts", /assertVerifiedPaymentForSubmit/) &&
  includes("server/lib/registration-submit-guard.ts", /resolveRegistrationFee/)
) {
  pass("submit_guard_payment_checks", "Shared guard validates fee and Razorpay");
} else {
  fail("submit_guard_payment_checks", "Shared guard missing payment validation");
}

if (
  includes("app/api/v2/registration/upload/route.ts", /resolveRegistrationUploadBucket/) &&
  !includes("app/api/v2/registration/upload/route.ts", /form\.get\("bucket"\)/)
) {
  pass("v2_upload_server_bucket", "v2 upload resolves bucket from registrationType only");
} else {
  fail("v2_upload_server_bucket", "v2 upload still accepts client bucket");
}

if (includes("server/lib/registration-upload-bucket.ts", /REGISTRATION_TYPE_BUCKET_MAP/)) {
  pass("upload_bucket_map_exists", "Shared upload bucket map defined");
} else {
  fail("upload_bucket_map_exists", "Missing REGISTRATION_TYPE_BUCKET_MAP");
}

if (fs.existsSync(path.join(root, "lib/security/sanitize-html.ts"))) {
  pass("sanitize_html_module", "sanitize-html.ts exists");
} else {
  fail("sanitize_html_module", "sanitize-html.ts missing");
}

if (includes("components/common/SafeHtml.tsx", /sanitizeCmsHtml/)) {
  pass("safe_html_component", "SafeHtml uses sanitizeCmsHtml");
} else {
  fail("safe_html_component", "SafeHtml missing sanitization");
}

const cmsFiles = [
  "components/layouts/CmsLegalPage.tsx",
  "components/departments/CmsDepartmentPage.tsx",
  "components/events/CmsEventView.tsx",
  "components/speakers/CmsSpeakerView.tsx",
  "components/press/CmsPressArticleView.tsx",
  "components/press/PressArticleBody.tsx",
];

const cmsUnsafe = cmsFiles.filter((f) =>
  /dangerouslySetInnerHTML/.test(read(f))
);
if (cmsUnsafe.length === 0) {
  pass("cms_no_raw_html", "CMS components use SafeHtml (no raw dangerouslySetInnerHTML)");
} else {
  fail("cms_no_raw_html", `Raw HTML still in: ${cmsUnsafe.join(", ")}`);
}

const nextConfig = fs.readFileSync(path.resolve("next.config.js"), "utf8");
if (/Content-Security-Policy/.test(nextConfig)) {
  pass("csp_header_configured", "CSP header in next.config.js");
} else {
  fail("csp_header_configured", "CSP header missing from next.config.js");
}

const passed = results.filter((r) => r.status === "PASS").length;
const failed = results.filter((r) => r.status === "FAIL").length;

console.log(JSON.stringify({ passed, failed, results }, null, 2));
process.exit(failed > 0 ? 1 : 0);
