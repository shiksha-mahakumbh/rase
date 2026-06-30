#!/usr/bin/env node
/** Read-only production database audit via DIRECT_URL. */
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
  console.error("pg not found — run: cd %TEMP%\\rase-supabase-deploy && npm install pg");
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
  console.error("Set DIRECT_URL in .env.vercel.production");
  process.exit(1);
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function q(sql, params = []) {
  const res = await client.query(sql, params);
  return res.rows;
}

async function main() {
  const migrationsDir = path.join(root, "prisma", "migrations");
  const expectedMigrationCount = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory()).length;

  await client.connect();

  const report = {
    checkedAt: new Date().toISOString(),
    connection: {
      host: connectionString.match(/@([^:/@]+)/)?.[1] ?? "unknown",
      database: connectionString.match(/\/([^/?]+)(\?|$)/)?.[1] ?? "postgres",
    },
    migrations: [],
    schema: {},
    rls: {},
    storage: {},
    rbac: {},
    registrations: {},
    payments: {},
    cms: {},
    analytics: {},
    integrity: { gaps: [] },
    performance: {},
  };

  report.migrations = await q(`
    SELECT migration_name, finished_at, applied_steps_count
    FROM _prisma_migrations
    ORDER BY finished_at
  `);
  report.migrationsExpected = expectedMigrationCount;
  report.migrationsApplied = report.migrations.length;

  const tables = await q(`
    SELECT c.relname AS table_name,
           pg_total_relation_size(c.oid) AS total_bytes,
           c.reltuples::bigint AS est_rows,
           c.relrowsecurity AS rls_enabled
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY pg_total_relation_size(c.oid) DESC
  `);

  const totalBytes = tables.reduce((s, t) => s + Number(t.total_bytes), 0);
  report.schema = {
    tableCount: tables.length,
    totalMB: Math.round((totalBytes / 1024 / 1024) * 10) / 10,
    largestTables: tables.slice(0, 15).map((t) => ({
      table: t.table_name,
      mb: Math.round((Number(t.total_bytes) / 1024 / 1024) * 100) / 100,
      estRows: Number(t.est_rows),
      rls: t.rls_enabled,
    })),
    tablesWithoutRls: tables.filter((t) => !t.rls_enabled).map((t) => t.table_name),
  };

  const policies = await q(`
    SELECT schemaname, tablename, count(*)::int AS policies
    FROM pg_policies
    WHERE schemaname IN ('public', 'storage')
    GROUP BY schemaname, tablename
    ORDER BY schemaname, tablename
  `);
  const policyTotal = await q(`
    SELECT schemaname, count(*)::int AS n FROM pg_policies
    WHERE schemaname IN ('public', 'storage')
    GROUP BY schemaname
  `);
  report.rls = {
    bySchema: policyTotal,
    tablesWithPolicies: policies.length,
    publicTablesNoPolicy: tables
      .filter((t) => !policies.some((p) => p.schemaname === "public" && p.tablename === t.table_name))
      .map((t) => t.table_name)
      .slice(0, 30),
    storagePolicies: await q(`
      SELECT policyname, cmd FROM pg_policies WHERE schemaname = 'storage' ORDER BY policyname
    `),
  };

  report.storage.buckets = await q(`
    SELECT id, name, public, file_size_limit FROM storage.buckets ORDER BY name
  `);
  const [{ n: objectCount }] = await q(`SELECT count(*)::int AS n FROM storage.objects`);
  report.storage.objectCount = objectCount;

  report.rbac = {
    roles: await q(`SELECT slug, is_system FROM roles WHERE deleted_at IS NULL ORDER BY slug`),
    userCount: (await q(`SELECT count(*)::int AS n FROM users WHERE deleted_at IS NULL`))[0].n,
    permissionCount: (await q(`SELECT count(*)::int AS n FROM permissions`))[0].n,
    adminUsers: (await q(`
      SELECT count(DISTINCT u.id)::int AS n
      FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.deleted_at IS NULL AND u.is_active = true
    `))[0].n,
  };

  report.registrations = {
    counters: await q(`SELECT prefix, last_number FROM registration_counters ORDER BY prefix`),
    total: (await q(`SELECT count(*)::int AS n FROM registrations`))[0].n,
    byRegistrationStatus: await q(`
      SELECT registration_status::text, count(*)::int AS n
      FROM registrations GROUP BY registration_status ORDER BY n DESC
    `),
    byPaymentStatus: await q(`
      SELECT payment_status::text, count(*)::int AS n
      FROM registrations GROUP BY payment_status ORDER BY n DESC
    `),
    byCheckInStatus: await q(`
      SELECT check_in_status::text, count(*)::int AS n
      FROM registrations GROUP BY check_in_status ORDER BY n DESC
    `),
    byType: await q(`
      SELECT registration_type::text, count(*)::int AS n FROM registrations GROUP BY registration_type ORDER BY n DESC
    `),
    recent30d: (await q(`
      SELECT count(*)::int AS n FROM registrations WHERE created_at > now() - interval '30 days'
    `))[0].n,
    uploadedFiles: (await q(`SELECT count(*)::int AS n FROM uploaded_files`))[0].n,
  };

  report.payments = {
    total: (await q(`SELECT count(*)::int AS n FROM payment_records`))[0].n,
    byStatus: await q(`
      SELECT status::text, count(*)::int AS n FROM payment_records GROUP BY status ORDER BY n DESC
    `),
    razorpayVerified: (await q(`SELECT count(*)::int AS n FROM razorpay_verified_payments`))[0].n,
    donations: (await q(`SELECT count(*)::int AS n FROM donation_records`))[0].n,
  };

  report.cms = {
    pages: (await q(`SELECT count(*)::int AS n FROM pages WHERE deleted_at IS NULL`))[0].n,
    publishedPages: (await q(`SELECT count(*)::int AS n FROM pages WHERE deleted_at IS NULL AND status = 'published'`))[0].n,
    notices: (await q(`SELECT count(*)::int AS n FROM notices WHERE deleted_at IS NULL`))[0].n,
    mediaAssets: (await q(`SELECT count(*)::int AS n FROM media_assets WHERE deleted_at IS NULL`))[0].n,
    downloads: (await q(`SELECT count(*)::int AS n FROM downloads WHERE deleted_at IS NULL`))[0].n,
    speakers: (await q(`SELECT count(*)::int AS n FROM speaker_profiles WHERE deleted_at IS NULL`))[0].n,
  };

  report.analytics = {
    visitorSessions: (await q(`SELECT count(*)::int AS n FROM visitor_sessions`))[0].n,
    pageViews: (await q(`SELECT count(*)::int AS n FROM visitor_page_views`))[0].n,
    auditLogs: (await q(`SELECT count(*)::int AS n FROM audit_logs`))[0].n,
    emailLogs: (await q(`SELECT count(*)::int AS n FROM email_logs`))[0].n,
  };

  report.performance = {
    indexCount: (await q(`
      SELECT count(*)::int AS n FROM pg_indexes WHERE schemaname = 'public'
    `))[0].n,
    fkCount: (await q(`
      SELECT count(*)::int AS n
      FROM information_schema.table_constraints
      WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'
    `))[0].n,
    missingFkIndexes: await q(`
      SELECT c.conrelid::regclass AS table_name, a.attname AS column_name
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
      LIMIT 15
    `),
  };

  // Integrity probes
  const orphanPayments = await q(`
    SELECT count(*)::int AS n FROM payment_records p
    WHERE p.registration_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM registrations r WHERE r.id = p.registration_id)
  `);
  const orphanFiles = await q(`
    SELECT count(*)::int AS n FROM uploaded_files f
    WHERE f.registration_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM registrations r WHERE r.id = f.registration_id)
  `);
  const duplicateRegs = await q(`
    SELECT registration_id, count(*)::int AS n FROM registrations
    WHERE registration_id IS NOT NULL
    GROUP BY registration_id HAVING count(*) > 1
    LIMIT 5
  `);

  if (orphanPayments[0].n > 0) report.integrity.gaps.push(`${orphanPayments[0].n} payment_records with missing registration`);
  if (orphanFiles[0].n > 0) report.integrity.gaps.push(`${orphanFiles[0].n} uploaded_files with missing registration`);
  if (duplicateRegs.length > 0) report.integrity.gaps.push(`duplicate registration_id values detected`);

  if (report.rls.storagePolicies.length === 0) {
    report.integrity.gaps.push("No storage.objects RLS policies");
  }
  if (report.migrations.length < expectedMigrationCount) {
    report.integrity.gaps.push(
      `Only ${report.migrations.length}/${expectedMigrationCount} Prisma migrations applied`
    );
  }
  if (report.rbac.roles.length === 0) {
    report.integrity.gaps.push("RBAC roles table empty");
  }
  if (report.storage.buckets.length < 8) {
    report.integrity.gaps.push(`Only ${report.storage.buckets.length}/8 storage buckets`);
  }

  const sensitiveNoRls = ["registrations", "payment_records", "users", "uploaded_files"].filter((t) =>
    report.schema.tablesWithoutRls.includes(t)
  );
  if (sensitiveNoRls.length > 0) {
    report.integrity.gaps.push(`RLS not enabled: ${sensitiveNoRls.join(", ")}`);
  }

  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => client.end());
