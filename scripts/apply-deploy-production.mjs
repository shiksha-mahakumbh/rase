#!/usr/bin/env node
/**
 * Apply deploy-production.sql artifacts via `prisma db execute` + DIRECT_URL.
 * psql \ir directives are expanded manually (Windows has no psql in PATH).
 */
import "dotenv/config";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const directUrl = process.env.DIRECT_URL;
if (!directUrl) {
  console.error("DIRECT_URL is required");
  process.exit(1);
}

function runFile(relativePath) {
  const abs = join(root, relativePath);
  console.log(`[exec] ${relativePath}`);
  try {
    execSync(`npx prisma db execute --url "${directUrl.replace(/"/g, '\\"')}" --file "${abs.replace(/\\/g, "/")}"`, {
      cwd: root,
      stdio: "pipe",
      shell: true,
      env: { ...process.env },
    });
    console.log(`[ok] ${relativePath}`);
  } catch (err) {
    const stderr = err.stderr?.toString() ?? err.message ?? "";
    if (/already exists|duplicate key/i.test(stderr)) {
      console.warn(`[skip] ${relativePath}: duplicate object (${stderr.slice(0, 80)})`);
      return;
    }
    console.error(stderr);
    throw err;
  }
}

const flag = process.argv[2];

const rlsFiles = [
  "supabase/policies/registrations.sql",
  "supabase/policies/production-hardening.sql",
  "supabase/policies/payments.sql",
  "supabase/policies/admin.sql",
  "supabase/policies/cms.sql",
  "supabase/policies/analytics.sql",
  "supabase/policies/phase_b.sql",
  "supabase/policies/storage-production.sql",
];

if (flag === "--buckets-only") {
  runFile("supabase/sql/001_storage_buckets.sql");
} else if (flag === "--seed-only") {
  runFile("supabase/sql/002_rbac_seed.sql");
} else if (flag === "--rls-only") {
  for (const f of rlsFiles) runFile(f);
} else {
  runFile("supabase/sql/001_storage_buckets.sql");
  runFile("supabase/sql/002_rbac_seed.sql");
  for (const f of rlsFiles) runFile(f);
}

// Verify via Prisma (DIRECT_URL for consistency)
process.env.DATABASE_URL = directUrl;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();
try {
  const buckets = await prisma.$queryRaw`SELECT id, name, public FROM storage.buckets ORDER BY name`;
  const policyCount = await prisma.$queryRaw`SELECT count(*)::int AS n FROM pg_policies WHERE schemaname IN ('public','storage')`;
  console.log(JSON.stringify({ buckets, policyCount }, null, 2));
} finally {
  await prisma.$disconnect();
}
