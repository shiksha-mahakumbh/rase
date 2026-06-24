#!/usr/bin/env node
/**
 * Configure GitHub Actions deploy fallback for shiksha-mahakumbh/rase.
 *
 * Sets VERCEL_DEPLOY_HOOK (preferred) and VERCEL_TOKEN (backup), then triggers workflow.
 *
 * Requires: `gh auth login` with repo admin on shiksha-mahakumbh/rase
 *
 * Run: npx tsx scripts/setup-github-vercel-secret.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const REPO = "shiksha-mahakumbh/rase";
const HOOK_NAME = "github-actions-fallback";
const AUTH_PATHS = [
  join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  join(homedir(), ".config", "vercel", "auth.json"),
];

function loadVercelToken() {
  for (const p of AUTH_PATHS) {
    if (!existsSync(p)) continue;
    const auth = JSON.parse(readFileSync(p, "utf8"));
    if (auth.token) return auth.token;
  }
  return process.env.VERCEL_TOKEN || null;
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    shell: true,
    env: { ...process.env, npm_config_devdir: undefined },
  });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

function gh(args) {
  return run("gh", args);
}

function vercel(args) {
  const token = loadVercelToken();
  const full = token ? [...args, "--token", token] : args;
  return run("npx", ["--yes", "vercel", ...full]);
}

function extractJson(output) {
  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(output.slice(start, end + 1));
  } catch {
    return null;
  }
}

function resolveHookUrl(output) {
  const data = extractJson(output);
  if (!data) return null;

  if (data.hook?.url) return data.hook.url;

  const hooks = Array.isArray(data.hooks) ? data.hooks : [];
  const matches = hooks.filter((h) => h.name === HOOK_NAME && h.ref === "main" && h.url);
  if (matches.length) {
    matches.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    return matches[0].url;
  }

  const fallback = hooks.find((h) => h.ref === "main" && h.url && h.name !== "_branch_probe");
  return fallback?.url ?? null;
}

const vercelToken = loadVercelToken();
if (!vercelToken) {
  console.error("No Vercel CLI auth. Run: npx vercel login");
  process.exit(1);
}

if (!gh(["auth", "status"]).ok) {
  console.error("GitHub CLI not authenticated. Run: gh auth login");
  process.exit(1);
}

console.log("Ensuring deploy hook exists…");
const list = vercel(["deploy-hook", "list"]);
let hookUrl = resolveHookUrl(list.out);

if (!hookUrl) {
  const created = vercel(["deploy-hook", "create", HOOK_NAME, "--ref", "main"]);
  if (!created.ok) {
    console.error("Failed to create deploy hook:", created.out);
    process.exit(1);
  }
  hookUrl = resolveHookUrl(created.out);
}

if (!hookUrl) {
  console.error("Could not resolve deploy hook URL from Vercel CLI output.");
  console.error("Raw output (last 800 chars):", list.out.slice(-800));
  process.exit(1);
}

console.log("Setting GitHub Actions secrets…");

const hookSet = gh(["secret", "set", "VERCEL_DEPLOY_HOOK", "--repo", REPO, "--body", hookUrl]);
if (!hookSet.ok) {
  console.error("Failed to set VERCEL_DEPLOY_HOOK:", hookSet.out);
  process.exit(1);
}
console.log("✓ VERCEL_DEPLOY_HOOK");

const tokenSet = gh(["secret", "set", "VERCEL_TOKEN", "--repo", REPO, "--body", vercelToken]);
if (!tokenSet.ok) {
  console.warn("VERCEL_TOKEN not set (hook path is enough):", tokenSet.out);
} else {
  console.log("✓ VERCEL_TOKEN");
}

const rerun = gh(["workflow", "run", "vercel-production.yml", "--repo", REPO, "--ref", "main"]);
if (rerun.ok) {
  console.log("✓ Triggered Vercel Production Deploy workflow");
  console.log("  https://github.com/shiksha-mahakumbh/rase/actions/workflows/vercel-production.yml");
} else {
  console.warn("Secrets set but workflow trigger failed:", rerun.out);
}
