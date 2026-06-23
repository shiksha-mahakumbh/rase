import {
  ABIYAN_PHOTO_FRAME,
  EDITION_CHIEF_GUESTS,
  INVITATION_CAMPAIGN_GROUPS,
  getInvitationGroupItems,
} from "@/data/abhiyan-photo-frame";
import { UPCOMING_EDITION } from "@/data/past-editions";
import { SITE_URL } from "@/config/site";

export const PHOTO_FRAME_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const PHOTO_FRAME_HERO_IMAGE_ALT =
  "Shiksha Mahakumbh Abhiyan Photo Frame — leadership, dignitaries, and coordinators across editions 1.0 to 5.0";

export const PHOTO_FRAME_OG_IMAGE = `${SITE_URL}${PHOTO_FRAME_HERO_IMAGE}`;

export const PHOTO_FRAME_CANONICAL_URL = `${SITE_URL}${ABIYAN_PHOTO_FRAME.pagePath}`;

export const PHOTO_FRAME_PAGE_HERO = {
  eyebrow: "Shiksha Mahakumbh Abhiyan · शिक्षा महाकुंभ अभियान",
  title: "Abhiyan Photo Frame",
  subtitle:
    "Leadership, editions, invitation campaign & coordinators — Editions 1.0 to 5.0",
} as const;

export const PHOTO_FRAME_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/introduction" },
  { name: "Abhiyan Photo Frame", path: ABIYAN_PHOTO_FRAME.pagePath },
] as const;

export const PHOTO_FRAME_SECTION_NAV = [
  { id: "overview", label: "Overview" },
  { id: "leadership", label: "Leadership" },
  { id: "editions", label: "Editions" },
  { id: "chief-guests", label: "Chief Guests" },
  { id: "invitation", label: "Invitation Campaign" },
  { id: "coordinators", label: "Coordinators" },
  { id: "pdf", label: "PDF" },
] as const;

export const PHOTO_FRAME_QUICK_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  icon: string;
  external?: boolean;
}> = [
  { label: "View / Download PDF", href: ABIYAN_PHOTO_FRAME.pdfUrl, external: true, icon: "📄" },
  { label: "Introduction", href: "/introduction", icon: "📜" },
  { label: "Past Editions", href: "/past-events", icon: "🗓️" },
  { label: "Speaker Directory", href: "/speakers/directory", icon: "🎤" },
  { label: "Committees", href: "/committees", icon: "👥" },
  { label: "Register for SMK 6.0", href: "/registration", icon: "✅" },
];

export function countChiefGuests(): number {
  return Object.values(EDITION_CHIEF_GUESTS).reduce((total, guests) => total + guests.length, 0);
}

export function countInvitationDignitaries(): number {
  return INVITATION_CAMPAIGN_GROUPS.reduce(
    (total, group) => total + getInvitationGroupItems(group.items).length,
    0
  );
}

export function buildPhotoFrameStats(coordinatorCount: number) {
  return [
    { label: "Editions", value: "5.0", hint: "Documented in photo frame" },
    {
      label: "Chief Guests",
      value: `${countChiefGuests()}+`,
      hint: "Across editions 1.0–5.0",
    },
    {
      label: "Invitation Dignitaries",
      value: `${countInvitationDignitaries()}+`,
      hint: "National outreach honoured",
    },
    {
      label: "Coordinators",
      value: String(coordinatorCount),
      hint: "Programme leads listed",
    },
  ] as const;
}

export const PHOTO_FRAME_UPCOMING_CTA = {
  title: UPCOMING_EDITION.title,
  venue: UPCOMING_EDITION.venue,
  dates: UPCOMING_EDITION.dates,
  registrationHref: UPCOMING_EDITION.registrationHref,
  learnMoreHref: UPCOMING_EDITION.href,
} as const;

export const PHOTO_FRAME_SEO_KEYWORDS = [
  "Shiksha Mahakumbh Abhiyan",
  "Shiksha Mahakumbh photo frame",
  "Department of Holistic Education",
  "Indian education conference",
  "NEP 2020",
  "education dignitaries India",
  "invitation campaign",
  "national education movement",
  "Abhiyan leadership",
  "Shiksha Mahakumbh coordinators",
] as const;
