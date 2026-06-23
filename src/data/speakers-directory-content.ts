/** English UI & SEO copy for /speakers/directory — speaker names stay in data file */

import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { totalAbhiyanSpeakerCount } from "@/data/mahakumbh-abhiyan-speakers";
import { UPCOMING_EDITION } from "@/data/past-editions";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";
import { SITE_URL } from "@/config/site";

export const SPEAKERS_DIRECTORY_PATH = CANONICAL_ROUTES.speakers;

export const SPEAKERS_DIRECTORY_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const SPEAKERS_DIRECTORY_HERO_IMAGE_ALT =
  "Shiksha Mahakumbh Abhiyan speaker directory — dignitaries and experts across national education summits";

export const SPEAKERS_DIRECTORY_OG_IMAGE = `${SITE_URL}${SPEAKERS_DIRECTORY_HERO_IMAGE}`;

export const SPEAKERS_DIRECTORY_CANONICAL_URL = `${SITE_URL}${SPEAKERS_DIRECTORY_PATH}`;

export const SPEAKERS_DIRECTORY_HERO = {
  eyebrow: "Shiksha Mahakumbh Abhiyan · Department of Holistic Education",
  title: "Speaker Directory",
  titleEditionLine: "Editions 1.0 – 5.0",
  subtitle:
    "Complete directory of dignitaries, leaders, and experts across Shiksha Mahakumbh editions 1.0 through 5.0 — sourced from the Abhiyan photo frame and edition archives.",
  titleHi: "वक्ता सूची",
} as const;

export const SPEAKERS_DIRECTORY_INTRO = {
  headingHi: "वक्ता एवं गरिमामयी विभाग",
  description:
    "Vice-chancellors, directors, policymakers, innovators, and social leaders — searchable by name, role, or organization.",
} as const;

export const SPEAKERS_DIRECTORY_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/introduction" },
  { name: "Speaker Directory", path: SPEAKERS_DIRECTORY_PATH },
] as const;

export const SPEAKERS_DIRECTORY_QUICK_LINKS = [
  { label: "Abhiyan Photo Frame", href: "/abhiyaninphotoframe", icon: "📜" },
  { label: "Organising Committees", href: "/committees", icon: "👥" },
  { label: "Past Editions", href: "/past-events", icon: "🗓️" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
  { label: "Media Centre", href: "/media-center", icon: "📺" },
  { label: "Register for SMK 6.0", href: "/registration", icon: "✅" },
] as const;

export const SPEAKERS_DIRECTORY_UPCOMING_NOTE = {
  title: UPCOMING_EDITION.title,
  venue: UPCOMING_EDITION.venue,
  dates: UPCOMING_EDITION.dates,
  registrationHref: UPCOMING_EDITION.registrationHref,
  committeeHref: committeePathForEdition("6.0"),
  message:
    "Edition 6.0 speaker listings will be published after the summit. Register now or explore the organising committee.",
} as const;

export function speakersDirectoryMetaDescription(): string {
  const total = totalAbhiyanSpeakerCount();
  return `Complete speaker directory for Shiksha Mahakumbh Abhiyan — ${total} dignitaries, vice-chancellors, directors, policymakers, and experts across editions 1.0 to 5.0.`;
}

export const EDITION_DIRECTORY_ACCENTS: Record<
  string,
  { header: string; badge: string; border: string }
> = {
  "1.0": {
    header: "from-brand-blue to-brand-blue/85",
    badge: "bg-brand-blue/15 text-brand-blue",
    border: "border-brand-blue/25",
  },
  "2.0": {
    header: "from-brand-saffron to-brand-saffron/85",
    badge: "bg-brand-saffron/20 text-brand-navy",
    border: "border-brand-saffron/30",
  },
  "3.0": {
    header: "from-brand-emerald to-emerald-600",
    badge: "bg-brand-emerald/15 text-emerald-800",
    border: "border-emerald-200/60",
  },
  "4.0": {
    header: "from-violet-600 to-violet-500",
    badge: "bg-violet-100 text-violet-800",
    border: "border-violet-200/60",
  },
  "5.0": {
    header: "from-brand-navy to-brand-navy/80",
    badge: "bg-brand-navy/10 text-brand-navy",
    border: "border-brand-navy/20",
  },
};

export const SPEAKERS_DIRECTORY_KEYWORDS = [
  "Shiksha Mahakumbh speakers",
  "education conference speakers India",
  "Shiksha Mahakumbh Abhiyan",
  "vice chancellor conclave",
  "NEP 2020 speakers",
  "Indian education summit",
  "Department of Holistic Education",
  "NIT Jalandhar Shiksha Mahakumbh",
  "speaker directory",
  "Vidya Bharti education leaders",
] as const;
