#!/usr/bin/env node
/**
 * Verify Vercel Git integration for rase-co-in.
 * Run: npx tsx scripts/verify-vercel-git.mjs
 */
import { spawnSync } from "node:child_process";

function run(args) {
  const r = spawnSync("npx", ["vercel", ...args], {
    shell: true,
    encoding: "utf8",
  });
  return (r.stdout || "") + (r.stderr || "");
}

console.log("Checking Vercel Git integration for rase-co-in…\n");

const probe = run(["deploy-hook", "create", "_branch_probe", "--ref", "main"]);
let exitCode = 0;

if (probe.includes("not connected to a Git repository")) {
  console.log("✗ Git repository is NOT connected to this Vercel project.");
  console.log("  Pushes to main will not auto-deploy.");
  exitCode = 1;
} else if (probe.includes('Branch "main" not found')) {
  console.log("✗ Git is connected but Vercel cannot see branch main (stale link).");
  exitCode = 1;
} else if (probe.includes("_branch_probe")) {
  const id = probe.match(/"id"\s*:\s*"([^"]+)"/)?.[1];
  if (id) run(["deploy-hook", "remove", id]);
  console.log("✓ Git connected and branch main is visible to Vercel.");
} else {
  console.log("? Could not determine Git status. Raw probe output:");
  console.log(probe.slice(0, 500));
  exitCode = 1;
}

if (exitCode) {
  console.log("\nFix (dashboard — CLI reconnect often needs org admin):");
  console.log("  1. https://vercel.com/dhe-projects/rase-co-in/settings/git");
  console.log("  2. Connect → GitHub → shiksha-mahakumbh/rase");
  console.log("  3. Production Branch = main");
  console.log("  4. GitHub → Settings → Applications → Vercel → grant repo access");
} else {
  console.log("\nOptional: npx vercel deploy-hook create github-actions-fallback --ref main");
}

console.log("\nGitHub Actions fallback: set VERCEL_TOKEN — see .github/DEPLOY_SECRETS.md");
process.exitCode = exitCode;
