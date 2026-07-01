import { NextRequest } from "next/server";
import type { ContentLocale, PageStatus, SpeakerCategory } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createSpeaker, listSpeakers } from "@/server/services/speaker.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listSpeakers({
      status: (searchParams.get("status") as PageStatus) ?? undefined,
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
      fullName: string;
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

    const speaker = await createSpeaker({
      ...body,
      category: body.category as SpeakerCategory | undefined,
      publishAt: body.publishAt ? new Date(body.publishAt) : undefined,
    });

    return { success: true, speaker };
  },
  { requireAdmin: true, adminResource: "media" }
);
