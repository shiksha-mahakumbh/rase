import type { EducationPillarId } from "./entities/education-pillars";

export type TopicClusterId = string;

export type TopicCluster = {
  id: TopicClusterId;
  pillarId: EducationPillarId;
  label: string;
  description: string;
};

/** pillar → cluster → content (routes in content-map.ts) */
export const TOPIC_CLUSTERS: TopicCluster[] = [
  { id: "school-programmes", pillarId: "school-education", label: "School Programmes", description: "Academic council school tracks" },
  { id: "school-registration", pillarId: "school-education", label: "School Registration", description: "Delegate and school project registration" },
  { id: "hei-conclave", pillarId: "higher-education", label: "HEI Conclaves", description: "VC and directors dialogues" },
  { id: "academic-council", pillarId: "higher-education", label: "Academic Council", description: "SMK 6.0 academic programming" },
  { id: "vocational-workshops", pillarId: "vocational-education", label: "Workshops", description: "Past vocational workshops" },
  { id: "skills-talent", pillarId: "skill-development", label: "Talent & Skills", description: "Talent and skill registration" },
  { id: "research-submit", pillarId: "research", label: "Submissions", description: "Abstract and paper submission" },
  { id: "research-proceedings", pillarId: "research", label: "Proceedings", description: "Published research volumes" },
  { id: "innovation-workshop", pillarId: "innovation", label: "Innovation Workshops", description: "Entrepreneurship workshops" },
  { id: "innovation-exhibition", pillarId: "innovation", label: "Exhibitions", description: "Project and best-practice displays" },
  { id: "policy-conclave", pillarId: "policy", label: "Policy Conclaves", description: "Policy and governance forums" },
  { id: "policy-topics", pillarId: "policy", label: "Conference Topics", description: "Research and policy themes" },
  { id: "leadership-intro", pillarId: "leadership", label: "Movement", description: "Introduction and vision" },
  { id: "leadership-speakers", pillarId: "leadership", label: "Keynotes", description: "Distinguished speakers" },
  { id: "teacher-tdp", pillarId: "teacher-development", label: "TDP", description: "Teacher Development Program" },
  { id: "student-olympiad", pillarId: "student-development", label: "Olympiads", description: "Student olympiad tracks" },
  { id: "student-cultural", pillarId: "student-development", label: "Cultural Programmes", description: "Talk shows and cultural tracks" },
  { id: "edtech-media", pillarId: "educational-technology", label: "Digital Media", description: "Digital media galleries" },
  { id: "edtech-videos", pillarId: "educational-technology", label: "Videos", description: "Video archives" },
  { id: "olympiad-dhe", pillarId: "olympiads", label: "DHE Olympiad", description: "Subject olympiads" },
  { id: "awards-excellence", pillarId: "awards", label: "Excellence Awards", description: "Faculty and student awards" },
  { id: "conf-mahakumbh", pillarId: "conferences", label: "Shiksha Mahakumbh Abhiyan", description: "Abhiyan editions" },
  { id: "conf-kumbh", pillarId: "conferences", label: "Past Editions", description: "Historical edition archives" },
  { id: "pub-journals", pillarId: "publications", label: "Journals & Books", description: "Publications catalogue" },
  { id: "pub-proceedings", pillarId: "publications", label: "Proceedings", description: "Conference proceedings" },
  { id: "media-press", pillarId: "media", label: "Press", description: "Press releases and articles" },
  { id: "media-centre", pillarId: "media", label: "Media Centre", description: "Official media hub" },
  { id: "knowledge-collections", pillarId: "knowledge-hub", label: "Collections", description: "Knowledge Hub collections" },
];

export function getClustersForPillar(
  pillarId: EducationPillarId
): TopicCluster[] {
  return TOPIC_CLUSTERS.filter((c) => c.pillarId === pillarId);
}

export function getClusterById(
  clusterId: TopicClusterId
): TopicCluster | undefined {
  return TOPIC_CLUSTERS.find((c) => c.id === clusterId);
}
