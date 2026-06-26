#!/usr/bin/env node
/**
 * Backup restore drill — verifies DATABASE_URL connectivity and a sample read.
 * Usage: node scripts/backup-restore-drill.mjs
 * For full restore: use Supabase dashboard PITR or pg_restore from your backup vendor.
 */
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

const env = {
  ...loadEnvFile(path.resolve(".env")),
  ...loadEnvFile(path.resolve(".env.local")),
  ...process.env,
};

const report = {
  checkedAt: new Date().toISOString(),
  databaseUrl: Boolean(env.DATABASE_URL),
  steps: [],
};

async function main() {
  if (!env.DATABASE_URL) {
    report.steps.push({ step: "database_url", ok: false, detail: "DATABASE_URL missing" });
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    report.steps.push({ step: "connect", ok: true });

    const regCount = await prisma.registration.count({ where: { deletedAt: null } });
    report.steps.push({
      step: "sample_read_registrations",
      ok: true,
      detail: `${regCount} active registrations visible`,
    });

    const cmsCount = await prisma.page.count({
      where: { status: "published", deletedAt: null },
    });
    report.steps.push({
      step: "sample_read_cms_pages",
      ok: true,
      detail: `${cmsCount} published CMS pages`,
    });

    await prisma.$disconnect();
    report.steps.push({
      step: "restore_note",
      ok: true,
      detail:
        "Full restore: Supabase → Project → Database → Backups → Restore. Re-run smoke:prod after restore.",
    });
  } catch (error) {
    report.steps.push({
      step: "database_probe",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    });
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  const failed = report.steps.some((s) => !s.ok);
  console.log(JSON.stringify(report, null, 2));
  process.exit(failed ? 1 : 0);
}

main();
