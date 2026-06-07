import type { EducationPillarId } from "./entities/education-pillars";

/** URL slug for pillar landing pages (flat routes, e.g. /school-education) */
export type PillarSlug =
  | "school-education"
  | "higher-education"
  | "vocational-education"
  | "skill-development"
  | "research"
  | "innovation"
  | "policy"
  | "leadership"
  | "teacher-development"
  | "student-development"
  | "educational-technology"
  | "olympiad"
  | "awards"
  | "conferences"
  | "publications"
  | "media";

export type PillarRegistryEntry = {
  id: EducationPillarId;
  slug: PillarSlug;
  path: `/${PillarSlug}`;
  label: string;
  tagline: string;
  intro: string;
  keywords: string[];
};

export const PILLAR_REGISTRY: PillarRegistryEntry[] = [
  {
    id: "school-education",
    slug: "school-education",
    path: "/school-education",
    label: "School Education",
    tagline: "K–12 excellence, school projects, and Bal Shodh",
    intro:
      "Shiksha Mahakumbh strengthens school education through national summits, olympiads, exhibitions, and NEP 2020–aligned programmes for students and teachers.",
    keywords: ["school education India", "K-12 NEP 2020", "Bal Shodh"],
  },
  {
    id: "higher-education",
    slug: "higher-education",
    path: "/higher-education",
    label: "Higher Education",
    tagline: "Universities, HEI projects, and VC policy dialogues",
    intro:
      "Higher education institutions participate through conclaves, academic council tracks, research submissions, and leadership forums at Shiksha Mahakumbh.",
    keywords: ["higher education summit", "VC conclave", "HEI India"],
  },
  {
    id: "vocational-education",
    slug: "vocational-education",
    path: "/vocational-education",
    label: "Vocational Education",
    tagline: "Industry skills and vocational training pathways",
    intro:
      "Vocational education at SMK connects schools and colleges with employability skills, workshops, and industry-linked training archives.",
    keywords: ["vocational education", "skill training India"],
  },
  {
    id: "skill-development",
    slug: "skill-development",
    path: "/skill-development",
    label: "Skill Development",
    tagline: "Employability, startups, and national skill missions",
    intro:
      "Skill development tracks include talent programmes, entrepreneurship workshops, and registration categories aligned with national skill initiatives.",
    keywords: ["skill development India", "employability education"],
  },
  {
    id: "research",
    slug: "research",
    path: "/research",
    label: "Research",
    tagline: "Abstracts, proceedings, and multidisciplinary research",
    intro:
      "The research pillar spans abstract submission, full-length papers, proceedings volumes, and peer-reviewed outcomes from Mahakumbh editions.",
    keywords: ["education research India", "conference proceedings"],
  },
  {
    id: "innovation",
    slug: "innovation",
    path: "/innovation",
    label: "Innovation",
    tagline: "Innovation labs, exhibitions, and entrepreneurship",
    intro:
      "Innovation programmes include HEI and school project displays, entrepreneurship workshops, and best-practice exhibitions at SMK 6.0.",
    keywords: ["education innovation", "startup education India"],
  },
  {
    id: "policy",
    slug: "policy",
    path: "/policy",
    label: "Policy",
    tagline: "NEP 2020, governance, and policy conclaves",
    intro:
      "Policy dialogues bring vice-chancellors, principals, and policymakers together for actionable charters aligned with NEP 2020 and Viksit Bharat 2047.",
    keywords: ["education policy India", "NEP 2020 summit"],
  },
  {
    id: "leadership",
    slug: "leadership",
    path: "/leadership",
    label: "Leadership",
    tagline: "National education leadership and keynote dialogues",
    intro:
      "Leadership spans the Abhiyan introduction, keynote speakers, conclave chairs, and institutional vision for the national education movement.",
    keywords: ["education leadership India", "Shiksha Mahakumbh"],
  },
  {
    id: "teacher-development",
    slug: "teacher-development",
    path: "/teacher-development",
    label: "Teacher Development",
    tagline: "TDP, pedagogy, and educator capacity building",
    intro:
      "Teacher development includes residential programmes, NITTTR collaborations, and workshop archives dedicated to educator excellence.",
    keywords: ["teacher development programme", "TDP India"],
  },
  {
    id: "student-development",
    slug: "student-development",
    path: "/student-development",
    label: "Student Development",
    tagline: "Talent, culture, and holistic student growth",
    intro:
      "Student development covers olympiads, cultural programmes, talent registration, and youth leadership at Shiksha Mahakumbh.",
    keywords: ["student development", "youth education India"],
  },
  {
    id: "educational-technology",
    slug: "educational-technology",
    path: "/educational-technology",
    label: "Educational Technology",
    tagline: "EdTech, digital media, and learning platforms",
    intro:
      "Educational technology showcases include digital media galleries, video archives, and EdTech tracks within the academic council.",
    keywords: ["EdTech India", "digital education summit"],
  },
  {
    id: "olympiads",
    slug: "olympiad",
    path: "/olympiad",
    label: "Olympiads",
    tagline: "DHE Olympiad — Maths, English, Tech, Sanskriti",
    intro:
      "DHE Olympiad at SMK 6.0 nurtures analytical excellence for school students through national-level subject olympiads.",
    keywords: ["DHE Olympiad", "school olympiad India"],
  },
  {
    id: "awards",
    slug: "awards",
    path: "/awards",
    label: "Awards",
    tagline: "Faculty and student excellence recognition",
    intro:
      "Excellence awards recognise outstanding faculty and student contributions in research, innovation, and institutional leadership.",
    keywords: ["education awards India", "excellence awards SMK"],
  },
  {
    id: "conferences",
    slug: "conferences",
    path: "/conferences",
    label: "Conferences",
    tagline: "Shiksha Mahakumbh & Shiksha Kumbh editions",
    intro:
      "National multidisciplinary conferences — Shiksha Mahakumbh and Shiksha Kumbh — unite delegates, researchers, and institutions biennially.",
    keywords: ["Shiksha Mahakumbh conference", "education summit 2026"],
  },
  {
    id: "publications",
    slug: "publications",
    path: "/publications",
    label: "Publications",
    tagline: "Journals, books, and proceedings",
    intro:
      "Publications include souvenir proceedings, journals, books, and open-access research outputs from Mahakumbh editions.",
    keywords: ["education proceedings", "research publications India"],
  },
  {
    id: "media",
    slug: "media",
    path: "/media",
    label: "Media",
    tagline: "Press, digital media, and national coverage",
    intro:
      "Media coverage documents the growth of the Shiksha Mahakumbh movement through press releases, articles, and digital media archives.",
    keywords: ["Shiksha Mahakumbh press", "education media India"],
  },
];

export const PILLAR_BY_SLUG = Object.fromEntries(
  PILLAR_REGISTRY.map((p) => [p.slug, p])
) as Record<PillarSlug, PillarRegistryEntry>;

export const PILLAR_BY_ID: Partial<
  Record<EducationPillarId, PillarRegistryEntry>
> = Object.fromEntries(PILLAR_REGISTRY.map((p) => [p.id, p]));

export function getPillarEntry(
  slug: string
): PillarRegistryEntry | undefined {
  return PILLAR_BY_SLUG[slug as PillarSlug];
}

export const ALL_PILLAR_SLUGS = PILLAR_REGISTRY.map((p) => p.slug);
