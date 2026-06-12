import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicMediaCenterHub } from "@/server/services/media-center.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") ?? "en") as ContentLocale;
    const category = searchParams.get("category") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? 50);

    const items = await listPublicMediaCenterHub(
      locale,
      category as Parameters<typeof listPublicMediaCenterHub>[1],
      limit
    );
    return { success: true, items, total: items.length };
  },
  { rateLimitKey: "v2-media-center-read", limit: 60 }
);
