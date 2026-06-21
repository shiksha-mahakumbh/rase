import { COMMITTEE_EDITION_1_0 } from "./edition-1-0";
import { COMMITTEE_EDITION_2_0 } from "./edition-2-0";
import { COMMITTEE_EDITION_3_0 } from "./edition-3-0";
import { COMMITTEE_EDITION_4_0 } from "./edition-4-0";
import { COMMITTEE_EDITION_5_0 } from "./edition-5-0";
import { COMMITTEE_EDITION_6_0 } from "./edition-6-0";
import type { CommitteeEditionData } from "./types";
import { countCommitteeMembers } from "./types";

export const ALL_COMMITTEE_EDITIONS: CommitteeEditionData[] = [
  COMMITTEE_EDITION_6_0,
  COMMITTEE_EDITION_5_0,
  COMMITTEE_EDITION_4_0,
  COMMITTEE_EDITION_3_0,
  COMMITTEE_EDITION_2_0,
  COMMITTEE_EDITION_1_0,
];

export const COMMITTEE_EDITION_BY_SLUG = Object.fromEntries(
  ALL_COMMITTEE_EDITIONS.map((edition) => [edition.slug, edition])
) as Record<string, CommitteeEditionData>;

export function getCommitteeEditionBySlug(slug: string): CommitteeEditionData | undefined {
  return COMMITTEE_EDITION_BY_SLUG[slug];
}

export function getTotalCommitteeMembers(): number {
  return ALL_COMMITTEE_EDITIONS.reduce(
    (sum, edition) => sum + countCommitteeMembers(edition),
    0
  );
}

export {
  COMMITTEE_EDITION_1_0,
  COMMITTEE_EDITION_2_0,
  COMMITTEE_EDITION_3_0,
  COMMITTEE_EDITION_4_0,
  COMMITTEE_EDITION_5_0,
  COMMITTEE_EDITION_6_0,
};

export type { CommitteeEditionData, CommitteeMember, CommitteeSection } from "./types";
export { countCommitteeMembers } from "./types";
