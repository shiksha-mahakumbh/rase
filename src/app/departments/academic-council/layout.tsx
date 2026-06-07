import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const path = CANONICAL_ROUTES.departments.academicCouncil;

export const metadata = createPageMetadata({
  title: "Academic Council — Programmes & Research Tracks",
  description:
    "Shiksha Mahakumbh 6.0 Academic Council: multi-track conference, conclaves, olympiads, exhibitions, best practices, and publications at NIT Hamirpur.",
  path,
  keywords: [
    "Academic Council Shiksha Mahakumbh",
    "research conference India 2026",
    "NIT Hamirpur education summit",
    "Department of Holistic Education",
  ],
});

const educationEvent = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: "Shiksha Mahakumbh 6.0 — Academic Council Programmes",
  description:
    "Academic Council programmes including multi-track conference, conclaves, olympiads, exhibitions, student projects, and Bal Shodh Patrika.",
  url: `${SITE_URL}${path}`,
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "NIT Hamirpur",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
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
