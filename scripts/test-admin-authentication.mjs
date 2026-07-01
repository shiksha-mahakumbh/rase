#!/usr/bin/env node
/**
 * Authentication flows — static security checks (item 8).
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

if (includes("app/api/admin/login/route.ts", /assertSameOrigin/) && includes("app/api/admin/login/route.ts", /admin-login:/)) {
  pass("auth_login_csrf_rate_limit", "Admin login enforces same-origin and rate limit");
} else {
  fail("auth_login_csrf_rate_limit", "Admin login missing CSRF or rate limit");
}

if (includes("server/services/auth.service.ts", /resolveAdminSessionForUser/) && includes("server/services/auth.service.ts", /Invalid credentials/)) {
  pass("auth_login_forbidden_non_admin", "Login resolves admin role and rejects non-admin users");
} else {
  fail("auth_login_forbidden_non_admin", "Login missing admin role resolution");
}

const signInSrc = read("server/services/auth.service.ts");
const signInFn = signInSrc.match(/export async function signInWithEmailPassword[\s\S]*?^}/m)?.[0] ?? "";
if (signInFn && !/accessToken:/.test(signInFn) && !/refreshToken:/.test(signInFn)) {
  pass("auth_no_token_leak", "signInWithEmailPassword does not return Supabase tokens to callers");
} else {
  fail("auth_no_token_leak", "signInWithEmailPassword still returns bearer tokens");
}

if (includes("lib/security/participant-auth.ts", /verifyParticipantCredentials/) && includes("app/api/participant/dashboard/route.ts", /verifyParticipantCredentials/)) {
  pass("auth_participant_credentials", "Participant dashboard uses shared credential verification");
} else {
  fail("auth_participant_credentials", "Participant auth wiring incomplete");
}

if (
  (includes("server/lib/registration-lookup-handler.ts", /verifyRegistrationLookupToken|emailsMatch/) ||
    includes("lib/security/registration-lookup.ts", /verifyRegistrationLookupToken|emailsMatch/)) &&
  includes("app/api/v2/registration/lookup/route.ts", /handlePublicRegistrationLookupPost/)
) {
  pass("auth_registration_lookup", "Registration lookup uses HMAC token or email binding");
} else {
  fail("auth_registration_lookup", "Registration lookup auth weak or missing");
}

if (includes("server/lib/admin-guard.ts", /requireAdminSecret/) && includes("server/lib/admin-gateway-context.ts", /timingSafeEqual/)) {
  pass("auth_admin_api_defense", "v2 admin API requires ops secret and signed gateway context");
} else {
  fail("auth_admin_api_defense", "Admin API auth layers incomplete");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
