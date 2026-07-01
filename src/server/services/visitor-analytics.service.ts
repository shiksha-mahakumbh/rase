import type { PageCategory, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { isPrismaUniqueViolation } from "@/lib/prisma/errors";
import { writeAuditLog } from "@/server/services/audit.service";
import {
  ACTIVE_WINDOW_MS,
  LEGACY_VISITOR_OFFSET,
  categorizePath,
  extractReferrerDomain,
  hashIp,
  isBotUserAgent,
  parseUserAgent,
  resolveTrafficSource,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "@/server/lib/visitor-analytics-utils";

const STATS_CACHE_TTL_MS = 30_000;
let statsCache: { data: PublicVisitorStats; expiresAt: number } | null = null;

export type PublicVisitorStats = {
  daily: number;
  total: number;
  displayTotal: number;
  activeUsers: number;
  uniqueToday: number;
  source: "supabase" | "fallback";
};

export type TrackVisitInput = {
  sessionId: string;
  visitorId: string;
  path: string;
  title?: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  screenWidth?: number;
  screenHeight?: number;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  durationMs?: number;
  countAsVisit?: boolean;
};

function invalidateStatsCache() {
  statsCache = null;
}

/** Handles concurrent first-hit races on the same sessionId (P2002). */
async function upsertVisitorSession(
  sessionId: string,
  create: Prisma.VisitorSessionCreateInput,
  update: Prisma.VisitorSessionUpdateInput
) {
  try {
    return await prisma.visitorSession.upsert({
      where: { sessionId },
      create,
      update,
    });
  } catch (error) {
    if (isPrismaUniqueViolation(error)) {
      return prisma.visitorSession.update({
        where: { sessionId },
        data: update,
      });
    }
    throw error;
  }
}

async function upsertDailyRollup(input: {
  uniqueDelta: number;
  returningDelta: number;
  botFiltered?: number;
}) {
  const today = startOfDay();

  await prisma.visitorAnalytics.upsert({
    where: { date: today },
    create: {
      date: today,
      dailyCount: input.uniqueDelta,
      uniqueCount: input.uniqueDelta,
      returningCount: input.returningDelta,
      totalCount: input.uniqueDelta,
      botFiltered: input.botFiltered ?? 0,
    },
    update: {
      dailyCount: { increment: input.uniqueDelta },
      uniqueCount: { increment: input.uniqueDelta },
      returningCount: { increment: input.returningDelta },
      totalCount: input.uniqueDelta > 0 ? { increment: input.uniqueDelta } : undefined,
      botFiltered: input.botFiltered ? { increment: input.botFiltered } : undefined,
    },
  });
}

export async function trackVisit(input: TrackVisitInput) {
  const isBot = isBotUserAgent(input.userAgent);
  const now = new Date();
  const pageCategory = categorizePath(input.path);
  const ipHash = input.ip ? hashIp(input.ip) : null;

  if (isBot) {
    await upsertDailyRollup({ uniqueDelta: 0, returningDelta: 0, botFiltered: 1 });
    return { tracked: false, reason: "bot_filtered" };
  }

  let sessionBefore = await prisma.visitorSession.findUnique({
    where: { sessionId: input.sessionId },
    select: { id: true, isReturning: true },
  });

  let isReturning: boolean;
  let isNewVisitorToday: boolean;

  if (sessionBefore) {
    isReturning = sessionBefore.isReturning;
    isNewVisitorToday = false;
  } else {
    const [priorVisitor, todayVisitor] = await Promise.all([
      prisma.visitorSession.findFirst({
        where: { visitorId: input.visitorId, isBot: false },
        orderBy: { startedAt: "asc" },
        select: { id: true },
      }),
      prisma.visitorSession.findFirst({
        where: {
          visitorId: input.visitorId,
          isBot: false,
          startedAt: { gte: startOfDay() },
        },
        select: { id: true },
      }),
    ]);
    isReturning = Boolean(priorVisitor);
    isNewVisitorToday = !todayVisitor;
  }

  const traffic = resolveTrafficSource({
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    referrer: input.referrer,
  });
  const ua = parseUserAgent(input.userAgent ?? "");

  const session = await upsertVisitorSession(
    input.sessionId,
    {
      sessionId: input.sessionId,
      visitorId: input.visitorId,
      isReturning,
      isBot: false,
      ipHash,
      userAgent: input.userAgent ?? null,
      referrer: input.referrer ?? null,
      landingPath: input.path,
      lastPath: input.path,
      pageViewCount: 1,
      startedAt: now,
      lastActiveAt: now,
      device: {
        create: {
          deviceType: ua.deviceType,
          browser: ua.browser,
          browserVersion: ua.browserVersion ?? null,
          os: ua.os,
          osVersion: ua.osVersion ?? null,
          screenWidth: input.screenWidth ?? null,
          screenHeight: input.screenHeight ?? null,
        },
      },
      location: {
        create: {
          country: input.country ?? null,
          countryCode: input.countryCode ?? null,
          state: input.state ?? null,
          city: input.city ?? null,
        },
      },
      trafficSource: {
        create: {
          source: traffic.source,
          medium: traffic.medium,
          campaign: input.utmCampaign ?? null,
          term: input.utmTerm ?? null,
          content: input.utmContent ?? null,
          referrerDomain: extractReferrerDomain(input.referrer),
        },
      },
    },
    {
      lastPath: input.path,
      lastActiveAt: now,
      pageViewCount: { increment: 1 },
    }
  );

  await prisma.visitorPageView.create({
    data: {
      sessionId: session.id,
      path: input.path,
      pageCategory,
      title: input.title ?? null,
      referrer: input.referrer ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      utmTerm: input.utmTerm ?? null,
      utmContent: input.utmContent ?? null,
      durationMs: input.durationMs ?? null,
      viewedAt: now,
    },
  });

  if (input.countAsVisit !== false && isNewVisitorToday) {
    await upsertDailyRollup({
      uniqueDelta: 1,
      returningDelta: isReturning ? 1 : 0,
    });
  }

  invalidateStatsCache();
  return { tracked: true, sessionId: session.id, isNewVisitorToday, isReturning };
}

export async function trackEvent(input: {
  sessionId: string;
  eventType: string;
  eventName: string;
  path?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const session = await prisma.visitorSession.findUnique({
    where: { sessionId: input.sessionId },
    select: { id: true, isBot: true },
  });
  if (!session || session.isBot) return { tracked: false };

  await prisma.visitorEvent.create({
    data: {
      sessionId: session.id,
      eventType: input.eventType,
      eventName: input.eventName,
      path: input.path ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? {},
    },
  });
  return { tracked: true };
}

export async function getPublicVisitorStats(useCache = true): Promise<PublicVisitorStats> {
  if (useCache && statsCache && statsCache.expiresAt > Date.now()) {
    return statsCache.data;
  }

  try {
    const today = startOfDay();
    const activeSince = new Date(Date.now() - ACTIVE_WINDOW_MS);

    const [uniqueToday, totalUnique, activeUsers] = await Promise.all([
      prisma.visitorSession.count({
        where: { isBot: false, startedAt: { gte: today } },
      }),
      prisma.visitorSession.count({ where: { isBot: false } }),
      prisma.visitorSession.count({
        where: { isBot: false, lastActiveAt: { gte: activeSince } },
      }),
    ]);

    const rollup = await prisma.visitorAnalytics.findUnique({ where: { date: today } });

    const data: PublicVisitorStats = {
      daily: Math.max(rollup?.uniqueCount ?? 0, uniqueToday),
      total: totalUnique,
      displayTotal: totalUnique + LEGACY_VISITOR_OFFSET,
      activeUsers,
      uniqueToday,
      source: "supabase",
    };

    statsCache = { data, expiresAt: Date.now() + STATS_CACHE_TTL_MS };
    return data;
  } catch {
    return {
      daily: 0,
      total: 0,
      displayTotal: LEGACY_VISITOR_OFFSET,
      activeUsers: 0,
      uniqueToday: 0,
      source: "fallback",
    };
  }
}

export async function recordVisitorHit(input: Omit<TrackVisitInput, "countAsVisit">) {
  const result = await trackVisit({ ...input, countAsVisit: true });
  if (result.tracked) {
    void writeAuditLog({
      action: "visitor_tracked",
      entityType: "visitor_sessions",
      entityId: result.sessionId ?? null,
      payload: { path: input.path, visitorId: input.visitorId },
    }).catch(() => undefined);
  }
  return result;
}

type Period = "day" | "week" | "month" | "year";

function periodStart(period: Period): Date {
  switch (period) {
    case "week":
      return startOfWeek();
    case "month":
      return startOfMonth();
    case "year":
      return startOfYear();
    default:
      return startOfDay();
  }
}

export async function getVisitorMetrics(period: Period = "day") {
  const since = periodStart(period);
  const botFilter = { isBot: false };

  const [total, unique, returning, pageViews] = await Promise.all([
    prisma.visitorSession.count({ where: { ...botFilter, startedAt: { gte: since } } }),
    prisma.visitorSession.groupBy({
      by: ["visitorId"],
      where: { ...botFilter, startedAt: { gte: since } },
    }).then((r) => r.length),
    prisma.visitorSession.count({
      where: { ...botFilter, isReturning: true, startedAt: { gte: since } },
    }),
    prisma.visitorPageView.count({
      where: { viewedAt: { gte: since }, session: botFilter },
    }),
  ]);

  return { period, since, total, unique, returning, pageViews };
}

export async function getAnalyticsChartData(period: Period = "day", points = 30) {
  const views = await prisma.visitorPageView.findMany({
    where: {
      viewedAt: { gte: new Date(Date.now() - points * 24 * 60 * 60 * 1000) },
      session: { isBot: false },
    },
    select: { viewedAt: true },
    orderBy: { viewedAt: "asc" },
  });

  const buckets = new Map<string, number>();
  for (const v of views) {
    let key: string;
    const d = v.viewedAt;
    if (period === "year") key = `${d.getFullYear()}`;
    else if (period === "month") key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    else if (period === "week") {
      const ws = startOfWeek(d);
      key = ws.toISOString().slice(0, 10);
    } else key = d.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

export async function getTopPages(limit = 10, since?: Date) {
  const rows = await prisma.visitorPageView.groupBy({
    by: ["path", "pageCategory"],
    where: {
      ...(since ? { viewedAt: { gte: since } } : {}),
      session: { isBot: false },
    },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  });

  return rows.map((r) => ({
    path: r.path,
    category: r.pageCategory,
    views: r._count.path,
  }));
}

export async function getTopDownloads(limit = 10) {
  const rows = await prisma.download.findMany({
    where: { deletedAt: null, isCurrent: true },
    orderBy: { downloadCount: "desc" },
    take: limit,
    select: { id: true, title: true, slug: true, downloadCount: true, category: true },
  });
  return rows;
}

export async function getTopNotices(limit = 10) {
  const rows = await prisma.visitorEvent.groupBy({
    by: ["entityId"],
    where: {
      eventType: "content_view",
      entityType: "notice",
      entityId: { not: null },
    },
    _count: { entityId: true },
    orderBy: { _count: { entityId: "desc" } },
    take: limit,
  });

  const notices = await prisma.notice.findMany({
    where: { id: { in: rows.map((r) => r.entityId!).filter(Boolean) } },
    select: { id: true, title: true, slug: true },
  });

  return rows.map((r) => ({
    notice: notices.find((n) => n.id === r.entityId),
    views: r._count.entityId,
  }));
}

export async function getTrafficSources(limit = 10, since?: Date) {
  const rows = await prisma.trafficSource.findMany({
    where: {
      ...(since
        ? { session: { startedAt: { gte: since }, isBot: false } }
        : { session: { isBot: false } }),
    },
    select: { source: true, medium: true },
  });

  const counts = new Map<string, number>();
  for (const r of rows) {
    const key = `${r.source ?? "direct"}|${r.medium ?? "none"}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([key, count]) => {
      const [source, medium] = key.split("|");
      return { source, medium, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getDeviceBreakdown(since?: Date) {
  const rows = await prisma.visitorDevice.groupBy({
    by: ["deviceType"],
    where: {
      ...(since ? { session: { startedAt: { gte: since }, isBot: false } } : { session: { isBot: false } }),
    },
    _count: { deviceType: true },
    orderBy: { _count: { deviceType: "desc" } },
  });

  return rows.map((r) => ({ deviceType: r.deviceType, count: r._count.deviceType }));
}

export async function getRegistrationConversionRate() {
  const today = startOfDay();
  const [visitorsToday, registrationsToday] = await Promise.all([
    prisma.visitorSession.count({ where: { isBot: false, startedAt: { gte: today } } }),
    prisma.registration.count({
      where: { deletedAt: null, createdAt: { gte: today } },
    }),
  ]);

  const rate = visitorsToday > 0 ? (registrationsToday / visitorsToday) * 100 : 0;
  return {
    visitorsToday,
    registrationsToday,
    conversionRate: Math.round(rate * 100) / 100,
  };
}

export async function getAnalyticsDashboard() {
  const monthStart = startOfMonth();
  const [stats, dayMetrics, weekMetrics, monthMetrics, yearMetrics] = await Promise.all([
    getPublicVisitorStats(),
    getVisitorMetrics("day"),
    getVisitorMetrics("week"),
    getVisitorMetrics("month"),
    getVisitorMetrics("year"),
  ]);

  const [
    topPages,
    topDownloads,
    topNotices,
    trafficSources,
    deviceBreakdown,
    conversion,
    chartDay,
    chartWeek,
    chartMonth,
    chartYear,
  ] = await Promise.all([
    getTopPages(10, monthStart),
    getTopDownloads(10),
    getTopNotices(10),
    getTrafficSources(10, monthStart),
    getDeviceBreakdown(monthStart),
    getRegistrationConversionRate(),
    getAnalyticsChartData("day", 30),
    getAnalyticsChartData("week", 12),
    getAnalyticsChartData("month", 12),
    getAnalyticsChartData("year", 5),
  ]);

  return {
    widgets: {
      totalVisitors: stats.displayTotal,
      activeVisitors: stats.activeUsers,
      visitorsToday: stats.daily,
      visitorsThisMonth: monthMetrics.unique,
      topPages,
      topDownloads,
      topNotices,
      registrationConversion: conversion,
      trafficSources,
      deviceBreakdown,
    },
    metrics: { day: dayMetrics, week: weekMetrics, month: monthMetrics, year: yearMetrics },
    charts: { day: chartDay, week: chartWeek, month: chartMonth, year: chartYear },
  };
}

export async function getPageCategoryBreakdown(since?: Date) {
  const rows = await prisma.visitorPageView.groupBy({
    by: ["pageCategory"],
    where: {
      ...(since ? { viewedAt: { gte: since } } : {}),
      session: { isBot: false },
    },
    _count: { pageCategory: true },
    orderBy: { _count: { pageCategory: "desc" } },
  });

  return rows.map((r) => ({
    category: r.pageCategory as PageCategory,
    views: r._count.pageCategory,
  }));
}
