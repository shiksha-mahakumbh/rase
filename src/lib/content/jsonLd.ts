import { SITE_URL } from "@/config/site";
import type { ContentItem } from "./types";

export function buildArticleJsonLd(item: ContentItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt ?? item.publishedAt,
    url: `${SITE_URL}${item.href}`,
    author: item.author
      ? { "@type": "Person", name: item.author.name }
      : { "@type": "Organization", name: "Shiksha Mahakumbh Abhiyan" },
  };
}
