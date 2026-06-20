import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import {
  ACADEMIC_COUNCIL_EVENT,
  ACADEMIC_COUNCIL_SEO,
} from "@/data/academic-council-content";

const path = CANONICAL_ROUTES.departments.academicCouncil;

export const metadata = createPageMetadata({
  title: ACADEMIC_COUNCIL_SEO.title,
  description: ACADEMIC_COUNCIL_SEO.description,
  path,
  keywords: [...ACADEMIC_COUNCIL_SEO.keywords],
  locale: "en_IN",
});

const educationEvent = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: "Shiksha Mahakumbh 6.0 — Academic Council Programmes",
  description: ACADEMIC_COUNCIL_SEO.description,
  url: `${SITE_URL}${path}`,
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
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Departments", path: CANONICAL_ROUTES.departments.academicCouncil },
          { name: "Academic Council", path },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationEvent) }}
      />
      {children}
    </>
  );
}
