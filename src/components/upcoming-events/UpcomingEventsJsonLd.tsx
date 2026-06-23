import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import { EVENT_SCHEMA } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  SMK_6_EVENT_DATES,
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_CANONICAL_URL,
  UPCOMING_EVENTS_FAQ,
  UPCOMING_EVENTS_HERO_IMAGE,
  UPCOMING_EVENTS_PAGE_HERO,
  UPCOMING_EVENTS_PATH,
  upcomingEventsMetaDescription,
} from "@/data/upcoming-events-hub";
import {
  buildCollectionPageSchema,
  buildFaqSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function UpcomingEventsJsonLd() {
  const description = upcomingEventsMetaDescription();
  const smk6 = UPCOMING_EVENTS.find((e) => e.edition === "6.0");

  const collection = buildCollectionPageSchema({
    name: UPCOMING_EVENTS_PAGE_HERO.title,
    description,
    path: UPCOMING_EVENTS_PATH,
  });

  const programmeList = buildItemListSchema({
    name: "Upcoming Shiksha Mahakumbh Programmes",
    items: UPCOMING_EVENTS.map((event) => ({
      name: event.title,
      url: `${UPCOMING_EVENTS_PATH}#${event.id}`,
    })),
  });

  const smk6Event = smk6
    ? {
        "@context": "https://schema.org",
        "@type": "EducationEvent",
        name: smk6.title,
        description: smk6.description,
        url: `${UPCOMING_EVENTS_CANONICAL_URL}#smk-6-0`,
        startDate: SMK_6_EVENT_DATES.startDate,
        endDate: SMK_6_EVENT_DATES.endDate,
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        eventStatus: EVENT_SCHEMA.eventStatus,
        location: {
          "@type": "Place",
          name: smk6.venueFull,
          address: {
            "@type": "PostalAddress",
            addressLocality: smk6.venue,
            addressRegion: "Himachal Pradesh",
            addressCountry: "IN",
          },
        },
        organizer: orgReference(),
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}${CANONICAL_ROUTES.registration}`,
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: UPCOMING_EVENTS_PAGE_HERO.title,
    description,
    url: UPCOMING_EVENTS_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${UPCOMING_EVENTS_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education",
      alternateName: "Shiksha Mahakumbh Abhiyan",
    },
    mainEntity: smk6Event ?? undefined,
  };

  const faq = buildFaqSchema([...UPCOMING_EVENTS_FAQ]);

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={programmeList} />
      {smk6Event && <JsonLd data={smk6Event} />}
      <JsonLd data={webPage} />
      <JsonLd data={faq} />
    </>
  );
}
