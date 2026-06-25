/**
 * Central authority & ecosystem content — used across homepage-adjacent pages,
 * about, and Vibhag surfaces.
 */

import { buildAuthorityPastEditions } from "@/data/past-editions";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";

export type AuthorityStat = {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
};

export const impactStatistics: AuthorityStat[] = [
  { value: 5, label: "Completed SMK Editions", suffix: "" },
  { value: 500, label: "Institutions Engaged", suffix: "+" },
  { value: 1200, label: "Research Papers Presented", suffix: "+" },
  { value: 14, label: "States & UTs Reached", suffix: "+" },
  { value: 10000, label: "Student Participants", suffix: "+" },
  { value: 200, label: "Partner Organizations", suffix: "+" },
];

export type PastEdition = {
  year: string;
  title: string;
  venue: string;
  highlight: string;
  href?: string;
};

export const pastEditions: PastEdition[] = buildAuthorityPastEditions();

export type ResearchOutputItem = {
  title: string;
  type: "Proceedings" | "Journal" | "Patrika" | "Policy Brief";
  description: string;
  href: string;
};

export const researchOutput: ResearchOutputItem[] = [
  {
    title: "Conference Proceedings",
    type: "Proceedings",
    description: "Peer-reviewed and invited papers from national editions.",
    href: "/proceedings",
  },
  {
    title: "Viksit Bharat & Viksit India Journals",
    type: "Journal",
    description: "Publication platform for education and development research.",
    href: "https://pub.dhe.org.in",
  },
  {
    title: "Bal Shodh Patrika",
    type: "Patrika",
    description: "Student research journal integrated with Academic Council.",
    href: "/departments/academic-council",
  },
  {
    title: "Multi Track Conference",
    type: "Policy Brief",
    description: "Submit via the official Microsoft CMT portal.",
    href: CMT_SUBMISSION_URL,
  },
];

export type InstitutionLogo = {
  name: string;
  role: string;
  logoSrc?: string;
};

export const participatingInstitutions: InstitutionLogo[] = [
  { name: "NIT Hamirpur", role: "Host Institution · SMK 6.0" },
  { name: "IIT Mandi", role: "Engineering & Technology Track" },
  { name: "IIT Bombay", role: "Governance & Policy Dialogue" },
  { name: "NIT Kurukshetra", role: "Academic Council Coordination" },
  { name: "PGIMER Chandigarh", role: "Health Sciences" },
  { name: "NCERT", role: "Education Systems & NEP" },
  { name: "CSIR–CSIO Chandigarh", role: "Research & Innovation" },
  { name: "IIT Delhi", role: "Policy & Higher Education" },
  { name: "Central Universities (Himachal Pradesh)", role: "Regional Academic Network" },
];

export type PartnerOrg = {
  name: string;
  category: "Education" | "Media" | "CSR" | "Government" | "Industry";
  description: string;
};

export const partnerOrganizations: PartnerOrg[] = [
  {
    name: "Department of Holistic Education (DHE)",
    category: "Education",
    description: "Convening authority for the Shiksha Mahakumbh Abhiyan.",
  },
  {
    name: "Vidya Bharati",
    category: "Education",
    description: "National education network and grassroots participation.",
  },
  {
    name: "RASE",
    category: "Education",
    description: "Research, administration, and publication support.",
  },
  {
    name: "National Media Partners",
    category: "Media",
    description: "Print, digital, and broadcast coverage of editions.",
  },
  {
    name: "CSR & NGO Network",
    category: "CSR",
    description: "Inclusive education and community impact programmes.",
  },
];

export type GovernmentEngagement = {
  title: string;
  body: string;
  icon?: string;
};

export const governmentEngagement: GovernmentEngagement[] = [
  {
    title: "NEP 2020 Alignment",
    body: "Programmes mapped to multidisciplinary education, IKS, and vocational integration.",
    icon: "📜",
  },
  {
    title: "Bharat @ 2047 Vision",
    body: "Conclaves and research tracks supporting Viksit Bharat knowledge goals.",
    icon: "🇮🇳",
  },
  {
    title: "State & UT Participation",
    body: "State representation zones and policy dialogues with education departments.",
    icon: "🏛️",
  },
  {
    title: "INI Collaboration",
    body: "Partnership with Indian National Institutes for research and talent development.",
    icon: "🎓",
  },
];

export type SuccessStory = {
  quote: string;
  author: string;
  role: string;
  edition?: string;
};

export const successStories: SuccessStory[] = [
  {
    quote:
      "SMK 6.0 registration and Academic Council tracks give our institution a single national gateway for delegates, papers, and olympiads.",
    author: "Institution Coordinator",
    role: "Higher Education · Himachal Pradesh",
    edition: "SMK 6.0",
  },
  {
    quote:
      "Shiksha Mahakumbh gave our students a national stage for research and innovation beyond the classroom.",
    author: "Principal, Partner School",
    role: "School Leadership",
    edition: "SMK 5.0",
  },
  {
    quote:
      "The conclave format connected policymakers, industry, and academia in one actionable dialogue.",
    author: "University Delegate",
    role: "Higher Education",
    edition: "SMK 4.0",
  },
  {
    quote:
      "Olympiad and exhibition tracks built confidence in STEM and entrepreneurship at scale.",
    author: "Student Achiever",
    role: "DHE Olympiad",
    edition: "SMK 6.0",
  },
  {
    quote:
      "Proceedings and journal pathways turned conference participation into lasting scholarly output.",
    author: "Research Scholar",
    role: "Conference & Publications",
    edition: "SMK 5.0",
  },
];

export type AuthoritySectionKey =
  | "impact"
  | "editions"
  | "research"
  | "institutions"
  | "partners"
  | "government"
  | "stories"
  | "speakers";

export const AUTHORITY_SECTION_ORDER: AuthoritySectionKey[] = [
  "impact",
  "editions",
  "research",
  "institutions",
  "partners",
  "government",
  "stories",
];
