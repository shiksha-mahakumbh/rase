#!/usr/bin/env node
/**
 * Security checklist items 120–128 — smoke, unit, integration, e2e, security,
 * accessibility, load, payment, and admin test coverage.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(".");
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

function countMatches(dir, pattern) {
  if (!fs.existsSync(dir)) return 0;
  return fs
    .readdirSync(dir)
    .filter((name) => pattern.test(name)).length;
}

const pkg = JSON.parse(readRepo("package.json"));

// 120 Smoke tests
if (
  existsRepo("scripts/production-smoke-test.mjs") &&
  pkg.scripts["smoke:prod"] &&
  pkg.scripts["test:smoke"] &&
  existsRepo("scripts/registration-redirect-smoke.mjs")
) {
  pass("smoke_tests", "Production smoke script, npm targets, and redirect smoke present");
} else {
  fail("smoke_tests", "Smoke test scripts or npm targets missing");
}

const smokeSource = readRepo("scripts/production-smoke-test.mjs");
if (smokeSource.includes("ads.txt") && smokeSource.includes("/api/v2/health")) {
  pass("smoke_coverage", "Smoke suite covers health and ads.txt");
} else {
  fail("smoke_coverage", "Smoke suite missing health or ads.txt checks");
}

// 121 Unit tests
const unitTests = countMatches(path.join(repo, "tests/unit"), /\.test\.ts$/);
if (pkg.scripts["test:unit"] && unitTests >= 5) {
  pass("unit_tests", `${unitTests} Node unit tests under tests/unit with test:unit script`);
} else {
  fail("unit_tests", "Unit test runner or tests/unit coverage missing");
}

const unitRun = spawnSync(process.execPath, [path.join(repo, "scripts/run-unit-tests.mjs")], {
  cwd: repo,
  encoding: "utf8",
});
if (unitRun.status === 0) {
  pass("unit_tests_runtime", "Unit tests execute successfully");
} else {
  fail(
    "unit_tests_runtime",
    unitRun.stderr?.slice(0, 400) || unitRun.stdout?.slice(0, 400) || "unit test run failed"
  );
}

// 122 Integration tests
if (pkg.scripts["test:integration"] && existsRepo("scripts/test-integration-contracts.mjs")) {
  pass("integration_tests", "Integration contract runner wired in package.json");
} else {
  fail("integration_tests", "Integration test runner missing");
}

const integrationScripts = fs
  .readdirSync(path.join(repo, "scripts"))
  .filter((name) => name.startsWith("test-supabase-") && name.endsWith(".mjs"));
if (integrationScripts.length >= 5) {
  pass("integration_supabase", `${integrationScripts.length} Supabase integration scripts present`);
} else {
  fail("integration_supabase", "Expected at least 5 test-supabase-*.mjs scripts");
}

// 123 E2E tests
if (
  existsRepo("playwright.config.ts") &&
  existsRepo("e2e/smoke.spec.ts") &&
  pkg.scripts["test:e2e"]
) {
  pass("e2e_tests", "Playwright config and smoke e2e spec present");
} else {
  fail("e2e_tests", "Playwright e2e setup incomplete");
}

const e2eList = spawnSync("npx", ["playwright", "test", "--list"], {
  cwd: repo,
  encoding: "utf8",
  shell: true,
});
if (e2eList.status === 0 && /smoke\.spec\.ts/.test(e2eList.stdout)) {
  pass("e2e_discovery", "Playwright discovers smoke e2e tests");
} else {
  fail("e2e_discovery", "Playwright test discovery failed");
}

// 124 Security tests
const securityPhases = fs
  .readdirSync(path.join(repo, "scripts"))
  .filter((name) => /^test-security-phase\d+\.mjs$/.test(name));
if (securityPhases.length >= 11 && pkg.scripts["test:security"]?.includes("test-security-phase11.mjs")) {
  pass("security_tests", `${securityPhases.length} security phase scripts wired into test:security`);
} else {
  fail("security_tests", "Security phase scripts or phase11 wiring missing");
}

// 125 Accessibility tests
if (
  existsRepo("e2e/accessibility.spec.ts") &&
  existsRepo("scripts/test-security-phase7.mjs")
) {
  pass("accessibility_tests", "Playwright a11y spec and phase7 WCAG checks present");
} else {
  fail("accessibility_tests", "Accessibility test coverage incomplete");
}

// 126 Load tests
if (pkg.scripts["test:load"] && existsRepo("scripts/test-load-baseline.mjs")) {
  pass("load_tests", "Load baseline script and npm target present");
} else {
  fail("load_tests", "Load test script missing");
}

// 127 Payment tests
const phase4 = readRepo("scripts/test-security-phase4.mjs");
if (
  phase4.includes("razorpay") &&
  phase4.includes("webhook") &&
  existsRepo("scripts/test-registration-types.mjs")
) {
  pass("payment_tests", "Phase4 Razorpay/webhook checks and registration payment tests present");
} else {
  fail("payment_tests", "Payment test coverage incomplete");
}

// 128 Admin tests
const adminTests = fs
  .readdirSync(path.join(repo, "scripts"))
  .filter((name) => name.startsWith("test-admin-") && name.endsWith(".mjs"));
if (adminTests.length >= 10 && pkg.scripts["test:security"]?.includes("test-admin-gate.mjs")) {
  pass("admin_tests", `${adminTests.length} admin audit scripts in security chain`);
} else {
  fail("admin_tests", "Admin test scripts incomplete or not wired");
}

const failed = results.filter((result) => result.status === "FAIL");
console.log(`\nPhase 11 testing checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const result of results) {
  console.log(`${result.status === "PASS" ? "✓" : "✗"} ${result.test}: ${result.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
