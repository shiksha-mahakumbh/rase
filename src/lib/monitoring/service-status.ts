import { isSentryConfigured } from "@/lib/monitoring/sentry-env";
import { isUpstashConfigured } from "@/lib/security/upstash-env";

export type DatabaseProbe = "connected" | "not_configured" | "error";

export type ServiceStatusPayload = {
  status: "ok" | "degraded";
  service: string;
  checks: {
    database: DatabaseProbe;
    sentryConfigured: boolean;
    rateLimitMode: "upstash" | "in-memory";
    cronConfigured: boolean;
  };
  timestamp: string;
};

export async function probeServiceStatus(): Promise<ServiceStatusPayload> {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  let database: DatabaseProbe = "not_configured";

  if (hasDatabaseUrl) {
    try {
      const { prisma } = await import("@/server/db/prisma");
      await prisma.$queryRaw`SELECT 1`;
      database = "connected";
    } catch (error) {
      database = "error";
      const { isPrismaConnectionError } = await import("@/lib/prisma/errors");
      console.error(
        "[status] database probe failed:",
        isPrismaConnectionError(error) ? "connection" : "query",
        error
      );
    }
  }

  const status = database === "error" ? "degraded" : "ok";

  return {
    status,
    service: "rase-web",
    checks: {
      database,
      sentryConfigured: isSentryConfigured(),
      rateLimitMode: isUpstashConfigured() ? "upstash" : "in-memory",
      cronConfigured: Boolean(process.env.CRON_SECRET),
    },
    timestamp: new Date().toISOString(),
  };
}
