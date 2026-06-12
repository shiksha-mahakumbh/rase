import PublicPageShell from "@/components/layouts/PublicPageShell";
import CmsGalleryView from "@/components/gallery/CmsGalleryView";
import { PAGE_HEROES } from "@/lib/page-heroes";
import {
  albumItemImageUrl,
  listPublicMediaAlbums,
} from "@/server/services/media-album.service";

export default async function GalleryRoutePage() {
  const albums = await listPublicMediaAlbums({ albumType: "gallery", limit: 12 });

  const viewAlbums = albums.map((album) => ({
    id: album.id,
    title: album.title,
    slug: album.slug,
    description: album.description,
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
      .filter((item): item is NonNullable<typeof item> => item !== null),
  }));

  return (
    <PublicPageShell hero={PAGE_HEROES.gallery} skipContainer>
      <CmsGalleryView albums={viewAlbums} />
    </PublicPageShell>
  );
}
