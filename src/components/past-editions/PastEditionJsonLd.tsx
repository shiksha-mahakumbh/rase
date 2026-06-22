import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import type { PastEditionRecord } from "@/data/past-editions";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

type Props = {
  edition: PastEditionRecord;
};

export default function PastEditionJsonLd({ edition }: Props) {
  const pageUrl = `${SITE_URL}${edition.href}`;

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Past Editions", path: "/past-events" },
    { name: edition.title, path: edition.href },
  ]);

  const event = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: edition.title,
    description: `${edition.theme}. ${edition.coreEssence}`,
    startDate: edition.dateStart,
    endDate: edition.dateEnd ?? edition.dateStart,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: edition.venueFull,
      address: {
        "@type": "PostalAddress",
        addressLocality: edition.venue,
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Department of Holistic Education",
      url: SITE_URL,
    },
    image: edition.imageSrc ? `${SITE_URL}${edition.imageSrc}` : undefined,
    url: pageUrl,
    isPartOf: {
      "@type": "EventSeries",
      name: "Shiksha Mahakumbh Abhiyan",
      url: `${SITE_URL}/past-events`,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={event} />
    </>
  );
}
