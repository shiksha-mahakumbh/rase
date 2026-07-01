import { NextRequest } from "next/server";
import type { ContentLocale, PageStatus, PartnerCategory } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createPartner, listPartners } from "@/server/services/partner.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listPartners({
      status: (searchParams.get("status") as PageStatus) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      partnerCategory: (searchParams.get("category") as never) ?? undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { requireAdmin: true, adminResource: "media" }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      name: string;
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

    const partner = await createPartner({
      ...body,
      partnerCategory: body.partnerCategory as PartnerCategory | undefined,
    });
    return { success: true, partner };
  },
  { requireAdmin: true, adminResource: "media" }
);
