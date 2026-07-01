#!/usr/bin/env node
/**
 * RBAC matrix — static consistency checks (item 7).
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

if (includes("lib/admin-role-capabilities.ts", /roleHasPermission\(role,\s*"media\.manage"/)) {
  pass("rbac_mutate_uses_permission", "canMutateCms checks media.manage via roleHasPermission");
} else {
  fail("rbac_mutate_uses_permission", "canMutateCms still role-name only");
}

if (includes("server/services/permission.service.ts", /FALLBACK_ROLE_PERMISSIONS/) && includes("server/services/permission.service.ts", /invalidatePermissionCache/)) {
  pass("rbac_db_with_fallback", "Permission service uses DB cache with static fallback");
} else {
  fail("rbac_db_with_fallback", "Permission service missing fallback or cache invalidation");
}

if (includes("server/services/admin/users-admin.service.ts", /invalidatePermissionCache/)) {
  pass("rbac_cache_invalidation", "User admin service invalidates permission cache on change");
} else {
  fail("rbac_cache_invalidation", "Permission cache not invalidated on user updates");
}

const seed = fs.readFileSync(path.resolve("supabase/seed.sql"), "utf8");
const fallback = read("lib/permissions.ts");

if (/Coordinator[\s\S]*registrations\.read[\s\S]*committees\.read/.test(fallback)) {
  pass("rbac_coordinator_fallback", "Coordinator fallback has read-only registration/committee access");
} else {
  fail("rbac_coordinator_fallback", "Coordinator fallback permissions incomplete");
}

if (seed.includes("'users.manage'") && fallback.includes('"users.manage"')) {
  pass("rbac_seed_slug_parity", "users.manage slug present in seed and TypeScript permissions");
} else {
  fail("rbac_seed_slug_parity", "Permission slug drift between seed and code");
}

if (includes("middleware.ts", /roleHasPermission\(role,\s*"media\.manage"\)/)) {
  pass("rbac_middleware_manage_paths", "Middleware blocks manage-only CMS paths without media.manage");
} else {
  fail("rbac_middleware_manage_paths", "Middleware manage-path check not permission-based");
}

if (includes("components/admin/cms/admin-nav.ts", /canMutateCms\(role, permissions\)/)) {
  pass("rbac_nav_mutate_permissions", "CMS nav passes permissions into mutate checks");
} else {
  fail("rbac_nav_mutate_permissions", "CMS nav mutate check ignores permissions array");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
