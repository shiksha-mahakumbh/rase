import {
  COMMITTEE_EDITION_1_0,
  COMMITTEE_EDITION_2_0,
  COMMITTEE_EDITION_3_0,
  COMMITTEE_EDITION_4_0,
  COMMITTEE_EDITION_5_0,
  COMMITTEE_EDITION_6_0,
  countCommitteeMembers,
  type CommitteeEditionData,
} from "@/data/committee-members";
import { UPCOMING_EDITION } from "@/data/past-editions";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { SITE_URL } from "@/config/site";
import { COMMITTEE_BROCHURES_FOLDER_URL } from "@/data/committee-brochures";

export const COMMITTEES_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const COMMITTEES_HERO_IMAGE_ALT =
  "Shiksha Mahakumbh Abhiyan organising committees — national advisory and conference leadership";

export const COMMITTEES_OG_IMAGE = `${SITE_URL}${COMMITTEES_HERO_IMAGE}`;

export const COMMITTEES_CANONICAL_URL = `${SITE_URL}${CANONICAL_ROUTES.committees}`;

export const COMMITTEES_PAGE_HERO = {
  eyebrow: "Governance & Leadership",
  title: "Organising Committees",
  subtitle:
    "National advisory, organising, and conference leadership across Shiksha Mahakumbh editions 1.0–6.0 — IITs, NITs, universities, Vidya Bharti, and DHE.",
} as const;

export const COMMITTEES_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/introduction" },
  { name: "Organising Committees", path: CANONICAL_ROUTES.committees },
] as const;

export const COMMITTEES_QUICK_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  icon: string;
  external?: boolean;
}> = [
  { label: "Register for SMK 6.0", href: "/registration", icon: "✅" },
  { label: "Past Editions", href: "/past-events", icon: "🗓️" },
  { label: "Abhiyan Photo Frame", href: "/abhiyaninphotoframe", icon: "📜" },
  { label: "Academic Council", href: "/departments/academic-council", icon: "🎓" },
  { label: "Speaker Directory", href: "/speakers/directory", icon: "🎤" },
  { label: "All Brochures (PDF)", href: COMMITTEE_BROCHURES_FOLDER_URL, icon: "📄", external: true },
];

export const COMMITTEES_SEO_KEYWORDS = [
  "Shiksha Mahakumbh committee",
  "organising committee",
  "national advisory committee",
  "DHE leadership",
  "education conference India",
  "IIT NIT university committee",
  "Vidya Bharti education leadership",
  "NEP 2020 conference committee",
] as const;

export const COMMITTEES_UPCOMING_CTA = {
  title: UPCOMING_EDITION.title,
  venue: UPCOMING_EDITION.venue,
  dates: UPCOMING_EDITION.dates,
  registrationHref: UPCOMING_EDITION.registrationHref,
  learnMoreHref: UPCOMING_EDITION.href,
  committeeHref: committeePathForEdition("6.0"),
} as const;

export type CommitteeHubEdition = CommitteeEditionData & {
  committeeLink: string;
  status: "upcoming" | "completed";
  description: string;
};

const SMK_2_0_MEMBER_COUNT = countCommitteeMembers(COMMITTEE_EDITION_2_0);

export const COMMITTEE_HUB_EDITIONS: CommitteeHubEdition[] = [
  {
    ...COMMITTEE_EDITION_6_0,
    committeeLink: committeePathForEdition(COMMITTEE_EDITION_6_0.edition),
    status: "upcoming",
    description:
      "National leadership for Shiksha, Prakriti aur Pragati — conclaves, research tracks, olympiads, and whole-of-society programmes at NIT Hamirpur.",
  },
  {
    ...COMMITTEE_EDITION_5_0,
    committeeLink: committeePathForEdition(COMMITTEE_EDITION_5_0.edition),
    status: "completed",
    description:
      "Organising body for Classroom to Society — linking pharmaceutical education, health outcomes, and national conclaves at NIPER Mohali (SAS Nagar).",
  },
  {
    ...COMMITTEE_EDITION_4_0,
    committeeLink: committeePathForEdition(COMMITTEE_EDITION_4_0.edition),
    status: "completed",
    description:
      "Leadership for Indian Education System for Global Development — seven conclaves, international delegates, and vision charter work at Kurukshetra University.",
  },
  {
    ...COMMITTEE_EDITION_3_0,
    committeeLink: committeePathForEdition(COMMITTEE_EDITION_3_0.edition),
    status: "completed",
    description:
      "Academic-driven startups and J&K economic development — Kashmir-focused advisory and conference leadership at NIT Srinagar.",
  },
  {
    ...COMMITTEE_EDITION_2_0,
    committeeLink: committeePathForEdition(COMMITTEE_EDITION_2_0.edition),
    status: "completed",
    description: `Startup-economy edition with a ${SMK_2_0_MEMBER_COUNT}-member national advisory network spanning IITs, NITs, central universities, and Vidya Bharti leadership.`,
  },
  {
    ...COMMITTEE_EDITION_1_0,
    committeeLink: committeePathForEdition(COMMITTEE_EDITION_1_0.edition),
    status: "completed",
    description:
      "Inaugural RASE edition on school education — foundational organising structure with national advisory participation from space, IIT, and NIT leadership.",
  },
];

export function getCommitteeHubMemberTotal(): number {
  return COMMITTEE_HUB_EDITIONS.reduce(
    (sum, edition) => sum + countCommitteeMembers(edition),
    0
  );
}

export function buildCommitteeHubStats() {
  const memberTotal = getCommitteeHubMemberTotal();
  return [
    {
      label: "Editions",
      value: "6",
      hint: "1.0 through 6.0",
    },
    {
      label: "Committee Members",
      value: `${memberTotal}+`,
      hint: "Listed across all editions",
    },
    {
      label: "Institutions",
      value: "100+",
      hint: "IITs, NITs, universities",
    },
    {
      label: "Global Reach",
      value: "Intl.",
      hint: "Delegates & advisors",
    },
  ] as const;
}
