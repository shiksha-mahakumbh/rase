import { SITE_URL } from "@/config/site";
import type { EducationPillarId } from "./entities/education-pillars";

export type GraphEntityType =
  | "Organization"
  | "EducationalOrganization"
  | "EducationEvent"
  | "CollectionPage"
  | "NewsArticle"
  | "PublicationVolume"
  | "Person";

export type GraphEntity = {
  id: string;
  type: GraphEntityType;
  name: string;
  url: string;
  pillarIds?: EducationPillarId[];
  sameAs?: string[];
};

/** Canonical entity registry — extend without changing routes */
export const ENTITY_MAP: Record<string, GraphEntity> = {
  "org:smk-abhiyan": {
    id: "org:smk-abhiyan",
    type: "EducationalOrganization",
    name: "Shiksha Mahakumbh Abhiyan",
    url: SITE_URL,
    pillarIds: ["leadership", "conferences", "policy"],
  },
  "event:smk-6": {
    id: "event:smk-6",
    type: "EducationEvent",
    name: "Shiksha Mahakumbh 6.0",
    url: `${SITE_URL}/registration`,
    pillarIds: ["conferences", "school-education", "higher-education"],
  },
  "collection:knowledge-hub": {
    id: "collection:knowledge-hub",
    type: "CollectionPage",
    name: "Knowledge Hub",
    url: `${SITE_URL}/knowledge`,
    pillarIds: ["knowledge-hub", "publications", "research"],
  },
  "vibhag:academic-council": {
    id: "vibhag:academic-council",
    type: "EducationalOrganization",
    name: "Academic Council SMK 6.0",
    url: `${SITE_URL}/VibhagRoute/AcademicCouncil24`,
    pillarIds: ["higher-education", "school-education", "olympiads"],
  },
  "press:hub": {
    id: "press:hub",
    type: "NewsArticle",
    name: "Shiksha Mahakumbh Press",
    url: `${SITE_URL}/Press_Release`,
    pillarIds: ["media"],
  },
  "pub:proceedings": {
    id: "pub:proceedings",
    type: "PublicationVolume",
    name: "SMK Proceedings",
    url: `${SITE_URL}/proceedings`,
    pillarIds: ["publications", "research"],
  },
};

export function getEntity(entityId: string): GraphEntity | undefined {
  return ENTITY_MAP[entityId];
}

export function getEntitiesByPillar(
  pillarId: EducationPillarId
): GraphEntity[] {
  return Object.values(ENTITY_MAP).filter((e) =>
    e.pillarIds?.includes(pillarId)
  );
}
