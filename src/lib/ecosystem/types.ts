import type { ContentItem, ContentCategory } from "@/lib/content/types";

/** Ecosystem content kinds — map to hub categories + dedicated search indexes */
export type EcosystemKind =
  | "speaker"
  | "expert"
  | "research"
  | "publication"
  | "case-study"
  | "success-story"
  | "article"
  | "news"
  | "policy"
  | "insight"
  | "event-report";

export interface EcosystemItem {
  id: string;
  slug: string;
  kind: EcosystemKind;
  title: string;
  excerpt: string;
  tags: string[];
  category: ContentCategory;
  publishedAt: string;
  href: string;
  image?: string;
  organization?: string;
  role?: string;
  featured?: boolean;
  /** For JSON-LD */
  authorName?: string;
}

export function kindLabel(kind: EcosystemKind): string {
  const labels: Record<EcosystemKind, string> = {
    speaker: "Speakers",
    expert: "Experts",
    research: "Research",
    publication: "Publications",
    "case-study": "Case Studies",
    "success-story": "Success Stories",
    article: "Articles",
    news: "News",
    policy: "Policy",
    insight: "Education Insights",
    "event-report": "Event Reports",
  };
  return labels[kind];
}

export type EcosystemSearchFilters = {
  q?: string;
  kind?: EcosystemKind | "";
  category?: ContentCategory;
  tag?: string;
  page?: number;
  pageSize?: number;
};

export function contentItemToEcosystem(item: ContentItem, kind?: EcosystemKind): EcosystemItem {
  return {
    id: item.slug,
    slug: item.slug,
    kind: kind ?? mapCategoryToKind(item.category),
    title: item.title,
    excerpt: item.excerpt,
    tags: item.tags,
    category: item.category,
    publishedAt: item.publishedAt,
    href: item.href,
    image: item.image,
    featured: item.featured,
    authorName: item.author?.name,
  };
}

function mapCategoryToKind(cat: ContentCategory): EcosystemKind {
  if (cat === "research") return "research";
  if (cat === "news") return "news";
  if (cat === "policy") return "policy";
  if (cat === "insight") return "insight";
  if (cat === "event-report") return "event-report";
  return "article";
}
