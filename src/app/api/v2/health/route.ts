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

  return NextResponse.json({
    status: "ok",
    service: "rase-web",
    backend,
    supabase: {
      database,
      configured: hasDatabaseUrl && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    timestamp: new Date().toISOString(),
  });
}
