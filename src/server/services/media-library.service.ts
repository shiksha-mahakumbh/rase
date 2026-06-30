import type { MediaAssetType, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSupabaseAdmin } from "@/server/db/supabase";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify } from "@/server/lib/cms-utils";

const MAX_BYTES = 10 * 1024 * 1024;
const STORAGE_BUCKET = "media";

export function buildMediaPublicUrl(storagePath: string): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}

function resolveAssetPublicUrl(asset: { storagePath: string; publicUrl: string | null }): string | null {
  return buildMediaPublicUrl(asset.storagePath) ?? asset.publicUrl;
}

const MIME_MAP: Record<string, MediaAssetType> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "application/pdf": "pdf",
  "video/mp4": "video",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
};

function detectAssetType(mimeType: string, fileName: string): MediaAssetType {
  if (MIME_MAP[mimeType]) return MIME_MAP[mimeType];
  if (fileName.toLowerCase().includes("brochure")) return "brochure";
  return "other";
}

export async function createFolder(input: {
  name: string;
  slug?: string;
  parentId?: string;
  sortOrder?: number;
}) {
  const slug = input.slug ?? slugify(input.name);
  return prisma.mediaFolder.create({
    data: {
      name: input.name,
      slug,
      parentId: input.parentId ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function listFolders(parentId?: string | null) {
  return prisma.mediaFolder.findMany({
    where: { parentId: parentId ?? null, deletedAt: null },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { assets: true } } },
  });
}

export async function uploadMediaAsset(input: {
  file: Buffer;
  fileName: string;
  mimeType: string;
  folderId?: string;
  altText?: string;
  tags?: string[];
  uploadedById?: string;
  ipAddress?: string | null;
}) {
  if (input.file.length > MAX_BYTES) {
    throw new ServiceError("File exceeds 10 MB limit", 400, "FILE_TOO_LARGE");
  }

  const assetType = detectAssetType(input.mimeType, input.fileName);
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `library/${Date.now()}-${safeName}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, input.file, { contentType: input.mimeType, upsert: false });

  if (error) throw new ServiceError("Media upload failed", 500, "UPLOAD_FAILED");

  const publicUrl = buildMediaPublicUrl(storagePath);

  const previous = await prisma.mediaAsset.findFirst({
    where: {
      originalName: input.fileName,
      folderId: input.folderId ?? null,
      isCurrent: true,
      deletedAt: null,
    },
  });

  const version = (previous?.version ?? 0) + 1;
  if (previous) {
    await prisma.mediaAsset.update({
      where: { id: previous.id },
      data: { isCurrent: false },
    });
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      folderId: input.folderId ?? null,
      fileName: safeName,
      originalName: input.fileName,
      storagePath,
      publicUrl,
      mimeType: input.mimeType,
      assetType,
      sizeBytes: input.file.length,
      altText: input.altText ?? null,
      tags: input.tags ?? [],
      version,
      isCurrent: true,
      uploadedById: input.uploadedById ?? null,
    },
  });

  if (previous) {
    await prisma.mediaAsset.update({
      where: { id: previous.id },
      data: { replacedById: asset.id },
    });
  }

  await writeAuditLog({
    action: "media_asset_created",
    entityType: "media_assets",
    entityId: asset.id,
    ipAddress: input.ipAddress ?? null,
    payload: { fileName: input.fileName, assetType },
  });

  return withMediaFileUrl(asset);
}

export function withMediaFileUrl<T extends { storagePath: string; publicUrl: string | null }>(
  asset: T
): T & { fileUrl: string | null } {
  const fileUrl = resolveAssetPublicUrl(asset);
  return { ...asset, publicUrl: fileUrl, fileUrl };
}

export async function replaceMediaAsset(
  assetId: string,
  input: {
    file: Buffer;
    fileName: string;
    mimeType: string;
    uploadedById?: string;
    ipAddress?: string | null;
  }
) {
  const existing = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
  if (!existing) throw new ServiceError("Asset not found", 404);

  return uploadMediaAsset({
    ...input,
    folderId: existing.folderId ?? undefined,
    altText: existing.altText ?? undefined,
    tags: existing.tags,
    uploadedById: input.uploadedById,
    ipAddress: input.ipAddress,
  });
}

export async function deleteMediaAsset(id: string, ipAddress?: string | null) {
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) throw new ServiceError("Asset not found", 404);

  const supabase = getSupabaseAdmin();
  await supabase.storage.from(STORAGE_BUCKET).remove([asset.storagePath]);

  await prisma.mediaAsset.update({
    where: { id },
    data: { deletedAt: new Date(), isCurrent: false },
  });

  await writeAuditLog({
    action: "media_asset_deleted",
    entityType: "media_assets",
    entityId: id,
    ipAddress: ipAddress ?? null,
    payload: { fileName: asset.originalName },
  });

  return { success: true };
}

export async function searchMediaAssets(options: {
  query?: string;
  folderId?: string;
  assetType?: MediaAssetType;
  tags?: string[];
  limit?: number;
  offset?: number;
}) {
  const { limit = 30, offset = 0, query, folderId, assetType, tags } = options;
  const where: Prisma.MediaAssetWhereInput = {
    deletedAt: null,
    isCurrent: true,
    ...(folderId ? { folderId } : {}),
    ...(assetType ? { assetType } : {}),
    ...(tags?.length ? { tags: { hasSome: tags } } : {}),
    ...(query
      ? {
          OR: [
            { originalName: { contains: query, mode: "insensitive" } },
            { fileName: { contains: query, mode: "insensitive" } },
            { altText: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: { folder: true },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return {
    items: items.map((asset) => withMediaFileUrl(asset)),
    total,
    limit,
    offset,
  };
}

export async function trackMediaUsage(assetId: string) {
  return prisma.mediaAsset.update({
    where: { id: assetId },
    data: { usageCount: { increment: 1 } },
  });
}

export async function getSignedMediaUrl(assetId: string, expiresInSec = 3600) {
  const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
  if (!asset) throw new ServiceError("Asset not found", 404);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(asset.storagePath, expiresInSec);

  if (error || !data?.signedUrl) {
    throw new ServiceError("Signed URL failed", 500);
  }

  return data.signedUrl;
}
