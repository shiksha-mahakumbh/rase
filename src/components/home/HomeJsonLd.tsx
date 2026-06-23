import { EVENT_SCHEMA, ORGANIZATION_SCHEMA } from "@/config/site";
import type { FaqItem } from "@/lib/cms/faq";
import { buildFaqPageSchema } from "@/lib/cms/faq";
import { HOME_DEFAULT_FAQS } from "@/data/home-faqs";

export default function HomeJsonLd({ faqs }: { faqs?: FaqItem[] }) {
  const faqSchema = buildFaqPageSchema(faqs?.length ? faqs : HOME_DEFAULT_FAQS);
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
