#!/usr/bin/env node
/**
 * Go-live certification bundle (item 150).
 * Static checks always run; live HTTP probes when RUN_LIVE_GO_LIVE=1.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const repo = path.resolve(".");
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);

const steps = [
  { name: "phase14_audit", cmd: ["node", "scripts/test-security-phase14.mjs"] },
  { name: "rollback_readiness", cmd: ["node", "scripts/verify-rollback-readiness.mjs"] },
];

if (process.env.RUN_LIVE_GO_LIVE === "1") {
  steps.push(
    { name: "validate_go_live", cmd: ["node", "scripts/validate-go-live.mjs", base] },
    { name: "monitoring_live", cmd: ["node", "scripts/verify-monitoring-live.mjs", base] },
    { name: "production_smoke", cmd: ["node", "scripts/production-smoke-test.mjs", base] }
  );
} else {
  console.log(
    "SKIP live HTTP probes — set RUN_LIVE_GO_LIVE=1 to run validate-go-live, monitoring, and smoke against production.\n"
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
