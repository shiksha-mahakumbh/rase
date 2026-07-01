import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `health:${ip}`,
    limit: 120,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    let status: "ok" | "degraded" = "ok";
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import("@/server/db/prisma");
        await prisma.$queryRaw`SELECT 1`;
      } catch {
        status = "degraded";
      }
    }
    return NextResponse.json({ status, service: "rase-web" });
  }

  const { isSentryConfigured } = await import("@/lib/monitoring/sentry-env");
  const { isUpstashConfigured } = await import("@/lib/security/upstash-env");

  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  let database: "connected" | "not_configured" | "error" = "not_configured";
  if (hasDatabaseUrl) {
    try {
      const { prisma } = await import("@/server/db/prisma");
      await prisma.$queryRaw`SELECT 1`;
      database = "connected";
    } catch (error) {
      const { isPrismaConnectionError } = await import("@/lib/prisma/errors");
      database = "error";
      console.error(
        "[health] database probe failed:",
        isPrismaConnectionError(error) ? "connection" : "query",
        error
      );
    }
  }

  return NextResponse.json({
    status: database === "error" ? "degraded" : "ok",
    service: "rase-web",
    backend: "supabase",
    supabase: {
      database,
      configured: hasDatabaseUrl && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    ops: {
      rateLimitMode: isUpstashConfigured() ? "upstash" : "in-memory",
      upstashConfigured: isUpstashConfigured(),
      sentryConfigured: isSentryConfigured(),
      cronConfigured: Boolean(process.env.CRON_SECRET),
      gatewaySigningConfigured: Boolean(process.env.ADMIN_GATEWAY_SIGNING_SECRET),
    },
    timestamp: new Date().toISOString(),
  });
}
