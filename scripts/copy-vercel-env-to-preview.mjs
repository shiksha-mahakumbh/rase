#!/usr/bin/env node
/**
 * Copy one Production env var to Preview (decrypt via Vercel API, never logs value).
 * Usage: node scripts/copy-vercel-env-to-preview.mjs SUPABASE_SERVICE_ROLE_KEY
 */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";

const key = process.argv[2];
if (!key) {
  console.error("Usage: node scripts/copy-vercel-env-to-preview.mjs <ENV_KEY>");
  process.exit(1);
}

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const VERCEL_TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";

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

async function main() {
  const token = loadVercelToken();
  if (!token) {
    console.error("Vercel CLI login required");
    process.exit(1);
  }

  const { envs } = await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env`);
  const onPreview = envs.some((e) => e.key === key && e.target?.includes("preview"));
  if (onPreview) {
    console.log(`[skip] ${key} already on preview`);
    return;
  }

  const prod = envs.find((e) => e.key === key && e.target?.includes("production"));
  if (!prod) {
    console.error(`[fail] ${key} not found on production`);
    process.exit(1);
  }

  const data = await vercelFetch(
    token,
    `/v9/projects/${VERCEL_PROJECT_ID}/env/${prod.id}?decrypt=true`
  );
  const value = data.value ?? "";
  if (!value || value.length < 8) {
    console.error(
      `[fail] ${key}: production value not decryptable via API (copy manually in Vercel dashboard)`
    );
    process.exit(1);
  }

  await vercelFetch(token, `/v10/projects/${VERCEL_PROJECT_ID}/env`, {
    method: "POST",
    body: JSON.stringify({
      key,
      value,
      type: prod.type ?? "encrypted",
      target: ["preview"],
    }),
  });

  console.log(`[ok] ${key} copied to preview (length ${value.length})`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
