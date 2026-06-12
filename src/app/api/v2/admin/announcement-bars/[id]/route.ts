import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  updateAnnouncementBar,
  deleteAnnouncementBar,
} from "@/server/services/announcement-bar.service";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const bar = await prisma.announcementBar.findFirst({ where: { id, deletedAt: null } });
    if (!bar) throw new ServiceError("Announcement bar not found", 404, "NOT_FOUND");
    return { success: true, bar };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      title?: string;
      message?: string;
      colorTheme?: string;
      ctaLabel?: string;
      ctaUrl?: string;
      isDismissible?: boolean;
      isActive?: boolean;
      priority?: number;
      startsAt?: string;
      endsAt?: string;
    }>(await request.json());

    const { startsAt, endsAt, ...rest } = body;
    const bar = await updateAnnouncementBar(id, {
      ...rest,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
    });
    return { success: true, bar };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const bar = await deleteAnnouncementBar(id);
    return { success: true, bar };
  },
  { requireAdmin: true }
);
