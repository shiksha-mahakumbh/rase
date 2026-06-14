import type { AccommodationStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { queueEmail } from "@/server/services/email.service";
import { EVENT_NAME } from "@/types/registration";

export async function listAccommodationRooms() {
  return prisma.accommodationRoom.findMany({
    where: { isActive: true },
    orderBy: [{ building: "asc" }, { roomNumber: "asc" }],
  });
}

export async function createAccommodationRoom(input: {
  building: string;
  roomNumber: string;
  bedNumber?: string;
  bedType?: string;
  capacity?: number;
}) {
  return prisma.accommodationRoom.create({
    data: {
      building: input.building.trim(),
      roomNumber: input.roomNumber.trim(),
      bedNumber: input.bedNumber?.trim() || null,
      bedType: input.bedType?.trim() || null,
      capacity: input.capacity ?? 1,
    },
  });
}

export async function listAccommodationWithRooms(options: {
  limit?: number;
  offset?: number;
  status?: AccommodationStatus;
}) {
  const { limit = 25, offset = 0, status } = options;
  const where = { deletedAt: null, ...(status ? { status } : {}) };

  const [items, total] = await Promise.all([
    prisma.accommodationRequest.findMany({
      where,
      include: {
        registration: {
          select: {
            registrationId: true,
            fullName: true,
            email: true,
            contactNumber: true,
            institution: true,
            accommodationStatus: true,
          },
        },
        room: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.accommodationRequest.count({ where }),
  ]);

  return {
    items: items.map((row) => ({
      id: row.id,
      registrationId: row.registration.registrationId,
      name: row.registration.fullName,
      email: row.registration.email,
      mobile: row.registration.contactNumber,
      institution: row.registration.institution,
      status: row.status.replace(/_/g, " "),
      building: row.building ?? row.room?.building ?? null,
      roomNumber: row.roomNumber ?? row.room?.roomNumber ?? null,
      bedNumber: row.bedNumber ?? row.room?.bedNumber ?? null,
      bedType: row.bedType,
      checkInDate: row.checkInDate?.toISOString().slice(0, 10) ?? null,
      checkOutDate: row.checkOutDate?.toISOString().slice(0, 10) ?? null,
      allocatedAt: row.allocatedAt?.toISOString() ?? null,
      emailSentAt: row.accommodationEmailSentAt?.toISOString() ?? null,
    })),
    total,
    limit,
    offset,
  };
}

export async function allocateRoom(input: {
  requestId: string;
  roomId: string;
  checkInDate?: string;
  checkOutDate?: string;
  actorUserId?: string;
  sendEmail?: boolean;
}) {
  const request = await prisma.accommodationRequest.findFirst({
    where: { id: input.requestId, deletedAt: null },
    include: { registration: true },
  });
  if (!request) throw new ServiceError("Accommodation request not found", 404);

  const room = await prisma.accommodationRoom.findUnique({ where: { id: input.roomId } });
  if (!room || !room.isActive) throw new ServiceError("Room not found", 404);
  if (room.occupied >= room.capacity) {
    throw new ServiceError("Room is fully occupied", 409, "ROOM_FULL");
  }

  const existingAllocation = await prisma.accommodationRequest.findFirst({
    where: {
      roomId: input.roomId,
      deletedAt: null,
      id: { not: input.requestId },
      status: "Allocated",
    },
  });
  if (existingAllocation && room.capacity <= 1) {
    throw new ServiceError("Room already allocated to another guest", 409, "DOUBLE_ALLOCATION");
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    if (request.roomId && request.roomId !== input.roomId) {
      await tx.accommodationRoom.update({
        where: { id: request.roomId },
        data: { occupied: { decrement: 1 } },
      });
    }

    await tx.accommodationRequest.update({
      where: { id: input.requestId },
      data: {
        roomId: input.roomId,
        building: room.building,
        roomNumber: room.roomNumber,
        bedNumber: room.bedNumber,
        bedType: room.bedType,
        status: "Allocated",
        allocatedAt: now,
        allocatedByUserId: input.actorUserId,
        checkInDate: input.checkInDate ? new Date(input.checkInDate) : undefined,
        checkOutDate: input.checkOutDate ? new Date(input.checkOutDate) : undefined,
      },
    });

    if (!request.roomId || request.roomId !== input.roomId) {
      await tx.accommodationRoom.update({
        where: { id: input.roomId },
        data: { occupied: { increment: 1 } },
      });
    }

    await tx.registration.update({
      where: { id: request.registrationId },
      data: { accommodationStatus: "Allocated" },
    });
  });

  if (input.sendEmail !== false && request.registration) {
    const reg = request.registration;
    await queueEmail({
      toEmail: reg.email,
      subject: `${EVENT_NAME} — Accommodation Allocated`,
      html: `<p>Dear ${reg.fullName},</p>
        <p>Your accommodation has been allocated.</p>
        <ul>
          <li><strong>Building:</strong> ${room.building}</li>
          <li><strong>Room:</strong> ${room.roomNumber}</li>
          ${room.bedNumber ? `<li><strong>Bed:</strong> ${room.bedNumber}</li>` : ""}
        </ul>
        <p>Registration ID: ${reg.registrationId}</p>`,
      template: "registration_confirmation",
      publicRegistrationId: reg.registrationId,
      registrationUuid: reg.id,
    });
    await prisma.accommodationRequest.update({
      where: { id: input.requestId },
      data: { accommodationEmailSentAt: new Date() },
    });
  }

  await writeAuditLog({
    action: "room_allocated",
    registrationId: request.registrationId,
    actorUserId: input.actorUserId,
    entityType: "accommodation_requests",
    entityId: request.id,
    payload: {
      room_id: input.roomId,
      building: room.building,
      room_number: room.roomNumber,
      registration_id: request.registration.registrationId,
    },
  });

  void import("@/server/services/ops/workflow-automation.service")
    .then(({ fireWorkflowForRegistration }) =>
      fireWorkflowForRegistration("accommodation_assigned", request.registrationId)
    )
    .catch(() => {});

  return { success: true };
}

export async function updateAccommodationRequestStatus(
  id: string,
  status: AccommodationStatus,
  notes?: string
) {
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
