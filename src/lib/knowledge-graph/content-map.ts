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
 * Maps live site routes to pillar → cluster hierarchy.
 * Placeholder / redirected routes are omitted (see site-cleanup.ts).
 */
export const CONTENT_MAP: ContentMapEntry[] = [
  { path: "/", title: "Home", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 1 },
  { path: "/introduction", title: "Introduction", pillarId: "leadership", clusterId: "leadership-intro" },
  { path: "/registration", title: "Registration", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 1 },
  { path: "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/", title: "Multi Track Conference", pillarId: "research", clusterId: "research-submit" },
  { path: "/proceedings", title: "Proceedings", pillarId: "publications", clusterId: "pub-proceedings", priority: 2 },
  { path: "/proceeding1", title: "Proceedings Vol. I", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding2", title: "Proceedings Vol. II", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/proceeding3", title: "Proceedings Vol. III", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "/books", title: "Books", pillarId: "publications", clusterId: "pub-journals" },
  { path: "/publications/souvenir-abstracts-mtc", title: "Souvenir Abstracts MTC", pillarId: "publications", clusterId: "pub-proceedings" },
  { path: "https://pub.dhe.org.in", title: "DHE Journal", pillarId: "publications", clusterId: "pub-journals" },
  { path: "/press", title: "Press Releases", pillarId: "media", clusterId: "media-press" },
  { path: "/past-events", title: "Past Editions", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 2 },
  { path: "/upcoming-events", title: "Upcoming Events", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 2 },
  { path: "/past_event/shiksha-mahakumbh-5.0", title: "SMK 5.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/shiksha-mahakumbh-4.0", title: "SMK 4.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/shiksha-mahakumbh-3.0", title: "SMK 3.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/shiksha-mahakumbh-2.0", title: "SMK 2.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/shiksha-mahakumbh-1.0", title: "SMK 1.0", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/past_event/Teacher_Development_Program", title: "TDP", pillarId: "teacher-development", clusterId: "teacher-tdp" },
  { path: "/past_event/Spoken_English_Workshop", title: "Spoken English", pillarId: "vocational-education", clusterId: "vocational-workshops" },
  { path: "/gallery", title: "Gallery", pillarId: "educational-technology", clusterId: "edtech-videos" },
  { path: "/education", title: "Programmes & Resources", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 2 },
  { path: "/publications", title: "Publications Hub", pillarId: "publications", clusterId: "pub-proceedings", priority: 2 },
  { path: "/conferences", title: "Conferences Hub", pillarId: "conferences", clusterId: "conf-mahakumbh", priority: 2 },
  { path: "/workshops", title: "Workshops", pillarId: "teacher-development", clusterId: "teacher-tdp" },
  { path: "/media-center", title: "Media Centre", pillarId: "media", clusterId: "media-centre" },
  { path: "/best-wishes", title: "Best Wishes", pillarId: "leadership", clusterId: "leadership-intro" },
  { path: "/committees", title: "Committees", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/departments/academic-council", title: "Academic Council", pillarId: "higher-education", clusterId: "academic-council" },
  { path: "/speakers/directory", title: "Speakers Directory", pillarId: "leadership", clusterId: "leadership-speakers" },
  { path: "/noticeboard", title: "Notice Board", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/downloads", title: "Downloads", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/contact-us", title: "Contact", pillarId: "leadership", clusterId: "leadership-intro" },
  { path: "/donation", title: "Donation", pillarId: "leadership", clusterId: "leadership-intro" },
  { path: "/departments/prabandhan", title: "Prabandhan Vibhag", pillarId: "conferences", clusterId: "conf-mahakumbh" },
  { path: "/departments/prachar", title: "Prachar Vibhag", pillarId: "media", clusterId: "media-centre" },
  { path: "/departments/sampark", title: "Sampark Vibhag", pillarId: "leadership", clusterId: "leadership-intro" },
  { path: "/departments/vitt", title: "Vitt Vibhag", pillarId: "conferences", clusterId: "conf-mahakumbh" },
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
