import { prisma } from "@/server/db/prisma";

const DELETE_BATCH_SIZE = 500;

export async function deleteInBatches(
  fetchBatch: (take: number) => Promise<Array<{ id: string }>>,
  deleteBatch: (ids: string[]) => Promise<{ count: number }>
): Promise<number> {
  let total = 0;
  while (true) {
    const batch = await fetchBatch(DELETE_BATCH_SIZE);
    if (batch.length === 0) break;
    const result = await deleteBatch(batch.map((row) => row.id));
    total += result.count;
    if (batch.length < DELETE_BATCH_SIZE) break;
  }
  return total;
}

export async function purgeVisitorSessionsOlderThan(cutoff: Date): Promise<number> {
  return deleteInBatches(
    (take) =>
      prisma.visitorSession.findMany({
        where: { startedAt: { lt: cutoff } },
        select: { id: true },
        take,
      }),
    (ids) => prisma.visitorSession.deleteMany({ where: { id: { in: ids } } })
  );
}

export async function purgeAuditLogsOlderThan(cutoff: Date): Promise<number> {
  return deleteInBatches(
    (take) =>
      prisma.auditLog.findMany({
        where: { createdAt: { lt: cutoff } },
        select: { id: true },
        take,
      }),
    (ids) => prisma.auditLog.deleteMany({ where: { id: { in: ids } } })
  );
}

export async function purgeEmailLogsOlderThan(cutoff: Date): Promise<number> {
  return deleteInBatches(
    (take) =>
      prisma.emailLog.findMany({
        where: { createdAt: { lt: cutoff } },
        select: { id: true },
        take,
      }),
    (ids) => prisma.emailLog.deleteMany({ where: { id: { in: ids } } })
  );
}
