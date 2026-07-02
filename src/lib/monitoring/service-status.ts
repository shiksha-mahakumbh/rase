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
    rlsPolicyCount: number | null;
    storagePolicyCount: number | null;
    anonRolesBlocked: boolean | null;
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

  let rlsPolicyCount: number | null = null;
  let storagePolicyCount: number | null = null;
  let anonRolesBlocked: boolean | null = null;

  if (database === "connected") {
    try {
      const { prisma } = await import("@/server/db/prisma");
      const [publicRows, storageRows] = await Promise.all([
        prisma.$queryRaw<{ n: number }[]>`
          SELECT count(*)::int AS n FROM pg_policies WHERE schemaname = 'public'
        `,
        prisma.$queryRaw<{ n: number }[]>`
          SELECT count(*)::int AS n FROM pg_policies WHERE schemaname = 'storage'
        `,
      ]);
      rlsPolicyCount = publicRows[0]?.n ?? 0;
      storagePolicyCount = storageRows[0]?.n ?? 0;
    } catch (error) {
      console.error("[status] RLS policy probe failed:", error);
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseAnon) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/roles?select=slug&limit=1`, {
        headers: {
          apikey: supabaseAnon,
          Authorization: `Bearer ${supabaseAnon}`,
        },
        cache: "no-store",
      });
      const text = await res.text();
      if (
        res.status === 401 ||
        res.status === 403 ||
        /permission denied|row-level security|JWT/i.test(text)
      ) {
        anonRolesBlocked = true;
      } else {
        try {
          const parsed = JSON.parse(text) as unknown;
          if (Array.isArray(parsed)) {
            // PostgREST returns [] with 200 when RLS hides all rows.
            anonRolesBlocked = parsed.length === 0;
          } else if (parsed && typeof parsed === "object" && "code" in parsed) {
            anonRolesBlocked = true;
          } else {
            anonRolesBlocked = false;
          }
        } catch {
          anonRolesBlocked = false;
        }
      }
    } catch (error) {
      console.error("[status] anon RLS probe failed:", error);
    }
  }

  const opsDegraded =
    database === "error" ||
    (rlsPolicyCount !== null && rlsPolicyCount < 1) ||
    (storagePolicyCount !== null && storagePolicyCount < 1) ||
    anonRolesBlocked === false ||
    !isUpstashConfigured() ||
    !isSentryConfigured() ||
    !process.env.CRON_SECRET;

  const status = opsDegraded ? "degraded" : "ok";

  return {
    status,
    service: "rase-web",
    checks: {
      database,
      sentryConfigured: isSentryConfigured(),
      rateLimitMode: isUpstashConfigured() ? "upstash" : "in-memory",
      cronConfigured: Boolean(process.env.CRON_SECRET),
      rlsPolicyCount,
      storagePolicyCount,
      anonRolesBlocked,
    },
    timestamp: new Date().toISOString(),
  };
}
