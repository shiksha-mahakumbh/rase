import { SITE_URL } from "@/config/site";
import {
  SMK_6_EVENT_DATES,
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_PAGE_HERO,
} from "@/data/upcoming-events-hub";

export default function UpcomingEventsJsonLd() {
  const pageUrl = `${SITE_URL}/upcoming-events`;
  const smk6 = UPCOMING_EVENTS.find((e) => e.edition === "6.0");

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: UPCOMING_EVENTS_PAGE_HERO.title,
    description: UPCOMING_EVENTS_PAGE_HERO.subtitle,
    url: pageUrl,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  const eventList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming Shiksha Mahakumbh Programmes",
    numberOfItems: UPCOMING_EVENTS.length,
    itemListElement: UPCOMING_EVENTS.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EducationEvent",
        name: event.title,
        description: event.description,
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        eventStatus:
          event.status === "registration_open"
            ? "https://schema.org/EventScheduled"
            : "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: event.venueFull,
          address: {
            "@type": "PostalAddress",
            addressLocality: event.venue,
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Department of Holistic Education",
          url: SITE_URL,
        },
        ...(event.edition === "6.0"
          ? {
              startDate: SMK_6_EVENT_DATES.startDate,
              endDate: SMK_6_EVENT_DATES.endDate,
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/registration`,
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      },
    })),
  };

  const primaryEvent = smk6
    ? {
        "@context": "https://schema.org",
        "@type": "EducationEvent",
        name: smk6.title,
        description: smk6.description,
        startDate: SMK_6_EVENT_DATES.startDate,
        endDate: SMK_6_EVENT_DATES.endDate,
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: smk6.venueFull,
          address: {
            "@type": "PostalAddress",
            addressLocality: smk6.venue,
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Department of Holistic Education",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/registration`,
          availability: "https://schema.org/InStock",
        },
        url: pageUrl,
      }
    : null;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Upcoming Events", item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventList) }} />
      {primaryEvent && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryEvent) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
