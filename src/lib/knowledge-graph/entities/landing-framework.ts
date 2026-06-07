import { SITE_URL } from "@/config/site";

/**
 * Framework for future entity landing pages (no content migration in Phase 3).
 */

export type EntityLandingType =
  | "person"
  | "institution"
  | "university"
  | "school"
  | "research-initiative"
  | "program"
  | "award"
  | "conference";

export type EntityLandingDefinition = {
  type: EntityLandingType;
  slug: string;
  path: string;
  schemaType: string;
  label: string;
  status: "planned" | "draft" | "published";
};

const BASE = `${SITE_URL}/entity`;

export const ENTITY_LANDING_TYPES: Record<
  EntityLandingType,
  { label: string; schemaType: string; pathPrefix: string }
> = {
  person: { label: "People", schemaType: "Person", pathPrefix: `${BASE}/people` },
  institution: {
    label: "Institutions",
    schemaType: "EducationalOrganization",
    pathPrefix: `${BASE}/institutions`,
  },
  university: {
    label: "Universities",
    schemaType: "CollegeOrUniversity",
    pathPrefix: `${BASE}/universities`,
  },
  school: { label: "Schools", schemaType: "School", pathPrefix: `${BASE}/schools` },
  "research-initiative": {
    label: "Research Initiatives",
    schemaType: "ResearchProject",
    pathPrefix: `${BASE}/research`,
  },
  program: {
    label: "Programs",
    schemaType: "EducationalOccupationalProgram",
    pathPrefix: `${BASE}/programs`,
  },
  award: { label: "Awards", schemaType: "Event", pathPrefix: `${BASE}/awards` },
  conference: {
    label: "Conferences",
    schemaType: "EducationEvent",
    pathPrefix: `${BASE}/conferences`,
  },
};

/** Placeholder registry — populate in Phase 4+ */
export const ENTITY_LANDING_REGISTRY: EntityLandingDefinition[] = [];

export function buildEntityLandingPath(
  type: EntityLandingType,
  slug: string
): string {
  return `${ENTITY_LANDING_TYPES[type].pathPrefix}/${slug}`;
}

export function getEntityLandingsByType(
  type: EntityLandingType
): EntityLandingDefinition[] {
  return ENTITY_LANDING_REGISTRY.filter((e) => e.type === type);
}
