import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const backend = "supabase";

  let database: "connected" | "not_configured" | "error" = "not_configured";
  if (hasDatabaseUrl) {
    try {
      const { prisma } = await import("@/server/db/prisma");
      await prisma.$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "error";
    }
  }

  const upstashConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
  const sentryConfigured = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
  const cronConfigured = Boolean(process.env.CRON_SECRET);
  const emailSecretConfigured = Boolean(process.env.REGISTRATION_EMAIL_SECRET);

  return NextResponse.json({
    status: database === "error" ? "degraded" : "ok",
    service: "rase-web",
    backend,
    supabase: {
      database,
      configured: hasDatabaseUrl && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    ops: {
      rateLimitMode: upstashConfigured ? "upstash" : "in-memory",
      upstashConfigured,
      sentryConfigured,
      cronConfigured,
      emailSecretConfigured,
    },
    timestamp: new Date().toISOString(),
  });
}
