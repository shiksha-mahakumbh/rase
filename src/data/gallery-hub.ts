import {
  getEditionByNumber,
  mediaArchivePath,
  PAST_EDITIONS,
  UPCOMING_EDITION,
  editionTitle,
} from "@/data/past-editions";
import { SITE_URL } from "@/config/site";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@ShikshaMahakumbh";

const DEFAULT_GALLERY_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

/** Featured YouTube coverage per edition — falls back to channel when unset */
export const EDITION_YOUTUBE_URLS: Record<string, string> = {
  "1.0": "https://youtu.be/uzQgxD5Bojk",
  "2.0": "https://youtu.be/9c9RHrsVU5A",
  "3.0": "https://www.youtube.com/watch?v=FFfdSd8_XOw",
  "4.0": "https://www.youtube.com/live/gUWl_xMBU2o",
  "5.0": "https://www.youtube.com/live/VsVFo0GGdkk",
};

export type GalleryTab = "photos" | "videos";

export type GalleryPhotoLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type GalleryEdition = {
  id: string;
  edition: string;
  title: string;
  year: string;
  venue: string;
  dates: string;
  theme: string;
  status: "available" | "coming_soon";
  pastEventHref?: string;
  accent: string;
  imageSrc: string;
  imageAlt: string;
  photoLinks: GalleryPhotoLink[];
  youtubeUrl?: string;
  videoTitle: string;
  videoDescription: string;
};

export const GALLERY_PAGE_HERO = {
  eyebrow: "Media Centre",
  title: "Photo & Video Gallery",
  subtitle:
    "Edition-wise albums and documentaries from Shiksha Mahakumbh Abhiyan — a national education movement reaching institutions, policymakers, and communities across India and beyond.",
} as const;

export const GALLERY_STATS = [
  {
    label: "Editions",
    value: "1.0 — 6.0",
    hint: "Archive & upcoming programme",
  },
  {
    label: "Photos",
    value: "Drive albums",
    hint: "High-resolution event galleries",
  },
  {
    label: "Videos",
    value: "YouTube",
    hint: "Documentaries & conference coverage",
  },
  {
    label: "Reach",
    value: "National",
    hint: "NITs, universities & global delegates",
  },
] as const;

export const GALLERY_QUICK_LINKS = [
  { label: "Media Centre", href: "/media-center", icon: "📺" },
  { label: "Press Releases", href: "/press", icon: "📰" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
  { label: "Souvenir Abstracts", href: "/publications/souvenir-abstracts-mtc", icon: "📖" },
  { label: "Past Editions", href: "/past-events", icon: "🗓️" },
  { label: "Brochures", href: "/downloads", icon: "📥" },
] as const;

function galleryEditionImageAlt(
  edition: Pick<GalleryEdition, "title" | "venue" | "year" | "edition">
): string {
  return `${edition.title} — ${edition.venue} ${edition.year} (Edition ${edition.edition})`;
}

function editionCore(num: string) {
  const e = getEditionByNumber(num)!;
  return {
    title: e.title,
    year: e.year,
    venue: e.venue,
    dates: e.dates,
    theme: e.theme,
    pastEventHref: e.href,
    imageSrc: e.imageSrc ?? DEFAULT_GALLERY_IMAGE,
    imageAlt: galleryEditionImageAlt({
      title: e.title,
      venue: e.venue,
      year: e.year,
      edition: e.edition,
    }),
  };
}

function standardPhotoLinks(
  edition: string,
  extras: GalleryPhotoLink[] = []
): GalleryPhotoLink[] {
  const e = getEditionByNumber(edition)!;
  return [
    ...(e.galleryUrl
      ? [{ label: "Mahakumbh Photos", href: e.galleryUrl, external: true as const }]
      : []),
    { label: `Digital Media ${edition}`, href: mediaArchivePath(edition, "digital") },
    { label: `Print Media ${edition}`, href: mediaArchivePath(edition, "print") },
    ...extras,
    ...(e.campaignPdf
      ? [{ label: "Campaign Details", href: e.campaignPdf, external: true as const }]
      : []),
    { label: "Edition Page", href: e.href },
  ];
}

/** Edition-wise photo albums — sourced from past-editions + media archives */
export const GALLERY_EDITIONS: GalleryEdition[] = [
  {
    id: "smk-6",
    edition: "6.0",
    title: editionTitle("6.0"),
    year: "2026",
    venue: UPCOMING_EDITION.venue,
    dates: UPCOMING_EDITION.dates,
    theme: UPCOMING_EDITION.theme,
    pastEventHref: UPCOMING_EDITION.href,
    status: "coming_soon",
    accent: "from-brand-navy via-brand-navy-light to-slate-700",
    imageSrc: DEFAULT_GALLERY_IMAGE,
    imageAlt: `${editionTitle("6.0")} — ${UPCOMING_EDITION.venue} 2026`,
    photoLinks: [],
    videoTitle: "Edition 6.0 coverage",
    videoDescription: "Photos and documentaries will be published after the event.",
  },
  {
    id: "smk-5",
    edition: "5.0",
    ...editionCore("5.0"),
    status: "available",
    accent: "from-violet-600 to-indigo-800",
    photoLinks: standardPhotoLinks("5.0", [
      {
        label: "UT Ladakh coverage",
        href: "https://ladakh.gov.in/shiksha-mahakumbh-abhiyan-2025/",
        external: true,
      },
    ]),
    youtubeUrl: EDITION_YOUTUBE_URLS["5.0"],
    videoTitle: "Edition 5.0 documentaries",
    videoDescription: "NIPER Mohali summit highlights and sessions on YouTube.",
  },
  {
    id: "smk-4",
    edition: "4.0",
    ...editionCore("4.0"),
    status: "available",
    accent: "from-blue-600 to-indigo-800",
    photoLinks: standardPhotoLinks("4.0", [
      { label: "Baton Ceremony", href: "/BatonCeremony" },
      { label: "Residential Camp", href: "/ResidentialCamp" },
    ]),
    youtubeUrl: EDITION_YOUTUBE_URLS["4.0"],
    videoTitle: "Edition 4.0 documentaries",
    videoDescription: "Kurukshetra University conclave coverage and national summit highlights.",
  },
  {
    id: "smk-3",
    edition: "3.0",
    ...editionCore("3.0"),
    status: "available",
    accent: "from-orange-500 to-red-600",
    photoLinks: standardPhotoLinks("3.0"),
    youtubeUrl: EDITION_YOUTUBE_URLS["3.0"],
    videoTitle: "Edition 3.0 documentaries",
    videoDescription: "NIT Srinagar edition coverage on YouTube.",
  },
  {
    id: "smk-2",
    edition: "2.0",
    ...editionCore("2.0"),
    status: "available",
    accent: "from-amber-500 to-orange-700",
    photoLinks: standardPhotoLinks("2.0", [
      {
        label: "Day 1 Photos",
        href: "https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ",
        external: true,
      },
    ]),
    youtubeUrl: EDITION_YOUTUBE_URLS["2.0"],
    videoTitle: "Edition 2.0 documentaries",
    videoDescription: "RASE conference documentaries — watch on YouTube.",
  },
  {
    id: "smk-1",
    edition: "1.0",
    ...editionCore("1.0"),
    status: "available",
    accent: "from-emerald-600 to-teal-800",
    photoLinks: standardPhotoLinks("1.0", [
      {
        label: "Day 1 Photos",
        href: "https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq",
        external: true,
      },
    ]),
    youtubeUrl: EDITION_YOUTUBE_URLS["1.0"],
    videoTitle: "Edition 1.0 documentaries",
    videoDescription: "Founding RASE 2023 edition films on the official channel.",
  },
];

export const GALLERY_OG_IMAGE = `${SITE_URL}${getEditionByNumber("5.0")!.imageSrc ?? DEFAULT_GALLERY_IMAGE}`;

export { galleryEditionImageAlt };

export const GALLERY_SEO_KEYWORDS = [
  "Shiksha Mahakumbh gallery",
  "Shiksha Mahakumbh photos",
  "Shiksha Mahakumbh videos",
  "Indian education conference gallery",
  "National education summit photos",
  "Department of Holistic Education media",
  "NEP 2020 education event",
  "Shiksha Mahakumbh YouTube",
  ...PAST_EDITIONS.map((e) => `Shiksha Mahakumbh ${e.edition}`),
];

export const GALLERY_CANONICAL_URL = `${SITE_URL}/gallery`;
