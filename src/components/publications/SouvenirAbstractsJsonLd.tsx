import JsonLd from "@/components/seo/JsonLd";
import {
  SOUVENIR_ABSTRACTS_CANONICAL_URL,
  SOUVENIR_ABSTRACTS_PDF_PATH,
  SOUVENIR_META,
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

  const digitalDocument = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: "Souvenir Abstracts — Multi Track Conference",
    description: SOUVENIR_PAGE_HERO.subtitle,
    url: SOUVENIR_ABSTRACTS_CANONICAL_URL,
    encodingFormat: "application/pdf",
    contentUrl: `${SITE_URL}${SOUVENIR_ABSTRACTS_PDF_PATH}`,
    inLanguage: ["en-IN", "hi-IN"],
    datePublished: SOUVENIR_META.year,
    publisher: {
      "@type": "Organization",
      name: "Department of Holistic Education",
      url: SITE_URL,
    },
    about: {
      "@type": "Event",
      name: SOUVENIR_META.title,
      location: SOUVENIR_META.venue,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${SOUVENIR_ABSTRACTS_PDF_PATH}`,
    },
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={digitalDocument} />
    </>
  );
}
