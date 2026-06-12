import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicSpeakers } from "@/server/services/speaker.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") ?? "en") as ContentLocale;
    const featuredOnly = searchParams.get("featured") === "true";

    const items = await listPublicSpeakers(locale, featuredOnly);
    return { success: true, items, total: items.length };
  },
  { rateLimitKey: "v2-speakers-read", limit: 60 }
);
