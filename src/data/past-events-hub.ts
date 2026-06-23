import { impactStatistics } from "@/data/authority";
import { PROCEEDINGS_SOUVENIR_EDITIONS } from "@/data/proceedings-hub";
import { PAST_EDITIONS, UPCOMING_EDITION } from "@/data/past-editions";
import { SITE_URL } from "@/config/site";

export const PAST_EVENTS_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const PAST_EVENTS_HERO_IMAGE_ALT =
  "Shiksha Mahakumbh Abhiyan — archive of national education summit editions 1.0 through 5.0";

export const PAST_EVENTS_OG_IMAGE = `${SITE_URL}${PAST_EVENTS_HERO_IMAGE}`;

export const PAST_EVENTS_CANONICAL_URL = `${SITE_URL}/past-events`;

/**
 * Verified geography: SMK 1.0 documented 14 states & UTs among delegates.
 * India has 28 states + 8 union territories (36 total) — not 50+.
 */
export const PAST_EVENTS_STATES_UTS_PEAK = "14+";

const papersStat = impactStatistics.find((s) => s.label.includes("Research Papers"));
const institutionsStat = impactStatistics.find((s) => s.label.includes("Institutions"));

export const PAST_EVENTS_PAGE_HERO = {
  eyebrow: "शिक्षा महाकुंभ अभियान",
  titleLine: "Past Editions",
  titleHindi: "1.0 से 5.0 — राष्ट्रीय यात्रा",
  subtitle: `Five national editions across NITs and universities — delegates from ${PAST_EVENTS_STATES_UTS_PEAK} states & UTs at peak (SMK 1.0), from school education (1.0) to health-oriented higher education (5.0), with researchers and institutions from across Bharat and abroad.`,
} as const;

export const PAST_EVENTS_STATS = [
  { value: "5", label: "National editions", hint: "Completed through SMK 5.0" },
  {
    value: PAST_EVENTS_STATES_UTS_PEAK,
    label: "States & UTs",
    hint: "Peak at SMK 1.0 (India has 36 total)",
  },
  {
    value: `${papersStat?.value ?? 1200}${papersStat?.suffix ?? "+"}`,
    label: "Research papers",
    hint: "Presented movement-wide",
  },
  {
    value: `${institutionsStat?.value ?? 500}${institutionsStat?.suffix ?? "+"}`,
    label: "Institutions",
    hint: "Engaged nationwide",
  },
] as const;

export const PAST_EVENTS_QUICK_LINKS = [
  { label: "Edition Brochures (PDF)", href: "/downloads", icon: "📄" },
  { label: "About the Movement", href: "/introduction", icon: "📜" },
  { label: "Media Centre", href: "/media-center", icon: "📺" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
  { label: "Photo & Video Gallery", href: "/gallery", icon: "📷" },
  { label: "Register for SMK 6.0", href: "/registration", icon: "✅" },
] as const;

export const PAST_EVENTS_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/introduction" },
  { name: "Past Editions", path: "/past-events" },
] as const;

export const PAST_EVENTS_SEO_KEYWORDS = [
  "Shiksha Mahakumbh past editions",
  "Indian Education Conference",
  "Education Conclave India",
  "Department of Holistic Education",
  "National Education Event",
  "NEP 2020 conference",
  "Shiksha Mahakumbh proceedings",
  "NIT Jalandhar education summit",
  "NIPER Mohali Shiksha Mahakumbh",
] as const;

export function souvenirHrefForEdition(edition: string): string | undefined {
  return PROCEEDINGS_SOUVENIR_EDITIONS.find((s) => s.edition === edition)?.souvenirHref;
}

export function editionGalleryLinks(edition: string) {
  const record = PAST_EDITIONS.find((e) => e.edition === edition);
  if (!record) return null;
  return {
    siteGallery: "/gallery",
    digital: `/media/shiksha-mahakumbh/${edition}/digital`,
    print: `/media/shiksha-mahakumbh/${edition}/print`,
    drive: record.galleryUrl,
  };
}

export const PAST_EVENTS_UPCOMING_CTA = {
  title: UPCOMING_EDITION.title,
  venue: UPCOMING_EDITION.venue,
  dates: UPCOMING_EDITION.dates,
  theme: UPCOMING_EDITION.theme,
  registrationHref: UPCOMING_EDITION.registrationHref,
  learnMoreHref: UPCOMING_EDITION.href,
} as const;
