import { NextRequest, NextResponse } from "next/server";
import { shouldTrackAnalytics } from "@/lib/analytics/track-path";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import {
  getPublicVisitorStats,
  recordVisitorHit,
} from "@/server/services/visitor-analytics.service";
import { LEGACY_VISITOR_OFFSET } from "@/server/lib/visitor-analytics-utils";

const FALLBACK = {
  daily: 0,
  total: 0,
  displayTotal: LEGACY_VISITOR_OFFSET,
  activeUsers: 0,
  uniqueToday: 0,
  source: "fallback" as const,
};

function parseBody(request: NextRequest) {
  return request
    .json()
    .catch(() => ({})) as Promise<{
    sessionId?: string;
    visitorId?: string;
    path?: string;
  }>;
}

export async function GET() {
  try {
    const stats = await getPublicVisitorStats();
    return NextResponse.json(
      {
        success: true,
        daily: stats.daily,
        total: stats.total,
        displayTotal: stats.displayTotal,
        activeUsers: stats.activeUsers,
        source: stats.source,
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
          Deprecation: "true",
          Link: '</api/v2/analytics/stats>; rel="successor-version"',
        },
      }
    );
  } catch (error) {
    console.error("[api/visitors] GET", error);
    return NextResponse.json(
      { ...FALLBACK, degraded: true },
      { status: 200, headers: { "X-Visitor-Fallback": "true" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limited = await rateLimitAsync({
      key: `visitors-post:${ip}`,
      limit: 120,
      windowMs: 60_000,
    });
    if (!limited.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await parseBody(request);
    const sessionId = body.sessionId ?? `anon-${getClientIp(request)}`;
    const visitorId = body.visitorId ?? sessionId;
    const path = body.path ?? "/";

    if (shouldTrackAnalytics(path)) {
      await recordVisitorHit({
        sessionId,
        visitorId,
        path,
        userAgent: request.headers.get("user-agent") ?? undefined,
        ip: getClientIp(request),
        referrer: request.headers.get("referer") ?? undefined,
        country: request.headers.get("x-vercel-ip-country") ?? undefined,
        countryCode: request.headers.get("x-vercel-ip-country") ?? undefined,
        state: request.headers.get("x-vercel-ip-country-region") ?? undefined,
        city: request.headers.get("x-vercel-ip-city") ?? undefined,
      });
    }

    const stats = await getPublicVisitorStats(false);
    return NextResponse.json({
      daily: stats.daily,
      total: stats.total,
      displayTotal: stats.displayTotal,
      activeUsers: stats.activeUsers,
      source: stats.source,
    });
  } catch (error) {
    console.error("[api/visitors] POST", error);
    return NextResponse.json(
      { ...FALLBACK, degraded: true },
      { status: 200, headers: { "X-Visitor-Fallback": "true" } }
    );
  }
}
