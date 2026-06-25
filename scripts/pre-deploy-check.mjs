#!/usr/bin/env node
/**
 * Pre-deploy checklist — env verification + release reminders.
 * Usage: node scripts/pre-deploy-check.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

console.log("=== Pre-deploy check ===\n");

const verify = spawnSync("node", ["scripts/verify-env.mjs"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if (verify.status !== 0) {
  console.error("\nFix missing environment variables before deploying.");
  process.exit(verify.status ?? 1);
}

console.log("\nManual release steps (production):");
console.log("  1. npx prisma migrate deploy   # apply DB migrations");
console.log("  2. npm run db:deploy-supabase  # RLS + storage policies (if changed)");
console.log("  3. npm run smoke:prod          # post-deploy HTTP probes");
console.log("  4. Confirm Brevo sender domain + Razorpay webhook + live keys on Vercel");
console.log("\nPre-deploy env check passed.");
