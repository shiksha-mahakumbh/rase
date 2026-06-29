#!/usr/bin/env node
/**
 * Upload Proceeding1–3.pdf to Supabase Storage (optional; primary CDN is GitHub Releases).
 * See scripts/upload-proceedings-github-release.mjs and src/config/proceedings-pdf-cdn.cjs.
 *
 * Usage:
 *   node scripts/upload-proceedings-supabase.mjs
 *   node scripts/upload-proceedings-supabase.mjs --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");
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

async function getDecryptedVercelEnv(token, key) {
  const envs = (await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env`)).envs ?? [];
  const entry = envs.find((e) => e.key === key);
  if (!entry) return null;
  const data = await vercelFetch(
    token,
    `/v9/projects/${VERCEL_PROJECT_ID}/env/${entry.id}?decrypt=true`
  );
  return data.value ?? null;
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

const env = {
  ...loadEnvFile(path.join(ROOT, ".env")),
  ...loadEnvFile(path.join(ROOT, ".env.local")),
  ...loadEnvFile(path.join(ROOT, ".env.vercel.production")),
  ...process.env,
};

const FILES = [
  { local: "public/Proceeding1.pdf", remote: "proceedings/Proceeding1.pdf", vol: "vol1" },
  { local: "public/Proceeding2.pdf", remote: "proceedings/Proceeding2.pdf", vol: "vol2" },
  { local: "public/Proceeding3.pdf", remote: "proceedings/Proceeding3.pdf", vol: "vol3" },
];

function publicUrl(remotePath) {
  const base = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");
  return `${base}/storage/v1/object/public/publications/${remotePath}`;
}

async function ensureBucket(base, key) {
  if (dryRun) {
    console.log("[dry-run] would ensure publications bucket");
    return;
  }
  const res = await fetch(`${base}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "publications",
      name: "publications",
      public: true,
      file_size_limit: 62914560,
      allowed_mime_types: ["application/pdf"],
    }),
  });
  if (res.ok) {
    console.log("[ok] publications bucket created");
    return;
  }
  const text = await res.text();
  if (/already exists|Duplicate/i.test(text)) {
    console.log("[ok] publications bucket already exists");
    return;
  }
  throw new Error(`Bucket create failed (${res.status}): ${text.slice(0, 200)}`);
}

async function uploadFile(base, key, localPath, remotePath) {
  const buffer = fs.readFileSync(localPath);
  if (dryRun) {
    console.log(`[dry-run] would upload ${remotePath} (${buffer.length} bytes)`);
    return publicUrl(remotePath);
  }
  const res = await fetch(`${base}/storage/v1/object/publications/${remotePath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/pdf",
      "x-upsert": "true",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload ${remotePath} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const href = publicUrl(remotePath);
  console.log(`[ok] ${remotePath} → ${href}`);
  return href;
}

async function main() {
  let base = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  let key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!base || !key) {
    const token = loadVercelToken();
    if (token) {
      console.log("Loading Supabase credentials from Vercel production env…");
      base = base || (await getDecryptedVercelEnv(token, "NEXT_PUBLIC_SUPABASE_URL"));
      key = key || (await getDecryptedVercelEnv(token, "SUPABASE_SERVICE_ROLE_KEY"));
    }
  }

  if (!base || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (local or Vercel CLI login)");
    process.exit(1);
  }

  for (const { local } of FILES) {
    const full = path.join(ROOT, local);
    if (!fs.existsSync(full)) {
      console.error(`Missing ${local}`);
      process.exit(1);
    }
    console.log(`Found ${local} (${(fs.statSync(full).size / 1024 / 1024).toFixed(1)} MB)`);
  }

  await ensureBucket(base, key);

  const urls = {};
  for (const { local, remote, vol } of FILES) {
    urls[vol] = await uploadFile(base, key, path.join(ROOT, local), remote);
  }

  console.log("\nProceedings CDN URLs:");
  console.log(JSON.stringify(urls, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
