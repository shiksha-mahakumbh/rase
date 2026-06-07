/** Knowledge & content hub — extensible CMS-ready types */

export type ContentCategory =
  | "article"
  | "news"
  | "research"
  | "policy"
  | "insight"
  | "event-report";

export interface ContentAuthor {
  name: string;
  role?: string;
}

export interface ContentItem {
  slug: string;
  title: string;
  excerpt: string;
  category: ContentCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  author?: ContentAuthor;
  href: string;
  image?: string;
  featured?: boolean;
}

export interface ContentHubFilters {
  category?: ContentCategory;
  tag?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}
