import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/server/db/prisma";
import { withCronAuth } from "@/server/lib/cron-route";

export const dynamic = "force-dynamic";

const RETENTION_MONTHS = 12;
const DELETE_BATCH_SIZE = 500;

/** Cron: delete visitor sessions (and cascaded page views/events) older than 12 months. */
export const GET = withCronAuth(async (_request: NextRequest) => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);

  let deletedSessions = 0;
  while (true) {
    const batch = await prisma.visitorSession.findMany({
      where: { startedAt: { lt: cutoff } },
      select: { id: true },
      take: DELETE_BATCH_SIZE,
    });
    if (batch.length === 0) break;

    const result = await prisma.visitorSession.deleteMany({
      where: { id: { in: batch.map((row) => row.id) } },
    });
    deletedSessions += result.count;
    if (batch.length < DELETE_BATCH_SIZE) break;
  }

  return NextResponse.json({
    ok: true,
    deletedSessions,
    cutoff: cutoff.toISOString(),
  });
});
