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
  { path: "/VibhagRoute/AcademicCouncil24", title: "Academic Council", pillarId: "higher-education", clusterId: "academic-council" },
  { path: "/VibhagRoute/Prachar24", title: "Prachar Vibhag", pillarId: "school-education", clusterId: "school-programmes" },
  { path: "/VibhagRoute/Prabandhan24", title: "Prabandhan Vibhag", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/conclave", title: "Conclaves", pillarId: "policy", clusterId: "policy-conclave" },
  { path: "/academiccouncil", title: "Academic Council", pillarId: "higher-education", clusterId: "academic-council" },
  { path: "/abstract", title: "Abstract Submission", pillarId: "research", clusterId: "research-submit" },
  { path: "/fulllengthpaper", title: "Full-Length Paper", pillarId: "research", clusterId: "research-submit" },
  { path: "/paper", title: "Call for Papers", pillarId: "research", clusterId: "research-submit" },
  { path: "/proceedings", title: "Proceedings", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding1", title: "Proceedings Vol. I", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding2", title: "Proceedings Vol. II", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding3", title: "Proceedings Vol. III", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/journals", title: "Journals", pillarId: "publications", clusterId: "pub-journals" },
  { path: "/books", title: "Books", pillarId: "publications", clusterId: "pub-journals" },
  { path: "/media", title: "Media", pillarId: "media", clusterId: "media-centre" },
  { path: "/Press_Release", title: "Press Releases", pillarId: "media", clusterId: "media-press" },
  { path: "/Press1", title: "Press 1", pillarId: "media", clusterId: "media-press" },
  { path: "/Press2", title: "Press 2", pillarId: "media", clusterId: "media-press" },
  { path: "/Press3", title: "Press 3", pillarId: "media", clusterId: "media-press" },
  { path: "/Press4", title: "Press 4", pillarId: "media", clusterId: "media-press" },
  { path: "/Press5", title: "Press 5", pillarId: "media", clusterId: "media-press" },
  { path: "/Press6", title: "Press 6", pillarId: "media", clusterId: "media-press" },
  { path: "/Press7", title: "Press 7", pillarId: "media", clusterId: "media-press" },
  { path: "/Press8", title: "Press 8", pillarId: "media", clusterId: "media-press" },
  { path: "/Press9", title: "Press 9", pillarId: "media", clusterId: "media-press" },
  { path: "/shikshamahakumbh", title: "Shiksha Mahakumbh", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/shikshakumbh", title: "Shiksha Kumbh", pillarId: "conferences", clusterId: "conf-kumbh" },
  { path: "/upcomingevent", title: "Upcoming Events", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/pastevent", title: "Past Events", pillarId: "conferences", clusterId: "conf-mahakumbh" },
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
