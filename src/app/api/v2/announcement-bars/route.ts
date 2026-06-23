import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listActiveAnnouncementBars } from "@/server/services/announcement-bar.service";
import { resolveAnnouncementBars } from "@/data/default-announcements";
import type { CmsAnnouncementBar } from "@/lib/cms/types";

function mapBar(
  b: Awaited<ReturnType<typeof listActiveAnnouncementBars>>[number]
): CmsAnnouncementBar {
  return {
    id: b.id,
    title: b.title,
    message: b.message,
    barType: b.barType,
    colorTheme: b.colorTheme,
    ctaLabel: b.ctaLabel,
    ctaUrl: b.ctaUrl,
    isDismissible: b.isDismissible,
  };
}

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const dbBars = await listActiveAnnouncementBars(locale);
    const items = resolveAnnouncementBars(dbBars.map(mapBar), locale);
    return { success: true, items };
  },
  { rateLimitKey: "v2-announcement-bars-read", limit: 60 }
);
