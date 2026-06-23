import { PRESS_ARTICLES, type PressArticleRecord } from "@/lib/press/articles";
import { SITE_URL } from "@/config/site";
import type { CmsArticleCard } from "@/lib/cms/types";

export const PRESS_PAGE_HERO = {
  eyebrow: "Press · Official Releases",
  title: "Press Releases",
  subtitle:
    "Official announcements, national coverage, and programme updates from Shiksha Mahakumbh Abhiyan — in English and Hindi, for media, institutions, and global education stakeholders.",
} as const;

export const PRESS_STATS = [
  { label: "Releases", value: "9 curated", hint: "English & Hindi coverage" },
  { label: "Editions", value: "2.0 – 5.0", hint: "Summit announcements" },
  { label: "Media", value: "National", hint: "Print & digital coverage" },
  { label: "Access", value: "Open web", hint: "Global readership" },
] as const;

export const PRESS_SEO_KEYWORDS = [
  "Shiksha Mahakumbh press release",
  "Indian education summit news",
  "NEP 2020 conference press",
  "Kurukshetra University education summit",
  "national education coverage India",
  "Hindi education press release",
  "international education delegates India",
  "Department of Holistic Education media",
];

export const PRESS_CANONICAL_URL = `${SITE_URL}/press`;

export type PressLocaleFilter = "all" | "en" | "hi";

export type PressReleaseCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  heroImage: string;
  locale: "en" | "hi";
  datePublished?: string;
  edition?: string;
  accent: string;
  featured?: boolean;
};

const ACCENTS = [
  "from-brand-navy to-slate-800",
  "from-blue-600 to-indigo-800",
  "from-emerald-600 to-teal-800",
  "from-orange-500 to-red-600",
  "from-violet-600 to-indigo-800",
] as const;

const EDITION_BY_SLUG: Record<string, string> = {
  "baton-ceremony-smk-4": "4.0",
  "shiksha-mahakumbh-4-0": "4.0",
  "education-summit-coverage": "4.0",
  "residential-camp-success": "4.0",
  "residential-camp-hindi": "2.0",
  "national-coverage": "4.0",
  "summit-highlights": "4.0",
  "mahakumbh-programme-update": "4.0",
  "education-movement": "4.0",
};

const FEATURED_SLUG = "education-summit-coverage";

export const PRESS_QUICK_LINKS = [
  { label: "Media Centre", href: "/media-center", icon: "📺" },
  { label: "Photo Gallery", href: "/gallery", icon: "📷" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
  { label: "Souvenir Abstracts", href: "/publications/souvenir-abstracts-mtc", icon: "📖" },
  { label: "Brochures", href: "/downloads", icon: "📥" },
  { label: "Past Editions", href: "/past-events", icon: "🗓️" },
] as const;

function isHindiText(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

function normalizeKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function localeFor(title: string, declared?: string): "en" | "hi" {
  const detected = isHindiText(title) ? "hi" : "en";
  if (declared === "hi") return "hi";
  if (detected === "hi") return "hi";
  return declared === "en" ? "en" : detected;
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function excerptFromArticle(article: PressArticleRecord): string {
  const titleKey = normalizeKey(article.title);
  const excerpt = article.excerpt.trim();
  if (excerpt && normalizeKey(excerpt) !== titleKey) return excerpt;

  const richSection = article.sections.find((section) => {
    const text = stripHtml(section.body);
    return text.length > 48 && normalizeKey(section.title) !== titleKey;
  });
  if (richSection) {
    const text = stripHtml(richSection.body);
    return text.length > 200 ? `${text.slice(0, 197)}…` : text;
  }

  const introSection = article.sections.find((section) => stripHtml(section.body).length > 48);
  if (introSection) {
    const text = stripHtml(introSection.body);
    return text.length > 200 ? `${text.slice(0, 197)}…` : text;
  }

  return excerpt || article.title;
}

function getFeaturedPressArticle(): PressArticleRecord {
  return PRESS_ARTICLES.find((a) => a.slug === FEATURED_SLUG) ?? PRESS_ARTICLES[0]!;
}

export const PRESS_HUB_OG_IMAGE = `${SITE_URL}${getFeaturedPressArticle().heroImage}`;

export function pressImageAlt(release: Pick<PressReleaseCard, "title">): string {
  return release.title.trim();
}

/** Canonical catalog — static articles first; CMS rows only if unique slug + title. */
export function buildPressCatalog(cmsArticles: CmsArticleCard[] = []): PressReleaseCard[] {
  const bySlug = new Map<string, PressReleaseCard>();
  const titleKeys = new Set<string>();

  PRESS_ARTICLES.forEach((article, index) => {
    const card: PressReleaseCard = {
      id: article.slug,
      slug: article.slug,
      title: article.title,
      excerpt: excerptFromArticle(article),
      href: `/press/${article.slug}`,
      heroImage: article.heroImage,
      locale: localeFor(article.title, article.locale),
      datePublished: article.datePublished,
      edition: EDITION_BY_SLUG[article.slug],
      accent: ACCENTS[index % ACCENTS.length]!,
      featured: article.slug === FEATURED_SLUG,
    };
    bySlug.set(article.slug, card);
    titleKeys.add(normalizeKey(article.title));
  });

  for (const cms of cmsArticles) {
    if (bySlug.has(cms.slug)) continue;
    const titleKey = normalizeKey(cms.title);
    if (titleKeys.has(titleKey)) continue;

    const card: PressReleaseCard = {
      id: cms.id,
      slug: cms.slug,
      title: cms.title,
      excerpt: cms.excerpt ?? "",
      href: cms.href,
      heroImage: cms.heroImage ?? "/2024M/Press7.jpg",
      locale: localeFor(cms.title, cms.locale),
      edition: EDITION_BY_SLUG[cms.slug],
      accent: ACCENTS[bySlug.size % ACCENTS.length]!,
    };
    bySlug.set(cms.slug, card);
    titleKeys.add(titleKey);
  }

  const ordered = PRESS_ARTICLES.map((a) => bySlug.get(a.slug)).filter(Boolean) as PressReleaseCard[];
  const extraSlugs = new Set(PRESS_ARTICLES.map((a) => a.slug));
  const extras = Array.from(bySlug.values()).filter((c) => !extraSlugs.has(c.slug));
  return [...ordered, ...extras];
}

export function filterPressCatalog(
  catalog: PressReleaseCard[],
  filter: PressLocaleFilter
): PressReleaseCard[] {
  if (filter === "all") return catalog;
  return catalog.filter((c) => c.locale === filter);
}

export function getFeaturedPressRelease(catalog: PressReleaseCard[]): PressReleaseCard | undefined {
  return catalog.find((c) => c.featured) ?? catalog[0];
}
