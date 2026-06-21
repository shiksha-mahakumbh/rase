import { SITE_URL } from "@/config/site";
import { COMMITTEE_HUB_EDITIONS } from "@/data/committee-hub";
import { committeeAbsoluteUrl } from "@/lib/committee/edition-slugs";

export default function CommitteesJsonLd() {
  const url = `${SITE_URL}/committees`;

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shiksha Mahakumbh Organising Committees",
    description:
      "Advisory, organising, and conference committees for Shiksha Mahakumbh Abhiyan editions 1.0 through 6.0 — national education leadership across IITs, NITs, universities, and DHE.",
    url,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
    hasPart: COMMITTEE_HUB_EDITIONS.map((edition) => ({
      "@type": "WebPage",
      name: edition.pageTitle,
      description: edition.theme,
      url: committeeAbsoluteUrl(edition.slug, SITE_URL),
    })),
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shiksha Mahakumbh Committee Editions",
    numberOfItems: COMMITTEE_HUB_EDITIONS.length,
    itemListElement: COMMITTEE_HUB_EDITIONS.map((edition, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Edition ${edition.edition} — ${edition.venue}`,
      url: committeeAbsoluteUrl(edition.slug, SITE_URL),
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Past Events", item: `${SITE_URL}/past-events` },
      { "@type": "ListItem", position: 3, name: "Organising Committees", item: url },
    ],
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
    </>
  );
}
