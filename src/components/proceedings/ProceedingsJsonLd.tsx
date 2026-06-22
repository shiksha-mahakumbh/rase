import { SITE_URL } from "@/config/site";
import {
  PROCEEDINGS_CANONICAL_URL,
  PROCEEDINGS_CATALOG,
  PROCEEDINGS_PAGE_HERO,
} from "@/data/proceedings-hub";

export default function ProceedingsJsonLd() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PROCEEDINGS_PAGE_HERO.title,
    description: PROCEEDINGS_PAGE_HERO.subtitle,
    url: PROCEEDINGS_CANONICAL_URL,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  const volumes = PROCEEDINGS_CATALOG.map((volume) => ({
    "@context": "https://schema.org",
    "@type": "PublicationVolume",
    name: volume.label,
    description: volume.theme,
    url: `${SITE_URL}${volume.readHref}`,
    datePublished: volume.year,
    image: `${SITE_URL}${volume.coverSrc}`,
    numberOfPages: volume.paperCount,
    isPartOf: {
      "@type": "Periodical",
      name: "Shiksha Mahakumbh Proceedings",
    },
    encoding: {
      "@type": "MediaObject",
      contentUrl: `${SITE_URL}${volume.pdfHref}`,
      encodingFormat: "application/pdf",
    },
  }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shiksha Mahakumbh Proceedings Volumes",
    numberOfItems: PROCEEDINGS_CATALOG.length,
    itemListElement: PROCEEDINGS_CATALOG.map((volume, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "PublicationVolume",
        name: volume.label,
        url: `${SITE_URL}${volume.readHref}`,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Publications", item: `${SITE_URL}/publications` },
      { "@type": "ListItem", position: 3, name: "Proceedings", item: PROCEEDINGS_CANONICAL_URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      {volumes.map((volume) => (
        <script
          key={volume.url}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(volume) }}
        />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
