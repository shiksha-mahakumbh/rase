import { EVENT_SCHEMA, ORGANIZATION_SCHEMA, SITE_URL } from "@/config/site";
import type { FaqItem } from "@/lib/cms/faq";
import { buildFaqPageSchema } from "@/lib/cms/faq";

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "What is Shiksha Mahakumbh Abhiyan?",
    answer:
      "A national–international multidisciplinary education movement aligned with NEP 2020 and Bharat@2047.",
  },
  {
    question: "When is Shiksha Mahakumbh 6.0?",
    answer: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India.",
  },
  {
    question: "How do I register?",
    answer: `Register online at ${SITE_URL}/registration`,
  },
];

export default function HomeJsonLd({ faqs }: { faqs?: FaqItem[] }) {
  const faqSchema = buildFaqPageSchema(faqs?.length ? faqs : DEFAULT_FAQS);
  const scripts: object[] = [ORGANIZATION_SCHEMA, EVENT_SCHEMA];
  if (faqSchema) scripts.push(faqSchema);

  return (
    <>
      {scripts.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
