import { NextRequest } from "next/server";
import type { ContentLocale, PageStatus, PageType } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPages } from "@/server/services/page.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listPages({
      status: (searchParams.get("status") as PageStatus) ?? "published",
      pageType: (searchParams.get("pageType") as PageType) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? "en",
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { rateLimitKey: "v2-pages-read", limit: 60 }
);
