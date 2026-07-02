#!/usr/bin/env node
/**
 * Apply Supabase SQL via DIRECT_URL (no Prisma required).
 * Usage: node scripts/deploy-supabase-pg.mjs [--rls-only|--buckets-only]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { splitSqlStatements, stripSqlLineComments } from "./lib/sql-split.mjs";

const require = createRequire(import.meta.url);
const pgPaths = [
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "node_modules", "pg"),
  path.join(process.env.TEMP ?? "/tmp", "rase-supabase-deploy", "node_modules", "pg"),
];
let pg;
for (const p of pgPaths) {
  try {
    pg = require(p);
    break;
  } catch {
    /* try next */
  }
}
if (!pg) {
  console.error("Install pg: npm install pg (or use temp deploy folder)");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const flag = process.argv[2];

const STORAGE_ONLY_FILES = [
  "supabase/policies/storage-production.sql",
  "supabase/policies/storage-publications.sql",
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

const env = {
  ...loadEnvFile(path.join(root, ".env")),
  ...loadEnvFile(path.join(root, ".env.local")),
  ...loadEnvFile(path.join(root, ".env.vercel.production")),
  ...process.env,
};

const connectionString = env.DIRECT_URL ?? env.POSTGRES_URL_NON_POOLING ?? env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DIRECT_URL (or POSTGRES_URL_NON_POOLING) in .env.vercel.production");
  process.exit(1);
}

function readSql(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

async function execSqlFile(client, label, relativePath) {
  const sql = stripSqlLineComments(readSql(relativePath));
  const statements = splitSqlStatements(sql);

  for (const stmt of statements) {
    const q = stmt.endsWith(";") ? stmt : `${stmt};`;
    try {
      await client.query(q);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        /already exists|duplicate key|duplicate_object|42710|policy .* already exists|must be owner of table/i.test(
          msg
        )
      ) {
        console.warn(`[skip] ${label}: ${msg.slice(0, 120)}`);
        continue;
      }
      throw new Error(`${label} failed: ${msg}`);
    }
  }
  console.log(`[ok] ${label} (${statements.length} statement(s))`);
}

async function verify(client) {
  const buckets = await client.query(
    `SELECT id, name, public FROM storage.buckets ORDER BY name`
  );
  const policies = await client.query(
    `SELECT count(*)::int AS n FROM pg_policies WHERE schemaname IN ('public','storage')`
  );
  const rolePolicies = await client.query(
    `SELECT policyname, roles::text FROM pg_policies WHERE schemaname = 'public' AND tablename = 'roles'`
  );
  const storagePolicies = await client.query(
    `SELECT policyname, cmd FROM pg_policies WHERE schemaname = 'storage' ORDER BY policyname`
  );
  console.log(
    JSON.stringify(
      {
        buckets: buckets.rows,
        policyCount: policies.rows[0]?.n,
        rolePolicies: rolePolicies.rows,
        storagePolicies: storagePolicies.rows,
      },
      null,
      2
    )
  );
}

const RLS_FILES = [
  "supabase/policies/registrations.sql",
  "supabase/policies/production-hardening.sql",
  "supabase/policies/rbac-tiered.sql",
  "supabase/policies/payments.sql",
  "supabase/policies/admin.sql",
  "supabase/policies/cms.sql",
  "supabase/policies/analytics.sql",
  "supabase/policies/phase_b.sql",
  "supabase/policies/storage.sql",
  "supabase/policies/storage-production.sql",
  "supabase/policies/storage-publications.sql",
];

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Connected to Supabase Postgres");

  if (flag === "--buckets-only") {
    await execSqlFile(client, "storage buckets", "supabase/sql/001_storage_buckets.sql");
    await execSqlFile(client, "publications bucket", "supabase/sql/002_publications_bucket.sql");
  } else if (flag === "--storage-only") {
    for (const file of STORAGE_ONLY_FILES) {
      await execSqlFile(client, file, file);
    }
  } else if (flag === "--rls-only") {
    for (const file of RLS_FILES) {
      await execSqlFile(client, file, file);
    }
  } else {
    await execSqlFile(client, "storage buckets", "supabase/sql/001_storage_buckets.sql");
    await execSqlFile(client, "publications bucket", "supabase/sql/002_publications_bucket.sql");
    for (const file of RLS_FILES) {
      await execSqlFile(client, file, file);
    }
  }

  await verify(client);
} finally {
  await client.end();
}
