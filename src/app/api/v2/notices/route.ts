import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicNotices } from "@/server/services/notice.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listPublicNotices({
      locale: (searchParams.get("locale") ?? "en") as ContentLocale,
      categorySlug: searchParams.get("category") ?? undefined,
      pinnedOnly: searchParams.get("pinned") === "true",
      widget: searchParams.get("widget") === "true",
      limit: Number(searchParams.get("limit") ?? (searchParams.get("widget") === "true" ? 5 : 25)),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { rateLimitKey: "v2-notices-read", limit: 60 }
);
