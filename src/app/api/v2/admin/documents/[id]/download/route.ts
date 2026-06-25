import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { prisma } from "@/server/db/prisma";
import type { DocumentLetterType } from "@prisma/client";
import { generateDocument } from "@/server/services/ops/document-generation.service";
import { toErrorResponse } from "@/server/lib/errors";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({ key: `admin-doc-dl:${ip}`, limit: 60, windowMs: 60_000 });
  if (!limited.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const { requireAdminSecret } = await import("@/server/lib/admin-guard");
    const { assertAdminRoles, ADMIN_MANAGE_ROLES } = await import("@/server/lib/admin-rbac");
    requireAdminSecret(request);
    assertAdminRoles(request, ADMIN_MANAGE_ROLES);

    const { id } = await context.params;
    const doc = await prisma.generatedDocument.findUnique({ where: { id } });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const reg = doc.registrationId
      ? await prisma.registration.findUnique({ where: { id: doc.registrationId } })
      : null;

    const { pdf } = await generateDocument({
      documentType: doc.documentType as DocumentLetterType,
      registrationId: reg?.registrationId,
      vars: (doc.metadata as Record<string, string>) ?? {},
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${doc.title.replace(/\s+/g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    const mapped = toErrorResponse(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
