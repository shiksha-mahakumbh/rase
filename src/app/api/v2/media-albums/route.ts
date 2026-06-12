import { NextRequest } from "next/server";
import type { AlbumType, ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import {
  albumItemImageUrl,
  listPublicMediaAlbums,
} from "@/server/services/media-album.service";

export const GET = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const albums = await listPublicMediaAlbums({
    albumType: (searchParams.get("albumType") as AlbumType) ?? undefined,
    locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
    limit: Number(searchParams.get("limit") ?? 20),
  });

  return {
    items: albums.map((album) => ({
      id: album.id,
      title: album.title,
      slug: album.slug,
      description: album.description,
      albumType: album.albumType,
      locale: album.locale,
      edition: album.edition,
      year: album.year,
      items: album.items
        .map((item) => {
          const src = albumItemImageUrl(item);
          if (!src) return null;
          return {
            id: item.id,
            src,
            alt: item.altText ?? item.mediaAsset?.altText ?? album.title,
            caption: item.caption ?? item.mediaAsset?.originalName ?? null,
          };
        })
        .filter(Boolean),
    })),
  };
});
