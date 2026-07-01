import { NextRequest, NextResponse } from "next/server";
import { adminBinaryGuard } from "@/server/lib/admin-binary-guard";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { generateCertificatePdf } from "@/server/services/lifecycle/badge-certificate.service";
import { toErrorResponse } from "@/server/lib/errors";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ registrationId: string }> }
) {
  const blocked = await adminBinaryGuard(request, {
    rateLimitKey: "admin-cert",
    limit: 30,
    permission: "registrations.export",
  });
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
  const blocked = await adminBinaryGuard(request, {
    rateLimitKey: "admin-cert-mutate",
    limit: 30,
    mutation: true,
    permission: "registrations.update",
  });
  if (blocked) return blocked;
  try {
    const { registrationId } = await context.params;
    const actorUserId = getAdminActorUid(request) ?? undefined;
    const result = await generateCertificatePdf(registrationId, undefined, actorUserId);
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
