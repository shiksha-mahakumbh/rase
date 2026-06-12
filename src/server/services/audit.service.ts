import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export type AuditInput = {
  action: AuditAction;
  actorUserId?: string | null;
  registrationId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  payload?: Prisma.InputJsonValue;
};

export async function writeAuditLog(input: AuditInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        action: input.action,
        actorUserId: input.actorUserId ?? null,
        registrationId: input.registrationId ?? null,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        payload: input.payload ?? {},
      },
    });
  } catch (error) {
    console.error("audit_logs write failed:", error);
    return null;
  }
}

export async function listAuditLogs(options: {
  limit?: number;
  offset?: number;
  action?: AuditAction;
  registrationId?: string;
}) {
  const { limit = 50, offset = 0, action, registrationId } = options;
  const where: Prisma.AuditLogWhereInput = {};
  if (action) where.action = action;
  if (registrationId) where.registrationId = registrationId;

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, total, limit, offset };
}
