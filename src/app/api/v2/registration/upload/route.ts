import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { uploadFile } from "@/server/services/storage.service";
import { isSupportedType } from "@/server/lib/registration-types";
import { resolveRegistrationUploadBucket } from "@/server/lib/registration-upload-bucket";
import { ServiceError } from "@/server/lib/errors";
import { verifyUploadToken } from "@/lib/security/upload-token";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const form = await request.formData();
    const file = form.get("file");
    const registrationType = String(form.get("registrationType") ?? "");
    const fieldName = String(form.get("field") ?? "file");
    const registrationId = form.get("registrationId")?.toString();
    const uploadToken = String(form.get("uploadToken") ?? "").trim();

    if (!verifyUploadToken(uploadToken)) {
      throw new ServiceError(
        "Valid upload authorization required — complete captcha verification first",
        403,
        "UPLOAD_FORBIDDEN"
      );
    }

    if (!registrationType || !isSupportedType(registrationType)) {
      throw new ServiceError("Invalid registration type", 400, "INVALID_TYPE");
    }
    if (!fieldName.trim()) {
      throw new ServiceError("Field name is required", 400, "INVALID_FIELD");
    }
    if (!(file instanceof File)) throw new ServiceError("File is required", 400);

    const bucket = resolveRegistrationUploadBucket(registrationType);

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
      bucket,
      file: {
        name: file.name,
        url: result.signedUrl,
        path: result.storagePath,
        contentType: file.type || undefined,
        size: file.size,
      },
    };
  },
  { rateLimitKey: "v2-registration-upload", limit: 30 }
);
