import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  PAST_EVENTS_CANONICAL_URL,
  PAST_EVENTS_HERO_IMAGE,
  PAST_EVENTS_PAGE_HERO,
} from "@/data/past-events-hub";
import { PAST_EDITIONS } from "@/data/past-editions";
import {
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function PastEditionsJsonLd() {
  const collection = buildCollectionPageSchema({
    name: `${PAST_EVENTS_PAGE_HERO.titleLine} — ${PAST_EVENTS_PAGE_HERO.titleHindi}`,
    description: PAST_EVENTS_PAGE_HERO.subtitle,
    path: "/past-events",
  });

  const editionsList = buildItemListSchema({
    name: "Shiksha Mahakumbh completed editions",
    items: PAST_EDITIONS.map((e) => ({
      name: e.title,
      url: `${SITE_URL}${e.href}`,
    })),
  });

  const eventSeries = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Shiksha Mahakumbh Abhiyan — Past Editions",
    description:
      "Archive of completed Shiksha Mahakumbh national education conference editions from 1.0 to 5.0.",
    url: PAST_EVENTS_CANONICAL_URL,
    image: `${SITE_URL}${PAST_EVENTS_HERO_IMAGE}`,
    organizer: orgReference(),
    subEvent: PAST_EDITIONS.map((e) => ({
      "@type": "EducationEvent",
      name: e.title,
      startDate: e.dateStart,
      endDate: e.dateEnd ?? e.dateStart,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: e.venueFull,
      },
      description: e.theme,
      url: `${SITE_URL}${e.href}`,
      ...(e.imageSrc ? { image: `${SITE_URL}${e.imageSrc}` } : {}),
    })),
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${PAST_EVENTS_PAGE_HERO.titleLine} — Shiksha Mahakumbh 1.0 to 5.0`,
    description: PAST_EVENTS_PAGE_HERO.subtitle,
    url: PAST_EVENTS_CANONICAL_URL,
    primaryImageOfPage: `${SITE_URL}${PAST_EVENTS_HERO_IMAGE}`,
    isPartOf: orgReference(),
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={editionsList} />
      <JsonLd data={eventSeries} />
      <JsonLd data={webPage} />
    </>
  );
}
