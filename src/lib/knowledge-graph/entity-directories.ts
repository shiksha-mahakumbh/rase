import { SITE_URL } from "@/config/site";

export type EntityDirectoryId =
  | "people"
  | "institutions"
  | "universities"
  | "schools"
  | "research-projects"
  | "educational-leaders";

export type EntityDirectoryConfig = {
  id: EntityDirectoryId;
  path: `/${EntityDirectoryId}`;
  label: string;
  description: string;
  schemaType: string;
  keywords: string[];
};

export const ENTITY_DIRECTORIES: EntityDirectoryConfig[] = [
  {
    id: "people",
    path: "/people",
    label: "People",
    description:
      "Speakers, researchers, policymakers, and educators connected with Shiksha Mahakumbh programmes.",
    schemaType: "Person",
    keywords: ["education leaders", "keynote speakers", "SMK faculty"],
  },
  {
    id: "educational-leaders",
    path: "/educational-leaders",
    label: "Educational Leaders",
    description:
      "Vice-chancellors, principals, and national education leaders participating in conclaves and summits.",
    schemaType: "Person",
    keywords: ["vice chancellor", "education leadership India"],
  },
  {
    id: "institutions",
    path: "/institutions",
    label: "Institutions",
    description:
      "Partner institutions, NGOs, and organisations in the Shiksha Mahakumbh ecosystem.",
    schemaType: "EducationalOrganization",
    keywords: ["education institutions India", "SMK partners"],
  },
  {
    id: "universities",
    path: "/universities",
    label: "Universities",
    description:
      "Universities and higher education institutions participating in research, conclaves, and HEI projects.",
    schemaType: "CollegeOrUniversity",
    keywords: ["universities India", "HEI Shiksha Mahakumbh"],
  },
  {
    id: "schools",
    path: "/schools",
    label: "Schools",
    description:
      "Schools engaged in olympiads, exhibitions, Bal Shodh, and national school programmes.",
    schemaType: "School",
    keywords: ["school education India", "SMK schools"],
  },
  {
    id: "research-projects",
    path: "/research-projects",
    label: "Research Projects",
    description:
      "Research initiatives, paper submissions, and multidisciplinary projects presented at SMK.",
    schemaType: "ResearchProject",
    keywords: ["education research projects", "SMK research"],
  },
];

export const ENTITY_DIRECTORY_BY_ID = Object.fromEntries(
  ENTITY_DIRECTORIES.map((d) => [d.id, d])
) as Record<EntityDirectoryId, EntityDirectoryConfig>;

export function getEntityDirectory(id: EntityDirectoryId): EntityDirectoryConfig {
  return ENTITY_DIRECTORY_BY_ID[id];
}

export function directoryCanonicalUrl(id: EntityDirectoryId): string {
  return `${SITE_URL}${ENTITY_DIRECTORY_BY_ID[id].path}`;
}
