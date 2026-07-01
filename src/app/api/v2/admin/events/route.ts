import { NextRequest } from "next/server";
import type { ContentLocale, EventCategory, EventStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createEventCms, listEventsCms } from "@/server/services/event-cms.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listEventsCms({
      status: (searchParams.get("status") as EventStatus) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      category: (searchParams.get("category") as never) ?? undefined,
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
      title: string;
      slug?: string;
      description?: string;
      edition?: string;
      locale?: ContentLocale;
      category?: string;
      venue?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      eventDate?: string;
      bannerUrl?: string;
      highlights?: unknown[];
      brochureDownloadId?: string;
      registrationLink?: string;
      isFeatured?: boolean;
      publishAt?: string;
      seo?: Record<string, unknown>;
    }>(await request.json());

    const event = await createEventCms({
      ...body,
      category: body.category as EventCategory | undefined,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
      publishAt: body.publishAt ? new Date(body.publishAt) : undefined,
      highlights: body.highlights as never,
    });

    return { success: true, event };
  },
  { requireAdmin: true, adminResource: "media" }
);
