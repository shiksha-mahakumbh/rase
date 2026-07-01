#!/usr/bin/env node
/** Audit visitor counter: DB truth vs API public stats (IST day boundaries). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const ANALYTICS_TIMEZONE = "Asia/Kolkata";
const LEGACY_OFFSET = 94_567;
const FIRESTORE_BASELINE = Number.parseInt(
  env.VISITOR_FIRESTORE_BASELINE ?? "80433",
  10
);

function computeDisplayTotal(liveSessions) {
  return LEGACY_OFFSET + FIRESTORE_BASELINE + liveSessions;
}

const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

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

function formatDateKeyInZone(d, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function startOfDayIst(d = new Date()) {
  const dateKey = formatDateKeyInZone(d, ANALYTICS_TIMEZONE);
  return new Date(`${dateKey}T00:00:00+05:30`);
}

function analyticsRollupDateIst(d = new Date()) {
  const dateKey = formatDateKeyInZone(d, ANALYTICS_TIMEZONE);
  return new Date(`${dateKey}T00:00:00.000Z`);
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  const today = startOfDayIst();
  const rollupDate = analyticsRollupDateIst();
  const activeSince = new Date(Date.now() - ACTIVE_WINDOW_MS);

  const q = (sql, params = []) => client.query(sql, params).then((r) => r.rows);

  const [
    sessions,
    uniqueVisitors,
    todayUniqueVisitors,
    activeUniqueVisitors,
    bots,
    rollupToday,
    pageViews,
    multiSessionVisitors,
  ] = await Promise.all([
    q(`SELECT count(*)::int AS n FROM visitor_sessions WHERE is_bot = false`),
    q(`SELECT count(DISTINCT visitor_id)::int AS n FROM visitor_sessions WHERE is_bot = false`),
    q(
      `SELECT count(DISTINCT visitor_id)::int AS n FROM visitor_sessions WHERE is_bot = false AND started_at >= $1`,
      [today]
    ),
    q(
      `SELECT count(DISTINCT visitor_id)::int AS n FROM visitor_sessions WHERE is_bot = false AND last_active_at >= $1`,
      [activeSince]
    ),
    q(`SELECT count(*)::int AS n FROM visitor_sessions WHERE is_bot = true`),
    q(
      `SELECT daily_count, unique_count, total_count, bot_filtered FROM visitor_analytics WHERE date = $1`,
      [rollupDate]
    ),
    q(`SELECT count(*)::int AS n FROM visitor_page_views`),
    q(`
      SELECT count(*)::int AS n FROM (
        SELECT visitor_id FROM visitor_sessions WHERE is_bot = false
        GROUP BY visitor_id HAVING count(*) > 1
      ) t
    `),
  ]);

  const sessionTotal = sessions[0].n;
  const uniqueTotal = uniqueVisitors[0].n;
  const expectedDaily = Math.max(rollupToday[0]?.unique_count ?? 0, todayUniqueVisitors[0].n);
  const gaps = [];

  if (sessionTotal !== uniqueTotal) {
    gaps.push(
      `Session count (${sessionTotal}) exceeds unique visitors (${uniqueTotal}) by ${sessionTotal - uniqueTotal} — public total must use distinct visitor_id`
    );
  }

  let apiStats = null;
  try {
    const site = env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in";
    const res = await fetch(`${site}/api/v2/analytics/stats`);
    apiStats = await res.json();
    if (apiStats.total !== uniqueTotal) {
      gaps.push(`API total (${apiStats.total}) != DB unique visitors (${uniqueTotal})`);
    }
    if (apiStats.daily !== expectedDaily) {
      gaps.push(`API daily (${apiStats.daily}) != expected (${expectedDaily})`);
    }
    if (apiStats.displayTotal !== computeDisplayTotal(sessionTotal)) {
      gaps.push(
        `API displayTotal (${apiStats.displayTotal}) != legacy + firestore baseline + sessions (${computeDisplayTotal(sessionTotal)})`
      );
    }
    if (apiStats.timezone && apiStats.timezone !== ANALYTICS_TIMEZONE) {
      gaps.push(`API timezone (${apiStats.timezone}) != ${ANALYTICS_TIMEZONE}`);
    }
    if (apiStats.activeUsers !== activeUniqueVisitors[0].n) {
      gaps.push(
        `API activeUsers (${apiStats.activeUsers}) != DB distinct active (${activeUniqueVisitors[0].n})`
      );
    }
  } catch (e) {
    gaps.push(`Could not fetch public API: ${e.message}`);
  }

  const report = {
    checkedAt: new Date().toISOString(),
    timezone: ANALYTICS_TIMEZONE,
    production: {
      sessionsNonBot: sessionTotal,
      uniqueVisitors: uniqueTotal,
      sessionInflation: sessionTotal - uniqueTotal,
      visitorsWithMultipleSessions: multiSessionVisitors[0].n,
      todayUniqueVisitors: todayUniqueVisitors[0].n,
      activeUniqueVisitors5m: activeUniqueVisitors[0].n,
      botSessions: bots[0].n,
      pageViews: pageViews[0].n,
      rollupToday: rollupToday[0] ?? null,
      legacyOffset: LEGACY_OFFSET,
      firestoreBaseline: FIRESTORE_BASELINE,
      displayTotalExpected: computeDisplayTotal(sessionTotal),
    },
    api: apiStats,
    tracking: {
      primaryTrackRoute: "/api/v2/analytics/track",
      statsRoute: "/api/v2/analytics/stats",
      consentGated: true,
      legacyRoute: "/api/visitors (deprecated, not used by footer)",
    },
    gaps,
    grade: gaps.length === 0 ? "A" : gaps.length <= 2 ? "B" : "C",
  };

  console.log(JSON.stringify(report, null, 2));
  if (gaps.length > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => client.end());
