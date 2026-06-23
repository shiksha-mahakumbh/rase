import {
  COMMITTEE_BROCHURES,
  COMMITTEE_BROCHURES_FOLDER_URL,
  getBrochureDownloadUrl,
  getBrochureViewUrl,
} from "@/data/committee-brochures";
import { COMMITTEE_EDITION_6_0 } from "@/data/committee-members/edition-6-0";
import { getEditionByNumber, PAST_EDITIONS, UPCOMING_EDITION } from "@/data/past-editions";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { SITE_URL } from "@/config/site";

export { COMMITTEE_BROCHURES_FOLDER_URL };

export const DOWNLOADS_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const DOWNLOADS_HERO_IMAGE_ALT =
  "Shiksha Mahakumbh Abhiyan edition brochures — official PDF downloads for national education delegates";

export const DOWNLOADS_OG_IMAGE = `${SITE_URL}${DOWNLOADS_HERO_IMAGE}`;

export const DOWNLOADS_CANONICAL_URL = `${SITE_URL}${CANONICAL_ROUTES.downloads}`;

export type EditionBrochureCard = {
  edition: string;
  year: string;
  venue: string;
  dates: string;
  theme: string;
  fileName: string;
  fileSize: string;
  viewUrl: string;
  downloadUrl: string;
  eventHref: string;
  committeeHref: string;
  imageSrc: string;
  status: "upcoming" | "completed";
};

export const DOWNLOADS_HUB_STATS = [
  { label: "Edition Brochures", value: "6", hint: "PDF editions 1.0–6.0" },
  { label: "Global Access", value: "Free", hint: "Open download for all delegates" },
  { label: "Languages", value: "EN + HI", hint: "Bilingual programme content" },
  { label: "Formats", value: "PDF", hint: "Print-ready official brochures" },
] as const;

export const DOWNLOADS_PAGE_HERO = {
  eyebrow: "Official Resources · National & International Delegates",
  title: "Edition Brochures & Download Centre",
  subtitle:
    "Download official Shiksha Mahakumbh Abhiyan brochures for editions 1.0 through 6.0 — programmes, conclaves, registration details, and global participation information in print-ready PDF format.",
} as const;

export const DOWNLOADS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Resources", path: CANONICAL_ROUTES.mediaCenter },
  { name: "Brochures & Downloads", path: CANONICAL_ROUTES.downloads },
] as const;

export const DOWNLOADS_QUICK_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  icon: string;
  external?: boolean;
}> = [
  { label: "Organising Committees", href: CANONICAL_ROUTES.committees, icon: "👥" },
  { label: "Past Editions", href: CANONICAL_ROUTES.pastEvents, icon: "🗓️" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
  { label: "Media Centre", href: CANONICAL_ROUTES.mediaCenter, icon: "📺" },
  { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration, icon: "✅" },
  {
    label: "All Brochures (Google Drive)",
    href: COMMITTEE_BROCHURES_FOLDER_URL,
    icon: "📄",
    external: true,
  },
];

export const DOWNLOADS_SEO_KEYWORDS = [
  "Shiksha Mahakumbh brochure",
  "edition brochure PDF",
  "Shiksha Mahakumbh downloads",
  "education conference brochure India",
  "NEP 2020 conference materials",
  "international education delegates",
  "Department of Holistic Education PDF",
  "NIT Hamirpur Shiksha Mahakumbh 6.0",
] as const;

export const DOWNLOADS_UPCOMING_CTA = {
  title: UPCOMING_EDITION.title,
  venue: UPCOMING_EDITION.venue,
  dates: UPCOMING_EDITION.dates,
  theme: COMMITTEE_EDITION_6_0.theme,
  registrationHref: UPCOMING_EDITION.registrationHref,
  learnMoreHref: UPCOMING_EDITION.href,
  committeeHref: committeePathForEdition("6.0"),
  eventHref: COMMITTEE_EDITION_6_0.eventHref,
} as const;

export function downloadsMetaDescription(): string {
  return "Download official Shiksha Mahakumbh Abhiyan edition brochures (PDF) for editions 1.0–6.0, plus reports, guidelines, and circulars. Free access for national and international education delegates.";
}

export function editionBrochureImageSrc(edition: string): string {
  return getEditionByNumber(edition)?.imageSrc ?? DOWNLOADS_HERO_IMAGE;
}

function committeeHrefForEdition(edition: string): string {
  return committeePathForEdition(edition);
}

export const EDITION_BROCHURES: EditionBrochureCard[] = COMMITTEE_BROCHURES.map(
  (brochure) => {
    const past = PAST_EDITIONS.find((e) => e.edition === brochure.edition);
    const upcoming = brochure.edition === "6.0";

    return {
      edition: brochure.edition,
      year: past?.year ?? COMMITTEE_EDITION_6_0.year,
      venue: past?.venue ?? COMMITTEE_EDITION_6_0.venue,
      dates: past?.dates ?? COMMITTEE_EDITION_6_0.dates,
      theme: past?.theme ?? COMMITTEE_EDITION_6_0.theme,
      fileName: brochure.fileName,
      fileSize: brochure.fileSize,
      viewUrl: getBrochureViewUrl(brochure.driveFileId),
      downloadUrl: getBrochureDownloadUrl(brochure.driveFileId),
      eventHref: past?.href ?? COMMITTEE_EDITION_6_0.eventHref,
      committeeHref: committeeHrefForEdition(brochure.edition),
      imageSrc: editionBrochureImageSrc(brochure.edition),
      status: (upcoming ? "upcoming" : "completed") as EditionBrochureCard["status"],
    };
  }
).sort((a, b) => parseFloat(b.edition) - parseFloat(a.edition));

export function getUpcomingBrochure(): EditionBrochureCard | undefined {
  return EDITION_BROCHURES.find((b) => b.edition === "6.0");
}
