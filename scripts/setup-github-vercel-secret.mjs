#!/usr/bin/env node
/**
 * One-shot: set VERCEL_TOKEN in GitHub Actions from local Vercel CLI auth,
 * then re-run the deploy workflow.
 *
 * Requires: GitHub CLI (`gh`) authenticated with repo admin, OR GITHUB_TOKEN env
 * with `actions:write` + `secrets:write` on shiksha-mahakumbh/rase.
 *
 * Run: npx tsx scripts/setup-github-vercel-secret.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const AUTH_PATHS = [
  join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  join(homedir(), ".config", "vercel", "auth.json"),
];

function loadVercelToken() {
  for (const p of AUTH_PATHS) {
    if (!existsSync(p)) continue;
    const auth = JSON.parse(readFileSync(p, "utf8"));
    const token = auth.token;
    if (token) return token;
  }
  return process.env.VERCEL_TOKEN || null;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: true, ...opts });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || ""), status: r.status };
}

const vercelToken = loadVercelToken();
if (!vercelToken) {
  console.error("No Vercel token found. Log in with: npx vercel login");
  process.exit(1);
}

console.log("Vercel CLI auth found.");

const gh = run("gh", ["--version"]);
if (!gh.ok) {
  console.error("GitHub CLI (gh) is required but not installed.");
  console.error("Install: https://cli.github.com/  then: gh auth login");
  console.error("Or set VERCEL_TOKEN manually in GitHub repo secrets.");
  process.exit(1);
}

const set = run("gh", [
  "secret",
  "set",
  "VERCEL_TOKEN",
  "--repo",
  "shiksha-mahakumbh/rase",
  "--body",
  vercelToken,
]);
if (!set.ok) {
  console.error("Failed to set VERCEL_TOKEN:", set.out);
  process.exit(1);
}
console.log("✓ VERCEL_TOKEN set on shiksha-mahakumbh/rase");

const rerun = run("gh", [
  "workflow",
  "run",
  "vercel-production.yml",
  "--repo",
  "shiksha-mahakumbh/rase",
  "--ref",
  "main",
]);
if (rerun.ok) {
  console.log("✓ Triggered Vercel Production Deploy workflow");
} else {
  console.warn("Secret set but workflow trigger failed:", rerun.out);
  console.warn("Re-run manually: GitHub → Actions → Vercel Production Deploy");
}
