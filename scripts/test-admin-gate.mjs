#!/usr/bin/env node
/**
 * Admin Gate — static security checks (item 5).
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

if (includes("lib/admin/safe-redirect.ts", /isSafeAdminRedirectPath/)) {
  pass("gate_safe_redirect_helper", "Shared safe redirect helper exists");
} else {
  fail("gate_safe_redirect_helper", "Missing isSafeAdminRedirectPath");
}

if (includes("components/admin/cms/AdminGate.tsx", /isSafeAdminRedirectPath/)) {
  pass("gate_uses_safe_redirect", "AdminGate validates post-login redirect");
} else {
  fail("gate_uses_safe_redirect", "AdminGate still uses loose startsWith check");
}

if (includes("app/api/admin/login/route.ts", /assertSameOrigin/) && includes("app/api/admin/login/route.ts", /admin-login:/)) {
  pass("gate_login_csrf_rate_limit", "Login route has same-origin CSRF and rate limit");
} else {
  fail("gate_login_csrf_rate_limit", "Login route missing CSRF or rate limit");
}

if (includes("lib/adminAuth.tsx", /session\/bootstrap/) && includes("lib/adminAuth.tsx", /credentials:\s*"include"/)) {
  pass("gate_bootstrap_permissions", "AdminProvider bootstraps session with credentials");
} else {
  fail("gate_bootstrap_permissions", "AdminProvider missing bootstrap");
}

if (includes("app/api/admin/session/bootstrap/route.ts", /verifyAndRefreshAdminSession/) && includes("app/api/admin/session/bootstrap/route.ts", /getPermissionsForRole/)) {
  pass("gate_bootstrap_revocation", "Bootstrap re-validates session and loads permissions");
} else {
  fail("gate_bootstrap_revocation", "Bootstrap missing revocation or permissions");
}

if (includes("components/admin/cms/AdminGate.tsx", /autoComplete="current-password"/)) {
  pass("gate_password_autocomplete", "Login form uses password manager autocomplete");
} else {
  fail("gate_password_autocomplete", "Login form missing autocomplete attributes");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
