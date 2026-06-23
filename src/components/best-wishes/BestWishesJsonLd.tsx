import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import { BEST_WISHES_ENTRIES } from "@/data/best-wishes";
import {
  BEST_WISHES_CANONICAL_URL,
  BEST_WISHES_HERO_IMAGE,
  BEST_WISHES_PAGE_HERO,
  wishAnchorUrl,
} from "@/data/best-wishes-hub";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function BestWishesJsonLd() {
  const collection = buildCollectionPageSchema({
    name: BEST_WISHES_PAGE_HERO.title,
    description: BEST_WISHES_PAGE_HERO.subtitle,
    path: CANONICAL_ROUTES.bestWishes,
  });

  const wishesList = buildItemListSchema({
    name: "Shiksha Mahakumbh Abhiyan — Best Wishes",
    items: BEST_WISHES_ENTRIES.map((entry) => ({
      name: entry.name,
      url: wishAnchorUrl(entry.id),
    })),
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: BEST_WISHES_PAGE_HERO.title,
    description: BEST_WISHES_PAGE_HERO.subtitle,
    url: BEST_WISHES_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${BEST_WISHES_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education",
      alternateName: "Shiksha Mahakumbh Abhiyan",
    },
    abstract: `${BEST_WISHES_ENTRIES.length} dignitary best-wish messages from national and international leaders supporting the Abhiyan.`,
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={wishesList} />
      <JsonLd data={webPage} />
    </>
  );
}
