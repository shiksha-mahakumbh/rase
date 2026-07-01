#!/usr/bin/env node
/**
 * Integration test contracts — Supabase/API scripts and optional live checks.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(".");
const scriptsDir = path.join(repo, "scripts");

const requiredScripts = [
  "test-supabase-registration.mjs",
  "test-supabase-contact.mjs",
  "test-supabase-email.mjs",
  "test-supabase-feedback.mjs",
  "test-supabase-upload.mjs",
  "test-registration-types.mjs",
  "test-v2-registration-security.mjs",
];

let failed = 0;

function pass(name, detail) {
  console.log(`PASS ${name}: ${detail}`);
}

function fail(name, detail) {
  console.log(`FAIL ${name}: ${detail}`);
  failed += 1;
}

for (const script of requiredScripts) {
  const fullPath = path.join(scriptsDir, script);
  if (!fs.existsSync(fullPath)) {
    fail("integration_script", `Missing ${script}`);
    continue;
  }

  const source = fs.readFileSync(fullPath, "utf8");
  const hasIntegrationHook =
    /DATABASE_URL|PrismaClient|fetch\s*\(|\/api\/v2\/|SMTP_/.test(source);

  if (!hasIntegrationHook) {
    fail("integration_hook", `${script} should exercise database, API, or SMTP integration`);
    continue;
  }

  pass("integration_script", `${script} present with integration hook`);
}

if (process.env.RUN_INTEGRATION_TESTS === "1" && process.env.DATABASE_URL) {
  console.log("\nRunning live integration subset (registration types)...\n");
  const result = spawnSync(
    process.execPath,
    [path.join(scriptsDir, "test-registration-types.mjs")],
    { stdio: "inherit", env: process.env }
  );
  if (result.status !== 0) {
    fail("integration_live", "test-registration-types.mjs failed");
  } else {
    pass("integration_live", "Registration type integration checks passed");
  }
} else {
  console.log(
    "\nSKIP live integration — set RUN_INTEGRATION_TESTS=1 and DATABASE_URL to execute runtime checks.\n"
  );
}

if (failed > 0) {
  process.exit(1);
}
