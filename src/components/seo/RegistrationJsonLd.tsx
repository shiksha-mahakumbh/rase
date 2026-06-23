import JsonLd from "./JsonLd";
import { SITE_URL } from "@/config/site";
import { EVENT_SCHEMA } from "@/config/site";
import {
  REGISTRATION_CANONICAL_URL,
  REGISTRATION_FAQ,
  REGISTRATION_HERO_IMAGE,
  REGISTRATION_PATH,
  registrationMetaDescription,
} from "@/data/registration-hub";
import { event } from "@/design/tokens";
import {
  buildCollectionPageSchema,
  buildFaqSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function RegistrationJsonLd() {
  const collection = buildCollectionPageSchema({
    name: "Register — Shiksha Mahakumbh 6.0",
    description: registrationMetaDescription(),
    path: REGISTRATION_PATH,
  });

  const educationEvent = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: event.name,
    description: registrationMetaDescription(),
    url: REGISTRATION_CANONICAL_URL,
    startDate: EVENT_SCHEMA.startDate,
    endDate: EVENT_SCHEMA.endDate,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    eventStatus: EVENT_SCHEMA.eventStatus,
    location: EVENT_SCHEMA.location,
    organizer: orgReference(),
    offers: {
      "@type": "Offer",
      url: REGISTRATION_CANONICAL_URL,
      availability: "https://schema.org/InStock",
      validFrom: "2025-01-01",
    },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Register — Shiksha Mahakumbh 6.0",
    description: registrationMetaDescription(),
    url: REGISTRATION_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${REGISTRATION_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education",
      alternateName: "Shiksha Mahakumbh Abhiyan",
    },
    mainEntity: educationEvent,
  };

  const faq = buildFaqSchema([...REGISTRATION_FAQ]);

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={educationEvent} />
      <JsonLd data={webPage} />
      <JsonLd data={faq} />
    </>
  );
}
