import { NextRequest } from "next/server";
import type { AnnouncementBarType, ContentLocale } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  createAnnouncementBar,
  listAnnouncementBars,
} from "@/server/services/announcement-bar.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listAnnouncementBars({
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      barType: (searchParams.get("barType") as AnnouncementBarType) ?? undefined,
      includeInactive: searchParams.get("includeInactive") === "true",
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { requireAdmin: true, adminResource: "media" }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      title: string;
      message: string;
      barType?: AnnouncementBarType;
      colorTheme?: string;
      ctaLabel?: string;
      ctaUrl?: string;
      locale?: ContentLocale;
      isDismissible?: boolean;
      isActive?: boolean;
      priority?: number;
      startsAt?: string;
      endsAt?: string;
    }>(await request.json());

    const bar = await createAnnouncementBar({
      ...body,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    });
    return { success: true, bar };
  },
  { requireAdmin: true, adminResource: "media" }
);
