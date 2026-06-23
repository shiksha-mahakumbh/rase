import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  DOWNLOADS_CANONICAL_URL,
  DOWNLOADS_HERO_IMAGE,
  DOWNLOADS_PAGE_HERO,
  EDITION_BROCHURES,
} from "@/data/downloads-hub";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function DownloadsJsonLd() {
  const collection = buildCollectionPageSchema({
    name: DOWNLOADS_PAGE_HERO.title,
    description: DOWNLOADS_PAGE_HERO.subtitle,
    path: CANONICAL_ROUTES.downloads,
  });

  const brochuresList = buildItemListSchema({
    name: "Shiksha Mahakumbh Edition Brochures",
    items: EDITION_BROCHURES.map((brochure) => ({
      name: brochure.fileName,
      url: brochure.viewUrl,
    })),
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: DOWNLOADS_PAGE_HERO.title,
    description: DOWNLOADS_PAGE_HERO.subtitle,
    url: DOWNLOADS_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${DOWNLOADS_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education",
      alternateName: "Shiksha Mahakumbh Abhiyan",
    },
    abstract: `${EDITION_BROCHURES.length} official edition brochures (PDF) for Shiksha Mahakumbh Abhiyan editions 1.0 through 6.0.`,
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={brochuresList} />
      <JsonLd data={webPage} />
    </>
  );
}
