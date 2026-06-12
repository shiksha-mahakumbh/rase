import type { MediaType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { uploadFile, deleteFile, type UploadBucket } from "@/server/services/storage.service";
import { writeAuditLog } from "@/server/services/audit.service";

export async function uploadMedia(input: {
  file: Buffer;
  fileName: string;
  contentType: string;
  mediaType: MediaType;
  title?: string;
  category?: string;
  eventId?: string;
  isFeatured?: boolean;
  ipAddress?: string | null;
}) {
  const bucket: UploadBucket = input.mediaType === "document" ? "downloads" : "media";
  const uploaded = await uploadFile({
    bucket,
    file: input.file,
    fileName: input.fileName,
    contentType: input.contentType,
    fieldName: "media",
    ipAddress: input.ipAddress,
  });

  const row = await prisma.eventMedia.create({
    data: {
      eventId: input.eventId ?? null,
      mediaType: input.mediaType,
      title: input.title ?? input.fileName,
      url: uploaded.signedUrl,
      storagePath: uploaded.storagePath,
      category: input.category ?? null,
      isFeatured: input.isFeatured ?? false,
    },
  });

  await writeAuditLog({
    action: "file_uploaded",
    entityType: "event_media",
    entityId: row.id,
    ipAddress: input.ipAddress ?? null,
    payload: { mediaType: input.mediaType, title: row.title },
  });

  return { media: row, upload: uploaded };
}

export async function deleteMedia(id: string, ipAddress?: string | null) {
  const row = await prisma.eventMedia.findUnique({ where: { id } });
  if (!row) return null;

  if (row.storagePath) {
    await deleteFile({
      bucket: "media",
      storagePath: row.storagePath,
      fileId: undefined,
      ipAddress,
    });
  }

  await prisma.eventMedia.update({ where: { id }, data: { deletedAt: new Date() } });
  return row;
}

export async function listMedia(options: {
  mediaType?: MediaType;
  category?: string;
  featuredOnly?: boolean;
  limit?: number;
}) {
  const where = {
    deletedAt: null,
    ...(options.mediaType ? { mediaType: options.mediaType } : {}),
    ...(options.category ? { category: options.category } : {}),
    ...(options.featuredOnly ? { isFeatured: true } : {}),
  };
  return prisma.eventMedia.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: options.limit ?? 50,
  });
}
