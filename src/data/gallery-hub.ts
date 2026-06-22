import {
  getEditionByNumber,
  PAST_EDITIONS,
  UPCOMING_EDITION,
  editionTitle,
} from "@/data/past-editions";
import { SITE_URL } from "@/config/site";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@ShikshaMahakumbh";

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
  photoLinks: GalleryPhotoLink[];
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

function editionFromPast(num: string): Pick<
  GalleryEdition,
  "title" | "year" | "venue" | "dates" | "theme" | "pastEventHref"
> {
  const e = getEditionByNumber(num)!;
  return {
    title: e.title,
    year: e.year,
    venue: e.venue,
    dates: e.dates,
    theme: e.theme,
    pastEventHref: e.href,
  };
}

/** Edition-wise photo albums — sourced from legacy gallery grid + past-editions */
export const GALLERY_EDITIONS: GalleryEdition[] = [
  {
    id: "smk-6",
    edition: "6.0",
    ...{
      title: editionTitle("6.0"),
      year: "2026",
      venue: UPCOMING_EDITION.venue,
      dates: UPCOMING_EDITION.dates,
      theme: UPCOMING_EDITION.theme,
      pastEventHref: UPCOMING_EDITION.href,
    },
    status: "coming_soon",
    accent: "from-brand-navy via-brand-navy-light to-slate-700",
    photoLinks: [],
    videoTitle: "Edition 6.0 coverage",
    videoDescription: "Photos and documentaries will be published after the event.",
  },
  {
    id: "smk-5",
    edition: "5.0",
    ...editionFromPast("5.0"),
    status: "available",
    accent: "from-violet-600 to-indigo-800",
    photoLinks: [
      {
        label: "Mahakumbh Photos",
        href: "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=sharing",
        external: true,
      },
      { label: "Digital Media 5.0", href: "/media/shiksha-mahakumbh/5.0/digital" },
      { label: "Print Media 5.0", href: "/media/shiksha-mahakumbh/5.0/print" },
      {
        label: "UT Ladakh coverage",
        href: "https://ladakh.gov.in/shiksha-mahakumbh-abhiyan-2025/",
        external: true,
      },
      { label: "Edition Page", href: "/past_event/shiksha-mahakumbh-5.0" },
    ],
    videoTitle: "Edition 5.0 documentaries",
    videoDescription: "Highlights and sessions on the official YouTube channel.",
  },
  {
    id: "smk-4",
    edition: "4.0",
    ...editionFromPast("4.0"),
    status: "available",
    accent: "from-blue-600 to-indigo-800",
    photoLinks: [
      {
        label: "Mahakumbh Photos",
        href: "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
        external: true,
      },
      { label: "Baton Ceremony", href: "/BatonCeremony" },
      { label: "Residential Camp", href: "/ResidentialCamp" },
      {
        label: "Campaign Details",
        href: "/RASE_2024_4TH_EDITION_Campaign.pdf",
        external: true,
      },
      { label: "Edition Page", href: "/past_event/shiksha-mahakumbh-4.0" },
    ],
    videoTitle: "Edition 4.0 documentaries",
    videoDescription: "Conclave coverage and national summit highlights.",
  },
  {
    id: "smk-3",
    edition: "3.0",
    ...editionFromPast("3.0"),
    status: "available",
    accent: "from-orange-500 to-red-600",
    photoLinks: [
      {
        label: "Day 1 Photos",
        href: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
        external: true,
      },
      {
        label: "Day 2 Photos",
        href: "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
        external: true,
      },
      {
        label: "Campaign Details",
        href: "/RASE_2024_3RD_EDITION_Campaign.pdf",
        external: true,
      },
      { label: "Edition Page", href: "/past_event/shiksha-mahakumbh-3.0" },
    ],
    videoTitle: "Edition 3.0 documentaries",
    videoDescription: "Jammu & Kashmir edition coverage on YouTube.",
  },
  {
    id: "smk-2",
    edition: "2.0",
    ...editionFromPast("2.0"),
    status: "available",
    accent: "from-amber-500 to-orange-700",
    photoLinks: [
      {
        label: "Mahakumbh Photos",
        href: "https://drive.google.com/drive/folders/1T5HOcgbHQs6MNouIiWb0i4DGkrRd23vY",
        external: true,
      },
      {
        label: "Day 1 Photos",
        href: "https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ",
        external: true,
      },
      {
        label: "Campaign Details",
        href: "/RASE_2023_2ND_EDITION_Campaign.pdf",
        external: true,
      },
      { label: "Edition Page", href: "/past_event/shiksha-mahakumbh-2.0" },
    ],
    videoTitle: "Edition 2.0 documentaries",
    videoDescription: "RASE conference documentaries — watch on YouTube.",
  },
  {
    id: "smk-1",
    edition: "1.0",
    ...editionFromPast("1.0"),
    status: "available",
    accent: "from-emerald-600 to-teal-800",
    photoLinks: [
      {
        label: "Mahakumbh Photos",
        href: "https://drive.google.com/drive/folders/1u_rgXNeYBuwnLae7irG4NiHgEil69j16?usp=sharing",
        external: true,
      },
      {
        label: "Day 1 Photos",
        href: "https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq",
        external: true,
      },
      {
        label: "Campaign Details",
        href: "/RASE_2023_1ST_EDITION_Campaign.pdf",
        external: true,
      },
      { label: "Edition Page", href: "/past_event/shiksha-mahakumbh-1.0" },
    ],
    videoTitle: "Edition 1.0 documentaries",
    videoDescription: "Founding edition films on the official channel.",
  },
];

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
