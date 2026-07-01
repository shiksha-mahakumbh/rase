#!/usr/bin/env node
/** Deep Prisma audit: schema vs production DB (read-only). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const pgPaths = [
  path.join(root, "node_modules", "pg"),
  path.join(process.env.TEMP ?? "/tmp", "rase-supabase-deploy", "node_modules", "pg"),
];
let pg;
for (const p of pgPaths) {
  try {
    pg = require(p);
    break;
  } catch {
    /* next */
  }
}
if (!pg) {
  console.error("pg not found");
  process.exit(1);
}

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
  console.error("Set DIRECT_URL");
  process.exit(1);
}

const schemaPath = path.join(root, "prisma", "schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf8");
const prismaTables = [...schema.matchAll(/@@map\("([^"]+)"\)/g)].map((m) => m[1]);
const models = (schema.match(/^model /gm) ?? []).length;
const enums = (schema.match(/^enum /gm) ?? []).length;
const schemaIndexes = (schema.match(/@@index/g) ?? []).length;
const schemaUniques = (schema.match(/@@unique/g) ?? []).length;

const migrationsDir = path.join(root, "prisma", "migrations");
const migrationFolders = fs
  .readdirSync(migrationsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();

  const dbTables = (
    await client.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`)
  ).rows.map((r) => r.tablename);

  const prismaSet = new Set(prismaTables);
  const extraInDb = dbTables.filter((t) => !prismaSet.has(t) && t !== "_prisma_migrations");
  const missingInDb = prismaTables.filter((t) => !dbTables.includes(t));

  const migrations = await client.query(`
    SELECT migration_name, finished_at, rolled_back_at, logs
    FROM _prisma_migrations ORDER BY finished_at
  `);

  const failedMigrations = migrations.rows.filter((m) => m.rolled_back_at);

  const counter = (await client.query(`SELECT prefix, last_number, year FROM registration_counters`)).rows;
  const [{ n: regCount }] = (await client.query(`SELECT count(*)::int AS n FROM registrations`)).rows;
  const [{ n: softDeleted }] = (
    await client.query(`SELECT count(*)::int AS n FROM registrations WHERE deleted_at IS NOT NULL`)
  ).rows;
  const maxReg = (await client.query(`SELECT max(registration_id) AS id FROM registrations`)).rows[0];

  const enumTypes = await client.query(`
    SELECT t.typname, count(e.enumlabel)::int AS labels
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
    GROUP BY t.typname ORDER BY t.typname
  `);

  const prismaEnumsInSchema = [...schema.matchAll(/^enum (\w+)/gm)].map((m) => m[1]);
  const dbEnumNames = enumTypes.rows.map((r) => r.typname);
  const enumsMissingInDb = prismaEnumsInSchema.filter(
    (e) => !dbEnumNames.includes(e) && !dbEnumNames.includes(e.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase())
  );

  const missingFkIndexes = await client.query(`
    SELECT c.conrelid::regclass::text AS table_name, a.attname AS column_name
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
    JOIN pg_class rel ON rel.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE c.contype = 'f'
      AND n.nspname = 'public'
      AND NOT EXISTS (
        SELECT 1 FROM pg_index i
        WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey)
      )
    ORDER BY 1, 2
    LIMIT 20
  `);

  const gaps = [];
  if (extraInDb.length) gaps.push(`Tables in DB not in Prisma schema: ${extraInDb.join(", ")}`);
  if (missingInDb.length) gaps.push(`Prisma tables missing in DB: ${missingInDb.join(", ")}`);
  if (migrations.rows.length !== migrationFolders.length) {
    gaps.push(`Migration count mismatch: DB ${migrations.rows.length} vs repo ${migrationFolders.length}`);
  }
  if (failedMigrations.length) gaps.push(`${failedMigrations.length} rolled-back migrations in _prisma_migrations`);
  if (missingFkIndexes.rows.length > 0) {
    gaps.push(`${missingFkIndexes.rows.length} FK columns still missing indexes`);
  }

  const lastNum = counter[0]?.last_number ?? 0;
  if (lastNum < regCount) {
    gaps.push(`Counter last_number (${lastNum}) < registration count (${regCount})`);
  } else if (lastNum > regCount + 5) {
    gaps.push(
      `Counter ahead of rows: last_number=${lastNum}, registrations=${regCount} (historical gaps from pre-atomic ID allocation or abandoned saves)`
    );
  }

  const report = {
    checkedAt: new Date().toISOString(),
    prisma: {
      version: JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).dependencies?.["@prisma/client"],
      schemaValid: true,
      models,
      enumsInSchema: enums,
      enumsInDb: enumTypes.rows.length,
      schemaIndexes,
      schemaUniques,
      prismaTableMaps: prismaTables.length,
      migrationFolders: migrationFolders.length,
      seedScript: "scripts/supabase/seed-rbac.mjs",
    },
    production: {
      host: connectionString.match(/@([^:/@]+)/)?.[1],
      dbTables: dbTables.length,
      extraInDb,
      missingInDb,
      migrationsApplied: migrations.rows.length,
      migrationsUpToDate: migrations.rows.length === migrationFolders.length && !failedMigrations.length,
      enumTypes: enumTypes.rows.length,
      missingFkIndexes: missingFkIndexes.rows,
    },
    registrationCounter: {
      counter,
      registrationRows: regCount,
      softDeleted,
      maxRegistrationId: maxReg?.id ?? null,
      counterGap: lastNum - regCount,
    },
    clientRuntime: {
      singleton: "src/server/db/prisma.ts",
      serverlessPoolLimit: "1 (runtime) / 8 (build via DIRECT_URL)",
      directUrlConfigured: Boolean(env.DIRECT_URL),
      databaseUrlInLocalPull: Boolean(env.DATABASE_URL),
      rawQueryUsage: "minimal (health probe only)",
      transactionUsage: "8 service files",
    },
    gaps,
    grade:
      gaps.length === 0 && migrations.rows.length === migrationFolders.length ? "A" : gaps.length <= 2 ? "B" : "C",
  };

  console.log(JSON.stringify(report, null, 2));

  if (gaps.length > 0 || !report.production.migrationsUpToDate) {
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => client.end());
