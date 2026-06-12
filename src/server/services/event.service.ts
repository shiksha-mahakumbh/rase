import type { EventStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createEvent(input: {
  title: string;
  slug?: string;
  description?: string;
  venue?: string;
  location?: string;
  eventDate?: Date;
  bannerUrl?: string;
}) {
  const row = await prisma.event.create({
    data: {
      title: input.title,
      slug: input.slug ?? slugify(input.title),
      description: input.description ?? null,
      venue: input.venue ?? null,
      location: input.location ?? null,
      eventDate: input.eventDate ?? null,
      bannerUrl: input.bannerUrl ?? null,
      status: "draft",
    },
  });
  await writeAuditLog({
    action: "event_created",
    entityType: "events",
    entityId: row.id,
    payload: { title: row.title },
  });
  return row;
}

export async function updateEvent(id: string, data: Prisma.EventUpdateInput) {
  const row = await prisma.event.update({ where: { id }, data });
  await writeAuditLog({
    action: "event_updated",
    entityType: "events",
    entityId: row.id,
    payload: { title: row.title },
  });
  return row;
}

export async function deleteEvent(id: string) {
  return prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
}

export async function setEventStatus(id: string, status: EventStatus) {
  const isPublished = status === "published";
  return prisma.event.update({
    where: { id },
    data: { status, isPublished },
  });
}

export async function listEvents(options: { publishedOnly?: boolean } = {}) {
  const where = {
    deletedAt: null,
    ...(options.publishedOnly ? { isPublished: true, status: "published" as const } : {}),
  };
  return prisma.event.findMany({ where, orderBy: { eventDate: "desc" } });
}
