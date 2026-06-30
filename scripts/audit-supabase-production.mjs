#!/usr/bin/env node
/** Read-only Supabase production audit (SELECT only). */
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

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
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
  ...loadEnvFile(".env.vercel.production"),
  ...process.env,
};

if (env.DIRECT_URL) process.env.DATABASE_URL = env.DIRECT_URL;
else if (env.POSTGRES_URL_NON_POOLING) process.env.DATABASE_URL = env.POSTGRES_URL_NON_POOLING;

const prisma = new PrismaClient();

async function main() {
  const report = {
    checkedAt: new Date().toISOString(),
    connection: { ok: false, host: null },
    buckets: [],
    storagePolicies: [],
    publicPolicies: { count: 0, tables: [] },
    rbac: { roles: 0, users: 0, permissions: 0 },
    registration: { counters: [], totalRegistrations: 0 },
    gaps: [],
  };

  const url = process.env.DATABASE_URL ?? "";
  const host = url.match(/@([^:/@]+)/)?.[1] ?? null;
  report.connection.host = host;

  try {
    await prisma.$queryRaw`SELECT 1`;
    report.connection.ok = true;
  } catch (e) {
    report.gaps.push(`DB connect failed: ${e instanceof Error ? e.message : String(e)}`);
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  report.buckets = await prisma.$queryRaw`
    SELECT id, name, public, file_size_limit,
           array_length(allowed_mime_types, 1) AS mime_count
    FROM storage.buckets ORDER BY name
  `;

  report.storagePolicies = await prisma.$queryRaw`
    SELECT schemaname, tablename, policyname, roles::text, cmd
    FROM pg_policies
    WHERE schemaname = 'storage'
    ORDER BY policyname
  `;

  const publicPolicyRows = await prisma.$queryRaw`
    SELECT tablename, count(*)::int AS n
    FROM pg_policies WHERE schemaname = 'public'
    GROUP BY tablename ORDER BY tablename
  `;
  report.publicPolicies.count = publicPolicyRows.reduce((s, r) => s + r.n, 0);
  report.publicPolicies.tables = publicPolicyRows;

  const [{ n: roles }] = await prisma.$queryRaw`SELECT count(*)::int AS n FROM roles`;
  const [{ n: users }] = await prisma.$queryRaw`SELECT count(*)::int AS n FROM users WHERE deleted_at IS NULL`;
  const [{ n: permissions }] = await prisma.$queryRaw`SELECT count(*)::int AS n FROM permissions`;
  report.rbac = { roles, users, permissions };

  report.registration.counters = await prisma.$queryRaw`
    SELECT prefix, last_number FROM registration_counters ORDER BY prefix
  `;
  const [{ n: totalRegistrations }] =
    await prisma.$queryRaw`SELECT count(*)::int AS n FROM registrations`;
  report.registration.totalRegistrations = totalRegistrations;

  const expectedBuckets = [
    "registrations", "resumes", "papers", "brochures", "media", "committee",
    "downloads", "receipts", "publications",
  ];
  const have = new Set(report.buckets.map((b) => b.id));
  for (const id of expectedBuckets) {
    if (!have.has(id)) report.gaps.push(`Missing storage bucket: ${id}`);
  }
  if (report.storagePolicies.length === 0) {
    report.gaps.push("No storage RLS policies in pg_policies");
  }
  if (report.publicPolicies.count === 0) {
    report.gaps.push("No public schema RLS policies");
  }
  if (roles === 0) report.gaps.push("RBAC roles table empty");
  if (!have.has("publications")) {
    report.gaps.push("publications bucket not applied (proceedings use GitHub CDN instead)");
  }

  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
