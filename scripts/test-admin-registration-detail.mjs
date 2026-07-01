#!/usr/bin/env node
/**
 * Admin registration detail — static security and wiring checks.
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

if (includes("lib/admin/registration-id.ts", /isAdminRegistrationIdentifier/)) {
  pass("registration_id_helper", "Shared admin registration ID validator exists");
} else {
  fail("registration_id_helper", "Missing isAdminRegistrationIdentifier");
}

if (
  includes("app/admin/registrations/[id]/page.tsx", /generateMetadata/) &&
  includes("app/admin/registrations/[id]/page.tsx", /NO_INDEX_META/)
) {
  pass("detail_page_noindex_metadata", "Server page exports noindex metadata");
} else {
  fail("detail_page_noindex_metadata", "Registration detail page missing noindex metadata");
}

if (includes("app/admin/registrations/[id]/RegistrationDetailClient.tsx", /sanitizeExternalUrl/)) {
  pass("detail_document_url_sanitize", "Client sanitizes document download URLs");
} else {
  fail("detail_document_url_sanitize", "Document URLs not sanitized on detail page");
}

if (includes("server/services/admin/registration-admin-view.service.ts", /sanitizeExternalUrl/)) {
  pass("admin_view_url_sanitize", "Admin view builder sanitizes legacy file URLs");
} else {
  fail("admin_view_url_sanitize", "Admin view builder missing URL sanitization");
}

if (
  includes("app/api/v2/admin/registrations/[registrationId]/route.ts", /adminResource:\s*"registrations"/) &&
  includes("app/api/v2/admin/registrations/[registrationId]/route.ts", /writeAuditLog/)
) {
  pass("detail_api_rbac_audit", "Detail API uses registrations RBAC and audit logging");
} else {
  fail("detail_api_rbac_audit", "Detail API missing RBAC or audit");
}

if (
  includes("server/services/registration.service.ts", /ADMIN_REGISTRATION_PUBLIC_ID_RE\.test\(idOrPublicId\)/) &&
  !includes("server/services/registration.service.ts", /\/\^SMK\//)
) {
  pass("admin_view_strict_id_lookup", "Admin view uses strict REG_ID_RE instead of /^SMK/");
} else {
  fail("admin_view_strict_id_lookup", "Admin view still uses loose SMK prefix match");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
