#!/usr/bin/env node
/**
 * One-shot Vercel close-out for audit P1 ops env.
 * Run locally after `npx vercel login` (account: internsdhe / dhe-projects).
 *
 * Steps:
 *   1. Optional: install Upstash + Sentry marketplace integrations
 *   2. Push CRON_SECRET, REGISTRATION_EMAIL_SECRET, DIRECT_URL to Vercel
 *   3. Verify production health flags
 *
 * Usage:
 *   node scripts/complete-vercel-setup.mjs
 *   node scripts/complete-vercel-setup.mjs --skip-integrations
 */
import { spawnSync } from "node:child_process";

const skipIntegrations = process.argv.includes("--skip-integrations");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function run(cmd, args, label) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`[warn] ${label} exited ${r.status}`);
    return false;
  }
  return true;
}

async function verifyHealth() {
  console.log("\n=== Verify production health ===");
  try {
    const res = await fetch("https://www.rase.co.in/api/v2/health");
    const j = await res.json();
    console.log(JSON.stringify(j.ops, null, 2));
    const ok =
      j.ops?.cronConfigured &&
      j.ops?.emailSecretConfigured &&
      j.ops?.upstashConfigured &&
      j.ops?.sentryConfigured;
    if (ok) console.log("[ok] All ops flags configured");
    else console.log("[pending] Set missing env vars — see docs/audit/production-checklist.md");
  } catch (e) {
    console.error("[warn] health check failed:", e.message ?? e);
  }
}

if (!skipIntegrations) {
  run(
    npx,
    [
      "vercel",
      "integration",
      "add",
      "upstash/upstash-kv",
      "-e",
      "production",
      "-e",
      "preview",
      "-n",
      "rase-rate-limit",
      "--non-interactive",
    ],
    "Install Upstash Redis"
  );
  run(
    npx,
    [
      "vercel",
      "integration",
      "add",
      "sentry",
      "-e",
      "production",
      "-e",
      "preview",
      "-n",
      "rase-monitoring",
      "--non-interactive",
    ],
    "Install Sentry"
  );
}

run(process.execPath, ["scripts/setup-audit-vercel-env.mjs"], "Push audit env vars");
await verifyHealth();

console.log("\nDone. Redeploy production if env vars changed (git push or Vercel dashboard).");
