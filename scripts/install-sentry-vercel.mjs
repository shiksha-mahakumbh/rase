#!/usr/bin/env node
/**
 * Install Sentry on Vercel with the free Developer plan (am3_f).
 * Prerequisite: accept terms at
 * https://vercel.com/dhe-projects/~/integrations/accept-terms/sentry?source=cli
 *
 * Usage: node scripts/install-sentry-vercel.mjs
 */
import { spawnSync } from "node:child_process";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const args = [
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
  "--plan",
  "am3_f",
  "-m",
  "platform=javascript-nextjs",
  "-m",
  "region=us",
  "-m",
  "name=rase-co-in",
  "--non-interactive",
];

console.log("Installing Sentry (Developer / free plan am3_f)…");
const r = spawnSync(npx, args, { stdio: "inherit", shell: process.platform === "win32" });
if (r.status !== 0) {
  console.error("\nBrowser install fails with 'Missing billingPlanId' — do NOT use Try Again in browser.");
  console.error("1. Accept legal terms only:");
  console.error("   https://vercel.com/dhe-projects/~/integrations/accept-terms/sentry?source=cli");
  console.error("2. Close the browser install popup and run this script again (uses free plan am3_f via CLI).");
  process.exit(r.status ?? 1);
}

console.log("\nVerify: curl -s https://www.rase.co.in/api/v2/health");
