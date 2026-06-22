import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Supabase pooler: default connection_limit=1 for serverless runtime.
 * During `next build`, allow more connections (or DIRECT_URL) so parallel SSG
 * does not exhaust the pool (Prisma pool_timeout errors).
 */
function resolveDatabaseUrl(): string | undefined {
  if (IS_PRODUCTION_BUILD && process.env.DIRECT_URL) {
    return process.env.DIRECT_URL;
  }
  return process.env.DATABASE_URL;
}

function withPoolParams(url: string | undefined): string | undefined {
  if (!url) return url;

  const params = new URLSearchParams();
  const [base, query] = url.split("?");
  if (query) {
    for (const part of query.split("&")) {
      const [key, value] = part.split("=");
      if (key) params.set(key, value ?? "");
    }
  }

  if (!params.has("connection_limit")) {
    const limit = IS_PRODUCTION_BUILD
      ? (process.env.PRISMA_CONNECTION_LIMIT ?? "8")
      : (process.env.PRISMA_CONNECTION_LIMIT ?? "1");
    params.set("connection_limit", limit);
  }

  if (!params.has("pool_timeout")) {
    const timeout = IS_PRODUCTION_BUILD
      ? (process.env.PRISMA_POOL_TIMEOUT ?? "30")
      : (process.env.PRISMA_POOL_TIMEOUT ?? "10");
    params.set("pool_timeout", timeout);
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: {
      db: {
        url: withPoolParams(resolveDatabaseUrl()),
      },
    },
  });

/** Reuse one client in dev and during production static generation. */
if (process.env.NODE_ENV !== "production" || IS_PRODUCTION_BUILD) {
  globalForPrisma.prisma = prisma;
}
