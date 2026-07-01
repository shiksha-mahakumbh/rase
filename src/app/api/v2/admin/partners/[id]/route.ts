import { NextRequest } from "next/server";
import type { ContentLocale, PageStatus, PartnerCategory } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getPartner,
  updatePartner,
  publishPartner,
  archivePartner,
  deletePartner,
} from "@/server/services/partner.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const partner = await getPartner(id);
    return { success: true, partner };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      action?: "publish" | "archive";
      name?: string;
      slug?: string;
      logoUrl?: string;
      website?: string;
      description?: string;
      partnerCategory?: string;
      locale?: ContentLocale;
      status?: PageStatus;
      isActive?: boolean;
      isFeatured?: boolean;
      mediaAssetId?: string;
      sortOrder?: number;
      seo?: Record<string, unknown>;
    }>(await request.json());

    if (body.action === "publish") {
      const partner = await publishPartner(id);
      return { success: true, partner };
    }
    if (body.action === "archive") {
      const partner = await archivePartner(id);
      return { success: true, partner };
    }

    const { action: _a, seo, partnerCategory, ...rest } = body;
    const partner = await updatePartner(id, {
      ...rest,
      ...(partnerCategory ? { partnerCategory: partnerCategory as PartnerCategory } : {}),
      seo: seo as never,
    });
    return { success: true, partner };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const partner = await deletePartner(id);
    return { success: true, partner };
  },
  { requireAdmin: true, adminResource: "media" }
);
