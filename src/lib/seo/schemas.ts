import {
  EVENT_SCHEMA,
  ORGANIZATION_SCHEMA,
  SITE_NAME,
  SITE_URL,
} from "@/config/site";

/** Department of Holistic Education — educational org for Knowledge Graph */
export function buildEducationalOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    alternateName: "शिक्षा महाकुंभ अभियान",
    url: SITE_URL,
    logo: ORGANIZATION_SCHEMA.logo,
    sameAs: ORGANIZATION_SCHEMA.sameAs,
    description:
      "Global education movement aligned with NEP 2020 — summits, research, policy, olympiads, and national registration.",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

/** SMK 6.0 — registration landing */
export function buildRegistrationEventJsonLd() {
  return {
    ...EVENT_SCHEMA,
    "@type": "EducationEvent",
    description:
      "Shiksha Mahakumbh 6.0 — national multidisciplinary education summit at NIT Hamirpur. Official registration for delegates, conclaves, olympiads, and research tracks.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/registration`,
      availability: "https://schema.org/InStock",
      validFrom: "2025-01-01",
    },
    performer: {
      "@type": "EducationalOrganization",
      name: "Department of Holistic Education (DHE)",
    },
  };
}

export function buildRegistrationFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I register for Shiksha Mahakumbh 6.0?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Complete the official registration form at ${SITE_URL}/registration. You will receive an SMK2026 registration ID after submission.`,
        },
      },
      {
        "@type": "Question",
        name: "When is Shiksha Mahakumbh 6.0?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India.",
        },
      },
      {
        "@type": "Question",
        name: "What registration categories are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Delegate, Conclave, Best Practices, Olympiad, Awards, Exhibition, Projects, Bal Shodh Patrika, Cultural Program, and Accommodation.",
        },
      },
    ],
  };
}

export function buildPersonJsonLd(person: {
  name: string;
  jobTitle?: string;
  worksFor?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    worksFor: person.worksFor
      ? { "@type": "Organization", name: person.worksFor }
      : undefined,
    url: person.url,
  };
}

export function buildNewsArticleJsonLd(article: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    image: article.image ? `${SITE_URL}${article.image}` : undefined,
    mainEntityOfPage: `${SITE_URL}${article.path}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: ORGANIZATION_SCHEMA.logo },
    },
  };
}
