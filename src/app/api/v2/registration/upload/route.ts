import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { uploadFile, type UploadBucket } from "@/server/services/storage.service";
import { ServiceError } from "@/server/lib/errors";

const BUCKETS = new Set<UploadBucket>([
  "registrations",
  "resumes",
  "papers",
  "brochures",
  "media",
  "committee",
  "downloads",
]);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const form = await request.formData();
    const file = form.get("file");
    const bucket = String(form.get("bucket") ?? "registrations") as UploadBucket;
    const fieldName = String(form.get("field") ?? "file");
    const registrationId = form.get("registrationId")?.toString();

    if (!BUCKETS.has(bucket)) throw new ServiceError("Invalid bucket", 400);
    if (!(file instanceof File)) throw new ServiceError("File is required", 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const ctx = getRequestContext(request);

    const result = await uploadFile({
      bucket,
      file: buffer,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      fieldName,
      registrationId,
      ipAddress: ctx.ip,
    });

    return {
      success: true,
      fileId: result.record.id,
      storagePath: result.storagePath,
      url: result.signedUrl,
    };
  },
  { rateLimitKey: "v2-registration-upload", limit: 30 }
);
