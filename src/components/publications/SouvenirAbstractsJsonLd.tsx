import JsonLd from "@/components/seo/JsonLd";
import {
  SOUVENIR_ABSTRACTS_CANONICAL_URL,
  SOUVENIR_CATALOG,
  SOUVENIR_PAGE_HERO,
} from "@/data/souvenir-abstracts-hub";
import { SITE_URL } from "@/config/site";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema";

export default function SouvenirAbstractsJsonLd() {
  const collection = buildCollectionPageSchema({
    name: SOUVENIR_PAGE_HERO.title,
    description: SOUVENIR_PAGE_HERO.subtitle,
    path: "/publications/souvenir-abstracts-mtc",
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
    { name: "Souvenir Abstracts MTC", path: "/publications/souvenir-abstracts-mtc" },
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shiksha Mahakumbh MTC Souvenir Abstracts",
    numberOfItems: SOUVENIR_CATALOG.length,
    itemListElement: SOUVENIR_CATALOG.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "DigitalDocument",
        name: entry.label,
        url: `${SITE_URL}${entry.pdfHref}`,
        encodingFormat: "application/pdf",
        datePublished: entry.year,
      },
    })),
  };

  const documents = SOUVENIR_CATALOG.map((entry) => ({
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: entry.label,
    description: entry.theme,
    url: SOUVENIR_ABSTRACTS_CANONICAL_URL,
    encodingFormat: "application/pdf",
    contentUrl: `${SITE_URL}${entry.pdfHref}`,
    inLanguage: ["en-IN", "hi-IN"],
    datePublished: entry.year,
    publisher: {
      "@type": "Organization",
      name: "Department of Holistic Education",
      url: SITE_URL,
    },
    about: {
      "@type": "Event",
      name: entry.label,
      location: entry.venue,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${entry.pdfHref}`,
    },
  }));

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemList} />
      {documents.map((doc, index) => (
        <JsonLd key={SOUVENIR_CATALOG[index]!.id} data={doc} />
      ))}
    </>
  );
}
