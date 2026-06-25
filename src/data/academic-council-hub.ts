import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { SITE_URL } from "@/config/site";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import { ACADEMIC_PUBLICATION_NOTE } from "@/data/academic-council-tracks";
import {
  ACADEMIC_COUNCIL_EVENT,
  ACADEMIC_COUNCIL_HERO,
  ACADEMIC_COUNCIL_SEO,
  ACADEMIC_COUNCIL_STATS,
  ACADEMIC_PROGRAMME_HUB,
  type AcademicCouncilTabId,
} from "@/data/academic-council-content";

export const ACADEMIC_COUNCIL_PATH = CANONICAL_ROUTES.departments.academicCouncil;

export const ACADEMIC_COUNCIL_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const ACADEMIC_COUNCIL_HERO_IMAGE_ALT =
  "Shiksha Mahakumbh 6.0 Academic Council — multi-track conference, conclaves, and DHE Olympiads at NIT Hamirpur";

export const ACADEMIC_COUNCIL_OG_IMAGE = `${SITE_URL}${ACADEMIC_COUNCIL_HERO_IMAGE}`;

export const ACADEMIC_COUNCIL_CANONICAL_URL = `${SITE_URL}${ACADEMIC_COUNCIL_PATH}`;

export { ACADEMIC_COUNCIL_HERO as ACADEMIC_COUNCIL_PAGE_HERO };
export { ACADEMIC_COUNCIL_SEO };

export const ACADEMIC_COUNCIL_HUB_STATS = [
  { label: "Dates", value: "9–11 Oct 2026", hint: "NIT Hamirpur summit" },
  { label: "Conference Tracks", value: "15", hint: ACADEMIC_COUNCIL_STATS[0].hint },
  { label: "Thematic Conclaves", value: "7", hint: ACADEMIC_COUNCIL_STATS[1].hint },
  { label: "Olympiad Streams", value: "3", hint: ACADEMIC_COUNCIL_STATS[2].hint },
] as const;

/** Introduction is the nearest parent hub for department vibhags (no /departments index). */
export const ACADEMIC_COUNCIL_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: CANONICAL_ROUTES.introduction },
  { name: "Academic Council", path: ACADEMIC_COUNCIL_PATH },
] as const;

export const ACADEMIC_COUNCIL_QUICK_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  external?: boolean;
}> = [
  { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration },
  { label: "Submit Paper (CMT)", href: CMT_SUBMISSION_URL, external: true },
  { label: "Edition 6.0 Brochure", href: `${CANONICAL_ROUTES.downloads}#edition-brochures` },
  { label: "Organising Committee", href: committeePathForEdition("6.0") },
  { label: "Proceedings", href: "/proceedings" },
  { label: "Workshops", href: "/workshops" },
];

export const ACADEMIC_COUNCIL_TAB_SLUGS: Record<AcademicCouncilTabId, string> = {
  OverviewPage: "overview",
  ConferencePage: "conference",
  ConclavePage: "conclave",
  AwardsPage: "awards",
  OlympiadPage: "olympiad",
  ExhibitionPage: "exhibition",
  ProjectsPage: "projects",
  BestPracticesPage: "best-practices",
  PatrikaPage: "bal-shodh-patrika",
  CulturalPage: "cultural",
};

const SLUG_TO_TAB_ID = Object.fromEntries(
  Object.entries(ACADEMIC_COUNCIL_TAB_SLUGS).map(([id, slug]) => [slug, id])
) as Record<string, AcademicCouncilTabId>;

export function academicCouncilTabFromSlug(slug: string | null | undefined): AcademicCouncilTabId {
  if (!slug || slug === "overview") return "OverviewPage";
  return SLUG_TO_TAB_ID[slug] ?? "OverviewPage";
}

export function academicCouncilTabSlug(tabId: AcademicCouncilTabId): string {
  return ACADEMIC_COUNCIL_TAB_SLUGS[tabId];
}

export function academicCouncilProgrammeUrl(tabId: AcademicCouncilTabId): string {
  const slug = academicCouncilTabSlug(tabId);
  if (slug === "overview") return ACADEMIC_COUNCIL_PATH;
  return `${ACADEMIC_COUNCIL_PATH}#${slug}`;
}

export function academicCouncilProgrammeItemsForSchema(): { name: string; url: string }[] {
  return ACADEMIC_PROGRAMME_HUB.map((section) => ({
    name: section.titleEn,
    url: `${ACADEMIC_COUNCIL_CANONICAL_URL}#${academicCouncilTabSlug(section.tabId)}`,
  }));
}

export const ACADEMIC_COUNCIL_FAQ = [
  {
    question: "When and where is Shiksha Mahakumbh 6.0 Academic Council?",
    answer: `The Academic Council programmes run 9–11 October 2026 at ${ACADEMIC_COUNCIL_EVENT.venue}, ${ACADEMIC_COUNCIL_EVENT.location}.`,
  },
  {
    question: "How many conference tracks are there?",
    answer:
      "The multi-track international conference spans 15 thematic tracks — from fundamental sciences and engineering to education, health, culture, and Indian Knowledge Systems. Each track has dedicated chair, co-chair, and convenor leadership listed on the Conference tab.",
  },
  {
    question: "How do I submit a research paper?",
    answer: `Authors submit via the official Microsoft CMT portal for Shiksha Mahakumbh 6.0 (${CMT_SUBMISSION_URL}). ${ACADEMIC_PUBLICATION_NOTE}`,
  },
  {
    question: "When do DHE Olympiad registrations open?",
    answer:
      "Olympiad registration and exam dates for Classes 3–10 are to be announced. Top achievers will be felicitated at Shiksha Mahakumbh 6.0 (9–11 Oct 2026, NIT Hamirpur). Apply via the registration hub when open.",
  },
  {
    question: "Who can I contact for academic enquiries?",
    answer: `For papers, Olympiads, awards, and programme submissions: ${ACADEMIC_COUNCIL_EVENT.contactEmail}. For general summit enquiries: info@shikshamahakumbh.com. WhatsApp: ${ACADEMIC_COUNCIL_EVENT.contactPhone}.`,
  },
] as const;
