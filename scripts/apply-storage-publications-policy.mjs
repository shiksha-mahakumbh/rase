#!/usr/bin/env node
/** Apply storage-publications.sql only (idempotent). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pg = require(path.join(process.env.TEMP ?? "/tmp", "rase-supabase-deploy", "node_modules", "pg"));
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

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
  ...loadEnvFile(path.join(root, ".env.vercel.production")),
  ...process.env,
};
const cs = env.DIRECT_URL ?? env.POSTGRES_URL_NON_POOLING;
if (!cs) {
  console.error("DIRECT_URL required");
  process.exit(1);
}

const sql = fs
  .readFileSync(path.join(root, "supabase/policies/storage-publications.sql"), "utf8")
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n");

const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query(sql);
  console.log("[ok] storage_publications_public_read");
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  if (/already exists/i.test(msg)) console.log("[skip] policy already exists");
  else throw e;
}
const { rows } = await client.query(
  `SELECT policyname FROM pg_policies WHERE schemaname = 'storage' ORDER BY policyname`
);
console.log(rows.map((r) => r.policyname).join(", "));
await client.end();
