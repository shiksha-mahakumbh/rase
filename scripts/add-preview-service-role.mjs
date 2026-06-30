#!/usr/bin/env node
/** Add SUPABASE_SERVICE_ROLE_KEY to Vercel Preview from local env files (never logs value). */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ENV_KEY = "SUPABASE_SERVICE_ROLE_KEY";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const VERCEL_TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";

const SOURCES = [
  path.join(ROOT, ".env"),
  path.join(ROOT, ".env.local"),
  path.join(ROOT, ".env.vercel.production"),
  path.join(ROOT, ".env.supabase"),
];

const AUTH_PATHS = [
  path.join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  path.join(homedir(), ".config", "vercel", "auth.json"),
];

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

function findKey() {
  if (process.env[ENV_KEY]?.length > 20) {
    return { value: process.env[ENV_KEY], source: "process.env" };
  }
  for (const file of SOURCES) {
    const v = loadEnvFile(file)[ENV_KEY];
    if (v && v.length > 20) return { value: v, source: path.basename(file) };
  }
  return null;
}

async function main() {
  const found = findKey();
  if (!found) {
    console.error(`[fail] ${ENV_KEY} not found in local env files`);
    process.exit(1);
  }

  const token = loadVercelToken();
  if (!token) {
    console.error("Vercel CLI login required");
    process.exit(1);
  }

  const { envs } = await vercelFetch(token, `/v9/projects/${VERCEL_PROJECT_ID}/env`);
  if (envs.some((e) => e.key === ENV_KEY && e.target?.includes("preview"))) {
    console.log(`[skip] ${ENV_KEY} already on preview`);
    return;
  }

  await vercelFetch(token, `/v10/projects/${VERCEL_PROJECT_ID}/env`, {
    method: "POST",
    body: JSON.stringify({
      key: ENV_KEY,
      value: found.value,
      type: "sensitive",
      target: ["preview"],
    }),
  });

  console.log(`[ok] ${ENV_KEY} → preview from ${found.source} (length ${found.value.length})`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
