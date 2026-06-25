import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { generateBadgePdf } from "@/server/services/lifecycle/badge-certificate.service";
import type { BadgeTemplate } from "@prisma/client";
import { toErrorResponse } from "@/server/lib/errors";

async function guard(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({ key: `admin-badge:${ip}`, limit: 60, windowMs: 60_000 });
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
