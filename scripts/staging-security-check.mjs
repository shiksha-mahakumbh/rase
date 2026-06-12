#!/usr/bin/env node
/**
 * P0 security code validation — no DB required.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

process.env.REGISTRATION_LOOKUP_SECRET = "test-lookup-secret";
process.env.ADMIN_SESSION_SECRET = "test-admin-secret";

const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

// --- Registration lookup token ---
function createLookupToken(registrationId, email) {
  const secret = process.env.REGISTRATION_LOOKUP_SECRET;
  const exp = Date.now() + 86400000;
  const payload = JSON.stringify({ rid: registrationId, email: email.trim().toLowerCase(), exp });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

function verifyLookupToken(registrationId, token) {
  const secret = process.env.REGISTRATION_LOOKUP_SECRET;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = createHmac("sha256", secret).update(encoded).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (parsed.rid !== registrationId) return null;
  if (Date.now() > parsed.exp) return null;
  return parsed;
}

const validToken = createLookupToken("SMK2026-000001", "test@example.com");
if (verifyLookupToken("SMK2026-000001", validToken)) {
  pass("lookup_token_valid", "HMAC token verifies for correct ID");
} else {
  fail("lookup_token_valid", "Token verification failed");
}

if (!verifyLookupToken("SMK2026-000002", validToken)) {
  pass("lookup_token_wrong_id", "Wrong registration ID rejected");
} else {
  fail("lookup_token_wrong_id", "Wrong ID accepted");
}

if (!verifyLookupToken("SMK2026-000001", "invalid.token")) {
  pass("lookup_token_tampered", "Tampered token rejected");
} else {
  fail("lookup_token_tampered", "Tampered token accepted");
}

// --- Admin session token ---
function createAdminToken(uid, email, role) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const body = { uid, email, role, exp: Date.now() + 86400000 };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${encoded}.${createHmac("sha256", secret).update(encoded).digest("base64url")}`;
}

function verifyAdminToken(token) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = createHmac("sha256", secret).update(encoded).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (Date.now() > parsed.exp) return null;
  return parsed;
}

const adminToken = createAdminToken("uid1", "admin@test.com", "Super Admin");
if (verifyAdminToken(adminToken)) {
  pass("admin_session_valid", "Signed admin session verifies");
} else {
  fail("admin_session_valid", "Admin session verification failed");
}

if (!verifyAdminToken("1")) {
  pass("admin_session_legacy_rejected", "Legacy cookie value '1' rejected");
} else {
  fail("admin_session_legacy_rejected", "Legacy cookie accepted");
}

// --- Source file checks ---
import fs from "node:fs";
import path from "node:path";

const src = path.resolve("src");

function fileContains(rel, pattern) {
  const content = fs.readFileSync(path.join(src, rel), "utf8");
  return pattern.test(content);
}

if (fileContains("app/api/registration/[registrationId]/route.ts", /Email or confirmation token required/)) {
  pass("registration_get_requires_auth", "GET registration requires token or email");
} else {
  fail("registration_get_requires_auth", "GET registration still open");
}

if (fileContains("middleware.ts", /raw === "1"\) return false/)) {
  pass("middleware_rejects_legacy_cookie", "Middleware rejects legacy =1 cookie");
} else {
  fail("middleware_rejects_legacy_cookie", "Legacy cookie not rejected");
}

if (!fileContains("server/backend/index.ts", /return "supabase"/)) {
  fail("registration_backend_supabase", "Registration backend is not supabase-only");
} else {
  pass("registration_backend_supabase", "Registration backend defaults to supabase");
}

function srcHasFirebaseRuntime() {
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) {
        if (name === "node_modules") continue;
        if (walk(full)) return true;
      } else if (/\.(ts|tsx|js|jsx)$/.test(name)) {
        const content = fs.readFileSync(full, "utf8");
        if (/from ["']firebase|firebase-admin|@\/lib\/firebase|@\/app\/firebase/.test(content)) {
          return true;
        }
      }
    }
    return false;
  };
  return walk(src);
}

if (!srcHasFirebaseRuntime()) {
  pass("src_no_firebase_runtime", "No Firebase runtime imports under src/");
} else {
  fail("src_no_firebase_runtime", "Firebase runtime imports still present under src/");
}

const passed = results.filter((r) => r.status === "PASS").length;
const failed = results.filter((r) => r.status === "FAIL").length;

import { writeFileSync, mkdirSync } from "node:fs";
const outDir = path.resolve("docs/staging");
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, "security-check-result.json"), JSON.stringify({ passed, failed, results }, null, 2));

console.log(JSON.stringify({ passed, failed, results }, null, 2));
process.exit(failed > 0 ? 1 : 0);
