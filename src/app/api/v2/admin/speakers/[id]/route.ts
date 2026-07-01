import { NextRequest } from "next/server";
import type { ContentLocale, PageStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getSpeaker,
  updateSpeaker,
  publishSpeaker,
  archiveSpeaker,
  deleteSpeaker,
} from "@/server/services/speaker.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const speaker = await getSpeaker(id);
    return { success: true, speaker };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      action?: "publish" | "archive";
      fullName?: string;
      slug?: string;
      title?: string;
      designation?: string;
      institution?: string;
      country?: string;
      bio?: string;
      photoUrl?: string;
      mediaAssetId?: string;
      category?: string;
      edition?: string;
      locale?: ContentLocale;
      status?: PageStatus;
      publishAt?: string;
      socialLinks?: Record<string, string>;
      topics?: string[];
      tags?: string[];
      languages?: string[];
      isFeatured?: boolean;
      sortOrder?: number;
      seo?: Record<string, unknown>;
    }>(await request.json());

    if (body.action === "publish") {
      const speaker = await publishSpeaker(id);
      return { success: true, speaker };
    }
    if (body.action === "archive") {
      const speaker = await archiveSpeaker(id);
      return { success: true, speaker };
    }

    const { action: _a, publishAt, seo, ...rest } = body;
    const speaker = await updateSpeaker(id, {
      ...rest,
      ...(publishAt ? { publishAt: new Date(publishAt) } : {}),
      seo: seo as never,
    } as Parameters<typeof updateSpeaker>[1]);
    return { success: true, speaker };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const speaker = await deleteSpeaker(id);
    return { success: true, speaker };
  },
  { requireAdmin: true, adminResource: "media" }
);
