import type { EducationPillarId } from "./entities/education-pillars";

export type RelationshipType =
  | "partOf"
  | "relatedTo"
  | "organizes"
  | "publishes"
  | "covers";

export type EntityRelationship = {
  from: string;
  to: string;
  type: RelationshipType;
};

/** Logical knowledge-graph edges (entity ids from entity-map.ts) */
export const ENTITY_RELATIONSHIPS: EntityRelationship[] = [
  { from: "org:smk-abhiyan", to: "event:smk-6", type: "organizes" },
  { from: "event:smk-6", to: "collection:knowledge-hub", type: "relatedTo" },
  { from: "org:smk-abhiyan", to: "collection:knowledge-hub", type: "publishes" },
  { from: "event:smk-6", to: "press:hub", type: "covers" },
  { from: "event:smk-6", to: "pub:proceedings", type: "publishes" },
  { from: "org:smk-abhiyan", to: "vibhag:academic-council", type: "organizes" },
];

export const PILLAR_RELATIONSHIPS: {
  from: EducationPillarId;
  to: EducationPillarId;
  type: RelationshipType;
}[] = [
  { from: "conferences", to: "research", type: "relatedTo" },
  { from: "conferences", to: "policy", type: "relatedTo" },
  { from: "school-education", to: "olympiads", type: "partOf" },
  { from: "higher-education", to: "research", type: "relatedTo" },
  { from: "innovation", to: "skill-development", type: "relatedTo" },
  { from: "leadership", to: "policy", type: "relatedTo" },
  { from: "publications", to: "research", type: "partOf" },
  { from: "media", to: "conferences", type: "covers" },
  { from: "knowledge-hub", to: "publications", type: "relatedTo" },
];

export function getRelatedPillars(
  pillarId: EducationPillarId
): EducationPillarId[] {
  const out = new Set<EducationPillarId>();
  for (const r of PILLAR_RELATIONSHIPS) {
    if (r.from === pillarId) out.add(r.to);
    if (r.to === pillarId) out.add(r.from);
  }
  return Array.from(out);
}

export function getRelationshipsForEntity(
  entityId: string
): EntityRelationship[] {
  return ENTITY_RELATIONSHIPS.filter(
    (r) => r.from === entityId || r.to === entityId
  );
}
