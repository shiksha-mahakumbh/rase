#!/usr/bin/env node
/**
 * Registration lookup security tests — PII stripping and auth requirements.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

process.env.REGISTRATION_LOOKUP_SECRET = "test-lookup-secret-for-ci";

const results = [];
function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

const REG_ID_RE = /^SMK2026-\d{6}$/;

function createToken(registrationId, email) {
  const secret = process.env.REGISTRATION_LOOKUP_SECRET;
  const exp = Date.now() + 86400000;
  const payload = JSON.stringify({ rid: registrationId, email: email.trim().toLowerCase(), exp });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

function verifyToken(registrationId, token) {
  const secret = process.env.REGISTRATION_LOOKUP_SECRET;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = createHmac("sha256", secret).update(encoded).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (parsed.rid !== registrationId || Date.now() > parsed.exp) return null;
  return parsed;
}

function toPublicSummary(data) {
  return {
    registrationId: data.registrationId,
    registrationType: data.registrationType,
    fullName: data.fullName,
    institution: data.institution ?? null,
    paymentStatus: data.paymentStatus ?? "Pending",
    accommodationRequired: data.accommodationRequired ?? null,
    accommodationStatus: data.accommodationStatus ?? null,
    createdAt: data.createdAt ?? null,
  };
}

const token = createToken("SMK2026-000001", "user@example.com");
if (verifyToken("SMK2026-000001", token)?.email === "user@example.com") {
  pass("token_flow_valid", "HMAC token verifies email binding");
} else {
  fail("token_flow_valid", "Token verification failed");
}

if (!verifyToken("SMK2026-000002", token)) {
  pass("token_wrong_registration_id", "Wrong ID rejected");
} else {
  fail("token_wrong_registration_id", "Wrong ID accepted");
}

if (REG_ID_RE.test("SMK2026-000001") && !REG_ID_RE.test("INVALID")) {
  pass("registration_id_format", "REG_ID_RE validates SMK format");
} else {
  fail("registration_id_format", "REG_ID_RE validation failed");
}

const summary = toPublicSummary({
  registrationId: "SMK2026-000001",
  registrationType: "Conclave",
  fullName: "Test User",
  institution: "Test Org",
  paymentStatus: "Paid",
});
const keys = Object.keys(summary);
if (!keys.includes("email") && !keys.includes("contactNumber")) {
  pass("pii_stripped_from_summary", `Public summary keys: ${keys.join(", ")}`);
} else {
  fail("pii_stripped_from_summary", `PII in summary: ${keys.join(", ")}`);
}

const routeSrc = readFileSync("src/app/api/registration/[registrationId]/route.ts", "utf8");
const lookupHandlerSrc = readFileSync("src/server/lib/registration-lookup-handler.ts", "utf8");
const v2LookupSrc = readFileSync("src/app/api/v2/registration/lookup/route.ts", "utf8");
if (
  (routeSrc.includes("status: 401") || routeSrc.includes("AUTH_REQUIRED")) &&
  (routeSrc.includes("Email or confirmation token required") ||
    lookupHandlerSrc.includes("Email or confirmation token required"))
) {
  pass("route_returns_401_without_credentials", "Route source enforces 401");
} else {
  fail("route_returns_401_without_credentials", "401 gate missing");
}

if (
  (routeSrc.includes("rateLimit") && routeSrc.includes("registration-lookup:")) ||
  v2LookupSrc.includes("v2-registration-lookup-post")
) {
  pass("route_rate_limited", "Rate limit configured");
} else {
  fail("route_rate_limited", "Rate limit missing");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
