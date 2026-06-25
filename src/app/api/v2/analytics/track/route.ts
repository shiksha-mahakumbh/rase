import { NextRequest, NextResponse } from "next/server";
import { shouldTrackAnalytics } from "@/lib/analytics/track-path";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { trackVisit } from "@/server/services/visitor-analytics.service";
import { toErrorResponse } from "@/server/lib/errors";

function geoFromHeaders(request: NextRequest) {
  return {
    country: request.headers.get("x-vercel-ip-country") ?? undefined,
    countryCode: request.headers.get("x-vercel-ip-country") ?? undefined,
    state: request.headers.get("x-vercel-ip-country-region") ?? undefined,
    city: request.headers.get("x-vercel-ip-city") ?? undefined,
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `v2-analytics-track:${ip}`,
    limit: 120,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = (await request.json()) as {
      sessionId: string;
      visitorId: string;
      path: string;
      title?: string;
      referrer?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmTerm?: string;
      utmContent?: string;
      screenWidth?: number;
      screenHeight?: number;
      durationMs?: number;
      countAsVisit?: boolean;
    };

    if (!shouldTrackAnalytics(body.path)) {
      return NextResponse.json({ success: true, tracked: false, reason: "excluded_path" });
    }

    const result = await trackVisit({
      ...body,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip,
      referrer: body.referrer ?? request.headers.get("referer") ?? undefined,
      ...geoFromHeaders(request),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status }
    );
  }
}
