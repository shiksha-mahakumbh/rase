import { YOUTUBE_CHANNEL_URL } from "@/data/gallery-hub";
import {
  PAST_EDITIONS,
  mediaArchivePath,
} from "@/data/past-editions";
import { SITE_URL } from "@/config/site";
import type { CmsMediaCenterItem } from "@/lib/cms/types";

export const MEDIA_CENTER_PAGE_HERO = {
  eyebrow: "Media · Global Reach",
  title: "Media & Archives",
  subtitle:
    "Edition-wise digital and print coverage, press releases, photo galleries, and national media archives — documenting Shiksha Mahakumbh Abhiyan for delegates and institutions worldwide.",
} as const;

export const MEDIA_CENTER_STATS = [
  { label: "Editions", value: "1.0 – 5.0", hint: "Digital & print archives" },
  { label: "Press", value: "9+ releases", hint: "English & Hindi coverage" },
  { label: "Gallery", value: "Photos & video", hint: "Edition-wise albums" },
  { label: "Access", value: "Open web", hint: "National & international" },
] as const;

export const MEDIA_CENTER_SEO_KEYWORDS = [
  "Shiksha Mahakumbh media centre",
  "education press India",
  "Mahakumbh digital media archive",
  "Indian education conference coverage",
  "international education delegates media",
  "NEP 2020 summit coverage",
  "Kurukshetra University education summit",
  "NIT Shiksha Mahakumbh photos",
];

export const MEDIA_CENTER_CANONICAL_URL = `${SITE_URL}/media-center`;

export type MediaCenterTab = "all" | "editions" | "press" | "gallery";

export type MediaEditionCard = {
  id: string;
  edition: string;
  title: string;
  year: string;
  venue: string;
  theme: string;
  accent: string;
  imageSrc: string;
  digitalHref: string;
  printHref: string;
  galleryHref?: string;
  eventHref: string;
};

const EDITION_IMAGES: Record<string, string> = {
  "5.0": "/sm25printmedia/1.jpg",
  "4.0": "/images/smk4.jpg",
  "3.0": "/images/smk3.jpg",
  "2.0": "/branding/shiksha-mahakumbh-brand-hero.png",
  "1.0": "/branding/shiksha-mahakumbh-brand-hero.png",
};

const EDITION_ACCENTS: Record<string, string> = {
  "5.0": "from-violet-600 to-indigo-800",
  "4.0": "from-blue-600 to-indigo-800",
  "3.0": "from-orange-500 to-red-600",
  "2.0": "from-emerald-600 to-teal-800",
  "1.0": "from-brand-navy to-slate-800",
};

/** All completed editions — newest first */
export const MEDIA_EDITION_CARDS: MediaEditionCard[] = [...PAST_EDITIONS]
  .reverse()
  .map((e) => ({
    id: e.id,
    edition: e.edition,
    title: e.title,
    year: e.year,
    venue: e.venue,
    theme: e.theme,
    accent: EDITION_ACCENTS[e.edition] ?? "from-brand-navy to-slate-800",
    imageSrc: EDITION_IMAGES[e.edition] ?? "/branding/shiksha-mahakumbh-brand-hero.png",
    digitalHref: mediaArchivePath(e.edition, "digital"),
    printHref: mediaArchivePath(e.edition, "print"),
    galleryHref: e.galleryUrl,
    eventHref: e.href,
  }));

export const MEDIA_FEATURED_EDITION = MEDIA_EDITION_CARDS[0]!;

export const MEDIA_QUICK_LINKS = [
  {
    label: "Photo & Video Gallery",
    href: "/gallery",
    description: "Edition-wise albums & YouTube documentaries",
    icon: "📷",
    accent: "from-brand-saffron to-amber-500",
  },
  {
    label: "Press Releases",
    href: "/press",
    description: "Official announcements in English & Hindi",
    icon: "📰",
    accent: "from-brand-navy to-slate-700",
  },
  {
    label: "YouTube Channel",
    href: YOUTUBE_CHANNEL_URL,
    description: "Documentaries & national coverage",
    icon: "▶️",
    accent: "from-red-600 to-rose-800",
    external: true,
  },
  {
    label: "Brochures & Downloads",
    href: "/downloads",
    description: "Edition PDFs for global delegates",
    icon: "📥",
    accent: "from-emerald-600 to-teal-800",
  },
] as const;

export const MEDIA_RESOURCE_LINKS = [
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
  { label: "DHE Journal", href: "https://pub.dhe.org.in", icon: "📘", external: true },
  { label: "Best Wishes", href: "/best-wishes", icon: "🙏" },
  { label: "Past Editions", href: "/past-events", icon: "🗓️" },
] as const;

export const PRESS_HIGHLIGHT_LINKS = [
  { label: "Baton Ceremony — SMK 4.0", href: "/press/baton-ceremony-smk-4" },
  { label: "Shiksha Mahakumbh 4.0 at Kurukshetra", href: "/press/shiksha-mahakumbh-4-0" },
  { label: "Residential Camp Success", href: "/press/residential-camp-success" },
  { label: "National Coverage", href: "/press/national-coverage" },
  { label: "Education Summit Coverage", href: "/press/education-summit-coverage" },
  { label: "All press releases", href: "/press" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  press_release: "Press",
  photo_gallery: "Gallery",
  interview: "Interview",
  publication: "Publication",
  video: "Video",
  document: "Document",
};

export function mediaCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

/** Remove duplicate CMS rows (same slug, href, or title). */
export function dedupeMediaCenterItems(items: CmsMediaCenterItem[]): CmsMediaCenterItem[] {
  const seen = new Set<string>();
  const out: CmsMediaCenterItem[] = [];

  for (const item of items) {
    const key = (item.slug ?? item.href ?? item.title).toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

export function partitionMediaItems(items: CmsMediaCenterItem[]) {
  const deduped = dedupeMediaCenterItems(items);
  const press = deduped.filter((i) => i.category === "press_release");
  const highlights = deduped.filter((i) => i.category !== "press_release");
  return { press, highlights, all: deduped };
}
