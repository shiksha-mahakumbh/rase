import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  COMMITTEES_CANONICAL_URL,
  COMMITTEES_HERO_IMAGE,
  COMMITTEES_PAGE_HERO,
  COMMITTEE_HUB_EDITIONS,
  getCommitteeHubMemberTotal,
} from "@/data/committee-hub";
import { committeeAbsoluteUrl } from "@/lib/committee/edition-slugs";
import {
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function CommitteesJsonLd() {
  const collection = buildCollectionPageSchema({
    name: COMMITTEES_PAGE_HERO.title,
    description: COMMITTEES_PAGE_HERO.subtitle,
    path: "/committees",
  });

  const editionsList = buildItemListSchema({
    name: "Shiksha Mahakumbh committee editions",
    items: COMMITTEE_HUB_EDITIONS.map((edition) => ({
      name: edition.pageTitle,
      url: committeeAbsoluteUrl(edition.slug, SITE_URL),
    })),
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shiksha Mahakumbh Organising Committees",
    description: COMMITTEES_PAGE_HERO.subtitle,
    url: COMMITTEES_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${COMMITTEES_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education",
      alternateName: "Shiksha Mahakumbh Abhiyan",
    },
    abstract: `${getCommitteeHubMemberTotal()}+ committee members listed across editions 1.0 through 6.0.`,
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={editionsList} />
      <JsonLd data={webPage} />
    </>
  );
}
