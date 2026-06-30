#!/usr/bin/env node
/**
 * Copy critical Supabase server env vars to Vercel Preview using Vercel API decrypt.
 * Usage: node scripts/sync-preview-supabase-secrets.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";

const dryRun = process.argv.includes("--dry-run");
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const VERCEL_TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";

const KEYS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "RECAPTCHA_SECRET_KEY",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
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

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

async function main() {
  const token = loadVercelToken();
  if (!token) {
    console.error("Vercel CLI login required");
    process.exit(1);
  }

  const local = loadEnvFile(path.join(process.cwd(), ".env.vercel.production"));
  const { envs } = await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env`);
  const previewKeys = new Set(
    envs.filter((e) => e.target?.includes("preview")).map((e) => e.key)
  );

  let copied = 0;
  let skipped = 0;

  for (const key of KEYS) {
    if (previewKeys.has(key)) {
      console.log(`[skip] ${key} already on preview`);
      skipped += 1;
      continue;
    }

    const entry = envs.find((e) => e.key === key && e.target?.includes("production"));
    let value = null;

    if (entry) {
      try {
        const data = await vercelFetch(
          token,
          `/v9/projects/${VERCEL_PROJECT_ID}/env/${entry.id}?decrypt=true`
        );
        value = data.value ?? null;
      } catch {
        value = null;
      }
    }

    if (!value && key === "DATABASE_URL" && local.POSTGRES_PRISMA_URL) {
      value = local.POSTGRES_PRISMA_URL;
      console.log(`[fallback] ${key} from POSTGRES_PRISMA_URL in .env.vercel.production`);
    }
    if (!value && key === "DIRECT_URL" && local.DIRECT_URL) {
      value = local.DIRECT_URL;
      console.log(`[fallback] ${key} from .env.vercel.production`);
    }

    if (!value) {
      console.warn(`[skip] ${key}: no decryptable production value`);
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
        type: entry?.type ?? "encrypted",
        target: ["preview"],
      }),
    });
    console.log(`[ok] ${key} → preview`);
    copied += 1;
  }

  console.log(`Done: ${copied} copied, ${skipped} skipped`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
