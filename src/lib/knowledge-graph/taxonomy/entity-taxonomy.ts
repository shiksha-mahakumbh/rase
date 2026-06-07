import type { GraphEntityType } from "../entity-map";

export const ENTITY_TYPES: GraphEntityType[] = [
  "Organization",
  "EducationalOrganization",
  "EducationEvent",
  "CollectionPage",
  "NewsArticle",
  "PublicationVolume",
  "Person",
];

export const FUTURE_ENTITY_SCHEMA_TYPES = [
  "Person",
  "EducationalOrganization",
  "CollegeOrUniversity",
  "School",
  "ResearchProject",
  "EducationalOccupationalProgram",
  "Course",
  "NewsArticle",
  "ScholarlyArticle",
] as const;
