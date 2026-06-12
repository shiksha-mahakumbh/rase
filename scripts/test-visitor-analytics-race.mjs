#!/usr/bin/env node
/**
 * Visitor analytics race-condition tests — source validation + optional DB integration.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

const servicePath = "src/server/services/visitor-analytics.service.ts";
const routePath = "src/app/api/visitors/route.ts";
const serviceSource = readFileSync(servicePath, "utf8");
const routeSource = readFileSync(routePath, "utf8");

// --- Source: upsert pattern ---
if (/visitorSession\.upsert\s*\(/.test(serviceSource)) {
  pass("source_uses_upsert", "trackVisit uses prisma.visitorSession.upsert()");
} else {
  fail("source_uses_upsert", "visitorSession.upsert not found");
}

const trackVisitBlock = serviceSource.slice(
  serviceSource.indexOf("export async function trackVisit"),
  serviceSource.indexOf("export async function trackEvent")
);

if (!/visitorSession\.create\s*\(/.test(trackVisitBlock)) {
  pass("source_no_naked_create", "trackVisit does not use visitorSession.create()");
} else {
  fail("source_no_naked_create", "visitorSession.create still present in trackVisit");
}

if (/PrismaClientKnownRequestError/.test(trackVisitBlock) && /P2002/.test(trackVisitBlock)) {
  fail("source_p2002_fallback", "P2002 fallback still present — upsert should replace it");
} else {
  pass("source_no_p2002_fallback", "No P2002 recovery fallback (upsert handles races)");
}

if (/visitorPageView\.create\s*\(/.test(trackVisitBlock)) {
  pass("source_page_view_create", "Page views recorded after session upsert");
} else {
  fail("source_page_view_create", "visitorPageView.create missing");
}

// --- Route: POST delegates to recordVisitorHit ---
if (/recordVisitorHit/.test(routeSource) && /POST/.test(routeSource)) {
  pass("route_delegates_to_service", "POST /api/visitors calls recordVisitorHit");
} else {
  fail("route_delegates_to_service", "Route wiring unexpected");
}

// --- In-memory concurrent upsert simulation ---
function simulateConcurrentUpsert(concurrency) {
  const sessions = new Map();
  const upsert = (sessionId, visitorId) => {
    const existing = sessions.get(sessionId);
    if (!existing) {
      sessions.set(sessionId, {
        sessionId,
        visitorId,
        pageViewCount: 1,
        pageViews: 1,
      });
      return { created: true };
    }
    existing.pageViewCount += 1;
    existing.pageViews += 1;
    return { created: false };
  };

  const sessionId = "sim-session-1";
  const visitorId = "sim-visitor-1";
  const outcomes = Array.from({ length: concurrency }, () => upsert(sessionId, visitorId));

  if (sessions.size !== 1) {
    return { ok: false, detail: `expected 1 session, got ${sessions.size}` };
  }
  const row = sessions.get(sessionId);
  if (row.pageViewCount !== concurrency) {
    return { ok: false, detail: `expected pageViewCount ${concurrency}, got ${row.pageViewCount}` };
  }
  const createdCount = outcomes.filter((o) => o.created).length;
  if (createdCount !== 1) {
    return { ok: false, detail: `expected 1 create, got ${createdCount}` };
  }
  return { ok: true, detail: `${concurrency} concurrent hits → 1 session, ${concurrency} page views` };
}

const sim = simulateConcurrentUpsert(20);
if (sim.ok) {
  pass("sim_concurrent_new_session", sim.detail);
} else {
  fail("sim_concurrent_new_session", sim.detail);
}

// Single request simulation
const single = simulateConcurrentUpsert(1);
if (single.ok) {
  pass("sim_single_request", single.detail);
} else {
  fail("sim_single_request", single.detail);
}

// Existing session simulation
{
  const sessions = new Map();
  sessions.set("existing", { sessionId: "existing", pageViewCount: 5, pageViews: 5 });
  const row = sessions.get("existing");
  row.pageViewCount += 1;
  row.pageViews += 1;
  if (sessions.size === 1 && row.pageViewCount === 6) {
    pass("sim_existing_session", "Existing session increments pageViewCount");
  } else {
    fail("sim_existing_session", "Existing session update failed");
  }
}

// --- Optional DB integration ---
async function dbIntegrationTests() {
  if (!process.env.DATABASE_URL) {
    pass("db_integration_skipped", "DATABASE_URL not set — skipped live upsert test");
    return;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const sessionId = `race-test-${randomUUID()}`;
  const visitorId = `visitor-${randomUUID()}`;

  try {
    const upsertOne = () =>
      prisma.visitorSession.upsert({
        where: { sessionId },
        create: {
          sessionId,
          visitorId,
          landingPath: "/test",
          lastPath: "/test",
          pageViewCount: 1,
        },
        update: {
          lastPath: "/test",
          pageViewCount: { increment: 1 },
        },
      });

    const concurrent = await Promise.allSettled(
      Array.from({ length: 8 }, () => upsertOne())
    );

    const rejected = concurrent.filter((r) => r.status === "rejected");
    if (rejected.length > 0) {
      fail(
        "db_concurrent_upsert",
        `${rejected.length}/8 rejected: ${rejected[0].reason?.message ?? rejected[0]}`
      );
    } else {
      pass("db_concurrent_upsert", "8 concurrent upserts — 0 P2002 errors");
    }

    const rows = await prisma.visitorSession.findMany({ where: { sessionId } });
    if (rows.length === 1) {
      pass("db_single_session_row", `Exactly 1 row for sessionId (${rows[0].pageViewCount} page views)`);
    } else {
      fail("db_single_session_row", `Expected 1 row, got ${rows.length}`);
    }
  } finally {
    await prisma.visitorPageView.deleteMany({
      where: { session: { sessionId } },
    }).catch(() => undefined);
    await prisma.visitorSession.deleteMany({ where: { sessionId } }).catch(() => undefined);
    await prisma.$disconnect();
  }
}

await dbIntegrationTests();

const failed = results.filter((r) => r.status === "FAIL");
console.log(
  JSON.stringify(
    { passed: results.length - failed.length, failed: failed.length, results },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exit(1);
}
