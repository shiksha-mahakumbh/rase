import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Academic Council — Programmes & Research Tracks",
  description:
    "Shiksha Mahakumbh 6.0 Academic Council: multi-track conference, conclaves, olympiads, exhibitions, best practices, and publications at NIT Hamirpur.",
  path: "/departments/academic-council",
  keywords: [
    "Academic Council Shiksha Mahakumbh",
    "research conference India 2026",
    "NIT Hamirpur education summit",
    "Department of Holistic Education",
    "Indian Education Conference",
    "Higher Education Summit",
  ],
});

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Academic Council",
      item: `${SITE_URL}/VibhagRoute/AcademicCouncil24`,
    },
  ],
};

const educationEvent = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: "Shiksha Mahakumbh 6.0 — Academic Council Programmes",
  description:
    "Academic Council programmes including multi-track conference, conclaves, olympiads, exhibitions, student projects, and Bal Shodh Patrika.",
  url: `${SITE_URL}/VibhagRoute/AcademicCouncil24`,
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

export default function AcademicCouncilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationEvent) }}
      />
      {children}
    </>
  );
}
