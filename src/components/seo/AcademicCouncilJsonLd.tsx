import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  ACADEMIC_COUNCIL_CANONICAL_URL,
  ACADEMIC_COUNCIL_FAQ,
  ACADEMIC_COUNCIL_HERO_IMAGE,
  ACADEMIC_COUNCIL_PATH,
  ACADEMIC_COUNCIL_SEO,
  academicCouncilProgrammeItemsForSchema,
} from "@/data/academic-council-hub";
import { ACADEMIC_COUNCIL_EVENT } from "@/data/academic-council-content";
import {
  buildCollectionPageSchema,
  buildFaqSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function AcademicCouncilJsonLd() {
  const collection = buildCollectionPageSchema({
    name: ACADEMIC_COUNCIL_SEO.title,
    description: ACADEMIC_COUNCIL_SEO.description,
    path: ACADEMIC_COUNCIL_PATH,
  });

  const programmesList = buildItemListSchema({
    name: "Shiksha Mahakumbh 6.0 Academic Council programmes",
    items: academicCouncilProgrammeItemsForSchema(),
  });

  const educationEvent = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: "Shiksha Mahakumbh 6.0 — Academic Council Programmes",
    description: ACADEMIC_COUNCIL_SEO.description,
    url: ACADEMIC_COUNCIL_CANONICAL_URL,
    startDate: ACADEMIC_COUNCIL_EVENT.startDate,
    endDate: ACADEMIC_COUNCIL_EVENT.endDate,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "Place",
      name: ACADEMIC_COUNCIL_EVENT.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamirpur",
        addressRegion: "Himachal Pradesh",
        addressCountry: "IN",
      },
    },
    organizer: orgReference(),
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: ACADEMIC_COUNCIL_SEO.title,
    description: ACADEMIC_COUNCIL_SEO.description,
    url: ACADEMIC_COUNCIL_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${ACADEMIC_COUNCIL_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education",
      alternateName: "Shiksha Mahakumbh Abhiyan",
    },
    mainEntity: educationEvent,
  };

  const faq = buildFaqSchema([...ACADEMIC_COUNCIL_FAQ]);

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={programmesList} />
      <JsonLd data={webPage} />
      <JsonLd data={faq} />
    </>
  );
}
