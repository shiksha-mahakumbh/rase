#!/usr/bin/env node
/**
 * Go-live certification bundle (item 150).
 * Static checks always run; live HTTP probes with --live or RUN_LIVE_GO_LIVE=1.
 *
 * Usage:
 *   node scripts/certify-go-live.mjs
 *   node scripts/certify-go-live.mjs --live
 *   node scripts/certify-go-live.mjs --live https://www.rase.co.in
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const repo = path.resolve(".");
const args = process.argv.slice(2);
const live = args.includes("--live") || process.env.RUN_LIVE_GO_LIVE === "1";
const baseArg = args.find((arg) => !arg.startsWith("--"));
const base = (baseArg || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);

const steps = [
  { name: "phase14_audit", cmd: ["node", "scripts/test-security-phase14.mjs"] },
  { name: "rollback_readiness", cmd: ["node", "scripts/verify-rollback-readiness.mjs"] },
];

if (live) {
  steps.push(
    { name: "validate_go_live", cmd: ["node", "scripts/validate-go-live.mjs", base] },
    { name: "monitoring_live", cmd: ["node", "scripts/verify-monitoring-live.mjs", base] },
    { name: "production_smoke", cmd: ["node", "scripts/production-smoke-test.mjs", base] }
  );
} else {
  console.log(
    "SKIP live HTTP probes — use npm run certify:go-live:live (or --live / RUN_LIVE_GO_LIVE=1).\n"
  );
}

let failed = 0;

for (const step of steps) {
  console.log(`\n▶ ${step.name}`);
  const result = spawnSync(step.cmd[0], step.cmd.slice(1), {
    cwd: repo,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    failed += 1;
  }
}

console.log(`\n${failed === 0 ? "✓" : "✗"} certify:go-live — ${steps.length - failed}/${steps.length} steps passed`);
console.log("Sign-off checklist: docs/go-live/GO_LIVE_SIGN_OFF.md");

process.exit(failed > 0 ? 1 : 0);
