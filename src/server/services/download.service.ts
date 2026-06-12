import type { DownloadStatus, DownloadType, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { uploadFile, deleteFile } from "@/server/services/storage.service";
import { writeAuditLog } from "@/server/services/audit.service";
import { upsertSeoForEntity, buildWebPageSchema } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isDownloadVisible } from "@/server/lib/cms-utils";

export type CreateDownloadInput = {
  title: string;
  slug?: string;
  description?: string;
  category?: string;
  downloadType?: DownloadType;
  tags?: string[];
  expiresAt?: Date;
  sortOrder?: number;
  mediaAssetId?: string;
  file: Buffer;
  fileName: string;
  contentType: string;
  ipAddress?: string | null;
  seo?: {
    seoTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
};

function publicDownloadWhere(now = new Date()): Prisma.DownloadWhereInput {
  return {
    deletedAt: null,
    isPublished: true,
    isCurrent: true,
    status: "published",
    AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
  };
}

export async function createDownload(input: CreateDownloadInput) {
  const uploaded = await uploadFile({
    bucket: "downloads",
    file: input.file,
    fileName: input.fileName,
    contentType: input.contentType,
    fieldName: "download",
    ipAddress: input.ipAddress,
  });

  const slug = input.slug ?? slugify(input.title);

  const row = await prisma.download.create({
    data: {
      title: input.title,
      slug,
      description: input.description ?? null,
      category: input.category ?? null,
      downloadType: input.downloadType ?? "other",
      tags: input.tags ?? [],
      expiresAt: input.expiresAt ?? null,
      sortOrder: input.sortOrder ?? 0,
      mediaAssetId: input.mediaAssetId ?? null,
      fileUrl: uploaded.signedUrl,
      storagePath: uploaded.storagePath,
      status: "published",
      isPublished: true,
    },
  });

  if (input.seo) {
    await upsertSeoForEntity({
      entityType: "download",
      entityId: row.id,
      ...input.seo,
      canonicalUrl: input.seo.canonicalUrl ?? `/downloads#${slug}`,
      schemaJsonLd: buildWebPageSchema({
        title: row.title,
        description: row.description ?? undefined,
        url: `/downloads#${slug}`,
      }),
    });
  }

  await writeAuditLog({
    action: "file_uploaded",
    entityType: "downloads",
    entityId: row.id,
    ipAddress: input.ipAddress ?? null,
    payload: { title: row.title },
  });

  return { download: row, upload: uploaded };
}

export async function replaceDownload(
  id: string,
  input: {
    file: Buffer;
    fileName: string;
    contentType: string;
    ipAddress?: string | null;
  }
) {
  const existing = await prisma.download.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    throw new ServiceError("Download not found", 404, "NOT_FOUND");
  }

  const uploaded = await uploadFile({
    bucket: "downloads",
    file: input.file,
    fileName: input.fileName,
    contentType: input.contentType,
    fieldName: "download",
    ipAddress: input.ipAddress,
  });

  await prisma.download.update({
    where: { id },
    data: { isCurrent: false },
  });

  const newVersion = await prisma.download.create({
    data: {
      title: existing.title,
      slug: existing.slug,
      description: existing.description,
      category: existing.category,
      downloadType: existing.downloadType,
      tags: existing.tags,
      expiresAt: existing.expiresAt,
      sortOrder: existing.sortOrder,
      mediaAssetId: existing.mediaAssetId,
      fileUrl: uploaded.signedUrl,
      storagePath: uploaded.storagePath,
      version: existing.version + 1,
      isCurrent: true,
      status: existing.status,
      isPublished: existing.isPublished,
      downloadCount: 0,
      replacedById: null,
    },
  });

  await prisma.download.update({
    where: { id },
    data: { replacedById: newVersion.id },
  });

  await writeAuditLog({
    action: "download_updated",
    entityType: "downloads",
    entityId: newVersion.id,
    ipAddress: input.ipAddress ?? null,
    payload: { version: newVersion.version, replacedId: id },
  });

  return { download: newVersion, upload: uploaded, previousId: id };
}

export async function updateDownload(
  id: string,
  data: Prisma.DownloadUpdateInput & {
    seo?: CreateDownloadInput["seo"];
  },
  ipAddress?: string | null
) {
  const { seo, ...downloadData } = data;
  const row = await prisma.download.update({ where: { id }, data: downloadData });

  if (seo) {
    await upsertSeoForEntity({
      entityType: "download",
      entityId: row.id,
      ...seo,
      canonicalUrl: seo.canonicalUrl ?? `/downloads#${row.slug ?? row.id}`,
    });
  }

  await writeAuditLog({
    action: "download_updated",
    entityType: "downloads",
    entityId: row.id,
    ipAddress: ipAddress ?? null,
    payload: { title: row.title },
  });

  return row;
}

export async function deleteDownload(id: string, ipAddress?: string | null) {
  const row = await prisma.download.findUnique({ where: { id } });
  if (!row) return null;

  if (row.storagePath) {
    await deleteFile({ bucket: "downloads", storagePath: row.storagePath, ipAddress });
  }

  await prisma.download.update({
    where: { id },
    data: { deletedAt: new Date(), isCurrent: false, status: "archived" },
  });
  return row;
}

export async function listPublicDownloads(options?: {
  category?: string;
  downloadType?: DownloadType;
  tag?: string;
  limit?: number;
  offset?: number;
}) {
  const { limit = 50, offset = 0 } = options ?? {};
  const where: Prisma.DownloadWhereInput = {
    ...publicDownloadWhere(),
    ...(options?.category ? { category: options.category } : {}),
    ...(options?.downloadType ? { downloadType: options.downloadType } : {}),
    ...(options?.tag ? { tags: { has: options.tag } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.download.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.download.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function listDownloads(options?: {
  status?: DownloadStatus;
  downloadType?: DownloadType;
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}) {
  const { limit = 50, offset = 0, includeDeleted = false } = options ?? {};
  const where: Prisma.DownloadWhereInput = {
    ...(includeDeleted ? {} : { deletedAt: null }),
    isCurrent: true,
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.downloadType ? { downloadType: options.downloadType } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.download.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.download.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function getDownloadBySlug(slug: string) {
  const download = await prisma.download.findFirst({
    where: { slug, deletedAt: null, isCurrent: true },
  });

  if (!download || !isDownloadVisible(download)) return null;

  const seo = await prisma.seoMetadata.findFirst({
    where: { entityType: "download", entityId: download.id },
  });

  return { download, seo };
}

export async function getDownloadById(id: string) {
  const download = await prisma.download.findFirst({
    where: { id, deletedAt: null, isCurrent: true },
  });

  if (!download || !isDownloadVisible(download)) return null;

  const seo = await prisma.seoMetadata.findFirst({
    where: { entityType: "download", entityId: download.id },
  });

  return { download, seo };
}

export async function trackDownload(id: string) {
  const row = await prisma.download.findUnique({ where: { id } });
  if (!row || !isDownloadVisible(row)) {
    throw new ServiceError("Download not found", 404, "NOT_FOUND");
  }

  return prisma.download.update({
    where: { id },
    data: { downloadCount: { increment: 1 } },
  });
}
