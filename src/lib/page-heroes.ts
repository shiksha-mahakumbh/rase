import type { PublicPageHero } from "@/components/layouts/PublicPageShell";

export const BRAND_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export function brandPageHero(
  title: PublicPageHero["title"],
  subtitle: string,
  eyebrow = "शिक्षा महाकुंभ अभियान"
): PublicPageHero {
  return {
    eyebrow,
    title,
    subtitle,
    accent: "brand",
    imageSrc: BRAND_HERO_IMAGE,
  };
}

export function brandWorkshopHero(title: string, subtitle: string): PublicPageHero {
  return brandPageHero(title, subtitle, "Workshops · Shiksha Mahakumbh Abhiyan");
}

/** Standard brand hero for PAGE_HEROES registry entries */
function registryHero(
  eyebrow: string,
  title: string,
  subtitle: string
): PublicPageHero {
  return {
    eyebrow,
    title,
    subtitle,
    accent: "brand",
    imageSrc: BRAND_HERO_IMAGE,
  };
}

export const PAGE_HEROES = {
  press: registryHero(
    "Media Centre",
    "Press Releases",
    "Official announcements, coverage, and updates from Shiksha Mahakumbh Abhiyan."
  ),
  glimpses: registryHero(
    "Media Archive",
    "Glimpses of Shiksha Mahakumbh Abhiyan",
    "Explore digital and print media from Abhiyan editions — celebrating education, innovation, and national development."
  ),
  gallery: registryHero(
    "Media Centre",
    "Photo & Video Gallery",
    "Edition-wise albums and documentaries from Shiksha Mahakumbh Abhiyan — photos, films, and national coverage."
  ),
  videos: registryHero(
    "Media Centre",
    "Video Gallery",
    "Watch highlights, talks, and coverage from the national education movement."
  ),
  conclave: registryHero(
    "Conferences",
    "Conclaves & Dialogues",
    "Vice-Chancellor, scientist, media, and leadership conclaves driving policy and innovation."
  ),
  upcomingEvents: registryHero(
    "Programmes",
    "Shiksha Mahakumbh 6.0 & Upcoming Programmes",
    "Summits, workshops, and national programmes on the Shiksha Mahakumbh Abhiyan calendar."
  ),
  abhiyan: registryHero(
    "Abhiyan",
    "शिक्षा महाकुंभ अभियान",
    "Unified timeline of editions 1.0 through 6.0 — venues, themes, and national impact."
  ),
  talkShow: registryHero(
    "Programmes",
    "Talk Shows",
    "Conversations with educators, policymakers, and innovators."
  ),
  topics: registryHero(
    "Research",
    "Conference Topics",
    "Explore thematic areas for papers, panels, and academic submissions."
  ),
  proceedings: registryHero(
    "Publications",
    "Proceedings",
    "Peer-reviewed outcomes and volumes from Shiksha Mahakumbh editions."
  ),
  abstract: registryHero(
    "Research",
    "Multi Track Conference",
    "Redirecting to Microsoft CMT submission portal."
  ),
  fullLengthPaper: registryHero(
    "Research",
    "Multi Track Conference",
    "Redirecting to Microsoft CMT submission portal."
  ),
  comingSoon: registryHero(
    "Programmes",
    "Coming Soon",
    "New programmes and features launching soon on the national platform."
  ),
} as const satisfies Record<string, PublicPageHero>;
