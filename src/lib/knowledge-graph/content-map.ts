import type { EducationPillarId } from "./entities/education-pillars";
import type { TopicClusterId } from "./topic-clusters";

export type ContentMapEntry = {
  path: string;
  title: string;
  pillarId: EducationPillarId;
  clusterId: TopicClusterId;
  priority?: number;
};

/**
 * Maps existing site routes to pillar → cluster hierarchy.
 * New pillar landing pages are additive; legacy URLs unchanged.
 */
export const CONTENT_MAP: ContentMapEntry[] = [
  { path: "/", title: "Home", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 1 },
  { path: "/introduction", title: "Introduction", pillarId: "leadership", clusterId: "leadership-intro" },
  { path: "/registration", title: "Registration", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 1 },
  { path: "/knowledge", title: "Knowledge Hub", pillarId: "knowledge-hub", clusterId: "knowledge-collections" },
  { path: "/departments/academic-council", title: "Academic Council", pillarId: "higher-education", clusterId: "academic-council" },
  { path: "/departments/prachar", title: "Prachar Vibhag", pillarId: "school-education", clusterId: "school-programmes" },
  { path: "/departments/prabandhan", title: "Prabandhan Vibhag", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/conclave", title: "Conclaves", pillarId: "policy", clusterId: "policy-conclave" },
  { path: "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/", title: "Multi Track Conference", pillarId: "research", clusterId: "research-submit" },
  { path: "/proceedings", title: "Proceedings", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding1", title: "Proceedings Vol. I", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding2", title: "Proceedings Vol. II", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding3", title: "Proceedings Vol. III", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/journals", title: "Journals", pillarId: "publications", clusterId: "pub-journals" },
  { path: "/books", title: "Books", pillarId: "publications", clusterId: "pub-journals" },
  { path: "/media", title: "Media", pillarId: "media", clusterId: "media-centre" },
  { path: "/press", title: "Press Releases", pillarId: "media", clusterId: "media-press" },
  { path: "/press/baton-ceremony-smk-4", title: "Press 1", pillarId: "media", clusterId: "media-press" },
  { path: "/press/shiksha-mahakumbh-4-0", title: "Press 2", pillarId: "media", clusterId: "media-press" },
  { path: "/press/residential-camp-success", title: "Press 3", pillarId: "media", clusterId: "media-press" },
  { path: "/press/residential-camp-hindi", title: "Press 4", pillarId: "media", clusterId: "media-press" },
  { path: "/press/national-coverage", title: "Press 5", pillarId: "media", clusterId: "media-press" },
  { path: "/press/education-summit-coverage", title: "Press 6", pillarId: "media", clusterId: "media-press" },
  { path: "/press/mahakumbh-programme-update", title: "Press 7", pillarId: "media", clusterId: "media-press" },
  { path: "/press/education-movement", title: "Press 8", pillarId: "media", clusterId: "media-press" },
  { path: "/press/summit-highlights", title: "Press 9", pillarId: "media", clusterId: "media-press" },
  { path: "/past-events", title: "Past Editions", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/upcoming-events", title: "शिक्षा महाकुंभ 6.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past-events", title: "Past Events", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/sm25", title: "SMK 5.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/sm24", title: "SMK 4.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/sk24", title: "SMK 3.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/sk23", title: "SMK 2.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/sm23", title: "SMK 1.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/Teacher_Development_Program", title: "TDP", pillarId: "teacher-development", clusterId: "teacher-tdp" },
  { path: "/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop", title: "Innovation Workshop", pillarId: "innovation", clusterId: "innovation-workshop" },
  { path: "/past_event/Spoken_English_Workshop", title: "Spoken English", pillarId: "vocational-education", clusterId: "vocational-workshops" },
  { path: "/keynotespeakers", title: "Keynote Speakers", pillarId: "leadership", clusterId: "leadership-speakers" },
  { path: "/Topics", title: "Topics", pillarId: "policy", clusterId: "policy-topics" },
  { path: "/TalkShow", title: "Talk Show", pillarId: "student-development", clusterId: "student-cultural" },
  { path: "/videos", title: "Videos", pillarId: "educational-technology", clusterId: "edtech-videos" },
  { path: "/noticeboard", title: "Notice Board", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/publications", title: "Publications Hub", pillarId: "publications", clusterId: "pub-proceedings", priority: 2 },
  { path: "/conferences", title: "Conferences Hub", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 2 },
  { path: "/events", title: "Events", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/summits", title: "Summits", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/workshops", title: "Workshops", pillarId: "teacher-development", clusterId: "teacher-tdp" },
  { path: "/reports", title: "Reports", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/whitepapers", title: "Whitepapers", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/policy-papers", title: "Policy Papers", pillarId: "policy", clusterId: "policy-topics" },
  { path: "/research-papers", title: "Research Papers", pillarId: "research", clusterId: "research-submit" },
  { path: "/people", title: "People Directory", pillarId: "leadership", clusterId: "leadership-speakers" },
  { path: "/institutions", title: "Institutions", pillarId: "school-education", clusterId: "school-programmes" },
  { path: "/universities", title: "Universities", pillarId: "higher-education", clusterId: "academic-council" },
  { path: "/schools", title: "Schools", pillarId: "school-education", clusterId: "school-programmes" },
  { path: "/research-projects", title: "Research Projects", pillarId: "research", clusterId: "research-submit" },
  { path: "/educational-leaders", title: "Educational Leaders", pillarId: "leadership", clusterId: "leadership-speakers" },
  { path: "/committee/Shiksha Mahakumbh 1.0", title: "Shiksha Mahakumbh 1.0 Committee", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/committee/Shiksha Mahakumbh 2.0", title: "Shiksha Mahakumbh 2.0 Committee", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/committee/Shiksha Mahakumbh 3.0", title: "Shiksha Mahakumbh 3.0 Committee", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/committee/Shiksha Mahakumbh 4.0", title: "Shiksha Mahakumbh 4.0 Committee", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/committee/Shiksha Mahakumbh 5.0", title: "Shiksha Mahakumbh 5.0 Committee", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/committee/Shiksha Mahakumbh 6.0", title: "Shiksha Mahakumbh 6.0 Committee", pillarId: "conferences", clusterId: "conf-mahakumbh" },
];

export function getContentByPath(path: string): ContentMapEntry | undefined {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return CONTENT_MAP.find((e) => e.path === normalized);
}

export function getContentForPillar(
  pillarId: EducationPillarId
): ContentMapEntry[] {
  return CONTENT_MAP.filter((e) => e.pillarId === pillarId);
}

export function getContentForCluster(
  clusterId: TopicClusterId
): ContentMapEntry[] {
  return CONTENT_MAP.filter((e) => e.clusterId === clusterId);
}
