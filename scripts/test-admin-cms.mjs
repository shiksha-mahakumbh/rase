#!/usr/bin/env node
/**
 * Admin CMS shell — static security and wiring checks.
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

if (includes("components/admin/cms/admin-nav.ts", /canAccessCmsPath/)) {
  pass("cms_path_guard", "Permission-aware CMS path guard exists");
} else {
  fail("cms_path_guard", "Missing canAccessCmsPath");
}

if (includes("components/admin/cms/AdminShell.tsx", /canAccessCmsPath/)) {
  pass("cms_shell_enforces_path", "AdminShell enforces CMS path permissions");
} else {
  fail("cms_shell_enforces_path", "AdminShell missing path guard");
}

if (includes("app/admin/cms/layout.tsx", /NO_INDEX_META/) && !includes("app/admin/cms/layout.tsx", /"use client"/)) {
  pass("cms_layout_noindex", "CMS layout exports server-side noindex metadata");
} else {
  fail("cms_layout_noindex", "CMS layout missing noindex metadata");
}

if (includes("components/admin/cms/AdminUi.tsx", /roleHasPermission/)) {
  pass("cms_mutate_permissions", "CMS mutate checks use DB-backed permissions");
} else {
  fail("cms_mutate_permissions", "CMS mutate still role-only");
}

if (includes("components/admin/cms/AdminUi.tsx", /AdminSafeExternalLink/)) {
  pass("cms_safe_external_link", "AdminSafeExternalLink component exists");
} else {
  fail("cms_safe_external_link", "Missing AdminSafeExternalLink");
}

if (includes("app/admin/cms/page.tsx", /filterCmsNavForRole\(role, permissions\)/)) {
  pass("cms_dashboard_permissions", "CMS dashboard filters nav with permissions");
} else {
  fail("cms_dashboard_permissions", "CMS dashboard ignores permissions array");
}

if (includes("lib/admin-cms-api.ts", /401.*403/s)) {
  pass("cms_api_auth_errors", "adminCmsFetch handles 401/403 explicitly");
} else {
  fail("cms_api_auth_errors", "adminCmsFetch missing auth error handling");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
