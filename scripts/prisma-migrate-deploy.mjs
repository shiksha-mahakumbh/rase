#!/usr/bin/env node
/**
 * Run `prisma migrate deploy` with env loaded from .env / .env.local.
 * Prisma 6 + prisma.config.mjs skips dotenv — this wrapper fixes local CLI runs.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

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
  ...loadEnvFile(path.join(root, ".env")),
  ...loadEnvFile(path.join(root, ".env.local")),
  ...process.env,
};

const databaseUrl = env.DATABASE_URL;
const directUrl = env.DIRECT_URL ?? env.POSTGRES_URL_NON_POOLING ?? databaseUrl;

if (!databaseUrl) {
  console.error("Set DATABASE_URL in .env or .env.local before running migrations.");
  process.exit(1);
}
if (!directUrl) {
  console.error(
    "Set DIRECT_URL in .env or .env.local (port 5432, non-pooled) before running migrations."
  );
  process.exit(1);
}

execSync("npx prisma migrate deploy", {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DATABASE_URL: databaseUrl, DIRECT_URL: directUrl },
});
