import { SITE_URL } from "@/config/site";
import { PILLAR_BY_ID } from "../pillar-registry";

/** Education pillar identifiers for knowledge graph clustering */
export type EducationPillarId =
  | "school-education"
  | "higher-education"
  | "vocational-education"
  | "skill-development"
  | "research"
  | "innovation"
  | "leadership"
  | "policy"
  | "teacher-development"
  | "student-development"
  | "educational-technology"
  | "olympiads"
  | "awards"
  | "conferences"
  | "media"
  | "publications"
  | "knowledge-hub";

export type EducationEntityDefinition = {
  id: EducationPillarId;
  label: string;
  description: string;
  /** Primary routes (no changes in Phase 2 — mapping only) */
  routes: string[];
  schemaTypes: string[];
};

export const EDUCATION_PILLAR_ENTITIES: EducationEntityDefinition[] = [
  {
    id: "school-education",
    label: "School Education",
    description: "K–12 programmes, school projects, and Bal Shodh initiatives.",
    routes: ["/departments/academic-council", "/registration"],
    schemaTypes: ["EducationEvent", "Course"],
  },
  {
    id: "higher-education",
    label: "Higher Education",
    description: "HEI participation, VC conclaves, and academic council.",
    routes: ["/conclave", "/departments/academic-council"],
    schemaTypes: ["EducationEvent", "EducationalOrganization"],
  },
  {
    id: "vocational-education",
    label: "Vocational Education",
    description: "Skills training and industry-linked workshops.",
    routes: ["/past_event/Teacher_Development_Program"],
    schemaTypes: ["Event"],
  },
  {
    id: "skill-development",
    label: "Skill Development",
    description: "Employability, startups, and skill tracks at SMK.",
    routes: ["/registration", "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/"],
    schemaTypes: ["Event"],
  },
  {
    id: "research",
    label: "Research",
    description: "Multi Track Conference submissions and proceedings.",
    routes: ["https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/", "/proceedings"],
    schemaTypes: ["ScholarlyArticle", "PublicationVolume"],
  },
  {
    id: "innovation",
    label: "Innovation",
    description: "Innovation workshops and exhibition tracks.",
    routes: ["/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop"],
    schemaTypes: ["Event"],
  },
  {
    id: "leadership",
    label: "Leadership",
    description: "Keynotes, introduction, and national leadership dialogues.",
    routes: ["/introduction", "/speakers/directory"],
    schemaTypes: ["Person", "Organization"],
  },
  {
    id: "policy",
    label: "Policy",
    description: "Policy conclaves and NEP-aligned discourse.",
    routes: ["/conclave", "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/"],
    schemaTypes: ["Article"],
  },
  {
    id: "teacher-development",
    label: "Teacher Development",
    description: "TDP and educator capacity building.",
    routes: ["/past_event/Teacher_Development_Program"],
    schemaTypes: ["Event"],
  },
  {
    id: "student-development",
    label: "Student Development",
    description: "Student talent, cultural, and olympiad programmes.",
    routes: ["/registration", "/media-center"],
    schemaTypes: ["Event"],
  },
  {
    id: "educational-technology",
    label: "Educational Technology",
    description: "Digital media, videos, and EdTech showcases.",
    routes: ["/gallery", "/media/shiksha-mahakumbh/4.0/digital"],
    schemaTypes: ["VideoObject"],
  },
  {
    id: "olympiads",
    label: "Olympiads",
    description: "DHE Olympiad tracks at SMK 6.0.",
    routes: ["/registration", "/departments/academic-council"],
    schemaTypes: ["SportsEvent", "EducationEvent"],
  },
  {
    id: "awards",
    label: "Awards",
    description: "Excellence awards for faculty and students.",
    routes: ["/registration", "/departments/academic-council"],
    schemaTypes: ["Event"],
  },
  {
    id: "conferences",
    label: "Conferences",
    description: "Shiksha Mahakumbh Abhiyan national editions.",
    routes: ["/past-events", "/introduction", "/registration"],
    schemaTypes: ["EducationEvent"],
  },
  {
    id: "media",
    label: "Media",
    description: "Press coverage and media centre.",
    routes: ["/media-center", "/press"],
    schemaTypes: ["NewsArticle"],
  },
  {
    id: "publications",
    label: "Publications",
    description: "Journals, books, and proceedings volumes.",
    routes: ["https://pub.dhe.org.in", "/books", "/proceeding1"],
    schemaTypes: ["PublicationVolume"],
  },
  {
    id: "knowledge-hub",
    label: "Knowledge Hub",
    description: "Curated knowledge collections and authority content.",
    routes: ["/publications"],
    schemaTypes: ["CollectionPage", "ItemList"],
  },
];

export function getPillarById(
  id: EducationPillarId
): EducationEntityDefinition | undefined {
  return EDUCATION_PILLAR_ENTITIES.find((p) => p.id === id);
}

export function pillarCanonicalUrl(pillarId: EducationPillarId): string {
  const registryPath = PILLAR_BY_ID[pillarId]?.path;
  if (registryPath) return `${SITE_URL}${registryPath}`;
  const pillar = getPillarById(pillarId);
  const path = pillar?.routes[0] ?? "/";
  return `${SITE_URL}${path}`;
}
