import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listActiveAnnouncementBars } from "@/server/services/announcement-bar.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const items = await listActiveAnnouncementBars(locale);
    return { success: true, items };
  },
  { rateLimitKey: "v2-announcement-bars-read", limit: 60 }
);
