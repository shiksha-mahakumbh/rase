#!/usr/bin/env node
/**
 * Scan Postgres for legacy third-party storage URL strings.
 * Exit 0 when none found; exit 1 when legacy URLs remain.
 *
 * Usage: npm run check:legacy-urls
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

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

Object.assign(
  process.env,
  loadEnvFile(path.resolve(".env")),
  loadEnvFile(path.resolve(".env.local"))
);

const LEGACY_HOST_PATTERNS = [
  "firebasestorage.googleapis.com",
  "firebaseapp.com",
];

async function main() {
  if (!process.env.DATABASE_URL) {
    if (process.env.CI === "true" || process.env.SKIP_DB_CHECKS === "1") {
      console.log(
        JSON.stringify({
          checkedAt: new Date().toISOString(),
          ok: true,
          skipped: true,
          reason: "DATABASE_URL not set — skipped in CI",
        })
      );
      process.exit(0);
    }
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const checks = [];
  let total = 0;

  async function scanTable(label, sql) {
    try {
      const rows = await prisma.$queryRawUnsafe(sql);
      const list = Array.isArray(rows) ? rows : [];
      checks.push({ label, count: list.length, samples: list.slice(0, 5) });
      return list.length;
    } catch (e) {
      checks.push({ label, count: 0, skipped: true, error: e.message ?? String(e) });
      return 0;
    }
  }

  const likeClause = LEGACY_HOST_PATTERNS.map((p) => `'%${p}%'`).join(", ");

  total += await scanTable(
    "registrations.metadata",
    `SELECT id, registration_id, metadata::text AS payload
     FROM registrations
     WHERE metadata::text ILIKE ANY(ARRAY[${likeClause}])`
  );

  total += await scanTable(
    "uploaded_files.signed_url",
    `SELECT id, registration_id, signed_url AS payload
     FROM uploaded_files
     WHERE signed_url ILIKE ANY(ARRAY[${likeClause}])`
  );

  total += await scanTable(
    "media_assets.public_url",
    `SELECT id, file_name, public_url AS payload
     FROM media_assets
     WHERE public_url ILIKE ANY(ARRAY[${likeClause}])`
  );

  total += await scanTable(
    "downloads.file_url",
    `SELECT id, title, file_url AS payload
     FROM downloads
     WHERE file_url ILIKE ANY(ARRAY[${likeClause}])`
  );

  const report = {
    checkedAt: new Date().toISOString(),
    legacyHostPatterns: LEGACY_HOST_PATTERNS,
    totalHits: total,
    checks,
    ok: total === 0,
  };

  console.log(JSON.stringify(report, null, 2));
  await prisma.$disconnect();
  process.exit(total === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
