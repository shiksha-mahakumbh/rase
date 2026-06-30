import type { ContentLocale, NoticeStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { upsertSeoForEntity, buildNewsArticleSchema } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isNoticeVisible } from "@/server/lib/cms-utils";
import { sanitizeNoticeDescription } from "@/server/lib/cms-sanitize";
import { saveEntityRevision } from "@/server/services/entity-revision.service";

export type CreateNoticeInput = {
  title: string;
  slug?: string;
  categoryId?: string;
  description: string;
  priority?: number;
  status?: NoticeStatus;
  isPinned?: boolean;
  locale?: ContentLocale;
  publishAt?: Date;
  expireAt?: Date;
  createdById?: string;
  attachments?: Array<{
    mediaAssetId?: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    sizeBytes?: number;
    sortOrder?: number;
  }>;
  seo?: {
    seoTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    canonicalUrl?: string;
    ogImageUrl?: string;
  };
};

function fixPublicNoticeWhere(): Prisma.NoticeWhereInput {
  const now = new Date();
  return {
    deletedAt: null,
    status: { in: ["published", "scheduled"] },
    AND: [
      { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
      { OR: [{ expireAt: null }, { expireAt: { gt: now } }] },
    ],
  };
}

export async function createNoticeCategory(input: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}) {
  const slug = input.slug ?? slugify(input.name);
  return prisma.noticeCategory.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function listNoticeCategories(includeInactive = false) {
  return prisma.noticeCategory.findMany({
    where: {
      deletedAt: null,
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function createNotice(input: CreateNoticeInput) {
  const slug = input.slug ?? slugify(input.title);
  const locale = input.locale ?? "en";

  const existing = await prisma.notice.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Notice slug already exists", 409, "SLUG_EXISTS");

  const notice = await prisma.notice.create({
    data: {
      title: input.title,
      slug,
      categoryId: input.categoryId ?? null,
      description: sanitizeNoticeDescription(input.description),
      priority: input.priority ?? 0,
      status: input.status ?? "draft",
      isPinned: input.isPinned ?? false,
      locale,
      publishAt: input.publishAt ?? null,
      expireAt: input.expireAt ?? null,
      createdById: input.createdById ?? null,
      attachments: input.attachments?.length
        ? {
            create: input.attachments.map((a, i) => ({
              mediaAssetId: a.mediaAssetId ?? null,
              fileName: a.fileName,
              fileUrl: a.fileUrl,
              mimeType: a.mimeType,
              sizeBytes: a.sizeBytes ?? 0,
              sortOrder: a.sortOrder ?? i,
            })),
          }
        : undefined,
    },
    include: { category: true, attachments: true },
  });

  if (input.seo) {
    await upsertSeoForEntity({
      entityType: "notice",
      entityId: notice.id,
      locale,
      ...input.seo,
      canonicalUrl: input.seo.canonicalUrl ?? `/noticeboard#${slug}`,
      schemaJsonLd: buildNewsArticleSchema({
        headline: notice.title,
        datePublished: notice.createdAt.toISOString(),
        url: `/noticeboard#${slug}`,
        description: notice.description.slice(0, 200),
      }),
    });
  }

  await writeAuditLog({
    action: "notice_created",
    entityType: "notices",
    entityId: notice.id,
    payload: { title: notice.title, slug: notice.slug },
  });

  return notice;
}

export async function updateNotice(
  id: string,
  data: Prisma.NoticeUpdateInput & {
    seo?: CreateNoticeInput["seo"];
    attachments?: CreateNoticeInput["attachments"];
  },
  userId?: string
) {
  const { seo, attachments, ...noticeData } = data;

  const existing = await prisma.notice.findFirst({
    where: { id, deletedAt: null },
    include: { category: true, attachments: { orderBy: { sortOrder: "asc" } } },
  });
  if (!existing) throw new ServiceError("Notice not found", 404, "NOT_FOUND");

  await saveEntityRevision({
    entityType: "notice",
    entityId: id,
    snapshot: existing as unknown as Prisma.InputJsonValue,
    createdById: userId ?? null,
  });

  const sanitized: Prisma.NoticeUpdateInput = { ...noticeData };
  if (typeof noticeData.description === "string") {
    sanitized.description = sanitizeNoticeDescription(noticeData.description);
  }

  const notice = await prisma.notice.update({
    where: { id },
    data: { ...sanitized, updatedById: userId ?? undefined },
    include: { category: true, attachments: true },
  });

  if (attachments) {
    await prisma.noticeAttachment.deleteMany({ where: { noticeId: id } });
    if (attachments.length) {
      await prisma.noticeAttachment.createMany({
        data: attachments.map((a, i) => ({
          noticeId: id,
          mediaAssetId: a.mediaAssetId ?? null,
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          mimeType: a.mimeType,
          sizeBytes: a.sizeBytes ?? 0,
          sortOrder: a.sortOrder ?? i,
        })),
      });
    }
  }

  if (seo) {
    await upsertSeoForEntity({
      entityType: "notice",
      entityId: notice.id,
      locale: notice.locale,
      ...seo,
    });
  }

  await writeAuditLog({
    action: "notice_updated",
    entityType: "notices",
    entityId: notice.id,
    actorUserId: userId ?? null,
    payload: { title: notice.title },
  });

  return prisma.notice.findUnique({
    where: { id },
    include: { category: true, attachments: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function publishNotice(id: string, userId?: string) {
  const notice = await prisma.notice.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: new Date(),
      updatedById: userId ?? undefined,
    },
    include: { category: true, attachments: true },
  });

  await upsertSeoForEntity({
    entityType: "notice",
    entityId: notice.id,
    locale: notice.locale,
    seoTitle: notice.title,
    metaDescription: notice.description.slice(0, 160),
    canonicalUrl: `/noticeboard#${notice.slug}`,
    schemaJsonLd: buildNewsArticleSchema({
      headline: notice.title,
      datePublished: (notice.publishedAt ?? new Date()).toISOString(),
      url: `/noticeboard#${notice.slug}`,
      description: notice.description.slice(0, 200),
    }),
  });

  await writeAuditLog({
    action: "notice_published",
    entityType: "notices",
    entityId: notice.id,
    actorUserId: userId ?? null,
    payload: { slug: notice.slug },
  });

  return notice;
}

export async function archiveNotice(id: string, userId?: string) {
  return updateNotice(id, { status: "archived" }, userId);
}

export async function deleteNotice(id: string, userId?: string) {
  const notice = await prisma.notice.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived", updatedById: userId ?? undefined },
  });

  await writeAuditLog({
    action: "notice_deleted",
    entityType: "notices",
    entityId: notice.id,
    actorUserId: userId ?? null,
  });

  return notice;
}

export async function getNoticeBySlug(slug: string, locale: ContentLocale = "en") {
  const notice = await prisma.notice.findFirst({
    where: { slug, locale, deletedAt: null },
    include: {
      category: true,
      attachments: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!notice || !isNoticeVisible(notice)) return null;

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId_locale: {
        entityType: "notice",
        entityId: notice.id,
        locale,
      },
    },
  });

  return { notice, seo };
}

export async function listPublicNotices(options: {
  locale?: ContentLocale;
  categorySlug?: string;
  pinnedOnly?: boolean;
  limit?: number;
  offset?: number;
  widget?: boolean;
}) {
  const { limit = options.widget ? 5 : 25, offset = 0 } = options;
  const where: Prisma.NoticeWhereInput = {
    ...fixPublicNoticeWhere(),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.pinnedOnly ? { isPinned: true } : {}),
    ...(options.categorySlug
      ? { category: { slug: options.categorySlug, deletedAt: null } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { priority: "desc" }, { publishAt: "desc" }],
      take: limit,
      skip: offset,
      include: {
        category: true,
        attachments: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.notice.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function listNotices(options: {
  status?: NoticeStatus;
  locale?: ContentLocale;
  categoryId?: string;
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}) {
  const { limit = 25, offset = 0, includeDeleted = false } = options;
  const where: Prisma.NoticeWhereInput = {
    ...(includeDeleted ? {} : { deletedAt: null }),
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      take: limit,
      skip: offset,
      include: {
        category: true,
        attachments: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.notice.count({ where }),
  ]);

  return { items, total, limit, offset };
}
