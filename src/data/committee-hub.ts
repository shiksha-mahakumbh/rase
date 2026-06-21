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
import { committeePathForEdition } from "@/lib/committee/edition-slugs";

export type CommitteeHubEdition = CommitteeEditionData & {
  committeeLink: string;
  status: "upcoming" | "completed";
  description: string;
};

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
      "Organising body for Classroom to Society — linking pharmaceutical education, health outcomes, and national conclaves at NIPER SAS Nagar.",
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
    description:
      "Startup-economy edition with a 59-member national advisory network spanning IITs, NITs, central universities, and Vidya Bharti leadership.",
  },
  {
    ...COMMITTEE_EDITION_1_0,
    committeeLink: committeePathForEdition(COMMITTEE_EDITION_1_0.edition),
    status: "completed",
    description:
      "Inaugural RASE edition on school education — foundational organising structure with national advisory participation from space, IIT, and NIT leadership.",
  },
];

export const COMMITTEE_HUB_STATS = [
  {
    label: "Editions",
    value: "6",
    hint: "1.0 through 6.0",
  },
  {
    label: "Committee Members",
    value: "400+",
    hint: "Across all editions",
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

export function getCommitteeHubMemberTotal(): number {
  return COMMITTEE_HUB_EDITIONS.reduce(
    (sum, edition) => sum + countCommitteeMembers(edition),
    0
  );
}
