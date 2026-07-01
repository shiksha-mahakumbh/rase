#!/usr/bin/env node
/**
 * Security checklist items 51–57 — database schema, migrations, integrity, backups, retention.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
const src = path.join(repo, "src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function readSrc(rel) {
  return fs.readFileSync(path.join(src, rel), "utf8");
}

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

const schema = readRepo("prisma/schema.prisma");

// 51 Schema
const modelCount = (schema.match(/^model /gm) ?? []).length;
const enumCount = (schema.match(/^enum /gm) ?? []).length;
if (modelCount >= 60 && enumCount >= 25) {
  pass("schema_model_inventory", `${modelCount} models, ${enumCount} enums in Prisma schema`);
} else {
  fail("schema_model_inventory", `models=${modelCount}, enums=${enumCount}`);
}

if (
  schema.includes("@@index([registrationType, registrationStatus, createdAt])") &&
  schema.includes("@@index([deletedAt, createdAt])")
) {
  pass("schema_registration_admin_indexes", "Registration has admin list composite indexes");
} else {
  fail("schema_registration_admin_indexes", "Missing registration composite indexes");
}

// 52 Migrations
const migrationsDir = path.join(repo, "prisma", "migrations");
const migrationFolders = fs
  .readdirSync(migrationsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

if (
  migrationFolders.length >= 5 &&
  existsRepo("prisma/migrations/20250701_phase3_db_integrity/migration.sql") &&
  existsRepo(".github/workflows/prisma-migrate-deploy.yml")
) {
  pass("migrations_versioned", `${migrationFolders.length} migration folders with CI deploy workflow`);
} else {
  fail("migrations_versioned", "Migrations or prisma-migrate-deploy workflow incomplete");
}

if (readRepo("scripts/guard-db-push.mjs").includes("looksProduction")) {
  pass("migrations_push_guard", "db:push blocked against production-like URLs");
} else {
  fail("migrations_push_guard", "Missing guard-db-push.mjs production guard");
}

// 53 Constraints
if (
  schema.includes("registrationId      String               @unique") &&
  schema.includes("@@unique([slug, locale])") &&
  schema.includes("@@unique([prefix])")
) {
  pass("constraints_uniques", "Registration IDs, CMS slugs, and counters have unique constraints");
} else {
  fail("constraints_uniques", "Missing expected unique constraints");
}

// 54 Foreign Keys
if (
  schema.includes("user         User?         @relation(fields: [userId], references: [id], onDelete: SetNull)") &&
  readRepo("prisma/migrations/20250701_phase3_db_integrity/migration.sql").includes("ON DELETE SET NULL")
) {
  pass("fk_email_log_user_set_null", "EmailLog.user uses onDelete SetNull with migration");
} else {
  fail("fk_email_log_user_set_null", "EmailLog user FK missing SetNull behavior");
}

const fkRelations = schema.match(/onDelete: (Cascade|SetNull|Restrict)/g) ?? [];
if (fkRelations.length >= 40) {
  pass("fk_explicit_policies", `${fkRelations.length} explicit onDelete policies in schema`);
} else {
  fail("fk_explicit_policies", `Only ${fkRelations.length} explicit onDelete policies`);
}

// 55 Data Integrity
if (
  readSrc("server/services/registration.service.ts").includes("lastNumber: { increment: 1 }") &&
  readSrc("server/services/registration.service.ts").includes("$transaction")
) {
  pass("data_integrity_registration_counter", "Registration IDs allocated in transaction with atomic increment");
} else {
  fail("data_integrity_registration_counter", "Registration counter not transactional");
}

if (schema.includes("model RegistrationStatusHistory")) {
  pass("data_integrity_status_history", "Registration status changes tracked in history table");
} else {
  fail("data_integrity_status_history", "Missing RegistrationStatusHistory model");
}

// 56 Backups
if (
  existsRepo("scripts/backup-restore-drill.mjs") &&
  existsRepo("docs/go-live/BACKUP_AND_RECOVERY_GUIDE.md") &&
  readRepo("scripts/backup-restore-drill.mjs").includes("sample_read_registrations")
) {
  pass("backups_drill_and_docs", "Backup restore drill script and recovery guide present");
} else {
  fail("backups_drill_and_docs", "Backup drill or recovery documentation missing");
}

if (existsRepo("scripts/audit-database-production.mjs") && existsRepo("scripts/audit-prisma.mjs")) {
  pass("backups_audit_tooling", "Production database audit scripts available");
} else {
  fail("backups_audit_tooling", "Database audit scripts missing");
}

// 57 Retention Policies
if (
  existsRepo("src/server/services/retention.service.ts") &&
  readSrc("server/services/retention.service.ts").includes("DELETE_BATCH_SIZE") &&
  readSrc("app/api/cron/analytics-retention/route.ts").includes("purgeAuditLogsOlderThan") &&
  readSrc("app/api/cron/analytics-retention/route.ts").includes("purgeEmailLogsOlderThan")
) {
  pass("retention_batched_cron", "Visitor, audit, and email logs purged via batched retention cron");
} else {
  fail("retention_batched_cron", "Retention service or cron coverage incomplete");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 3 database checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
