import { NextRequest } from "next/server";
import type { AlbumType, ContentLocale, PageStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createMediaAlbum, listMediaAlbums } from "@/server/services/media-album.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listMediaAlbums({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      albumType: (searchParams.get("albumType") as AlbumType) ?? undefined,
      status: (searchParams.get("status") as PageStatus) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
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
      albumType?: AlbumType;
      locale?: ContentLocale;
      edition?: string;
      year?: number;
      status?: PageStatus;
      sortOrder?: number;
      items?: Array<Record<string, unknown>>;
    }>(await request.json());

    const album = await createMediaAlbum({
      ...body,
      items: body.items as never,
    });
    return { success: true, album };
  },
  { requireAdmin: true, adminResource: "media" }
);
