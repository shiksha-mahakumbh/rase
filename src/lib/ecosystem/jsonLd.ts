import { SITE_URL } from "@/config/site";
import type { EcosystemItem } from "./types";

export function buildEcosystemItemJsonLd(item: EcosystemItem) {
  const url = `${SITE_URL}${item.href}`;

  if (item.kind === "speaker" || item.kind === "expert") {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: item.title,
      jobTitle: item.role,
      worksFor: item.organization
        ? { "@type": "Organization", name: item.organization }
        : undefined,
      url,
      description: item.excerpt,
    };
  }

  if (item.kind === "publication" || item.kind === "research") {
    return {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      headline: item.title,
      description: item.excerpt,
      datePublished: item.publishedAt,
      url,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.publishedAt,
    url,
    author: item.authorName
      ? { "@type": "Person", name: item.authorName }
      : undefined,
  };
}
