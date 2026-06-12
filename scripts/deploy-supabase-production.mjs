#!/usr/bin/env node
/**
 * Apply Supabase production SQL (buckets, seed, RLS) via Prisma direct connection.
 * Usage: node scripts/deploy-supabase-production.mjs [--buckets-only|--seed-only|--rls-only]
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const prisma = new PrismaClient();

function readSql(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

async function execSqlFile(label, relativePath) {
  const sql = readSql(relativePath);
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("\\"));

  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(`${stmt};`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/already exists|duplicate key|policy .* already exists/i.test(msg)) {
        console.warn(`[skip] ${label}: ${msg.slice(0, 100)}`);
        continue;
      }
      throw new Error(`${label} failed on statement: ${stmt.slice(0, 80)}... — ${msg}`);
    }
  }
  console.log(`[ok] ${label}`);
}

async function applyBuckets() {
  await execSqlFile("storage buckets", "supabase/sql/001_storage_buckets.sql");
}

async function applySeed() {
  await execSqlFile("rbac seed", "supabase/seed.sql");
}

async function applyRls() {
  const files = [
    "supabase/policies/registrations.sql",
    "supabase/policies/production-hardening.sql",
    "supabase/policies/payments.sql",
    "supabase/policies/admin.sql",
    "supabase/policies/cms.sql",
    "supabase/policies/analytics.sql",
    "supabase/policies/phase_b.sql",
    "supabase/policies/storage-production.sql",
  ];
  for (const file of files) {
    await execSqlFile(file, file);
  }
}

async function verify() {
  const buckets = await prisma.$queryRaw`
    SELECT id, name, public FROM storage.buckets ORDER BY name
  `;
  const policies = await prisma.$queryRaw`
    SELECT count(*)::int AS n FROM pg_policies WHERE schemaname IN ('public','storage')
  `;
  const counters = await prisma.$queryRaw`
    SELECT prefix, last_number FROM registration_counters
  `;
  const roles = await prisma.$queryRaw`SELECT count(*)::int AS n FROM roles`;
  console.log(JSON.stringify({ buckets, policies, counters, roles }, null, 2));
}

const flag = process.argv[2];
try {
  if (flag === "--buckets-only") await applyBuckets();
  else if (flag === "--seed-only") await applySeed();
  else if (flag === "--rls-only") await applyRls();
  else {
    await applyBuckets();
    await applySeed();
    await applyRls();
  }
  await verify();
} finally {
  await prisma.$disconnect();
}
