import { SITE_URL } from "@/config/site";
import {
  GALLERY_CANONICAL_URL,
  GALLERY_EDITIONS,
  GALLERY_PAGE_HERO,
  YOUTUBE_CHANNEL_URL,
} from "@/data/gallery-hub";

export default function GalleryJsonLd() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: GALLERY_PAGE_HERO.title,
    description: GALLERY_PAGE_HERO.subtitle,
    url: GALLERY_CANONICAL_URL,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  const imageGallery = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Shiksha Mahakumbh Photo Albums",
    description:
      "Edition-wise photo albums from Shiksha Mahakumbh Abhiyan national education summits.",
    url: `${GALLERY_CANONICAL_URL}?tab=photos`,
    associatedMedia: GALLERY_EDITIONS.filter((e) => e.status === "available").flatMap((e) =>
      e.photoLinks
        .filter((l) => l.external && l.href.includes("drive.google.com"))
        .map((l) => ({
          "@type": "MediaObject",
          name: `${e.title} — ${l.label}`,
          contentUrl: l.href,
        }))
    ),
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
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Gallery", item: GALLERY_CANONICAL_URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallery) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGallery) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
