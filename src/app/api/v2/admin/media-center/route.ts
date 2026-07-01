import { NextRequest } from "next/server";
import type { ContentLocale, MediaCenterCategory, PageStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createMediaEntry, listMediaEntries } from "@/server/services/media-center.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listMediaEntries({
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
      title: string;
      slug?: string;
      mediaCenterCategory: string;
      excerpt?: string;
      description?: string;
      url: string;
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

    const entry = await createMediaEntry({
      ...body,
      mediaCenterCategory: body.mediaCenterCategory as MediaCenterCategory,
      publishAt: body.publishAt ? new Date(body.publishAt) : undefined,
    });

    return { success: true, entry };
  },
  { requireAdmin: true, adminResource: "media" }
);
