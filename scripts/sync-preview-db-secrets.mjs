#!/usr/bin/env node
/**
 * Copy non-empty env values from .env.vercel.production to Preview when missing.
 * Uses Vercel API decrypt for production values Preview lacks.
 * Usage: node scripts/sync-preview-db-secrets.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const VERCEL_TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";

const PRIORITY_KEYS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "RECAPTCHA_SECRET_KEY",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
  "REGISTRATION_LOOKUP_SECRET",
  "ADMIN_SESSION_SECRET",
  "ADMIN_OPS_SECRET",
  "BREVO_SMTP_HOST",
  "BREVO_SMTP_USER",
  "BREVO_SMTP_PASS",
  "BREVO_SMTP_FROM",
  "BREVO_SMTP_PORT",
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

function hasPreview(envs, key) {
  return envs.some((e) => e.key === key && e.target?.includes("preview"));
}

async function getProdValue(token, envs, key) {
  const entry = envs.find((e) => e.key === key && e.target?.includes("production"));
  if (!entry) return null;
  const data = await vercelFetch(
    token,
    `/v9/projects/${VERCEL_PROJECT_ID}/env/${entry.id}?decrypt=true`
  );
  return data.value ?? null;
}

async function addPreview(token, key, value, type = "encrypted") {
  if (dryRun) {
    console.log(`[dry-run] would add ${key} to preview`);
    return;
  }
  await vercelFetch(token, `/v10/projects/${VERCEL_PROJECT_ID}/env`, {
    method: "POST",
    body: JSON.stringify({ key, value, type, target: ["preview"] }),
  });
  console.log(`[ok] ${key} → preview`);
}

async function main() {
  const token = loadVercelToken();
  if (!token) {
    console.error("Vercel CLI login required");
    process.exit(1);
  }

  const localProd = loadEnvFile(path.join(ROOT, ".env.vercel.production"));
  const localPreview = loadEnvFile(path.join(ROOT, ".env.vercel.preview"));
  const { envs } = await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env`);

  let copied = 0;
  let skipped = 0;

  for (const key of PRIORITY_KEYS) {
    if (hasPreview(envs, key)) {
      console.log(`[skip] ${key}: already on preview`);
      skipped += 1;
      continue;
    }

    let value = localProd[key] || localPreview[key] || null;
    if (!value) value = await getProdValue(token, envs, key);
    if (!value && key === "DATABASE_URL") {
      value =
        (await getProdValue(token, envs, "POSTGRES_PRISMA_URL")) ||
        (await getProdValue(token, envs, "POSTGRES_URL"));
    }

    if (!value) {
      console.warn(`[skip] ${key}: no decryptable production value`);
      skipped += 1;
      continue;
    }

    await addPreview(token, key, value);
    copied += 1;
  }

  console.log(`Done: ${copied} copied, ${skipped} skipped`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
