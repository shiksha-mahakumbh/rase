import articlesJson from "@/data/press-articles.json";

export type PressArticleSection = {
  title: string;
  body: string;
};

export type PressArticleRecord = {
  slug: string;
  pressNumber: number;
  locale: string;
  datePublished?: string;
  title: string;
  excerpt: string;
  heroImage: string;
  shareText: string;
  sections: PressArticleSection[];
};

export const PRESS_ARTICLES: PressArticleRecord[] = articlesJson as PressArticleRecord[];

export const PRESS_ARTICLE_SLUGS = PRESS_ARTICLES.map((a) => a.slug);

export function getPressArticleBySlug(slug: string): PressArticleRecord | null {
  return PRESS_ARTICLES.find((a) => a.slug === slug) ?? null;
}
