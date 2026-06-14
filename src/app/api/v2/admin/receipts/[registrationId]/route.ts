import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { ServiceError, toErrorResponse } from "@/server/lib/errors";
import { regenerateReceipt, regenerateQr } from "@/server/services/admin/receipt-admin.service";

async function adminGuard(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `admin-receipt:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }
  const { requireAdminSecret } = await import("@/server/lib/admin-guard");
  requireAdminSecret(request);
  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ registrationId: string }> }
) {
  const blocked = await adminGuard(request);
  if (blocked) return blocked;

  try {
    const { registrationId } = await context.params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "receipt";

    if (type === "qr") {
      const { qr } = await regenerateQr(registrationId);
      return new NextResponse(new Uint8Array(qr), {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="qr-${registrationId}.png"`,
        },
      });
    }

    const { pdf } = await regenerateReceipt(registrationId);
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
  const blocked = await adminGuard(request);
  if (blocked) return blocked;

  try {
    const { registrationId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { type?: string };
    if (body.type === "qr") {
      const result = await regenerateQr(registrationId);
      return NextResponse.json({
        success: true,
        registrationId: result.registrationId,
        path: result.path,
        generatedAt: result.generatedAt.toISOString(),
      });
    }
    const result = await regenerateReceipt(registrationId);
    return NextResponse.json({
      success: true,
      registrationId: result.registrationId,
      generatedAt: result.generatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
