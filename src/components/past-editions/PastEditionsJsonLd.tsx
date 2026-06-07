import { SITE_URL } from "@/config/site";
import { PAST_EDITIONS } from "@/data/past-editions";

export default function PastEditionsJsonLd() {
  const eventSeries = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Shiksha Mahakumbh Abhiyan — Past Editions",
    description:
      "Archive of completed Shiksha Mahakumbh national education conference editions from 1.0 to 5.0.",
    url: `${SITE_URL}/pastevent`,
    organizer: {
      "@type": "Organization",
      name: "Department of Holistic Education",
    },
    subEvent: PAST_EDITIONS.map((e) => ({
      "@type": "EducationEvent",
      name: e.title,
      startDate: e.dateStart,
      endDate: e.dateEnd ?? e.dateStart,
      location: {
        "@type": "Place",
        name: e.venueFull,
      },
      description: e.theme,
      url: `${SITE_URL}${e.href}`,
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Past Editions",
        item: `${SITE_URL}/pastevent`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSeries) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
