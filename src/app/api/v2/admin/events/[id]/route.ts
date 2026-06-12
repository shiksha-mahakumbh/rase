import { NextRequest } from "next/server";
import type { ContentLocale, EventStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getEventCms,
  updateEventCms,
  publishEventCms,
  archiveEventCms,
  deleteEventCms,
} from "@/server/services/event-cms.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const event = await getEventCms(id);
    return { success: true, event };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      action?: "publish" | "archive";
      title?: string;
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
      status?: EventStatus;
      publishAt?: string;
      seo?: Record<string, unknown>;
    }>(await request.json());

    if (body.action === "publish") {
      const event = await publishEventCms(id);
      return { success: true, event };
    }
    if (body.action === "archive") {
      const event = await archiveEventCms(id);
      return { success: true, event };
    }

    const { action: _a, startDate, endDate, eventDate, publishAt, highlights, seo, ...rest } =
      body;
    const event = await updateEventCms(id, {
      ...rest,
      ...(startDate ? { startDate: new Date(startDate) } : {}),
      ...(endDate ? { endDate: new Date(endDate) } : {}),
      ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
      ...(publishAt ? { publishAt: new Date(publishAt) } : {}),
      highlights: highlights as never,
      seo: seo as never,
    } as Parameters<typeof updateEventCms>[1]);
    return { success: true, event };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const event = await deleteEventCms(id);
    return { success: true, event };
  },
  { requireAdmin: true }
);
