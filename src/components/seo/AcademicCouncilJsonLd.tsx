import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  ACADEMIC_COUNCIL_EVENT,
  ACADEMIC_COUNCIL_SEO,
} from "@/data/academic-council-content";

const path = CANONICAL_ROUTES.departments.academicCouncil;

export default function AcademicCouncilJsonLd() {
  const url = `${SITE_URL}${path}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: ACADEMIC_COUNCIL_SEO.title,
        description: ACADEMIC_COUNCIL_SEO.description,
        url,
        inLanguage: ["en-IN", "hi-IN"],
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
        about: {
          "@type": "EducationalOrganization",
          name: "Department of Holistic Education",
          alternateName: "Shiksha Mahakumbh Abhiyan",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/branding/shiksha-mahakumbh-brand-hero.png`,
        },
        mainEntity: {
          "@type": "EducationEvent",
          name: "Shiksha Mahakumbh 6.0 — Academic Council Programmes",
          description: ACADEMIC_COUNCIL_SEO.description,
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
          organizer: {
            "@type": "Organization",
            name: "Department of Holistic Education",
          },
        },
      }}
    />
  );
}
