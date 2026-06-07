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

export const PUBLICATION_TYPES: PublicationTypeEntry[] = [
  {
    id: "reports",
    path: "/reports",
    label: "Reports",
    description: "Annual and event reports from Shiksha Mahakumbh editions.",
    pillarId: "publications",
  },
  {
    id: "whitepapers",
    path: "/whitepapers",
    label: "Whitepapers",
    description: "Policy and practice whitepapers from national education dialogues.",
    pillarId: "publications",
  },
  {
    id: "policy-papers",
    path: "/policy-papers",
    label: "Policy Papers",
    description: "NEP-aligned policy papers and governance perspectives.",
    pillarId: "policy",
  },
  {
    id: "research-papers",
    path: "/research-papers",
    label: "Research Papers",
    description: "Peer-reviewed research papers and conference submissions.",
    pillarId: "research",
  },
];

export const PUBLICATION_BY_ID = Object.fromEntries(
  PUBLICATION_TYPES.map((t) => [t.id, t])
) as Record<PublicationTypeId, PublicationTypeEntry>;

export function getPublicationType(id: PublicationTypeId): PublicationTypeEntry {
  return PUBLICATION_BY_ID[id];
}

/** Canonical legacy publication routes */
export const LEGACY_PUBLICATION_ROUTES = [
  { path: "/proceedings", label: "Proceedings", year: "multi" },
  { path: "/proceeding1", label: "Proceedings Vol. I", year: "2024" },
  { path: "/proceeding2", label: "Proceedings Vol. II", year: "2024" },
  { path: "/proceeding3", label: "Proceedings Vol. III", year: "2024" },
  { path: "/journals", label: "Journals", year: "ongoing" },
  { path: "/books", label: "Books", year: "ongoing" },
] as const;
