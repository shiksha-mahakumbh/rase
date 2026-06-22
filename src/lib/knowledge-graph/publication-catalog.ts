import type { EducationPillarId } from "./entities/education-pillars";

export type PublicationTypeId =
  | "reports"
  | "whitepapers"
  | "policy-papers"
  | "research-papers";

export type PublicationTypeEntry = {
  id: PublicationTypeId;
  path: `/${PublicationTypeId}`;
  label: string;
  description: string;
  pillarId: EducationPillarId;
};

/** Placeholder types — routes redirect to /publications (Phase 2 cleanup) */
export const PUBLICATION_TYPES: PublicationTypeEntry[] = [];

export const PUBLICATION_BY_ID = Object.fromEntries(
  PUBLICATION_TYPES.map((t) => [t.id, t])
) as Record<PublicationTypeId, PublicationTypeEntry>;

export function getPublicationType(id: PublicationTypeId): PublicationTypeEntry {
  return PUBLICATION_BY_ID[id];
}

export type LegacyPublicationRoute = {
  href: string;
  label: string;
  year: string;
  external?: boolean;
};

/** Canonical publication routes with real content */
export const LEGACY_PUBLICATION_ROUTES: LegacyPublicationRoute[] = [
  { href: "/proceedings", label: "Proceedings", year: "multi" },
  { href: "/proceeding1", label: "Proceedings Vol. I (SMK 2.0)", year: "2023" },
  { href: "/proceeding2", label: "Proceedings Vol. II (SMK 1.0)", year: "2023" },
  { href: "/proceeding3", label: "Proceedings Vol. III (SMK 3.0)", year: "2024" },
  { href: "https://pub.dhe.org.in", label: "DHE Journal", year: "ongoing", external: true },
  { href: "/books", label: "Books", year: "ongoing" },
  { href: "/publications/souvenir-abstracts-mtc", label: "Souvenir Abstracts (MTC)", year: "2024–2025" },
];
