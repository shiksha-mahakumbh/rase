import { NextRequest } from "next/server";
import type { DocumentLetterType } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  generateDocument,
  bulkGenerateDocuments,
  listGeneratedDocuments,
} from "@/server/services/ops/document-generation.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listGeneratedDocuments({
      limit: Number(searchParams.get("limit") ?? 30),
      documentType: (searchParams.get("type") as DocumentLetterType) ?? undefined,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-documents", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: string;
      documentType?: DocumentLetterType;
      registrationId?: string;
      registrationIds?: string[];
      vars?: Record<string, string>;
    }>(await request.json());

    if (!body.documentType) throw new Error("documentType required");

    if (body.action === "bulk" && body.registrationIds?.length) {
      return bulkGenerateDocuments({
        documentType: body.documentType,
        registrationIds: body.registrationIds,
      });
    }

    if (!body.registrationId && !body.vars) {
      throw new Error("registrationId or vars required");
    }

    const { document, pdf, batchId } = await generateDocument({
      documentType: body.documentType,
      registrationId: body.registrationId,
      vars: body.vars,
    });

    return {
      document,
      batchId,
      downloadHint: `/api/v2/admin/documents/${document.id}/download`,
      sizeBytes: pdf.length,
    };
  },
  { requireAdmin: true, rateLimitKey: "admin-documents-gen", limit: 20 }
);
