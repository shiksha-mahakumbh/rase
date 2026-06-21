import { SITE_URL } from "@/config/site";
import type { CommitteeEditionData } from "@/data/committee-members";
import { countCommitteeMembers } from "@/data/committee-members";
import { committeeAbsoluteUrl } from "@/lib/committee/edition-slugs";

interface CommitteeEditionJsonLdProps {
  edition: CommitteeEditionData;
}

export default function CommitteeEditionJsonLd({ edition }: CommitteeEditionJsonLdProps) {
  const url = committeeAbsoluteUrl(edition.slug, SITE_URL);
  const memberCount = countCommitteeMembers(edition);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `Shiksha Mahakumbh ${edition.edition} Organising Committee`,
    description: `${edition.theme} — ${edition.venue}, ${edition.dates}.`,
    url,
    memberOf: {
      "@type": "Organization",
      name: "Department of Holistic Education",
      url: SITE_URL,
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: memberCount,
      unitText: "committee members",
    },
  };

  const event = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: edition.pageTitle,
    description: edition.theme,
    location: {
      "@type": "Place",
      name: edition.venue,
    },
    organizer: {
      "@type": "Organization",
      name: "Department of Holistic Education",
    },
    url,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Organising Committees",
        item: `${SITE_URL}/committees`,
      },
      { "@type": "ListItem", position: 3, name: edition.breadcrumbLabel, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
