#!/usr/bin/env node
/**
 * Static secrets audit — client leaks, gitignored env files, hardcoded credentials.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(".");
const src = path.join(repo, "src");
let failed = 0;

function pass(name, detail) {
  console.log(`PASS ${name}: ${detail}`);
}

function fail(name, detail) {
  console.log(`FAIL ${name}: ${detail}`);
  failed += 1;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== "node_modules") walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) out.push(p);
  }
  return out;
}

const trackedEnv = spawnSync("git", ["ls-files", ".env", ".env.local", ".env.production"], {
  cwd: repo,
  encoding: "utf8",
});
if (trackedEnv.status === 0 && trackedEnv.stdout.trim()) {
  fail("git_tracked_env", `Tracked env files: ${trackedEnv.stdout.trim()}`);
} else {
  pass("git_tracked_env", "No .env files tracked in git");
}

if (fs.existsSync(path.join(repo, ".env.example")) && /ADMIN_OPS_SECRET/.test(fs.readFileSync(path.join(repo, ".env.example"), "utf8"))) {
  pass("env_example_documented", ".env.example documents admin and payment secrets");
} else {
  fail("env_example_documented", ".env.example missing secret documentation");
}

const clientSecretPattern =
  /process\.env\.(ADMIN_OPS_SECRET|ADMIN_SESSION_SECRET|RAZORPAY_KEY_SECRET|REGISTRATION_LOOKUP_SECRET|SUPABASE_SERVICE_ROLE_KEY)/;
const clientLeaks = [];
for (const file of walk(src)) {
  const content = fs.readFileSync(file, "utf8");
  if (!/^["']use client["']/m.test(content)) continue;
  if (clientSecretPattern.test(content)) {
    clientLeaks.push(path.relative(repo, file));
  }
}
if (clientLeaks.length === 0) {
  pass("client_secret_refs", "No server secrets referenced in use client modules");
} else {
  fail("client_secret_refs", clientLeaks.join(", "));
}

const hardcodedPattern =
  /(?:sk_live|rzp_live|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA )?PRIVATE KEY-----|xox[baprs]-)/;
const hardcodedHits = [];
for (const file of walk(src)) {
  if (hardcodedPattern.test(fs.readFileSync(file, "utf8"))) {
    hardcodedHits.push(path.relative(repo, file));
  }
}
if (hardcodedHits.length === 0) {
  pass("hardcoded_credentials", "No obvious hardcoded live credentials under src/");
} else {
  fail("hardcoded_credentials", hardcodedHits.join(", "));
}

if (fs.existsSync(path.join(repo, "docs/devops/SECRETS_MANAGEMENT.md"))) {
  pass("secrets_runbook", "Secrets management runbook present");
} else {
  fail("secrets_runbook", "Missing docs/devops/SECRETS_MANAGEMENT.md");
}

process.exit(failed > 0 ? 1 : 0);
