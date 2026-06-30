#!/usr/bin/env node
/** Add Supabase keys to Vercel Preview (values via env, never logged). */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const VERCEL_TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";

const KEYS = [
  { key: "SUPABASE_SERVICE_ROLE_KEY", env: "SUPABASE_SERVICE_ROLE_KEY", type: "sensitive" },
  { key: "SUPABASE_SECRET_KEY", env: "SUPABASE_SECRET_KEY", type: "sensitive" },
  { key: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", env: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", type: "encrypted" },
  { key: "SUPABASE_PUBLISHABLE_KEY", env: "SUPABASE_PUBLISHABLE_KEY", type: "encrypted" },
];

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

async function upsertPreview(token, envs, { key, value, type }) {
  const existing = envs.find((e) => e.key === key && e.target?.includes("preview"));
  if (existing) {
    await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ value, type, target: ["preview"] }),
    });
    console.log(`[updated] ${key} on preview`);
    return;
  }
  await vercelFetch(token, `/v10/projects/${VERCEL_PROJECT_ID}/env`, {
    method: "POST",
    body: JSON.stringify({ key, value, type, target: ["preview"] }),
  });
  console.log(`[added] ${key} on preview`);
}

async function main() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  const publishable =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!secret || secret.length < 10) {
    console.error("Set SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)");
    process.exit(1);
  }

  const token = loadVercelToken();
  if (!token) {
    console.error("Vercel CLI login required");
    process.exit(1);
  }

  const { envs } = await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env`);

  await upsertPreview(token, envs, {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    value: secret,
    type: "sensitive",
  });
  await upsertPreview(token, envs, {
    key: "SUPABASE_SECRET_KEY",
    value: secret,
    type: "sensitive",
  });

  if (publishable) {
    await upsertPreview(token, envs, {
      key: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      value: publishable,
      type: "encrypted",
    });
    await upsertPreview(token, envs, {
      key: "SUPABASE_PUBLISHABLE_KEY",
      value: publishable,
      type: "encrypted",
    });
  }

  console.log("Done — redeploy preview to apply.");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
