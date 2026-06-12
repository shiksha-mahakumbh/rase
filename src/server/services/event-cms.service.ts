import type {
  ContentLocale,
  EventCategory,
  EventStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { saveEntityRevision } from "@/server/services/entity-revision.service";
import { upsertSeoForEntity, buildEventSchema } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isPublishedStatus } from "@/server/lib/cms-utils";

function slugifyEvent(text: string) {
  return slugify(text);
}

export async function createEventCms(input: {
  title: string;
  slug?: string;
  description?: string;
  edition?: string;
  locale?: ContentLocale;
  category?: EventCategory;
  venue?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  eventDate?: Date;
  bannerUrl?: string;
  highlights?: Prisma.InputJsonValue;
  brochureDownloadId?: string;
  registrationLink?: string;
  isFeatured?: boolean;
  publishAt?: Date;
}) {
  const slug = input.slug ?? slugifyEvent(input.title);
  const locale = input.locale ?? "en";

  const existing = await prisma.event.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Event slug already exists", 409, "SLUG_EXISTS");

  const startDate = input.startDate ?? input.eventDate ?? null;

  const row = await prisma.event.create({
    data: {
      title: input.title.trim(),
      slug,
      description: input.description ?? null,
      edition: input.edition ?? null,
      locale,
      category: input.category ?? "other",
      venue: input.venue ?? null,
      location: input.location ?? null,
      startDate,
      endDate: input.endDate ?? null,
      eventDate: startDate,
      bannerUrl: input.bannerUrl ?? null,
      highlights: input.highlights ?? [],
      brochureDownloadId: input.brochureDownloadId ?? null,
      registrationLink: input.registrationLink ?? null,
      isFeatured: input.isFeatured ?? false,
      publishAt: input.publishAt ?? null,
      status: "draft",
    },
    include: { media: true, brochureDownload: true },
  });

  await writeAuditLog({
    action: "event_created",
    entityType: "events",
    entityId: row.id,
    payload: { title: row.title },
  });

  return row;
}

export async function updateEventCms(
  id: string,
  data: Prisma.EventUpdateInput & {
    seo?: { seoTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImageUrl?: string };
  }
) {
  const existing = await prisma.event.findFirst({
    where: { id, deletedAt: null },
    include: { media: true },
  });
  if (!existing) throw new ServiceError("Event not found", 404, "NOT_FOUND");

  const { seo, ...rest } = data;
  await saveEntityRevision({
    entityType: "event",
    entityId: id,
    snapshot: existing as unknown as Prisma.InputJsonValue,
  });

  const row = await prisma.event.update({
    where: { id },
    data: rest,
    include: { media: true, brochureDownload: true },
  });

  if (seo) {
    const start = row.startDate ?? row.eventDate;
    await upsertSeoForEntity({
      entityType: "event",
      entityId: row.id,
      locale: row.locale,
      canonicalUrl: seo.canonicalUrl ?? `/events/${row.slug}`,
      schemaJsonLd: buildEventSchema({
        name: row.title,
        startDate: start?.toISOString() ?? new Date().toISOString(),
        endDate: row.endDate?.toISOString(),
        location: row.venue ?? row.location ?? undefined,
        description: row.description ?? undefined,
        url: `/events/${row.slug}`,
      }) as Prisma.InputJsonValue,
      ...seo,
    });
  }

  await writeAuditLog({
    action: "event_updated",
    entityType: "events",
    entityId: row.id,
    payload: { title: row.title },
  });

  return row;
}

export async function publishEventCms(id: string) {
  const row = await prisma.event.update({
    where: { id },
    data: { status: "published", isPublished: true, publishAt: new Date() },
  });
  await writeAuditLog({
    action: "event_updated",
    entityType: "events",
    entityId: id,
    payload: { event: "published" },
  });
  return row;
}

export async function archiveEventCms(id: string) {
  return prisma.event.update({
    where: { id },
    data: { status: "archived", isPublished: false },
  });
}

export async function deleteEventCms(id: string) {
  return prisma.event.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived", isPublished: false },
  });
}

export async function getEventCms(id: string) {
  const row = await prisma.event.findFirst({
    where: { id, deletedAt: null },
    include: { media: { where: { deletedAt: null } }, brochureDownload: true },
  });
  if (!row) throw new ServiceError("Event not found", 404, "NOT_FOUND");
  return row;
}

export async function listEventsCms(options: {
  status?: EventStatus;
  locale?: ContentLocale;
  category?: EventCategory;
  featured?: boolean;
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 25, offset = 0 } = options;
  const where: Prisma.EventWhereInput = {
    deletedAt: null,
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.category ? { category: options.category } : {}),
    ...(options.featured !== undefined ? { isFeatured: options.featured } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: [{ startDate: "desc" }, { updatedAt: "desc" }],
      take: limit,
      skip: offset,
      include: { brochureDownload: true },
    }),
    prisma.event.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function getEventBySlug(slug: string, locale: ContentLocale = "en") {
  const row = await prisma.event.findFirst({
    where: { slug, locale, deletedAt: null },
    include: {
      media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
      brochureDownload: true,
    },
  });
  if (!row || row.status !== "published" || !row.isPublished) return null;
  if (!isPublishedStatus("published", row.publishAt)) return null;

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId_locale: { entityType: "event", entityId: row.id, locale },
    },
  });

  return { event: row, seo };
}

export async function listPublicEvents(locale: ContentLocale = "en", featuredOnly = false) {
  const items = await prisma.event.findMany({
    where: {
      deletedAt: null,
      locale,
      status: "published",
      isPublished: true,
      ...(featuredOnly ? { isFeatured: true } : {}),
    },
    orderBy: [{ startDate: "desc" }],
    include: { brochureDownload: true },
  });
  return items.filter((e) => isPublishedStatus("published", e.publishAt));
}

// Re-export legacy helpers for backward compat
export { setEventStatus, deleteEvent } from "@/server/services/event.service";
