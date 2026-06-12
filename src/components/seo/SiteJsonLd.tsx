import { SITE_NAME, SITE_URL } from "@/config/site";

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["en-IN", "hi-IN"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/downloads?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export default function SiteJsonLd() {
  const schema = buildWebSiteSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
