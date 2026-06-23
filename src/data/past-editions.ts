import { SITE_NAME_HINDI } from "@/config/site";
import {
  EDITION_LEGACY_PATHS,
  SMK_1_0_PATH,
  SMK_2_0_PATH,
  SMK_3_0_PATH,
  SMK_4_0_PATH,
  SMK_5_0_PATH,
} from "@/data/editions/paths";

/** Display title for an edition e.g. शिक्षा महाकुंभ 2.0 */
export function editionTitle(edition: string) {
  return `${SITE_NAME_HINDI.replace(" अभियान", "")} ${edition}`;
}

/**
 * Canonical Shiksha Mahakumbh Abhiyan past editions (1.0–5.0).
 * Single source of truth — do not duplicate edition facts elsewhere.
 */

export type PastEditionRecord = {
  id: string;
  edition: string;
  title: string;
  venue: string;
  venueFull: string;
  dates: string;
  dateStart: string;
  dateEnd?: string;
  theme: string;
  /** Core essence / Mool Tatva */
  coreEssence: string;
  impact: string;
  href: string;
  galleryUrl?: string;
  campaignPdf?: string;
  imageSrc?: string;
  /** Top stats for hub timeline cards */
  featuredStats?: readonly { label: string; value: string }[];
  /** Online proceedings reader path when a volume exists */
  proceedingHref?: string;
  year: string;
};

export const PAST_EDITIONS: PastEditionRecord[] = [
  {
    id: "smk-1",
    edition: "1.0",
    title: editionTitle("1.0"),
    venue: "NIT Jalandhar",
    venueFull: "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar",
    dates: "9–11 June 2023",
    dateStart: "2023-06-09",
    dateEnd: "2023-06-11",
    theme: "Recent Advances in School Education",
    coreEssence: "A strong beginning in innovation within school education",
    impact:
      "Initiated national dialogue on foundational reforms, introduced community-driven school models, and generated a best practices compendium on K–12 innovations.",
    href: SMK_1_0_PATH,
    galleryUrl:
      "https://drive.google.com/drive/folders/1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq",
    campaignPdf: "/RASE_2023_1ST_EDITION_Campaign.pdf",
    imageSrc: "/2023M/k5.jpeg",
    proceedingHref: "/proceeding2",
    featuredStats: [
      { label: "Research papers", value: "81" },
      { label: "Footfall", value: "5,000+" },
      { label: "States & UTs", value: "14" },
    ],
    year: "2023",
  },
  {
    id: "smk-2",
    edition: "2.0",
    title: editionTitle("2.0"),
    venue: "NIT Kurukshetra",
    venueFull: "National Institute of Technology, Kurukshetra",
    dates: "20 December 2023",
    dateStart: "2023-12-20",
    theme: "Role of Academic-driven Startups in Economy",
    coreEssence: "From Education to Startups, Startups to Economy",
    impact:
      "Sparked nationwide collaboration between academia and entrepreneurship, resulting in MoUs, startup incubation, and industry-institution integration plans.",
    href: SMK_2_0_PATH,
    galleryUrl:
      "https://drive.google.com/drive/folders/1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ",
    campaignPdf: "/RASE_2023_2ND_EDITION_Campaign.pdf",
    imageSrc: "/2023K/k1.jpg",
    proceedingHref: "/proceeding1",
    featuredStats: [
      { label: "Proceedings papers", value: "65" },
      { label: "Footfall", value: "5,000+" },
      { label: "Participants", value: "2,000+" },
    ],
    year: "2023",
  },
  {
    id: "smk-3",
    edition: "3.0",
    title: editionTitle("3.0"),
    venue: "NIT Srinagar",
    venueFull: "National Institute of Technology, Srinagar",
    dates: "29–30 June 2024",
    dateStart: "2024-06-29",
    dateEnd: "2024-06-30",
    theme: "Role of Academic-driven Startups in Developing Economy of J & K",
    coreEssence: "From Education to Enterprise, Enterprise to Regional Development",
    impact:
      "Focused on peace-building and economic empowerment through education in conflict-prone zones; initiated local skilling programs and startup mentorship cells.",
    href: SMK_3_0_PATH,
    galleryUrl:
      "https://drive.google.com/drive/folders/1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk",
    campaignPdf: "/RASE_2024_3RD_EDITION_Campaign.pdf",
    imageSrc: "/sk24printmedia/1.jpg",
    proceedingHref: "/proceeding3",
    featuredStats: [
      { label: "Research papers", value: "59" },
      { label: "Participation", value: "1,800+" },
      { label: "Schools", value: "156" },
    ],
    year: "2024",
  },
  {
    id: "smk-4",
    edition: "4.0",
    title: editionTitle("4.0"),
    venue: "Kurukshetra University",
    venueFull: "Kurukshetra University, Kurukshetra",
    dates: "16–17 December 2024",
    dateStart: "2024-12-16",
    dateEnd: "2024-12-17",
    theme: "Indian Education System for Global Development",
    coreEssence: "Indian Education as a Global Solution",
    impact:
      "Developed a national vision document for Bhartiya as a global education hub, rooted in NEP 2020 and Bhartiya knowledge systems.",
    href: SMK_4_0_PATH,
    galleryUrl:
      "https://drive.google.com/drive/folders/1XnauGu1-dQ2KCpTzvIMHhUwlBF-6GDEN",
    campaignPdf: "/RASE_2024_4TH_EDITION_Campaign.pdf",
    imageSrc: "/sm24printmedia/1-lcp.webp",
    featuredStats: [
      { label: "Research papers", value: "91" },
      { label: "Attendees", value: "2,400+" },
      { label: "Conclaves", value: "21" },
    ],
    year: "2024",
  },
  {
    id: "smk-5",
    edition: "5.0",
    title: editionTitle("5.0"),
    venue: "NIPER Mohali",
    venueFull: "National Institute of Pharmaceutical Education and Research, Mohali",
    dates: "31 October – 2 November 2025",
    dateStart: "2025-10-31",
    dateEnd: "2025-11-02",
    theme: "Classroom to Society: Building a Healthier World through Education",
    coreEssence: "The Journey of Education from Classroom to Society",
    impact:
      "Advanced the national dialogue on linking classroom learning with societal wellbeing and health-oriented education outcomes.",
    href: SMK_5_0_PATH,
    galleryUrl:
      "https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=sharing",
    imageSrc: "/sm25printmedia/1-lcp.webp",
    featuredStats: [
      { label: "Research papers", value: "284" },
      { label: "Olympiad students", value: "10,400" },
      { label: "Conclaves", value: "10" },
    ],
    year: "2025",
  },
];

export const PAST_EDITION_BY_ID = Object.fromEntries(
  PAST_EDITIONS.map((e) => [e.id, e])
) as Record<string, PastEditionRecord>;

const EDITION_HREF_ALIASES: Record<string, string> = EDITION_LEGACY_PATHS;

export function getEditionByHref(href: string): PastEditionRecord | undefined {
  const canonical = EDITION_HREF_ALIASES[href] ?? href;
  return PAST_EDITIONS.find((e) => e.href === canonical);
}

export type EditionPageHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: "brand";
  /** Omitted on detail pages — gallery is the single LCP image. */
  imageSrc?: string;
};

/** Shared brand hero config for `/past_event/*` detail pages (text-only; no hero image). */
export function editionPageHero(href: string): EditionPageHero {
  const edition = getEditionByHref(href);
  if (!edition) {
    throw new Error(`Unknown edition href: ${href}`);
  }
  return {
    eyebrow: "शिक्षा महाकुंभ अभियान",
    title: edition.title,
    subtitle: `${edition.venue} · ${edition.dates} · ${edition.theme}`,
    accent: "brand",
  };
}

/** Canonical media archive URL — /media/shiksha-mahakumbh/{edition}/{type} */
export function mediaArchivePath(edition: string, type: "digital" | "print") {
  return `/media/shiksha-mahakumbh/${edition}/${type}`;
}

export function getEditionByNumber(edition: string): PastEditionRecord | undefined {
  return PAST_EDITIONS.find((e) => e.edition === edition);
}

/** Previous / next edition cards for detail page navigation */
export function getAdjacentEditions(editionNumber: string): {
  prev?: PastEditionRecord;
  next?: PastEditionRecord;
} {
  const idx = PAST_EDITIONS.findIndex((e) => e.edition === editionNumber);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? PAST_EDITIONS[idx - 1] : undefined,
    next: idx < PAST_EDITIONS.length - 1 ? PAST_EDITIONS[idx + 1] : undefined,
  };
}

/** Upcoming edition 6.0 — single source for hero/widgets */
export const UPCOMING_EDITION = {
  edition: "6.0",
  title: editionTitle("6.0"),
  venue: "NIT Hamirpur",
  venueFull: "National Institute of Technology, Hamirpur",
  dates: "9–11 October 2026",
  theme: "Current National Edition",
  coreEssence: "Registration open for delegates, researchers, institutions, and volunteers",
  href: "/upcoming-events",
  registrationHref: "/registration",
} as const;

/** Authority strip / homepage widgets — derived from PAST_EDITIONS + upcoming */
export function buildAuthorityPastEditions() {
  const upcoming = {
    year: "2026",
    title: UPCOMING_EDITION.title,
    venue: `${UPCOMING_EDITION.venue} · ${UPCOMING_EDITION.dates}`,
    highlight: UPCOMING_EDITION.coreEssence,
    href: UPCOMING_EDITION.registrationHref,
  };
  const completed = [...PAST_EDITIONS].reverse().map((e) => ({
    year: e.year,
    title: e.title,
    venue: `${e.venue} · ${e.dates}`,
    highlight: e.theme,
    href: e.href,
  }));
  return [upcoming, ...completed];
}

export const PAST_EDITIONS_SEO_KEYWORDS = [
  "Shiksha Mahakumbh",
  "Shiksha Mahakumbh Abhiyan",
  "Department of Holistic Education",
  "Indian Education Conference",
  "Education Conclave India",
  "Research Conference India",
  "Academic Innovation Summit",
  "National Education Event",
  "School Education Conference",
  "Higher Education Summit",
  "NEP 2020 conference India",
  "NIT Jalandhar education summit",
  "NIT Srinagar Jammu Kashmir",
  "Kurukshetra University education",
  "NIPER Mohali health education",
];
