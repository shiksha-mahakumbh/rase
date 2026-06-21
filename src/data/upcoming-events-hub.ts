import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { UPCOMING_EDITION } from "@/data/past-editions";

export type UpcomingEventCard = {
  id: string;
  edition: string;
  title: string;
  dates: string;
  venue: string;
  venueFull: string;
  status: "registration_open" | "announced";
  registrationHref: string;
  ctaLabel: string;
  description: string;
  highlight?: string;
};

/** Canonical upcoming programmes — not CMS-driven (avoids stale edition data). */
export const UPCOMING_EVENTS: UpcomingEventCard[] = [
  {
    id: "smk-6-0",
    edition: "6.0",
    title: "Shiksha Mahakumbh 6.0",
    dates: UPCOMING_EDITION.dates,
    venue: UPCOMING_EDITION.venue,
    venueFull: UPCOMING_EDITION.venueFull,
    status: "registration_open",
    registrationHref: UPCOMING_EDITION.registrationHref,
    ctaLabel: "Register Now",
    description:
      "Hybrid multi-track international conference at NIT Hamirpur — aligned with NEP 2020 and Bharat@2047.",
    highlight: UPCOMING_EDITION.coreEssence,
  },
  {
    id: "smk-7-0",
    edition: "7.0",
    title: "Shiksha Mahakumbh 7.0",
    dates: "To Be Announced",
    venue: "IIT Jammu",
    venueFull: "Indian Institute of Technology Jammu",
    status: "announced",
    registrationHref: CANONICAL_ROUTES.comingSoon,
    ctaLabel: "Coming Soon",
    description:
      "The next national edition of Shiksha Mahakumbh Abhiyan at IIT Jammu. Dates and registration will be announced soon.",
    highlight: "Edition 7.0 — programme details forthcoming",
  },
];

export const UPCOMING_EVENTS_HERO = {
  eyebrow: "Conferences & Summits",
  title: "Upcoming Events",
  subtitle:
    "National and international education summits on the Shiksha Mahakumbh Abhiyan calendar — register for edition 6.0 or explore what's next.",
} as const;

export const UPCOMING_EVENTS_PAGE_HERO = {
  eyebrow: "Programmes · Global Education Movement",
  title: "Shiksha Mahakumbh 6.0 & Beyond",
  subtitle:
    "Summits, workshops, olympiads, and national programmes — open registration for edition 6.0 at NIT Hamirpur; edition 7.0 at IIT Jammu coming soon.",
} as const;

export const UPCOMING_EVENTS_STATS = [
  { label: "Open registration", value: "6.0", hint: "NIT Hamirpur · Oct 2026" },
  { label: "Next edition", value: "7.0", hint: "IIT Jammu · TBA" },
  { label: "Global delegates", value: "50+", hint: "Countries represented historically" },
  { label: "Institutions", value: "500+", hint: "Engaged across editions" },
] as const;

export const UPCOMING_EVENTS_KEYWORDS = [
  "Shiksha Mahakumbh 6.0",
  "Shiksha Mahakumbh 7.0",
  "upcoming education summit India",
  "NIT Hamirpur conference 2026",
  "IIT Jammu education summit",
  "NEP 2020 conference registration",
  "national education summit India",
  "international education conference India",
] as const;

/** ISO dates for JSON-LD (edition 6.0) */
export const SMK_6_EVENT_DATES = {
  startDate: "2026-10-09",
  endDate: "2026-10-11",
} as const;
