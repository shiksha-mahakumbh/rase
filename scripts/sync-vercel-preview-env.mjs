#!/usr/bin/env node
/**
 * Copy Production Vercel env vars missing from Preview (decrypt via Vercel API).
 * Usage: node scripts/sync-vercel-preview-env.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const VERCEL_TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";

const SKIP = new Set([
  "VERCEL",
  "VERCEL_ENV",
  "VERCEL_URL",
  "VERCEL_TARGET_ENV",
  "NX_DAEMON",
  "TURBO_CACHE",
  "TURBO_DOWNLOAD_LOCAL_ENABLED",
  "TURBO_REMOTE_ONLY",
  "TURBO_RUN_SUMMARY",
  "VERCEL_OIDC_TOKEN",
  "VERCEL_GIT_COMMIT_AUTHOR_LOGIN",
  "VERCEL_GIT_COMMIT_AUTHOR_NAME",
  "VERCEL_GIT_COMMIT_MESSAGE",
  "VERCEL_GIT_COMMIT_REF",
  "VERCEL_GIT_COMMIT_SHA",
  "VERCEL_GIT_PREVIOUS_SHA",
  "VERCEL_GIT_PROVIDER",
  "VERCEL_GIT_PULL_REQUEST_ID",
  "VERCEL_GIT_REPO_ID",
  "VERCEL_GIT_REPO_OWNER",
  "VERCEL_GIT_REPO_SLUG",
]);

const AUTH_PATHS = [
  path.join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  path.join(homedir(), ".config", "vercel", "auth.json"),
];

function loadVercelToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
  for (const p of AUTH_PATHS) {
    if (!fs.existsSync(p)) continue;
    try {
      const auth = JSON.parse(fs.readFileSync(p, "utf8"));
      if (auth.token) return auth.token;
    } catch {
      /* ignore */
    }
  }
  return null;
}

async function vercelFetch(token, apiPath, options = {}) {
  const url = `https://api.vercel.com${apiPath}${apiPath.includes("?") ? "&" : "?"}teamId=${VERCEL_TEAM_ID}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Vercel API ${apiPath} → ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : {};
}

function targetsForEnv(entry, target) {
  return entry.target?.includes(target) ?? false;
}

async function main() {
  const token = loadVercelToken();
  if (!token) {
    console.error("Vercel CLI login required");
    process.exit(1);
  }

  const { envs } = await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env`);
  const prodKeys = new Set(
    envs.filter((e) => targetsForEnv(e, "production")).map((e) => e.key)
  );
  const previewKeys = new Set(
    envs.filter((e) => targetsForEnv(e, "preview")).map((e) => e.key)
  );

  const missing = [...prodKeys].filter((k) => !previewKeys.has(k) && !SKIP.has(k)).sort();
  console.log(`${missing.length} Production-only keys to copy to Preview`);

  let copied = 0;
  let skipped = 0;

  for (const key of missing) {
    const entry = envs.find((e) => e.key === key && targetsForEnv(e, "production"));
    if (!entry) continue;

    let value;
    try {
      const data = await vercelFetch(
        token,
        `/v9/projects/${VERCEL_PROJECT_ID}/env/${entry.id}?decrypt=true`
      );
      value = data.value ?? "";
    } catch (err) {
      console.warn(`[skip] ${key}: decrypt failed`);
      skipped += 1;
      continue;
    }

    if (!value) {
      console.warn(`[skip] ${key}: empty value`);
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] would add ${key} to preview`);
      copied += 1;
      continue;
    }

    await vercelFetch(token, `/v10/projects/${VERCEL_PROJECT_ID}/env`, {
      method: "POST",
      body: JSON.stringify({
        key,
        value,
        type: entry.type ?? "encrypted",
        target: ["preview"],
      }),
    });
    console.log(`[ok] ${key}`);
    copied += 1;
  }

  console.log(`Done: ${copied} copied, ${skipped} skipped`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
