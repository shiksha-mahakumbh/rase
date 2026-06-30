import { NextRequest, NextResponse } from "next/server";
import { adminBinaryGuard } from "@/server/lib/admin-binary-guard";
import { generateBadgePdf } from "@/server/services/lifecycle/badge-certificate.service";
import type { BadgeTemplate } from "@prisma/client";
import { toErrorResponse } from "@/server/lib/errors";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ registrationId: string }> }
) {
  const blocked = await adminBinaryGuard(request, { rateLimitKey: "admin-badge", limit: 60 });
  if (blocked) return blocked;
  try {
    const { registrationId } = await context.params;
    const template = request.nextUrl.searchParams.get("template") as BadgeTemplate | null;
    const { pdf } = await generateBadgePdf(registrationId, template ?? undefined);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="badge-${registrationId}.pdf"`,
      },
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
