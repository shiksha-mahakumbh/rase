import type { ContentLocale, PageStatus, PageType, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { upsertSeoForEntity } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isPublishedStatus } from "@/server/lib/cms-utils";
import { sanitizeCmsHtmlField } from "@/server/lib/cms-sanitize";
import { purgeCmsContentCaches } from "@/server/lib/cms-cache-purge";

export type CreatePageInput = {
  title: string;
  slug?: string;
  pageType?: PageType;
  locale?: ContentLocale;
  excerpt?: string;
  content?: string;
  status?: PageStatus;
  publishAt?: Date;
  createdById?: string;
  seo?: {
    seoTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    canonicalUrl?: string;
    ogImageUrl?: string;
  };
  sections?: Array<{
    sectionKey: string;
    sectionType?: string;
    title?: string;
    content?: Prisma.InputJsonValue;
    sortOrder?: number;
  }>;
};

async function nextRevisionVersion(pageId: string) {
  const last = await prisma.pageRevision.findFirst({
    where: { pageId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  return (last?.version ?? 0) + 1;
}

async function saveRevision(pageId: string, userId?: string) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });
  if (!page) return;

  await prisma.pageRevision.create({
    data: {
      pageId,
      version: await nextRevisionVersion(pageId),
      title: page.title,
      slug: page.slug,
      content: page.content,
      sectionsSnapshot: page.sections,
      createdById: userId ?? null,
    },
  });
}

export async function createPage(input: CreatePageInput) {
  const slug = input.slug ?? slugify(input.title);
  const locale = input.locale ?? "en";

  const existing = await prisma.page.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Page slug already exists", 409, "SLUG_EXISTS");

  const page = await prisma.page.create({
    data: {
      title: input.title,
      slug,
      pageType: input.pageType ?? "static",
      locale,
      excerpt: sanitizeCmsHtmlField(input.excerpt),
      content: sanitizeCmsHtmlField(input.content),
      status: input.status ?? "draft",
      publishAt: input.publishAt ?? null,
      createdById: input.createdById ?? null,
      sections: input.sections?.length
        ? {
            create: input.sections.map((s, i) => ({
              sectionKey: s.sectionKey,
              sectionType: (s.sectionType as never) ?? "content",
              title: s.title ?? null,
              content: s.content ?? {},
              sortOrder: s.sortOrder ?? i,
            })),
          }
        : undefined,
    },
    include: { sections: true },
  });

  if (input.seo) {
    await upsertSeoForEntity({
      entityType: "page",
      entityId: page.id,
      locale,
      ...input.seo,
      canonicalUrl: input.seo.canonicalUrl ?? `/${slug}`,
    });
  }

  await writeAuditLog({
    action: "page_created",
    entityType: "pages",
    entityId: page.id,
    payload: { title: page.title, slug: page.slug },
  });

  purgeCmsContentCaches({ locales: [locale], slug: page.slug });
  return page;
}

export async function updatePage(
  id: string,
  data: Prisma.PageUpdateInput & { seo?: CreatePageInput["seo"] },
  userId?: string
) {
  const { seo, ...pageData } = data;
  await saveRevision(id, userId);

  const sanitized: Prisma.PageUpdateInput = { ...pageData };
  if (typeof pageData.content === "string") {
    sanitized.content = sanitizeCmsHtmlField(pageData.content);
  }
  if (typeof pageData.excerpt === "string") {
    sanitized.excerpt = sanitizeCmsHtmlField(pageData.excerpt);
  }

  const page = await prisma.page.update({
    where: { id },
    data: { ...sanitized, updatedById: userId ?? undefined },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  if (seo) {
    await upsertSeoForEntity({
      entityType: "page",
      entityId: page.id,
      locale: page.locale,
      ...seo,
    });
  }

  await writeAuditLog({
    action: "page_updated",
    entityType: "pages",
    entityId: page.id,
    actorUserId: userId ?? null,
    payload: { title: page.title },
  });

  purgeCmsContentCaches({ locales: [page.locale], slug: page.slug });
  return page;
}

export async function publishPage(id: string, userId?: string) {
  const page = await prisma.page.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: new Date(),
      updatedById: userId ?? undefined,
    },
  });

  await writeAuditLog({
    action: "page_published",
    entityType: "pages",
    entityId: page.id,
    actorUserId: userId ?? null,
    payload: { slug: page.slug },
  });

  purgeCmsContentCaches({ locales: [page.locale], slug: page.slug });
  return page;
}

export async function archivePage(id: string, userId?: string) {
  return updatePage(id, { status: "archived" }, userId);
}

export async function deletePage(id: string, userId?: string) {
  const page = await prisma.page.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived", updatedById: userId ?? undefined },
  });

  await writeAuditLog({
    action: "page_deleted",
    entityType: "pages",
    entityId: page.id,
    actorUserId: userId ?? null,
  });

  purgeCmsContentCaches({ locales: [page.locale], slug: page.slug });
  return page;
}

export async function getPageBySlug(slug: string, locale: ContentLocale = "en") {
  const page = await prisma.page.findFirst({
    where: { slug, locale, deletedAt: null },
    include: {
      sections: { where: { isVisible: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!page) return null;
  if (!isPublishedStatus(page.status, page.publishAt)) {
    return null;
  }

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId_locale: {
        entityType: "page",
        entityId: page.id,
        locale,
      },
    },
  });

  return { page, seo };
}

export async function listPages(options: {
  status?: PageStatus;
  pageType?: PageType;
  locale?: ContentLocale;
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}) {
  const { limit = 25, offset = 0, includeDeleted = false } = options;
  const where: Prisma.PageWhereInput = {
    ...(includeDeleted ? {} : { deletedAt: null }),
    ...(options.status ? { status: options.status } : {}),
    ...(options.pageType ? { pageType: options.pageType } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.page.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
      include: { sections: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.page.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function upsertPageSection(
  pageId: string,
  input: {
    sectionKey: string;
    sectionType?: string;
    title?: string;
    content?: Prisma.InputJsonValue;
    sortOrder?: number;
    isVisible?: boolean;
  }
) {
  return prisma.pageSection.upsert({
    where: { pageId_sectionKey: { pageId, sectionKey: input.sectionKey } },
    create: {
      pageId,
      sectionKey: input.sectionKey,
      sectionType: (input.sectionType as never) ?? "content",
      title: input.title ?? null,
      content: input.content ?? {},
      sortOrder: input.sortOrder ?? 0,
      isVisible: input.isVisible ?? true,
    },
    update: {
      sectionType: input.sectionType ? (input.sectionType as never) : undefined,
      title: input.title,
      content: input.content,
      sortOrder: input.sortOrder,
      isVisible: input.isVisible,
    },
  });
}

export async function listPageRevisions(pageId: string) {
  return prisma.pageRevision.findMany({
    where: { pageId },
    orderBy: { version: "desc" },
    take: 20,
  });
}

export async function listPublicArticles(options: {
  locale?: ContentLocale;
  limit?: number;
} = {}) {
  const { limit = 20, locale } = options;
  const items = await prisma.page.findMany({
    where: {
      deletedAt: null,
      pageType: "article",
      status: "published",
      ...(locale ? { locale } : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: limit,
    include: {
      sections: { where: { sectionKey: "article" }, take: 1 },
    },
  });

  return items.filter((p) => isPublishedStatus(p.status, p.publishAt));
}
