import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import type { UploadedFileMeta } from "@/types/registration";
import { isSupportedType } from "@/server/lib/registration-types";
import { uploadFile } from "@/server/services/storage.service";
import { resolveRegistrationUploadBucket } from "@/server/lib/registration-upload-bucket";
import { ServiceError } from "@/server/lib/errors";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `registration-upload:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  let registrationType = "";
  let field = "";

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const typeField = formData.get("registrationType");
    const fieldName = formData.get("field");
    const registrationId = formData.get("registrationId")?.toString();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (typeof typeField !== "string" || !isSupportedType(typeField)) {
      return NextResponse.json({ error: "Invalid registration type" }, { status: 400 });
    }
    registrationType = typeField;

    if (typeof fieldName !== "string" || !fieldName.trim()) {
      return NextResponse.json({ error: "Field name is required" }, { status: 400 });
    }
    field = fieldName;

    console.info("FILE_UPLOAD_START", {
      registrationType,
      field,
      fileName: file.name,
      size: file.size,
      contentType: file.type || null,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = resolveRegistrationUploadBucket(registrationType);

    const result = await uploadFile({
      bucket,
      file: buffer,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      fieldName: field,
      registrationId,
      ipAddress: ip,
    });

    const uploaded: UploadedFileMeta = {
      name: file.name,
      url: result.signedUrl,
      path: result.storagePath,
      contentType: file.type || undefined,
      size: file.size,
    };

    console.info("FILE_UPLOAD_SUCCESS", {
      registrationType,
      field,
      fileName: file.name,
      storagePath: result.storagePath,
      bytes: file.size,
    });

    return NextResponse.json({ success: true, file: uploaded });
  } catch (error) {
    const message = error instanceof ServiceError ? error.message : "File upload failed";
    const code = error instanceof ServiceError ? error.code : "UPLOAD_FAILED";
    console.error("FILE_UPLOAD_FAILED", {
      registrationType: registrationType || null,
      field: field || null,
      error: message,
      code,
    });
    return NextResponse.json(
      { error: "File upload failed. Please try again.", detail: message, code },
      { status: error instanceof ServiceError ? error.status : 500 }
    );
  }
}
