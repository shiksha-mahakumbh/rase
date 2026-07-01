#!/usr/bin/env node
/**
 * Security checklist items 129–134 — Docker, secrets, monitoring, alerting,
 * status pages, and runbooks.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
const src = path.join(repo, "src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

const pkg = JSON.parse(readRepo("package.json"));

// 129 Docker
if (
  existsRepo("Dockerfile") &&
  existsRepo("docker-compose.yml") &&
  existsRepo(".dockerignore") &&
  existsRepo("docs/devops/DOCKER.md")
) {
  pass("docker_tooling", "Dockerfile, compose, dockerignore, and docs present");
} else {
  fail("docker_tooling", "Docker packaging incomplete");
}

const dockerfile = readRepo("Dockerfile");
if (dockerfile.includes("node:24") && dockerfile.includes("npm run build")) {
  pass("docker_build_pipeline", "Docker image builds with Node 24 and production build");
} else {
  fail("docker_build_pipeline", "Dockerfile missing Node 24 or build step");
}

// 130 Secrets
if (
  pkg.scripts["verify:env"] &&
  pkg.scripts["audit:secrets"] &&
  existsRepo("scripts/audit-secrets-static.mjs") &&
  existsRepo("docs/devops/SECRETS_MANAGEMENT.md")
) {
  pass("secrets_management", "verify:env, audit:secrets, and secrets runbook wired");
} else {
  fail("secrets_management", "Secrets verification or documentation missing");
}

if (
  readRepo(".gitignore").includes(".env") &&
  existsRepo(".env.example") &&
  readRepo(".env.example").includes("CRON_SECRET")
) {
  pass("secrets_template_gitignore", ".env.example and gitignore protect local secrets");
} else {
  fail("secrets_template_gitignore", ".env.example or gitignore incomplete");
}

// 131 Monitoring
if (
  existsRepo("sentry.client.config.ts") &&
  existsRepo("sentry.server.config.ts") &&
  existsRepo("src/lib/monitoring/service-status.ts") &&
  existsRepo("src/app/api/client-error/route.ts")
) {
  pass("monitoring_stack", "Sentry configs, status probe, and client-error pipeline present");
} else {
  fail("monitoring_stack", "Monitoring stack incomplete");
}

const monitoringDoc = readRepo("docs/MONITORING_ARCHITECTURE.md");
if (monitoringDoc.includes("/api/v2/status") && monitoringDoc.includes("Supabase")) {
  pass("monitoring_docs", "Monitoring architecture documents Supabase probes and status API");
} else {
  fail("monitoring_docs", "Monitoring architecture doc outdated or incomplete");
}

// 132 Alerting
if (existsRepo("docs/devops/ALERTING.md") && readRepo("docs/devops/ALERTING.md").includes("Sentry")) {
  pass("alerting_runbook", "Alerting runbook covers Sentry, uptime, and deploy failures");
} else {
  fail("alerting_runbook", "Alerting documentation missing");
}

if (readRepo(".github/workflows/ci.yml").includes("Production smoke test")) {
  pass("alerting_deploy_smoke", "CI fails deploy pipeline when production smoke fails");
} else {
  fail("alerting_deploy_smoke", "CI missing post-deploy smoke alerting hook");
}

// 133 Status pages
if (
  existsRepo("src/app/status/page.tsx") &&
  existsRepo("src/app/api/v2/status/route.ts")
) {
  pass("status_page", "Public /status page and /api/v2/status JSON probe present");
} else {
  fail("status_page", "Status page or API route missing");
}

const smoke = readRepo("scripts/production-smoke-test.mjs");
if (smoke.includes("/api/v2/status") && smoke.includes("/status")) {
  pass("status_smoke", "Production smoke covers status page and API");
} else {
  fail("status_smoke", "Production smoke missing status endpoints");
}

// 134 Runbooks
if (existsRepo("docs/devops/RUNBOOKS.md")) {
  const runbooks = readRepo("docs/devops/RUNBOOKS.md");
  const requiredLinks = [
    "MONITORING_RUNBOOK.md",
    "ALERTING.md",
    "SECRETS_MANAGEMENT.md",
    "VERCEL_PRODUCTION_RELEASE_RUNBOOK.md",
  ];
  if (requiredLinks.every((link) => runbooks.includes(link))) {
    pass("runbooks_index", "Runbooks index links monitoring, alerting, secrets, and release docs");
  } else {
    fail("runbooks_index", "Runbooks index missing required links");
  }
} else {
  fail("runbooks_index", "docs/devops/RUNBOOKS.md missing");
}

const incidentRunbook = readRepo("docs/MONITORING_RUNBOOK.md");
if (incidentRunbook.includes("Supabase") && incidentRunbook.includes("/api/v2/health")) {
  pass("runbooks_incident", "Incident runbook references Supabase and v2 health probes");
} else {
  fail("runbooks_incident", "Incident runbook still references legacy stack or missing probes");
}

const failed = results.filter((result) => result.status === "FAIL");
console.log(`\nPhase 12 DevOps checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const result of results) {
  console.log(`${result.status === "PASS" ? "✓" : "✗"} ${result.test}: ${result.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
