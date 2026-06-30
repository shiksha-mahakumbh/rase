import { NextRequest, NextResponse } from "next/server";
import { adminBinaryGuard } from "@/server/lib/admin-binary-guard";
import { getAdminActorUid } from "@/server/lib/admin-rbac";
import { prisma } from "@/server/db/prisma";
import type { DocumentLetterType } from "@prisma/client";
import { generateDocument } from "@/server/services/ops/document-generation.service";
import { writeAuditLog } from "@/server/services/audit.service";
import { toErrorResponse } from "@/server/lib/errors";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const blocked = await adminBinaryGuard(request, {
    rateLimitKey: "admin-doc-dl",
    limit: 60,
    mutation: true,
  });
  if (blocked) return blocked;

  try {
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

    await writeAuditLog({
      action: "admin_action",
      entityType: "generated_documents",
      entityId: doc.id,
      registrationId: doc.registrationId ?? undefined,
      actorUserId: getAdminActorUid(request),
      payload: { event: "document_downloaded", title: doc.title },
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
