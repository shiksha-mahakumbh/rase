#!/usr/bin/env node
/**
 * /api/v2/admin/* — static security and RBAC wiring checks (item 4).
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const adminRoot = path.join(root, "app", "api", "v2", "admin");
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

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name === "route.ts") out.push(p);
  }
  return out;
}

const routes = walk(adminRoot);
const handlerExports = routes.flatMap((file) => {
  const src = fs.readFileSync(file, "utf8");
  const rel = file.replace(/\\/g, "/").replace(`${root.replace(/\\/g, "/")}/`, "");
  const matches = [...src.matchAll(/export const (GET|POST|PUT|PATCH|DELETE) =/g)];
  return matches.map((m) => ({ file: rel, method: m[1], src }));
});

if (routes.length >= 90) {
  pass("v2_admin_route_count", `${routes.length} route handlers under /api/v2/admin`);
} else {
  fail("v2_admin_route_count", `Expected >= 90 routes, found ${routes.length}`);
}

const unguarded = handlerExports.filter(({ src }) => {
  if (/adminBinaryGuard/.test(src)) return false;
  return !/requireAdmin:\s*true/.test(src);
});
if (unguarded.length === 0) {
  pass("v2_admin_require_admin", "All exported handlers require admin auth");
} else {
  fail(
    "v2_admin_require_admin",
    `Unguarded handlers: ${unguarded.map((u) => `${u.file} ${u.method}`).join(", ")}`
  );
}

const legacyRoleGates = routes.filter((file) =>
  /adminRoles:\s*ADMIN_MANAGE_ROLES/.test(fs.readFileSync(file, "utf8"))
);
if (legacyRoleGates.length === 0) {
  pass("v2_admin_no_legacy_role_arrays", "No ADMIN_MANAGE_ROLES hard-coded route gates");
} else {
  fail(
    "v2_admin_no_legacy_role_arrays",
    legacyRoleGates.map((f) => f.replace(/\\/g, "/")).join(", ")
  );
}

if (includes("server/lib/admin-guard.ts", /verifyAdminGatewayContext/) && includes("server/lib/admin-guard.ts", /GATEWAY_REQUIRED/)) {
  pass("v2_admin_gateway_enforced", "Production v2 admin requires signed gateway context");
} else {
  fail("v2_admin_gateway_enforced", "admin-guard missing gateway enforcement");
}

if (includes("app/api/admin/gateway/[...path]/route.ts", /assertSameOrigin/) && includes("app/api/admin/gateway/[...path]/route.ts", /verifyAdminRequest/)) {
  pass("v2_admin_gateway_proxy", "Gateway proxy verifies session and same-origin");
} else {
  fail("v2_admin_gateway_proxy", "Gateway proxy missing CSRF or session check");
}

if (includes("server/lib/api-handler.ts", /v2-admin-read/) && includes("server/lib/api-handler.ts", /v2-admin-mutation/)) {
  pass("v2_admin_default_rate_limits", "createApiHandler applies default admin rate limits");
} else {
  fail("v2_admin_default_rate_limits", "Missing default rate limit keys");
}

const binaryRoutes = routes.filter((f) => /adminBinaryGuard/.test(fs.readFileSync(f, "utf8")));
const binaryWithoutPerm = binaryRoutes.filter((f) => !/permission:/.test(fs.readFileSync(f, "utf8")));
if (binaryWithoutPerm.length === 0) {
  pass("v2_admin_binary_permissions", "Binary admin routes use explicit permission slugs");
} else {
  fail(
    "v2_admin_binary_permissions",
    binaryWithoutPerm.map((f) => f.replace(/\\/g, "/")).join(", ")
  );
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
