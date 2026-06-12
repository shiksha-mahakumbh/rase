import type { AccommodationStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
export async function listAccommodationRequests(options: { limit?: number; offset?: number; status?: AccommodationStatus }) {
  const { limit = 25, offset = 0, status } = options;
  const where = { deletedAt: null, ...(status ? { status } : {}) };
  const [items, total] = await Promise.all([
    prisma.accommodationRequest.findMany({
      where,
      include: { registration: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.accommodationRequest.count({ where }),
  ]);
  return { items, total, limit, offset };
}

export async function updateAccommodationStatus(id: string, status: AccommodationStatus, notes?: string) {
  const row = await prisma.accommodationRequest.update({
    where: { id },
    data: { status, notes: notes ?? undefined },
    include: { registration: true },
  });

  if (row.registration) {
    await prisma.registration.update({
      where: { id: row.registrationId },
      data: { accommodationStatus: status },
    });
  }

  await writeAuditLog({
    action: "registration_updated",
    registrationId: row.registrationId,
    entityType: "accommodation_requests",
    entityId: row.id,
    payload: { status, notes },
  });

  return row;
}
