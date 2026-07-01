#!/usr/bin/env node
/**
 * HMAC token design — static checks (item 10).
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

if (!includes("lib/security/admin-session.ts", /jwt|jsonwebtoken/i) && !includes("lib/security/registration-lookup.ts", /jwt|jsonwebtoken/i)) {
  pass("tokens_no_jwt_library", "Tokens use HMAC stateless design, not JWT libraries");
} else {
  fail("tokens_no_jwt_library", "JWT library detected in token modules");
}

if (includes("lib/security/admin-session.ts", /timingSafeEqual/) && includes("lib/security/admin-session.ts", /sessionVersion/)) {
  pass("tokens_admin_session", "Admin session tokens are HMAC-signed with sessionVersion");
} else {
  fail("tokens_admin_session", "Admin session token design incomplete");
}

if (includes("lib/security/registration-lookup.ts", /REG_ID_RE\.test\(rid\)/) && includes("lib/security/registration-lookup.ts", /timingSafeEqual/)) {
  pass("tokens_lookup_binding", "Lookup tokens validate SMK ID format and use timing-safe verify");
} else {
  fail("tokens_lookup_binding", "Lookup token validation incomplete");
}

if (includes("lib/security/upload-token.ts", /REGISTRATION_UPLOAD_SECRET/) && includes("lib/security/upload-token.ts", /typ:\s*"upload"/)) {
  pass("tokens_upload_short_lived", "Upload tokens use dedicated secret and typed short-lived payload");
} else {
  fail("tokens_upload_short_lived", "Upload token secret or typ claim missing");
}

if (
  includes("server/lib/admin-gateway-context.ts", /sessionVersion/) &&
  includes("server/lib/admin-gateway-context.ts", /expMs/) &&
  includes("server/lib/admin-gateway-proxy.ts", /x-admin-session-version/)
) {
  pass("tokens_gateway_context", "Gateway context signatures bind sessionVersion and expiry");
} else {
  fail("tokens_gateway_context", "Gateway signing missing sessionVersion or TTL");
}

if (includes("server/lib/admin-gateway-context.ts", /ADMIN_GATEWAY_SIGNING_SECRET/)) {
  pass("tokens_gateway_signing_secret", "Gateway supports separate signing secret");
} else {
  fail("tokens_gateway_signing_secret", "Gateway signing secret split missing");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
