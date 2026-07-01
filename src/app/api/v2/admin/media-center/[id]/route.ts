import { NextRequest } from "next/server";
import type { ContentLocale, PageStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import {
  updateMediaEntry,
  publishMediaEntry,
  archiveMediaEntry,
  deleteMediaEntry,
} from "@/server/services/media-center.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const entry = await prisma.eventMedia.findFirst({
      where: { id, deletedAt: null },
    });
    if (!entry) throw new ServiceError("Media entry not found", 404, "NOT_FOUND");
    return { success: true, entry };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      action?: "publish" | "archive";
      title?: string;
      slug?: string;
      mediaCenterCategory?: string;
      excerpt?: string;
      description?: string;
      url?: string;
      mediaType?: "image" | "video" | "document" | "press_release" | "interview" | "publication";
      locale?: ContentLocale;
      status?: PageStatus;
      edition?: string;
      tags?: string[];
      isFeatured?: boolean;
      publishAt?: string;
      eventId?: string;
      mediaAssetId?: string;
      seo?: Record<string, unknown>;
    }>(await request.json());

    if (body.action === "publish") {
      const entry = await publishMediaEntry(id);
      return { success: true, entry };
    }
    if (body.action === "archive") {
      const entry = await archiveMediaEntry(id);
      return { success: true, entry };
    }

    const { action: _a, publishAt, seo, ...rest } = body;
    const entry = await updateMediaEntry(id, {
      ...rest,
      ...(publishAt ? { publishAt: new Date(publishAt) } : {}),
      seo: seo as never,
    } as Parameters<typeof updateMediaEntry>[1]);
    return { success: true, entry };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const entry = await deleteMediaEntry(id);
    return { success: true, entry };
  },
  { requireAdmin: true, adminResource: "media" }
);
