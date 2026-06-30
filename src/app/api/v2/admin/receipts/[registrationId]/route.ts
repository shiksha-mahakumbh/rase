import { NextRequest, NextResponse } from "next/server";
import { adminBinaryGuard } from "@/server/lib/admin-binary-guard";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { toErrorResponse } from "@/server/lib/errors";
import {
  regenerateReceipt,
  regenerateQr,
  renderReceiptPdf,
  renderQrPng,
} from "@/server/services/admin/receipt-admin.service";
export { runtime, maxDuration } from "@/lib/server/pdf-api-route";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ registrationId: string }> }
) {
  const blocked = await adminBinaryGuard(request, { rateLimitKey: "admin-receipt", limit: 120 });
  if (blocked) return blocked;

  try {
    const { registrationId } = await context.params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "receipt";

    if (type === "qr") {
      const { qr } = await renderQrPng(registrationId);
      return new NextResponse(new Uint8Array(qr), {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="qr-${registrationId}.png"`,
        },
      });
    }

    const { pdf } = await renderReceiptPdf(registrationId);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${registrationId}.pdf"`,
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
    rateLimitKey: "admin-receipt-mutate",
    limit: 60,
    mutation: true,
  });
  if (blocked) return blocked;

  try {
    const { registrationId } = await context.params;
    const actorUserId = getAdminActorUid(request) ?? undefined;
    const body = (await request.json().catch(() => ({}))) as { type?: string };
    if (body.type === "qr") {
      const result = await regenerateQr(registrationId, actorUserId);
      return NextResponse.json({
        success: true,
        registrationId: result.registrationId,
        path: result.path,
        generatedAt: result.generatedAt.toISOString(),
      });
    }
    const result = await regenerateReceipt(registrationId, actorUserId);
    return NextResponse.json({
      success: true,
      registrationId: result.registrationId,
      generatedAt: result.generatedAt.toISOString(),
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
