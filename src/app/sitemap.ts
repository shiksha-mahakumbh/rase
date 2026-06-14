import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { ALL_PILLAR_SLUGS } from "@/lib/knowledge-graph/pillar-registry";
import { MEDIA_ARCHIVE_KEYS } from "@/data/media-archive-keys";
import { PRESS_CANONICAL_PATHS } from "@/constants/canonical-routes";
import { generateSitemapIndex } from "@/server/services/seo.service";

const PILLAR_PATH_OVERRIDES: Record<string, string> = {
  media: "media-center",
};

const COMMITTEE_PATHS = [
  "committee/shikshamahakumbh2023",
  "committee/shikshakumbh2023",
  "committee/shikshakumbh2024",
  "committee/shikshamahakumbh2024",
  "committee/shikshamahakumbh2025",
] as const;

const WORKSHOP_PATHS = [
  "past_event/Teacher_Development_Program",
  "past_event/Spoken_English_Workshop",
  "past_event/Innovation_and_Entrepreneurship_Dhe_Workshop",
] as const;

const DEPARTMENT_PATHS = [
  "departments/academic-council",
  "departments/prabandhan",
  "departments/prachar",
  "departments/sampark",
  "departments/vitt",
] as const;

const MEDIA_ARCHIVE_PATHS = MEDIA_ARCHIVE_KEYS.map((key) => {
  const [edition, year, type] = key.split("/");
  return `media/${edition}/${year}/${type}`;
});

const PRESS_ARTICLE_PATHS = Object.values(PRESS_CANONICAL_PATHS).map((p) =>
  p.replace(/^\//, "")
);

const PILLAR_PATHS = ALL_PILLAR_SLUGS.map((slug) => PILLAR_PATH_OVERRIDES[slug] ?? slug);

const STATIC_PATHS = [
  "",
  "education",
  ...PILLAR_PATHS,
  "registration",
  "registration/success",
  "introduction",
  "abhiyan",
  "contact-us",
  "upcoming-events",
  "past-events",
  "past_event/sm23",
  "past_event/sk23",
  "past_event/sk24",
  "past_event/sm24",
  "past_event/sm25",
  ...WORKSHOP_PATHS,
  "gallery",
  "videos",
  "media-center",
  ...MEDIA_ARCHIVE_PATHS,
  "best-wishes",
  "wishes-received",
  "merchandise",
  "committees",
  ...COMMITTEE_PATHS,
  ...DEPARTMENT_PATHS,
  "journals",
  "books",
  "proceedings",
  "proceeding1",
  "proceeding2",
  "proceeding3",
  "keynotespeakers",
  "noticeboard",
  "downloads",
  "conclave",
  "TalkShow",
  "Topics",
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "refund-policy",
  "cookie-policy",
  "knowledge",
  "initiatives",
  "glimpses",
  "accommodation",
  "coming-soon",
  "donation",
  "feedback",
  "press",
  ...PRESS_ARTICLE_PATHS,
  "people",
  "institutions",
  "universities",
  "schools",
  "research-projects",
  "educational-leaders",
  "reports",
  "whitepapers",
  "policy-papers",
  "research-papers",
  "events",
  "summits",
  "workshops",
];

function sitemapPriority(path: string): number {
  if (path === "") return 1;
  if (path === "registration") return 0.9;
  if (path === "downloads" || path === "noticeboard") return 0.8;
  if (path.startsWith("departments/")) return 0.7;
  if (path.startsWith("committee/")) return 0.5;
  if (path.startsWith("press/")) return 0.4;
  if (path.startsWith("media/") && path.split("/").length > 2) return 0.4;
  return 0.6;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const unique = Array.from(new Set(STATIC_PATHS));

  const staticEntries: MetadataRoute.Sitemap = unique.map((path) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified: now,
    changeFrequency:
      path === "" || path === "registration" || path === "noticeboard" || path === "downloads"
        ? "weekly"
        : "monthly",
    priority: sitemapPriority(path),
  }));

  try {
    const cmsEntries = await generateSitemapIndex();
    const cmsMapped: MetadataRoute.Sitemap = cmsEntries.map((e) => ({
      url: e.url,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
    }));

    const seen = new Set(staticEntries.map((e) => e.url));
    const merged = [
      ...staticEntries,
      ...cmsMapped.filter((e) => !seen.has(e.url)),
    ];
    return merged;
  } catch {
    return staticEntries;
  }
}
