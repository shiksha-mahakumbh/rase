#!/usr/bin/env node
/**
 * Run `prisma db execute` with env loaded from .env / .env.local.
 * Prisma 6 + prisma.config.mjs skips dotenv — this wrapper fixes local CLI runs.
 *
 * Usage: node scripts/prisma-db-execute.mjs <relative-sql-file>
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

const directUrl =
  env.DIRECT_URL ?? env.POSTGRES_URL_NON_POOLING ?? env.DATABASE_URL;

if (!directUrl) {
  console.error(
    "Set DIRECT_URL in .env (or POSTGRES_URL_NON_POOLING in .env.local) before running SQL."
  );
  process.exit(1);
}

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node scripts/prisma-db-execute.mjs <relative-sql-file>");
  process.exit(1);
}

const abs = path.join(root, sqlFile);
if (!fs.existsSync(abs)) {
  console.error(`File not found: ${sqlFile}`);
  process.exit(1);
}

console.log(`[prisma-db-execute] ${sqlFile}`);
execSync(
  `npx prisma db execute --url "${directUrl.replace(/"/g, '\\"')}" --file "${abs.replace(/\\/g, "/")}"`,
  { cwd: root, stdio: "inherit", shell: true, env: { ...process.env, DIRECT_URL: directUrl } }
);
console.log("[prisma-db-execute] done");
