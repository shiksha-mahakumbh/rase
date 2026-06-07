import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { ALL_PILLAR_SLUGS } from "@/lib/knowledge-graph/pillar-registry";

const STATIC_PATHS = [
  "",
  "education",
  ...ALL_PILLAR_SLUGS,
  "registration",
  "registration/success",
  "introduction",
  "ContactUs",
  "upcomingevent",
  "pastevent",
  "past_event/sm23",
  "past_event/sk23",
  "past_event/sk24",
  "past_event/sm24",
  "past_event/sm25",
  "gallery",
  "media",
  "journals",
  "proceedings",
  "committeepage",
  "VibhagRoute/AcademicCouncil24",
  "VibhagRoute/Prabandhan24",
  "VibhagRoute/Prachar24",
  "VibhagRoute/Sampark24",
  "VibhagRoute/Vitt24",
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "refund-policy",
  "cookie-policy",
  "abstract",
  "knowledge",
  "donation",
  "feedback",
  "Press_Release",
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_PATHS.map((path) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified: now,
    changeFrequency: path === "" || path === "registration" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "registration" ? 0.9 : 0.6,
  }));
}
