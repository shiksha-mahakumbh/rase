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
    title: "Glimpses of Shiksha Mahakumbh",
    subtitle:
      "Explore digital and print media from Mahakumbh and Kumbh editions — celebrating education, innovation, and national development.",
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
    title: "Upcoming Events",
    subtitle: "Summits, workshops, and national programmes on the Shiksha Mahakumbh calendar.",
    accent: "saffron",
  },
  shikshaMahakumbh: {
    eyebrow: "Editions",
    title: "Shiksha Mahakumbh",
    subtitle: "India's multidisciplinary education summit — editions, themes, and archives.",
    accent: "navy",
  },
  shikshaKumbh: {
    eyebrow: "Editions",
    title: "Shiksha Kumbh",
    subtitle: "Regional Kumbh editions connecting institutions, youth, and educators.",
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
    title: "Abstract Submission",
    subtitle: "Submit your research abstract for Shiksha Mahakumbh proceedings.",
    accent: "emerald",
  },
  fullLengthPaper: {
    eyebrow: "Research",
    title: "Full-Length Paper Submission",
    subtitle: "Submit full-length research papers for Shiksha Mahakumbh proceedings.",
    accent: "emerald",
  },
  comingSoon: {
    eyebrow: "Programmes",
    title: "Coming Soon",
    subtitle: "New programmes and features launching soon on the national platform.",
    accent: "saffron",
  },
} as const satisfies Record<string, PublicPageHero>;
