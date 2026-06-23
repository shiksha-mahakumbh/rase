import JsonLd from "./JsonLd";
import {
  INTRODUCTION_CANONICAL_URL,
  INTRODUCTION_CLOSING,
  INTRODUCTION_HERO,
  INTRODUCTION_HERO_IMAGE,
  INTRODUCTION_OBJECTIVES,
} from "@/data/introduction-content";
import { PAST_EDITIONS, UPCOMING_EDITION } from "@/data/past-editions";
import { SITE_URL } from "@/config/site";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function IntroductionJsonLd() {
  const collection = buildCollectionPageSchema({
    name: `${INTRODUCTION_HERO.title} — Introduction`,
    description: INTRODUCTION_HERO.subtitle,
    path: "/introduction",
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/introduction" },
    { name: "Introduction", path: "/introduction" },
  ]);

  const objectivesList = buildItemListSchema({
    name: "Shiksha Mahakumbh Abhiyan objectives",
    items: INTRODUCTION_OBJECTIVES.map((item) => ({
      name: item.title,
      url: `${INTRODUCTION_CANONICAL_URL}#objectives`,
    })),
  });

  const editionsList = buildItemListSchema({
    name: "Shiksha Mahakumbh major editions",
    items: [
      ...PAST_EDITIONS.map((e) => ({
        name: e.title,
        url: `${SITE_URL}${e.href}`,
      })),
      {
        name: UPCOMING_EDITION.title,
        url: `${SITE_URL}${UPCOMING_EDITION.href}`,
      },
    ],
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${INTRODUCTION_HERO.title} — Introduction`,
    description: INTRODUCTION_HERO.subtitle,
    url: INTRODUCTION_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${INTRODUCTION_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education",
      alternateName: INTRODUCTION_HERO.title,
    },
    abstract: INTRODUCTION_CLOSING,
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={objectivesList} />
      <JsonLd data={editionsList} />
      <JsonLd data={webPage} />
    </>
  );
}
