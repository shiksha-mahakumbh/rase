import type { AlbumType, ContentLocale, PageStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isPublishedStatus } from "@/server/lib/cms-utils";

export async function listMediaAlbums(options: {
  albumType?: AlbumType;
  status?: PageStatus;
  locale?: ContentLocale;
  limit?: number;
  offset?: number;
}) {
  const { limit = 25, offset = 0 } = options;
  const where = {
    deletedAt: null,
    ...(options.albumType ? { albumType: options.albumType } : {}),
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.mediaAlbum.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: limit,
      skip: offset,
      include: {
        items: { orderBy: { sortOrder: "asc" } },
        _count: { select: { items: true } },
      },
    }),
    prisma.mediaAlbum.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function getMediaAlbum(id: string) {
  const album = await prisma.mediaAlbum.findFirst({
    where: { id, deletedAt: null },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: { mediaAsset: true },
      },
    },
  });
  if (!album) throw new ServiceError("Album not found", 404, "NOT_FOUND");
  return album;
}

export async function createMediaAlbum(input: {
  title: string;
  slug?: string;
  description?: string;
  albumType?: AlbumType;
  locale?: ContentLocale;
  edition?: string;
  year?: number;
  status?: PageStatus;
  sortOrder?: number;
  items?: Array<{
    mediaAssetId?: string;
    imageUrl?: string;
    caption?: string;
    altText?: string;
    sortOrder?: number;
  }>;
}) {
  const slug = input.slug ?? slugify(input.title);
  const locale = input.locale ?? "en";

  const existing = await prisma.mediaAlbum.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Album slug already exists", 409, "SLUG_EXISTS");

  const album = await prisma.mediaAlbum.create({
    data: {
      title: input.title.trim(),
      slug,
      description: input.description ?? null,
      albumType: input.albumType ?? "gallery",
      locale,
      edition: input.edition ?? null,
      year: input.year ?? null,
      status: input.status ?? "draft",
      sortOrder: input.sortOrder ?? 0,
      items: input.items?.length
        ? {
            create: input.items.map((item, index) => ({
              mediaAssetId: item.mediaAssetId ?? null,
              imageUrl: item.imageUrl ?? null,
              caption: item.caption ?? null,
              altText: item.altText ?? null,
              sortOrder: item.sortOrder ?? index,
            })),
          }
        : undefined,
    },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "media_albums",
    entityId: album.id,
    payload: { event: "album_created", slug },
  });

  return album;
}

export async function updateMediaAlbum(
  id: string,
  input: Partial<{
    title: string;
    slug: string;
    description: string;
    albumType: AlbumType;
    edition: string;
    year: number;
    status: PageStatus;
    sortOrder: number;
    items: Array<{
      id?: string;
      mediaAssetId?: string;
      imageUrl?: string;
      caption?: string;
      altText?: string;
      sortOrder?: number;
    }>;
  }>
) {
  const existing = await prisma.mediaAlbum.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Album not found", 404, "NOT_FOUND");

  const { items, ...rest } = input;
  const album = await prisma.mediaAlbum.update({
    where: { id },
    data: {
      ...(rest.title !== undefined ? { title: rest.title.trim() } : {}),
      ...(rest.slug !== undefined ? { slug: rest.slug } : {}),
      ...(rest.description !== undefined ? { description: rest.description } : {}),
      ...(rest.albumType !== undefined ? { albumType: rest.albumType } : {}),
      ...(rest.edition !== undefined ? { edition: rest.edition } : {}),
      ...(rest.year !== undefined ? { year: rest.year } : {}),
      ...(rest.status !== undefined ? { status: rest.status } : {}),
      ...(rest.sortOrder !== undefined ? { sortOrder: rest.sortOrder } : {}),
    },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  if (items) {
    await prisma.mediaAlbumItem.deleteMany({ where: { albumId: id } });
    if (items.length) {
      await prisma.mediaAlbumItem.createMany({
        data: items.map((item, index) => ({
          albumId: id,
          mediaAssetId: item.mediaAssetId ?? null,
          imageUrl: item.imageUrl ?? null,
          caption: item.caption ?? null,
          altText: item.altText ?? null,
          sortOrder: item.sortOrder ?? index,
        })),
      });
    }
  }

  return getMediaAlbum(id);
}

export async function deleteMediaAlbum(id: string) {
  const existing = await prisma.mediaAlbum.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Album not found", 404, "NOT_FOUND");

  await prisma.mediaAlbum.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived" },
  });

  return { success: true };
}

export async function listPublicMediaAlbums(options: {
  albumType?: AlbumType;
  locale?: ContentLocale;
  limit?: number;
} = {}) {
  const items = await prisma.mediaAlbum.findMany({
    where: {
      deletedAt: null,
      status: "published",
      ...(options.albumType ? { albumType: options.albumType } : {}),
      ...(options.locale ? { locale: options.locale } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: options.limit ?? 20,
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          mediaAsset: { select: { publicUrl: true, altText: true, originalName: true } },
        },
      },
    },
  });

  return items.filter((album) => isPublishedStatus(album.status, null));
}

export async function getPublicMediaAlbumBySlug(slug: string, locale: ContentLocale = "en") {
  const album = await prisma.mediaAlbum.findFirst({
    where: { slug, locale, deletedAt: null, status: "published" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          mediaAsset: { select: { publicUrl: true, altText: true, originalName: true } },
        },
      },
    },
  });
  if (!album || !isPublishedStatus(album.status, null)) return null;
  return album;
}

export function albumItemImageUrl(item: {
  imageUrl: string | null;
  mediaAsset: { publicUrl: string | null } | null;
}) {
  return item.imageUrl ?? item.mediaAsset?.publicUrl ?? null;
}
