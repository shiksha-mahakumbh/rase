import type { PublicPageHero } from "@/components/layouts/PublicPageShell";

export const PAGE_HEROES = {
  press: {
    eyebrow: "Media Centre",
    title: "Press Releases",
    subtitle:
      "Official announcements, coverage, and updates from Shiksha Mahakumbh Abhiyan.",
    accent: "navy",
  },
  glimpses: {
    eyebrow: "Media Archive",
    title: "Glimpses of Shiksha Mahakumbh Abhiyan",
    subtitle:
      "Explore digital and print media from Abhiyan editions — celebrating education, innovation, and national development.",
    accent: "emerald",
  },
  gallery: {
    eyebrow: "Media Centre",
    title: "Photo Gallery",
    subtitle: "Moments from Shiksha Mahakumbh editions, workshops, and national programmes.",
    accent: "navy",
  },
  videos: {
    eyebrow: "Media Centre",
    title: "Video Gallery",
    subtitle: "Watch highlights, talks, and coverage from the national education movement.",
    accent: "navy",
  },
  conclave: {
    eyebrow: "Conferences",
    title: "Conclaves & Dialogues",
    subtitle:
      "Vice-Chancellor, scientist, media, and leadership conclaves driving policy and innovation.",
    accent: "saffron",
  },
  accommodation: {
    eyebrow: "Registration",
    title: "Accommodation Booking",
    subtitle: "Reserve campus accommodation for Shiksha Mahakumbh delegates and participants.",
    accent: "emerald",
  },
  upcomingEvents: {
    eyebrow: "Programmes",
    title: "शिक्षा महाकुंभ 6.0",
    subtitle: "Summits, workshops, and national programmes on the Shiksha Mahakumbh Abhiyan calendar.",
    accent: "saffron",
  },
  abhiyan: {
    eyebrow: "Abhiyan",
    title: "शिक्षा महाकुंभ अभियान",
    subtitle: "Unified timeline of editions 1.0 through 6.0 — venues, themes, and national impact.",
    accent: "navy",
  },
  talkShow: {
    eyebrow: "Programmes",
    title: "Talk Shows",
    subtitle: "Conversations with educators, policymakers, and innovators.",
    accent: "saffron",
  },
  topics: {
    eyebrow: "Research",
    title: "Conference Topics",
    subtitle: "Explore thematic areas for papers, panels, and academic submissions.",
    accent: "emerald",
  },
  proceedings: {
    eyebrow: "Publications",
    title: "Proceedings",
    subtitle: "Peer-reviewed outcomes and volumes from Shiksha Mahakumbh editions.",
    accent: "navy",
  },
  abstract: {
    eyebrow: "Research",
    title: "Multi Track Conference",
    subtitle: "Redirecting to Microsoft CMT submission portal.",
    accent: "emerald",
  },
  fullLengthPaper: {
    eyebrow: "Research",
    title: "Multi Track Conference",
    subtitle: "Redirecting to Microsoft CMT submission portal.",
    accent: "emerald",
  },
  comingSoon: {
    eyebrow: "Programmes",
    title: "Coming Soon",
    subtitle: "New programmes and features launching soon on the national platform.",
    accent: "saffron",
  },
} as const satisfies Record<string, PublicPageHero>;
