import { EVENT_SCHEMA, ORGANIZATION_SCHEMA, SITE_URL } from "@/config/site";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Shiksha Mahakumbh Abhiyan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A national–international multidisciplinary education movement aligned with NEP 2020 and Bharat@2047.",
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
      name: "How do I register?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Register online at ${SITE_URL}/registration`,
      },
    },
  ],
};

export default function HomeJsonLd() {
  const scripts = [ORGANIZATION_SCHEMA, EVENT_SCHEMA, faqSchema];

  return (
    <>
      {scripts.map((schema) => (
        <script
          key={schema["@type"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
