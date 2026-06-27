import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { trackEvent } from "@/server/services/visitor-analytics.service";
import { toErrorResponse } from "@/server/lib/errors";

/** Sync consent-gated funnel milestones to server (P3-12). */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `v2-analytics-funnel:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      sessionId?: string;
      eventName?: string;
      path?: string;
      metadata?: Record<string, unknown>;
    };

    if (!body.sessionId || !body.eventName) {
      return NextResponse.json({ error: "sessionId and eventName required" }, { status: 400 });
    }

    const result = await trackEvent({
      sessionId: body.sessionId,
      eventType: "funnel",
      eventName: body.eventName,
      path: body.path,
      metadata: (body.metadata ?? {}) as Prisma.InputJsonValue,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
