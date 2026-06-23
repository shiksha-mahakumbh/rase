import type { EducationPillarId } from "./entities/education-pillars";
import { PILLAR_REGISTRY } from "./pillar-registry";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";

export type InternalLinkSuggestion = {
  href: string;
  label: string;
  reason: string;
  weight?: number;
};

/** Official DHE journal platform — replaces legacy /journals route */
export const DHE_JOURNALS_URL = "https://pub.dhe.org.in";

export const DEFAULT_RELATED_LINK_LIMIT = 4;

/** Thin pillar landing pages → redirect to /upcoming-events (legacy-redirects) */
export const THIN_PILLAR_PATHS = new Set(
  PILLAR_REGISTRY.filter(
    (p) => !["conferences", "publications", "media"].includes(p.slug)
  ).map((p) => p.path)
);

/** Empty / placeholder routes — no related-link suggestions */
export const BLOCKED_RELATED_LINK_PATHS = new Set([
  "/initiatives",
  "/knowledge",
  "/journals",
  "/videos",
  "/people",
  "/educational-leaders",
  "/institutions",
  "/universities",
  "/schools",
  "/research-projects",
  "/reports",
  "/whitepapers",
  "/policy-papers",
  "/research-papers",
  "/Topics",
  "/TalkShow",
  "/keynotespeakers",
  "/glimpses",
  "/events",
  "/summits",
  "/media",
  ...Array.from(THIN_PILLAR_PATHS),
]);

/** Sitemap: omit placeholder and redirected shells */
export const SITEMAP_EXCLUDED_PATHS = new Set([
  "journals",
  "videos",
  "people",
  "educational-leaders",
  "institutions",
  "universities",
  "schools",
  "research-projects",
  "reports",
  "whitepapers",
  "policy-papers",
  "research-papers",
  "initiatives",
  "summits",
  "research",
  "events",
  "knowledge",
  "keynotespeakers",
  "glimpses",
  "TalkShow",
  "Topics",
  "conclave",
  "past_event/Innovation_and_Entrepreneurship_Dhe_Workshop",
  ...PILLAR_REGISTRY.filter((p) => THIN_PILLAR_PATHS.has(p.path)).map((p) =>
    p.path.replace(/^\//, "")
  ),
]);

/** Routes that only redirect — noindex in middleware + sitemap (Phase 6) */
export const REDIRECT_SHELL_PATHS = new Set([
  "reports",
  "whitepapers",
  "policy-papers",
  "research-papers",
  "people",
  "educational-leaders",
  "institutions",
  "universities",
  "schools",
  "research-projects",
  "research",
  "initiatives",
  "summits",
  "events",
  "knowledge",
  "journals",
  "videos",
  "Topics",
  "TalkShow",
  "keynotespeakers",
  "glimpses",
  "conclave",
  "past_event/Innovation_and_Entrepreneurship_Dhe_Workshop",
  ...Array.from(THIN_PILLAR_PATHS).map((p) => p.replace(/^\//, "")),
]);

/** Phase 6 — positive allowlist: real public content only */
export const SITEMAP_CORE_PATHS: readonly string[] = [
  "",
  "registration",
  "registration/success",
  "introduction",
  "contact-us",
  "upcoming-events",
  "past-events",
  "speakers/directory",
  "gallery",
  "media-center",
  "publications",
  "conferences",
  "workshops",
  "education",
  "past_event/shiksha-mahakumbh-1.0",
  "past_event/shiksha-mahakumbh-2.0",
  "past_event/shiksha-mahakumbh-3.0",
  "past_event/shiksha-mahakumbh-4.0",
  "past_event/shiksha-mahakumbh-5.0",
  "past_event/Teacher_Development_Program",
  "past_event/Spoken_English_Workshop",
  "best-wishes",
  "merchandise",
  "committees",
  "downloads",
  "books",
  "publications/souvenir-abstracts-mtc",
  "proceedings",
  "proceeding1",
  "proceeding2",
  "proceeding3",
  "noticeboard",
  "donation",
  "feedback",
  "press",
  "departments/academic-council",
  "departments/prabandhan",
  "departments/prachar",
  "departments/sampark",
  "departments/vitt",
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "refund-policy",
  "cookie-policy",
  "coming-soon",
  "abhiyaninphotoframe",
];

export function isRedirectShellPath(pathname: string): boolean {
  const normalized = pathname.replace(/^\//, "").replace(/\/$/, "");
  return REDIRECT_SHELL_PATHS.has(normalized);
}

const CORE: InternalLinkSuggestion[] = [
  { href: "/registration", label: "Registration", reason: "curated", weight: 95 },
  { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 90 },
  { href: "/past-events", label: "Past Editions", reason: "curated", weight: 88 },
  { href: "/gallery", label: "Gallery", reason: "curated", weight: 85 },
];

const PUBLICATIONS: InternalLinkSuggestion[] = [
  { href: "/proceedings", label: "Proceedings", reason: "curated", weight: 92 },
  { href: "/publications/souvenir-abstracts-mtc", label: "Souvenir Abstracts MTC", reason: "curated", weight: 90 },
  { href: "/books", label: "Books", reason: "curated", weight: 88 },
  { href: DHE_JOURNALS_URL, label: "DHE Journal", reason: "curated", weight: 86 },
  { href: "/publications", label: "Publications Hub", reason: "curated", weight: 84 },
];

const CURATED_BY_PATH: Record<string, InternalLinkSuggestion[]> = {
  "/": CORE,
  "/books": PUBLICATIONS,
  "/proceedings": PUBLICATIONS,
  "/proceeding1": PUBLICATIONS,
  "/proceeding2": PUBLICATIONS,
  "/proceeding3": PUBLICATIONS,
  "/publications": PUBLICATIONS,
  "/publications/souvenir-abstracts-mtc": PUBLICATIONS,
  "/gallery": [
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: DHE_JOURNALS_URL, label: "DHE Journal", reason: "curated", weight: 85 },
    { href: "/press", label: "Press Releases", reason: "curated", weight: 82 },
    { href: "/media-center", label: "Media Centre", reason: "curated", weight: 80 },
  ],
  "/upcoming-events": [
    { href: "/registration", label: "Register for 6.0", reason: "curated", weight: 95 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 93 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 88 },
    { href: "/downloads", label: "Brochures", reason: "curated", weight: 85 },
    { href: "/committees", label: "Organising Committee", reason: "curated", weight: 82 },
    { href: "/contact-us", label: "Contact DHE", reason: "curated", weight: 80 },
  ],
  "/past-events": [
    { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 92 },
    { href: "/downloads", label: "Edition Brochures", reason: "curated", weight: 90 },
    { href: "/gallery", label: "Gallery", reason: "curated", weight: 88 },
    { href: "/media-center", label: "Media Centre", reason: "curated", weight: 86 },
    { href: "/proceedings", label: "Proceedings", reason: "curated", weight: 84 },
    { href: "/publications/souvenir-abstracts-mtc", label: "Souvenir Abstracts", reason: "curated", weight: 82 },
  ],
  "/downloads": [
    { href: "/committees", label: "Organising Committees", reason: "curated", weight: 92 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: "/abhiyaninphotoframe", label: "Abhiyan Photo Frame", reason: "curated", weight: 88 },
    { href: "/proceedings", label: "Proceedings", reason: "curated", weight: 86 },
    { href: "/media-center", label: "Media Centre", reason: "curated", weight: 84 },
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 82 },
  ],
  "/best-wishes": [
    { href: "/introduction", label: "About the Abhiyan", reason: "curated", weight: 92 },
    { href: "/abhiyaninphotoframe", label: "Abhiyan Photo Frame", reason: "curated", weight: 90 },
    { href: "/speakers/directory", label: "Speaker Directory", reason: "curated", weight: 88 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 86 },
    { href: "/media-center", label: "Media Centre", reason: "curated", weight: 84 },
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 82 },
  ],
  "/committees": [
    { href: "/registration", label: "Registration", reason: "curated", weight: 92 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: "/abhiyaninphotoframe", label: "Abhiyan Photo Frame", reason: "curated", weight: 88 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 86 },
    { href: "/speakers/directory", label: "Speaker Directory", reason: "curated", weight: 84 },
    { href: "/introduction", label: "Introduction", reason: "curated", weight: 82 },
  ],
  "/introduction": [
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: "/best-wishes", label: "Best Wishes", reason: "curated", weight: 88 },
    { href: "/registration", label: "Registration", reason: "curated", weight: 86 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 84 },
    { href: "/departments/prabandhan", label: "Prabandhan Vibhag", reason: "curated", weight: 82 },
    { href: "/committees", label: "Committees", reason: "curated", weight: 80 },
  ],
  "/press": [
    { href: "/media-center", label: "Media Centre", reason: "curated", weight: 90 },
    { href: "/gallery", label: "Gallery", reason: "curated", weight: 88 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 86 },
    { href: "/introduction", label: "Introduction", reason: "curated", weight: 84 },
  ],
  "/media-center": [
    { href: "/gallery", label: "Gallery", reason: "curated", weight: 90 },
    { href: "/press", label: "Press Releases", reason: "curated", weight: 88 },
    { href: "/best-wishes", label: "Best Wishes", reason: "curated", weight: 86 },
    { href: "/downloads", label: "Edition Brochures", reason: "curated", weight: 84 },
    { href: "/publications/souvenir-abstracts-mtc", label: "Souvenir Abstracts", reason: "curated", weight: 82 },
  ],
  "/conferences": [
    { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 92 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: "/workshops", label: "Workshops", reason: "curated", weight: 88 },
    { href: "/registration", label: "Registration", reason: "curated", weight: 86 },
  ],
  "/workshops": [
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: "/proceedings", label: "Proceedings", reason: "curated", weight: 88 },
    { href: "/conferences", label: "Conferences Hub", reason: "curated", weight: 86 },
    { href: "/registration", label: "Registration", reason: "curated", weight: 84 },
  ],
  "/registration": [
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 92 },
    { href: "/downloads", label: "Edition Brochures", reason: "curated", weight: 90 },
    { href: "/committees", label: "Organising Committee", reason: "curated", weight: 88 },
    { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 86 },
    { href: "/contact-us", label: "Contact DHE", reason: "curated", weight: 84 },
    { href: "/departments/prabandhan", label: "Prabandhan (Logistics)", reason: "curated", weight: 82 },
  ],
  "/departments/academic-council": [
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 92 },
    { href: "/downloads", label: "Edition Brochures", reason: "curated", weight: 90 },
    { href: "/committees", label: "Organising Committee", reason: "curated", weight: 88 },
    { href: CMT_SUBMISSION_URL, label: "Multi Track Conference", reason: "curated", weight: 86 },
    { href: "/workshops", label: "Workshops", reason: "curated", weight: 84 },
    { href: "/proceedings", label: "Proceedings", reason: "curated", weight: 82 },
  ],
  "/departments/prabandhan": [
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 92 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 90 },
    { href: "/contact-us", label: "Contact DHE", reason: "curated", weight: 88 },
    { href: "/downloads", label: "Edition Brochures", reason: "curated", weight: 86 },
    { href: "/committees", label: "Organising Committee", reason: "curated", weight: 84 },
    { href: "/departments/sampark", label: "Sampark Vibhag", reason: "curated", weight: 82 },
  ],
  "/departments/prachar": [
    { href: "/press", label: "Press Releases", reason: "curated", weight: 92 },
    { href: "/media-center", label: "Media Centre", reason: "curated", weight: 90 },
    { href: "/gallery", label: "Gallery", reason: "curated", weight: 88 },
    { href: "/best-wishes", label: "Best Wishes", reason: "curated", weight: 86 },
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 84 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 82 },
  ],
  "/departments/sampark": [
    { href: "/committees", label: "Organising Committees", reason: "curated", weight: 92 },
    { href: "/contact-us", label: "Contact DHE", reason: "curated", weight: 90 },
    { href: "/introduction", label: "About the Abhiyan", reason: "curated", weight: 88 },
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 86 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 84 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 82 },
  ],
  "/departments/vitt": [
    { href: "/donation", label: "Donate (80G)", reason: "curated", weight: 92 },
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 90 },
    { href: "/contact-us", label: "Contact DHE", reason: "curated", weight: 88 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 86 },
    { href: "/merchandise", label: "Merchandise", reason: "curated", weight: 84 },
    { href: "/introduction", label: "Introduction", reason: "curated", weight: 82 },
  ],
  "/donation": [
    { href: "/departments/vitt", label: "Vitt Vibhag (Finance)", reason: "curated", weight: 95 },
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 93 },
    { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 90 },
    { href: "/contact-us", label: "Contact DHE", reason: "curated", weight: 88 },
    { href: "/refund-policy", label: "Refund Policy", reason: "curated", weight: 85 },
    { href: "/introduction", label: "About the Abhiyan", reason: "curated", weight: 82 },
  ],
  "/contact-us": [
    { href: "/registration", label: "Register for SMK 6.0", reason: "curated", weight: 95 },
    { href: "/departments/sampark", label: "Sampark Vibhag", reason: "curated", weight: 93 },
    { href: "/donation", label: "Donate (80G)", reason: "curated", weight: 90 },
    { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 88 },
    { href: "/press", label: "Press Releases", reason: "curated", weight: 85 },
    { href: "/introduction", label: "About the Abhiyan", reason: "curated", weight: 82 },
  ],
  "/knowledge": [
    { href: "/proceedings", label: "Proceedings", reason: "curated", weight: 92 },
    { href: DHE_JOURNALS_URL, label: "DHE Journal", reason: "curated", weight: 90 },
    { href: "/publications", label: "Publications", reason: "curated", weight: 88 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 86 },
  ],
  "/speakers/directory": [
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: "/abhiyaninphotoframe", label: "Abhiyan Photo Frame", reason: "curated", weight: 88 },
    { href: "/committees", label: "Committees", reason: "curated", weight: 86 },
    { href: "/registration", label: "Registration", reason: "curated", weight: 84 },
    { href: "/introduction", label: "Introduction", reason: "curated", weight: 82 },
    { href: "/media-center", label: "Media Centre", reason: "curated", weight: 80 },
  ],
  "/abhiyaninphotoframe": [
    { href: "/introduction", label: "Introduction", reason: "curated", weight: 92 },
    { href: "/past-events", label: "Past Editions", reason: "curated", weight: 90 },
    { href: "/speakers/directory", label: "Speaker Directory", reason: "curated", weight: 88 },
    { href: "/committees", label: "Committees", reason: "curated", weight: 86 },
    { href: "/registration", label: "Registration", reason: "curated", weight: 84 },
    { href: "/press", label: "Press Releases", reason: "curated", weight: 82 },
  ],
  "/education": [
    { href: "/registration", label: "Registration", reason: "curated", weight: 95 },
    { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 92 },
    { href: "/publications", label: "Publications", reason: "curated", weight: 88 },
    { href: "/gallery", label: "Gallery", reason: "curated", weight: 86 },
  ],
  "/noticeboard": [
    { href: "/upcoming-events", label: "Upcoming Events", reason: "curated", weight: 92 },
    { href: "/registration", label: "Registration", reason: "curated", weight: 90 },
    { href: "/downloads", label: "Brochures", reason: "curated", weight: 86 },
    { href: "/departments/academic-council", label: "Academic Council", reason: "curated", weight: 84 },
  ],
};

const CURATED_BY_PILLAR: Partial<Record<EducationPillarId, InternalLinkSuggestion[]>> = {
  publications: PUBLICATIONS,
  conferences: CURATED_BY_PATH["/conferences"],
  media: CURATED_BY_PATH["/media-center"],
  leadership: CURATED_BY_PATH["/introduction"],
  research: [
    { href: "/proceedings", label: "Proceedings", reason: "curated", weight: 92 },
    { href: CMT_SUBMISSION_URL, label: "Multi Track Conference", reason: "curated", weight: 90 },
    { href: DHE_JOURNALS_URL, label: "DHE Journal", reason: "curated", weight: 88 },
    { href: "/publications", label: "Publications Hub", reason: "curated", weight: 86 },
  ],
  "teacher-development": CURATED_BY_PATH["/workshops"],
  "educational-technology": CURATED_BY_PATH["/gallery"],
};

export function isBlockedRelatedLink(href: string): boolean {
  if (!href || href === "#") return true;
  if (BLOCKED_RELATED_LINK_PATHS.has(href)) return true;
  if (href.startsWith("/press/") && href !== "/press") return true;
  if (href.startsWith("/committee/")) return true;
  if (href.startsWith("/media/shiksha-mahakumbh/")) return true;
  return false;
}

export function getCuratedLinksForPath(
  path: string,
  limit = DEFAULT_RELATED_LINK_LIMIT
): InternalLinkSuggestion[] | undefined {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const curated = CURATED_BY_PATH[normalized];
  if (curated) return curated.slice(0, limit);
  return undefined;
}

export function getCuratedLinksForPillar(
  pillarId: EducationPillarId,
  limit = DEFAULT_RELATED_LINK_LIMIT
): InternalLinkSuggestion[] | undefined {
  const curated = CURATED_BY_PILLAR[pillarId];
  if (curated) return curated.slice(0, limit);
  return undefined;
}

/** Useful programme links for the simplified /education hub */
export const EDUCATION_HUB_PROGRAMME_LINKS = [
  { href: "/registration", label: "Registration", description: "Register for Shiksha Mahakumbh 6.0" },
  { href: "/upcoming-events", label: "Upcoming Events", description: "SMK 6.0 & 7.0 programmes" },
  { href: "/past-events", label: "Past Editions", description: "Editions 1.0 through 5.0" },
  { href: "/workshops", label: "Workshops", description: "Teacher development & innovation archives" },
  { href: "/conferences", label: "Conferences", description: "National summit network" },
  { href: "/publications", label: "Publications", description: "Proceedings, books, and research" },
  { href: DHE_JOURNALS_URL, label: "DHE Journal", description: "Official journal platform" },
  { href: "/gallery", label: "Gallery", description: "Photos and videos by edition" },
  { href: "/noticeboard", label: "Notice Board", description: "Official announcements and deadlines" },
  { href: "/media-center", label: "Media Centre", description: "Press and digital coverage" },
  { href: "/departments/academic-council", label: "Academic Council", description: "Programmes and olympiads" },
] as const;
