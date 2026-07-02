#!/usr/bin/env node
/**
 * Static rollback readiness checks (item 148).
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
let failed = 0;

function pass(name, detail) {
  console.log(`PASS ${name}: ${detail}`);
}

function fail(name, detail) {
  console.log(`FAIL ${name}: ${detail}`);
  failed += 1;
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

if (readRepo("docs/platform/FINAL_DEPLOYMENT_PLAYBOOK.md").includes("Vercel rollback")) {
  pass("rollback_playbook", "Deployment playbook documents Vercel promote rollback");
} else {
  fail("rollback_playbook", "Missing Vercel rollback section in FINAL_DEPLOYMENT_PLAYBOOK.md");
}

if (readRepo("docs/MONITORING_RUNBOOK.md").includes("Rollback procedures")) {
  pass("rollback_runbook", "Monitoring runbook includes rollback procedures");
} else {
  fail("rollback_runbook", "MONITORING_RUNBOOK missing rollback section");
}

if (readRepo("docs/devops/RUNBOOKS.md").includes("FINAL_DEPLOYMENT_PLAYBOOK")) {
  pass("rollback_index", "DevOps runbooks index links deployment playbook");
} else {
  fail("rollback_index", "docs/devops/RUNBOOKS.md missing playbook link");
}

if (fs.existsSync(path.join(repo, "scripts/backup-restore-drill.mjs"))) {
  pass("backup_drill", "backup-restore-drill.mjs available for DB connectivity checks");
} else {
  fail("backup_drill", "backup-restore-drill.mjs missing");
}

const pkg = JSON.parse(readRepo("package.json"));
if (pkg.scripts["backup:drill"]) {
  pass("backup_script", "npm run backup:drill wired");
} else {
  fail("backup_script", "backup:drill npm script missing");
}

process.exit(failed > 0 ? 1 : 0);
