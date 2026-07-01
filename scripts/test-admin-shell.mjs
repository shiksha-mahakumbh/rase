#!/usr/bin/env node
/**
 * Admin Shell — static security checks (item 6).
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

if (includes("components/admin/cms/AdminShell.tsx", /canAccessCmsPath/) && includes("components/admin/cms/AdminShell.tsx", /getCmsFallbackPath/)) {
  pass("shell_path_guard", "AdminShell enforces CMS path permissions with fallback");
} else {
  fail("shell_path_guard", "AdminShell missing path guard or fallback");
}

if (includes("components/admin/cms/AdminShell.tsx", /filterCmsNavForRole\(role, permissions\)/)) {
  pass("shell_nav_permissions", "Sidebar filters nav items by DB permissions");
} else {
  fail("shell_nav_permissions", "Sidebar ignores permissions array");
}

if (includes("components/admin/cms/AdminShell.tsx", /id="admin-main-content"/) && includes("components/admin/cms/AdminShell.tsx", /aria-label="Admin navigation"/)) {
  pass("shell_a11y_landmarks", "Shell exposes main landmark and labelled nav");
} else {
  fail("shell_a11y_landmarks", "Shell missing accessibility landmarks");
}

if (includes("components/admin/cms/AdminShell.tsx", /accessDenied/) && includes("components/admin/cms/AdminShell.tsx", /Redirecting/)) {
  pass("shell_access_denied_ui", "Shell blocks content while redirecting unauthorized users");
} else {
  fail("shell_access_denied_ui", "Shell renders children on denied paths");
}

if (includes("app/admin/cms/CmsLayoutClient.tsx", /AdminCheckInShell/) && includes("app/admin/cms/CmsLayoutClient.tsx", /AdminShell/)) {
  pass("shell_checkin_split", "Check-in routes use dedicated shell outside CMS sidebar");
} else {
  fail("shell_checkin_split", "CMS layout missing check-in shell split");
}

if (includes("components/admin/cms/AdminUi.tsx", /CmsReadOnlyBanner/)) {
  pass("shell_readonly_banner", "CMS read-only banner component exists");
} else {
  fail("shell_readonly_banner", "Missing CmsReadOnlyBanner");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
