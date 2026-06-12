import type {
  ContentLocale,
  MediaCenterCategory,
  PageStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { saveEntityRevision } from "@/server/services/entity-revision.service";
import { upsertSeoForEntity, buildNewsArticleSchema } from "@/server/services/seo.service";
import { listPublicArticles } from "@/server/services/page.service";
import { listPublicMediaAlbums } from "@/server/services/media-album.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isPublishedStatus } from "@/server/lib/cms-utils";

export type MediaCenterHubItem = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  category: MediaCenterCategory | "press_release" | "photo_gallery";
  href: string;
  imageUrl: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  tags: string[];
  source: "event_media" | "page" | "album";
};

export async function createMediaEntry(input: {
  title: string;
  slug?: string;
  mediaCenterCategory: MediaCenterCategory;
  excerpt?: string;
  description?: string;
  url: string;
  mediaType?: "image" | "video" | "document" | "press_release" | "interview" | "publication";
  locale?: ContentLocale;
  status?: PageStatus;
  edition?: string;
  tags?: string[];
  isFeatured?: boolean;
  publishAt?: Date;
  eventId?: string;
  mediaAssetId?: string;
}) {
  const slug = input.slug ?? slugify(input.title);
  const row = await prisma.eventMedia.create({
    data: {
      title: input.title.trim(),
      slug,
      mediaCenterCategory: input.mediaCenterCategory,
      excerpt: input.excerpt ?? null,
      description: input.description ?? null,
      url: input.url,
      mediaType: input.mediaType ?? "document",
      locale: input.locale ?? "en",
      status: input.status ?? "draft",
      edition: input.edition ?? null,
      tags: input.tags ?? [],
      isFeatured: input.isFeatured ?? false,
      publishAt: input.publishAt ?? null,
      eventId: input.eventId ?? null,
      mediaAssetId: input.mediaAssetId ?? null,
    },
  });

  await writeAuditLog({
    action: "admin_action",
    entityType: "event_media",
    entityId: row.id,
    payload: { event: "media_entry_created", category: input.mediaCenterCategory },
  });

  return row;
}

export async function updateMediaEntry(
  id: string,
  data: Prisma.EventMediaUpdateInput & {
    seo?: { seoTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImageUrl?: string };
  }
) {
  const existing = await prisma.eventMedia.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Media entry not found", 404, "NOT_FOUND");

  const { seo, ...rest } = data;
  await saveEntityRevision({
    entityType: "media_entry",
    entityId: id,
    snapshot: existing as unknown as Prisma.InputJsonValue,
  });

  const row = await prisma.eventMedia.update({ where: { id }, data: rest });

  if (seo && row.slug) {
    await upsertSeoForEntity({
      entityType: "media_entry",
      entityId: row.id,
      locale: row.locale,
      canonicalUrl: seo.canonicalUrl ?? `/media-center/${row.slug}`,
      schemaJsonLd: buildNewsArticleSchema({
        headline: row.title ?? "Media",
        datePublished: row.publishAt?.toISOString() ?? row.createdAt.toISOString(),
        url: `/media-center/${row.slug}`,
        description: row.excerpt ?? undefined,
        image: row.url,
      }) as Prisma.InputJsonValue,
      ...seo,
    });
  }

  await writeAuditLog({
    action: "admin_action",
    entityType: "event_media",
    entityId: id,
    payload: { event: "media_entry_updated" },
  });

  return row;
}

export async function publishMediaEntry(id: string) {
  const row = await prisma.eventMedia.update({
    where: { id },
    data: { status: "published", publishAt: new Date() },
  });
  return row;
}

export async function archiveMediaEntry(id: string) {
  return prisma.eventMedia.update({
    where: { id },
    data: { status: "archived" },
  });
}

export async function deleteMediaEntry(id: string) {
  return prisma.eventMedia.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived" },
  });
}

export async function listMediaEntries(options: {
  status?: PageStatus;
  locale?: ContentLocale;
  category?: MediaCenterCategory;
  featured?: boolean;
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 25, offset = 0 } = options;
  const where: Prisma.EventMediaWhereInput = {
    deletedAt: null,
    mediaCenterCategory: { not: null },
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.category ? { mediaCenterCategory: options.category } : {}),
    ...(options.featured !== undefined ? { isFeatured: options.featured } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.eventMedia.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.eventMedia.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function getMediaEntryBySlug(slug: string, locale: ContentLocale = "en") {
  const row = await prisma.eventMedia.findFirst({
    where: { slug, locale, deletedAt: null, status: "published" },
  });
  if (!row || !isPublishedStatus(row.status, row.publishAt)) return null;

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId_locale: { entityType: "media_entry", entityId: row.id, locale },
    },
  });

  return { entry: row, seo };
}

export async function listPublicMediaCenterHub(
  locale: ContentLocale = "en",
  category?: MediaCenterCategory | "press_release" | "photo_gallery",
  limit = 50
): Promise<MediaCenterHubItem[]> {
  const items: MediaCenterHubItem[] = [];

  if (!category || category === "press_release") {
    const articles = await listPublicArticles({ locale, limit: 20 });
    for (const page of articles) {
      const section = page.sections.find((s) => s.sectionKey === "article");
      const content = (section?.content as Record<string, unknown>) ?? {};
      items.push({
        id: page.id,
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt,
        category: "press_release",
        href: `/press/${page.slug}`,
        imageUrl: typeof content.heroImage === "string" ? content.heroImage : null,
        publishedAt: page.publishedAt?.toISOString() ?? null,
        isFeatured: false,
        tags: [],
        source: "page",
      });
    }
  }

  if (!category || category === "photo_gallery") {
    const albums = await listPublicMediaAlbums({ locale, limit: 10 });
    for (const album of albums) {
      items.push({
        id: album.id,
        title: album.title,
        slug: album.slug,
        excerpt: album.description,
        category: "photo_gallery",
        href: `/gallery#${album.slug}`,
        imageUrl: album.items[0]?.imageUrl ?? album.items[0]?.mediaAsset?.publicUrl ?? null,
        publishedAt: null,
        isFeatured: false,
        tags: [],
        source: "album",
      });
    }
  }

  if (!category || !["press_release", "photo_gallery"].includes(category)) {
    const entries = await prisma.eventMedia.findMany({
      where: {
        deletedAt: null,
        locale,
        status: "published",
        mediaCenterCategory: category && category !== "press_release" && category !== "photo_gallery"
          ? category
          : { not: null },
      },
      orderBy: [{ isFeatured: "desc" }, { publishAt: "desc" }],
      take: limit,
    });

    for (const entry of entries.filter((e) => isPublishedStatus(e.status, e.publishAt))) {
      if (!entry.mediaCenterCategory) continue;
      items.push({
        id: entry.id,
        title: entry.title ?? "Media",
        slug: entry.slug,
        excerpt: entry.excerpt,
        category: entry.mediaCenterCategory,
        href: entry.slug ? `/media-center/${entry.slug}` : entry.url,
        imageUrl: entry.mediaType === "image" ? entry.url : null,
        publishedAt: entry.publishAt?.toISOString() ?? entry.createdAt.toISOString(),
        isFeatured: entry.isFeatured,
        tags: entry.tags,
        source: "event_media",
      });
    }
  }

  return items
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    })
    .slice(0, limit);
}
