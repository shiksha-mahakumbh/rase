import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { createUploadToken } from "@/lib/security/upload-token";

export async function handleVerifyCaptchaPost(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, action } = body as { token?: string; action?: string };

    const result = await verifyRecaptchaToken(token, action ?? "registration");

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      score: result.score,
      uploadToken: createUploadToken(),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
