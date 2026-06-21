import { SITE_URL } from "@/config/site";
import {
  COMMITTEE_BROCHURES_FOLDER_URL,
  EDITION_BROCHURES,
} from "@/data/downloads-hub";

export default function DownloadsJsonLd() {
  const pageUrl = `${SITE_URL}/downloads`;

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shiksha Mahakumbh Downloads & Brochures",
    description:
      "Official Shiksha Mahakumbh Abhiyan edition brochures (1.0–6.0), reports, guidelines, and downloadable resources for national and international delegates.",
    url: pageUrl,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shiksha Mahakumbh Edition Brochures",
    numberOfItems: EDITION_BROCHURES.length,
    itemListElement: EDITION_BROCHURES.map((brochure, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "DigitalDocument",
        name: brochure.fileName,
        description: `${brochure.theme} — ${brochure.venue}, ${brochure.dates}`,
        encodingFormat: "application/pdf",
        url: brochure.viewUrl,
        isAccessibleForFree: true,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Brochures & Downloads", item: pageUrl },
    ],
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Shiksha Mahakumbh Official Brochures",
    description: "PDF brochures for all Shiksha Mahakumbh Abhiyan editions.",
    url: COMMITTEE_BROCHURES_FOLDER_URL,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/pdf",
      contentUrl: COMMITTEE_BROCHURES_FOLDER_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
    </>
  );
}
