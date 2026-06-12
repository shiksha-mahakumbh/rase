import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import type { UploadedFileMeta } from "@/types/registration";
import { isSupportedType } from "@/server/lib/registration-types";
import { uploadFile, type UploadBucket } from "@/server/services/storage.service";

const TYPE_BUCKET_MAP: Record<string, UploadBucket> = {
  Volunteer: "resumes",
  Talent: "resumes",
  NGO: "registrations",
  "Paper Submission": "papers",
  "Abstract Submission": "papers",
  "Best Practices": "registrations",
  Projects: "registrations",
  "School Program": "registrations",
};

function resolveBucket(registrationType: string): UploadBucket {
  return TYPE_BUCKET_MAP[registrationType] ?? "registrations";
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
    const registrationId = formData.get("registrationId")?.toString();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (typeof registrationType !== "string" || !isSupportedType(registrationType)) {
      return NextResponse.json({ error: "Invalid registration type" }, { status: 400 });
    }

    if (typeof field !== "string" || !field.trim()) {
      return NextResponse.json({ error: "Field name is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = resolveBucket(registrationType);

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

    return NextResponse.json({ success: true, file: uploaded });
  } catch (error) {
    console.error("registration upload error:", error);
    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}
