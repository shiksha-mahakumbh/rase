import { NextRequest, NextResponse } from "next/server";
import { getAdminStorage } from "@/lib/firebase-admin";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import {
  REGISTRATION_TYPE_OPTIONS,
  type RegistrationType,
  type UploadedFileMeta,
} from "@/types/registration";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".xlsx",
  ".xls",
]);

function isRegistrationType(value: unknown): value is RegistrationType {
  return (
    typeof value === "string" &&
    (REGISTRATION_TYPE_OPTIONS as readonly string[]).includes(value)
  );
}

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
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

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const registrationType = formData.get("registrationType");
    const field = formData.get("field");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!isRegistrationType(registrationType)) {
      return NextResponse.json(
        { error: "Invalid registration type" },
        { status: 400 }
      );
    }

    if (typeof field !== "string" || !field.trim()) {
      return NextResponse.json({ error: "Field name is required" }, { status: 400 });
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be between 1 byte and 10 MB" },
        { status: 400 }
      );
    }

    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported MIME type" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `registrations/${registrationType}/${field}/${Date.now()}_${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const bucket = getAdminStorage().bucket();
    const storageFile = bucket.file(storagePath);

    await storageFile.save(buffer, {
      metadata: {
        contentType: file.type || "application/octet-stream",
        metadata: {
          registrationType,
          field,
        },
      },
    });

    const [signedUrl] = await storageFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
    });

    const result: UploadedFileMeta = {
      name: file.name,
      url: signedUrl,
      path: storagePath,
      contentType: file.type || undefined,
      size: file.size,
    };

    return NextResponse.json({ success: true, file: result });
  } catch (error) {
    console.error("registration upload error:", error);
    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}
