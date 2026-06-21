/** Internal code identifiers (kebab-case, aligned with edition number) */
export const COMMITTEE_EDITION_MODULE_KEYS = {
  "1.0": "shiksha-mahakumbh-1-0",
  "2.0": "shiksha-mahakumbh-2-0",
  "3.0": "shiksha-mahakumbh-3-0",
  "4.0": "shiksha-mahakumbh-4-0",
  "5.0": "shiksha-mahakumbh-5-0",
  "6.0": "shiksha-mahakumbh-6-0",
} as const;

export type CommitteeEditionModuleKey =
  (typeof COMMITTEE_EDITION_MODULE_KEYS)[keyof typeof COMMITTEE_EDITION_MODULE_KEYS];

/** Canonical committee URL slugs — edition labels (not year-based). */
export const COMMITTEE_EDITION_SLUGS = {
  "1.0": "Shiksha Mahakumbh 1.0",
  "2.0": "Shiksha Mahakumbh 2.0",
  "3.0": "Shiksha Mahakumbh 3.0",
  "4.0": "Shiksha Mahakumbh 4.0",
  "5.0": "Shiksha Mahakumbh 5.0",
  "6.0": "Shiksha Mahakumbh 6.0",
} as const;

export type CommitteeEditionSlug =
  (typeof COMMITTEE_EDITION_SLUGS)[keyof typeof COMMITTEE_EDITION_SLUGS];

/** Retired year-based slugs → canonical edition slugs */
export const LEGACY_COMMITTEE_SLUG_MAP: Record<string, CommitteeEditionSlug> = {
  shikshamahakumbh2026: "Shiksha Mahakumbh 6.0",
  shikshamahakumbh2025: "Shiksha Mahakumbh 5.0",
  shikshamahakumbh2024: "Shiksha Mahakumbh 4.0",
  shikshakumbh2024: "Shiksha Mahakumbh 3.0",
  shikshakumbh2023: "Shiksha Mahakumbh 2.0",
  shikshakumbh20231: "Shiksha Mahakumbh 2.0",
  shikshamahakumbh2023: "Shiksha Mahakumbh 1.0",
};

export function committeeModuleKeyForEdition(edition: string): CommitteeEditionModuleKey {
  const key = COMMITTEE_EDITION_MODULE_KEYS[edition as keyof typeof COMMITTEE_EDITION_MODULE_KEYS];
  if (key) return key;
  return `shiksha-mahakumbh-${edition.replace(".", "-")}` as CommitteeEditionModuleKey;
}

export function committeeSlugForEdition(edition: string): CommitteeEditionSlug {
  const slug = COMMITTEE_EDITION_SLUGS[edition as keyof typeof COMMITTEE_EDITION_SLUGS];
  if (slug) return slug;
  return `Shiksha Mahakumbh ${edition}` as CommitteeEditionSlug;
}

export function normalizeCommitteeSlug(raw: string): string {
  const decoded = decodeURIComponent(raw);
  return LEGACY_COMMITTEE_SLUG_MAP[decoded] ?? LEGACY_COMMITTEE_SLUG_MAP[raw] ?? decoded;
}

export function committeePathFromSlug(slug: string): string {
  return `/committee/${encodeURIComponent(normalizeCommitteeSlug(slug))}`;
}

export function committeePathForEdition(edition: string): string {
  return committeePathFromSlug(committeeSlugForEdition(edition));
}

export function committeeAbsoluteUrl(slug: string, siteUrl: string): string {
  return `${siteUrl}${committeePathFromSlug(slug)}`;
}
