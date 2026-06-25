import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { generateCertificatePdf } from "@/server/services/lifecycle/badge-certificate.service";
import { toErrorResponse } from "@/server/lib/errors";

async function guard(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({ key: `admin-cert:${ip}`, limit: 30, windowMs: 60_000 });
  if (!limited.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const { requireAdminSecret } = await import("@/server/lib/admin-guard");
  const { assertAdminRoles, ADMIN_EXPORT_ROLES } = await import("@/server/lib/admin-rbac");
  requireAdminSecret(request);
  assertAdminRoles(request, ADMIN_EXPORT_ROLES);
  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ registrationId: string }> }
) {
  const blocked = await guard(request);
  if (blocked) return blocked;
  try {
    const { registrationId } = await context.params;
    const { pdf, certificateNo } = await generateCertificatePdf(registrationId);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${certificateNo}.pdf"`,
      },
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ registrationId: string }> }
) {
  const blocked = await guard(request);
  if (blocked) return blocked;
  try {
    const { registrationId } = await context.params;
    const result = await generateCertificatePdf(registrationId);
    return NextResponse.json({
      success: true,
      certificateNo: result.certificateNo,
      verifyCode: result.verifyCode,
      registrationId: result.registrationId,
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
