#!/usr/bin/env node
/**
 * Database validation — requires running PostgreSQL.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const outDir = path.resolve("docs/staging");
fs.mkdirSync(outDir, { recursive: true });

const PHASE_C_TABLES = [
  "entity_revisions",
  "committees",
  "committee_members",
  "speaker_profiles",
  "partners",
  "events",
  "event_media",
];

const PHASE_TABLES = [
  "pages",
  "page_sections",
  "notices",
  "downloads",
  "media_assets",
  "media_albums",
  "seo_metadata",
  "visitor_analytics",
];

async function tableExists(name) {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    ) AS exists`,
    name
  );
  return Boolean(rows[0]?.exists);
}

async function main() {
  const report = {
    timestamp: new Date().toISOString(),
    connected: false,
    migrations: [],
    tables: {},
    seedCounts: {},
    error: null,
  };

  try {
    await prisma.$connect();
    report.connected = true;

    const migrations = await prisma.$queryRawUnsafe(
      `SELECT migration_name, finished_at, applied_steps_count
       FROM _prisma_migrations
       ORDER BY finished_at ASC`
    );
    report.migrations = migrations;

    for (const t of [...PHASE_TABLES, ...PHASE_C_TABLES]) {
      report.tables[t] = await tableExists(t);
    }

    if (report.tables.pages) {
      report.seedCounts.homepage = await prisma.page.count({
        where: { slug: "home", deletedAt: null },
      });
    }
    if (report.tables.notices) {
      report.seedCounts.notices = await prisma.notice.count({ where: { deletedAt: null } });
    }
    if (report.tables.downloads) {
      report.seedCounts.downloads = await prisma.download.count({ where: { deletedAt: null } });
    }
    if (report.tables.committees) {
      report.seedCounts.committees = await prisma.committee.count({ where: { deletedAt: null } });
    }
    if (report.tables.speaker_profiles) {
      report.seedCounts.speakers = await prisma.speakerProfile.count({ where: { deletedAt: null } });
    }
    if (report.tables.partners) {
      report.seedCounts.partners = await prisma.partner.count({ where: { deletedAt: null } });
    }
    if (report.tables.events) {
      report.seedCounts.events = await prisma.event.count({ where: { deletedAt: null } });
    }
    if (report.tables.event_media) {
      report.seedCounts.eventMedia = await prisma.eventMedia.count({
        where: { deletedAt: null, mediaCenterCategory: { not: null } },
      });
    }
  } catch (e) {
    report.error = e instanceof Error ? e.message : String(e);
  } finally {
    await prisma.$disconnect();
  }

  fs.writeFileSync(path.join(outDir, "db-check-result.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.connected ? 0 : 1);
}

main();
