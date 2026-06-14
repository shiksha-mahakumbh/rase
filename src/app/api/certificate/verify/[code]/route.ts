import { NextRequest, NextResponse } from "next/server";
import { verifyCertificate } from "@/server/services/lifecycle/badge-certificate.service";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const ip = getClientIp(request);
  const limited = rateLimit({ key: `cert-verify:${ip}`, limit: 60, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { code } = await context.params;
  const result = await verifyCertificate(code);
  if (!result) {
    return NextResponse.json({ valid: false, error: "Certificate not found or revoked" }, { status: 404 });
  }
  return NextResponse.json(result);
}
