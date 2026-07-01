#!/usr/bin/env node
/**
 * Admin check-in gate — static security and wiring checks.
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

if (includes("lib/admin-role-capabilities.ts", /canAccessCheckInGate/)) {
  pass("checkin_gate_capability", "canAccessCheckInGate exported");
} else {
  fail("checkin_gate_capability", "Missing canAccessCheckInGate");
}

if (
  includes("middleware.ts", /roleHasPermission\(role,\s*"registrations\.read"\)/) &&
  !includes("middleware.ts", /canPerformCheckIn\(role\)/)
) {
  pass("checkin_middleware_read", "Middleware allows lookup roles (registrations.read)");
} else {
  fail("checkin_middleware_read", "Middleware still blocks read-only check-in access");
}

if (includes("components/admin/cms/AdminCheckInShell.tsx", /canAccessCheckInGate/)) {
  pass("checkin_shell_guard", "AdminCheckInShell enforces registrations.read");
} else {
  fail("checkin_shell_guard", "AdminCheckInShell missing permission guard");
}

if (includes("app/event/checkin/CheckInClient.tsx", /ADMIN_REGISTRATION_PUBLIC_ID_RE/)) {
  pass("checkin_client_id_validation", "Client validates SMK ID before lookup");
} else {
  fail("checkin_client_id_validation", "Client missing ID validation");
}

if (
  includes("server/services/lifecycle/checkin.service.ts", /REG_ID_RE/) &&
  !includes(
    "server/services/lifecycle/checkin.service.ts",
    /OR:\s*\[\s*\{\s*registrationId\s*\},\s*\{\s*id:\s*registrationId\s*\}\s*\]/
  )
) {
  pass("checkin_server_strict_lookup", "Server lookup uses public ID only");
} else {
  fail("checkin_server_strict_lookup", "Server lookup still allows UUID OR");
}

if (includes("app/api/v2/admin/checkin/route.ts", /mutationPermission:\s*"registrations\.update"/)) {
  pass("checkin_post_mutation_perm", "POST check-in requires registrations.update");
} else {
  fail("checkin_post_mutation_perm", "POST missing explicit mutation permission");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
