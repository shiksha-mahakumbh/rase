import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicPartners } from "@/server/services/partner.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") ?? "en") as ContentLocale;
    const category = searchParams.get("category") ?? undefined;

    const items = await listPublicPartners(
      locale,
      category as Parameters<typeof listPublicPartners>[1]
    );
    return { success: true, items, total: items.length };
  },
  { rateLimitKey: "v2-partners-read", limit: 60 }
);
