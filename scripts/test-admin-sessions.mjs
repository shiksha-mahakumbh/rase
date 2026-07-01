#!/usr/bin/env node
/**
 * Admin sessions — static security checks (item 9).
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

if (includes("lib/security/admin-session.ts", /sessionVersion/) && includes("lib/security/admin-session.ts", /timingSafeEqual/)) {
  pass("session_signed_cookie", "Admin session cookie is HMAC-signed with sessionVersion");
} else {
  fail("session_signed_cookie", "Admin session token missing version or timing-safe verify");
}

if (includes("lib/security/admin-session.ts", /httpOnly:\s*true/) && includes("lib/security/admin-session.ts", /sameSite:\s*"lax"/)) {
  pass("session_cookie_flags", "Session cookie uses HttpOnly and SameSite=Lax");
} else {
  fail("session_cookie_flags", "Session cookie flags incomplete");
}

if (includes("lib/security/admin-session-edge.ts", /sessionVersion/) && includes("middleware.ts", /verifyAdminSessionTokenEdge/)) {
  pass("session_edge_middleware", "Middleware verifies signed session on edge");
} else {
  fail("session_edge_middleware", "Edge session verification missing");
}

if (includes("server/lib/admin-request-auth.ts", /verifyAndRefreshAdminSession/) && includes("server/lib/admin-request-auth.ts", /sessionVersion/)) {
  pass("session_revocation_check", "Server refresh compares sessionVersion for revocation");
} else {
  fail("session_revocation_check", "Session revocation check missing");
}

if (includes("server/services/auth.service.ts", /bumpAdminSessionVersion/) && includes("server/services/admin/users-admin.service.ts", /bumpAdminSessionVersion/)) {
  pass("session_bump_on_role_change", "Role changes bump sessionVersion to revoke cookies");
} else {
  fail("session_bump_on_role_change", "sessionVersion not bumped on admin user updates");
}

if (includes("app/api/admin/session/route.ts", /assertAdminSession/) && includes("app/api/admin/session/route.ts", /clearAdminSessionCookie/)) {
  pass("session_logout_requires_auth", "Logout requires valid session before clearing cookie");
} else {
  fail("session_logout_requires_auth", "Logout allows unauthenticated cookie clear");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
