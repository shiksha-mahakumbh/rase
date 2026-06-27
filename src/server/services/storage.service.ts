import type { StorageBucket } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSupabaseAdmin } from "@/server/db/supabase";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { assertFileMagicBytes } from "@/lib/security/file-validation";

const MAX_BYTES = 10 * 1024 * 1024;

function inferMimeType(fileName: string, reportedType: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const byExt: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    mp4: "video/mp4",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv",
  };
  if (reportedType && reportedType !== "application/octet-stream" && MIME_ALLOWLIST.has(reportedType)) {
    return reportedType;
  }
  return byExt[ext] ?? reportedType ?? "application/octet-stream";
}

const MIME_ALLOWLIST = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/plain",
]);

export type UploadBucket =
  | "registrations"
  | "resumes"
  | "papers"
  | "brochures"
  | "media"
  | "committee"
  | "downloads";

const BUCKET_MAP: Record<UploadBucket, StorageBucket> = {
  registrations: "registrations",
  resumes: "registrations",
  papers: "documents",
  brochures: "brochures",
  media: "gallery",
  committee: "committee",
  downloads: "documents",
};

export function mapUploadBucket(bucket: UploadBucket): StorageBucket {
  return BUCKET_MAP[bucket];
}

export function validateUploadFile(file: {
  name: string;
  type: string;
  size: number;
}) {
  if (!file.name || file.size <= 0) {
    throw new ServiceError("File is required", 400, "FILE_REQUIRED");
  }
  if (file.size > MAX_BYTES) {
    throw new ServiceError("File exceeds 10 MB limit", 400, "FILE_TOO_LARGE");
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowedExt = new Set([
    "pdf", "jpg", "jpeg", "png", "webp", "gif", "mp4", "doc", "docx", "xls", "xlsx", "csv",
  ]);
  if (!allowedExt.has(ext)) {
    throw new ServiceError("File type not allowed", 400, "FILE_TYPE_DENIED");
  }
  const resolvedType = inferMimeType(file.name, file.type);
  if (!MIME_ALLOWLIST.has(resolvedType)) {
    throw new ServiceError("MIME type not allowed", 400, "MIME_DENIED");
  }
}

/** Pre-upload validation hook — extend with ClamAV when available. */
export async function virusScanHook(file: Buffer, fileName: string): Promise<void> {
  assertFileMagicBytes(file, fileName);
  if (process.env.CLAMAV_SCAN_URL) {
    try {
      const res = await fetch(process.env.CLAMAV_SCAN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream", "X-Filename": fileName },
        body: file,
      });
      if (!res.ok) {
        throw new ServiceError("Virus scan failed", 503, "SCAN_UNAVAILABLE");
      }
      const result = (await res.json()) as { clean?: boolean };
      if (result.clean === false) {
        throw new ServiceError("File rejected by virus scan", 400, "FILE_INFECTED");
      }
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      console.error("[virusScanHook] external scanner unavailable:", error);
    }
  }
}

export async function uploadFile(options: {
  bucket: UploadBucket;
  file: Buffer;
  fileName: string;
  contentType: string;
  fieldName?: string;
  registrationId?: string;
  uploadedById?: string;
  ipAddress?: string | null;
}) {
  validateUploadFile({
    name: options.fileName,
    type: inferMimeType(options.fileName, options.contentType),
    size: options.file.length,
  });
  await virusScanHook(options.file, options.fileName);

  const storageBucket = mapUploadBucket(options.bucket);
  const safeName = options.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${options.bucket}/${Date.now()}-${safeName}`;
  const contentType = inferMimeType(options.fileName, options.contentType);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(options.bucket)
    .upload(storagePath, options.file, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new ServiceError("File upload failed", 500, "UPLOAD_FAILED");
  }

  const previous = options.registrationId
    ? await prisma.uploadedFile.findFirst({
        where: {
          registrationId: options.registrationId,
          fieldName: options.fieldName ?? "file",
          isCurrent: true,
        },
      })
    : null;

  const version = (previous?.version ?? 0) + 1;
  if (previous) {
    await prisma.uploadedFile.update({
      where: { id: previous.id },
      data: { isCurrent: false },
    });
  }

  const record = await prisma.uploadedFile.create({
    data: {
      registrationId: options.registrationId ?? null,
      bucket: storageBucket,
      storagePath,
      fieldName: options.fieldName ?? "file",
      originalName: options.fileName,
      contentType: options.contentType,
      sizeBytes: options.file.length,
      version,
      isCurrent: true,
      uploadedById: options.uploadedById ?? null,
      metadata: { uploadBucket: options.bucket },
    },
  });

  const signedUrl = await getSignedUrl(options.bucket, storagePath);

  await writeAuditLog({
    action: "file_uploaded",
    registrationId: options.registrationId ?? null,
    entityType: "uploaded_files",
    entityId: record.id,
    ipAddress: options.ipAddress ?? null,
    payload: { bucket: options.bucket, storagePath, fileName: options.fileName },
  });

  return { record, storagePath, signedUrl };
}

export async function deleteFile(options: {
  bucket: UploadBucket;
  storagePath: string;
  fileId?: string;
  ipAddress?: string | null;
}) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(options.bucket).remove([options.storagePath]);
  if (error) {
    throw new ServiceError("File delete failed", 500, "DELETE_FAILED");
  }

  if (options.fileId) {
    await prisma.uploadedFile.update({
      where: { id: options.fileId },
      data: { deletedAt: new Date(), isCurrent: false },
    });
  }

  await writeAuditLog({
    action: "file_deleted",
    entityType: "uploaded_files",
    entityId: options.fileId ?? null,
    ipAddress: options.ipAddress ?? null,
    payload: { bucket: options.bucket, storagePath: options.storagePath },
  });

  return { success: true };
}

export async function getSignedUrl(bucket: UploadBucket, storagePath: string, expiresInSec = 3600) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresInSec);
  if (error || !data?.signedUrl) {
    throw new ServiceError("Signed URL generation failed", 500, "SIGNED_URL_FAILED");
  }
  return data.signedUrl;
}
