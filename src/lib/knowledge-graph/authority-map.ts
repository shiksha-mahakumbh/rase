import type { EducationPillarId } from "./entities/education-pillars";
import { PILLAR_BY_ID } from "./pillar-registry";

export type AuthorityTier = "primary" | "secondary" | "supporting";

export type AuthorityEntry = {
  path: string;
  tier: AuthorityTier;
  pillarId: EducationPillarId;
  /** 0–100 relative authority weight for internal linking sort */
  weight: number;
};

/** Crawl and authority priority for ecosystem routes */
export const AUTHORITY_MAP: AuthorityEntry[] = [
  { path: "/", tier: "primary", pillarId: "conferences", weight: 100 },
  { path: "/education", tier: "primary", pillarId: "conferences", weight: 95 },
  { path: "/introduction", tier: "primary", pillarId: "leadership", weight: 90 },
  { path: "/registration", tier: "primary", pillarId: "conferences", weight: 95 },
  { path: "/knowledge", tier: "primary", pillarId: "knowledge-hub", weight: 88 },
  { path: "/departments/academic-council", tier: "primary", pillarId: "higher-education", weight: 85 },
  { path: "/proceedings", tier: "secondary", pillarId: "publications", weight: 75 },
  { path: "/media", tier: "secondary", pillarId: "media", weight: 70 },
  { path: "/press", tier: "supporting", pillarId: "media", weight: 65 },
  { path: "/publications", tier: "primary", pillarId: "publications", weight: 82 },
  { path: "/conferences", tier: "primary", pillarId: "conferences", weight: 82 },
  { path: "/workshops", tier: "secondary", pillarId: "teacher-development", weight: 70 },
  { path: "/people", tier: "supporting", pillarId: "leadership", weight: 60 },
  { path: "/educational-leaders", tier: "supporting", pillarId: "leadership", weight: 60 },
];

export function getAuthorityForPath(path: string): AuthorityEntry | undefined {
  return AUTHORITY_MAP.find((a) => a.path === path);
}

export function getPillarAuthorityWeight(
  pillarId: EducationPillarId
): number {
  const pillarPath = PILLAR_BY_ID[pillarId]?.path;
  if (!pillarPath) return 50;
  const entry = AUTHORITY_MAP.find((a) => a.path === pillarPath);
  return entry?.weight ?? 60;
}
