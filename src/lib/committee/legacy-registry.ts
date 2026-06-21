import { ALL_COMMITTEE_EDITIONS, type CommitteeEditionData } from "@/data/committee-members";
import { normalizeCommitteeSlug } from "@/lib/committee/edition-slugs";

export type CommitteeLegacyEntry = {
  editionData: CommitteeEditionData;
};

export const COMMITTEE_LEGACY_EDITIONS: CommitteeLegacyEntry[] = ALL_COMMITTEE_EDITIONS.map(
  (editionData) => ({ editionData })
);

export function getCommitteeLegacyEntry(slug: string): CommitteeLegacyEntry | null {
  const normalized = normalizeCommitteeSlug(slug);
  return (
    COMMITTEE_LEGACY_EDITIONS.find((entry) => entry.editionData.slug === normalized) ?? null
  );
}

export const COMMITTEE_LEGACY_SLUGS = COMMITTEE_LEGACY_EDITIONS.map(
  (entry) => entry.editionData.slug
);

export function committeeLegacyDetail(entry: CommitteeLegacyEntry): string {
  const { breadcrumbLabel, venue } = entry.editionData;
  return `${breadcrumbLabel} — ${venue}`;
}
