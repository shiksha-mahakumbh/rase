import { randomBytes } from "crypto";
import type { EventSessionType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import { writeAuditLog } from "@/server/services/audit.service";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function listEventSessions(options: { activeOnly?: boolean }) {
  return prisma.eventSession.findMany({
    where: { deletedAt: null, ...(options.activeOnly ? { isActive: true } : {}) },
    orderBy: { startAt: "asc" },
    include: { _count: { select: { attendances: true } } },
  });
}

export async function createEventSession(input: {
  title: string;
  sessionType?: EventSessionType;
  description?: string;
  venue?: string;
  capacity?: number;
  startAt: string;
  endAt: string;
  speakerName?: string;
}) {
  const base = slugify(input.title);
  const slug = `${base}-${Date.now().toString(36)}`;
  const qrToken = randomBytes(16).toString("hex");

  return prisma.eventSession.create({
    data: {
      slug,
      title: input.title.trim(),
      sessionType: input.sessionType ?? "other",
      description: input.description,
      venue: input.venue,
      capacity: input.capacity ?? 100,
      startAt: new Date(input.startAt),
      endAt: new Date(input.endAt),
      speakerName: input.speakerName,
      qrToken,
    },
  });
}

export async function updateEventSession(id: string, data: Partial<{
  title: string;
  sessionType: EventSessionType;
  venue: string;
  capacity: number;
  startAt: string;
  endAt: string;
  speakerName: string;
  isActive: boolean;
}>) {
  return prisma.eventSession.update({
    where: { id },
    data: {
      ...(data.title ? { title: data.title.trim() } : {}),
      ...(data.sessionType ? { sessionType: data.sessionType } : {}),
      ...(data.venue !== undefined ? { venue: data.venue } : {}),
      ...(data.capacity !== undefined ? { capacity: data.capacity } : {}),
      ...(data.startAt ? { startAt: new Date(data.startAt) } : {}),
      ...(data.endAt ? { endAt: new Date(data.endAt) } : {}),
      ...(data.speakerName !== undefined ? { speakerName: data.speakerName } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
  });
}

export async function recordSessionAttendance(input: {
  registrationId: string;
  sessionId?: string;
  qrToken?: string;
  recordedByUserId?: string;
}) {
  let session = null;
  if (input.sessionId) {
    session = await prisma.eventSession.findFirst({
      where: { id: input.sessionId, deletedAt: null, isActive: true },
    });
  } else if (input.qrToken) {
    session = await prisma.eventSession.findFirst({
      where: { qrToken: input.qrToken, deletedAt: null, isActive: true },
    });
  }
  if (!session) throw new ServiceError("Session not found", 404);

  const reg = await prisma.registration.findFirst({
    where: { registrationId: input.registrationId, deletedAt: null },
  });
  if (!reg) throw new ServiceError("Registration not found", 404);

  const count = await prisma.sessionAttendance.count({
    where: { eventSessionId: session.id },
  });
  if (count >= session.capacity) {
    throw new ServiceError("Session at capacity", 409);
  }

  const attendance = await prisma.sessionAttendance.upsert({
    where: {
      registrationId_sessionName: {
        registrationId: reg.id,
        sessionName: session.title,
      },
    },
    create: {
      registrationId: reg.id,
      eventSessionId: session.id,
      sessionName: session.title,
      recordedByUserId: input.recordedByUserId,
    },
    update: { eventSessionId: session.id },
  });

  await writeAuditLog({
    action: "session_attendance_recorded",
    registrationId: reg.id,
    actorUserId: input.recordedByUserId,
    payload: { sessionId: session.id, sessionTitle: session.title },
  });

  return { attendance, session, duplicate: false };
}

export async function getSessionByQrToken(qrToken: string) {
  return prisma.eventSession.findFirst({
    where: { qrToken, deletedAt: null, isActive: true },
    include: { _count: { select: { attendances: true } } },
  });
}
