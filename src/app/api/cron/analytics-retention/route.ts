import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

const RETENTION_MONTHS = 12;

/** Cron: delete visitor sessions (and cascaded page views/events) older than 12 months. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || auth !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);

  const result = await prisma.visitorSession.deleteMany({
    where: { startedAt: { lt: cutoff } },
  });

  return NextResponse.json({
    ok: true,
    deletedSessions: result.count,
    cutoff: cutoff.toISOString(),
  });
}
