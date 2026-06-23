import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  GALLERY_CANONICAL_URL,
  GALLERY_EDITIONS,
  GALLERY_OG_IMAGE,
  GALLERY_PAGE_HERO,
  YOUTUBE_CHANNEL_URL,
} from "@/data/gallery-hub";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema";

export default function GalleryJsonLd() {
  const collection = buildCollectionPageSchema({
    name: GALLERY_PAGE_HERO.title,
    description: GALLERY_PAGE_HERO.subtitle,
    path: "/gallery",
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Media Centre", path: "/media-center" },
    { name: "Gallery", path: "/gallery" },
  ]);

  const imageGallery = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Shiksha Mahakumbh Photo Albums",
    description:
      "Edition-wise photo albums from Shiksha Mahakumbh Abhiyan national education summits.",
    url: `${GALLERY_CANONICAL_URL}?tab=photos`,
    image: GALLERY_OG_IMAGE,
    associatedMedia: GALLERY_EDITIONS.filter((e) => e.status === "available").flatMap((e) => [
      {
        "@type": "ImageObject",
        name: e.imageAlt,
        contentUrl: `${SITE_URL}${e.imageSrc}`,
      },
      ...e.photoLinks
        .filter((l) => l.external && l.href.includes("drive.google.com"))
        .map((l) => ({
          "@type": "MediaObject",
          name: `${e.title} — ${l.label}`,
          contentUrl: l.href,
        })),
    ]),
  };

  const videoGallery = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    name: "Shiksha Mahakumbh Documentaries",
    description: "Conference documentaries and event coverage on the official YouTube channel.",
    url: `${GALLERY_CANONICAL_URL}?tab=videos`,
    publisher: {
      "@type": "Organization",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
    mainEntityOfPage: YOUTUBE_CHANNEL_URL,
    hasPart: GALLERY_EDITIONS.filter((e) => e.youtubeUrl).map((e) => ({
      "@type": "VideoObject",
      name: e.videoTitle,
      description: e.videoDescription,
      url: e.youtubeUrl,
      thumbnailUrl: `${SITE_URL}${e.imageSrc}`,
    })),
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={imageGallery} />
      <JsonLd data={videoGallery} />
    </>
  );
}
