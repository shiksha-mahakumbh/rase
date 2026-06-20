import { createPageMetadata } from "@/lib/seo/metadata";
import { PRESS_CANONICAL_PATHS } from "@/constants/canonical-routes";
import {
  createArticleMetadata,
  createCommitteeMetadata,
  createEventMetadata,
  createPublicationMetadata,
  createNoIndexMetadata,
} from "@/lib/seo/metadataBuilders";
import { getPressOgImageUrl, PRESS_OG_IMAGES } from "@/lib/seo/pressShare";

/** Central registry for static public routes — extend as layouts are added */
export const PUBLIC_PAGE_META = {
  proceedings: createPublicationMetadata({
    title: "Proceedings",
    description: "Research proceedings from Shiksha Mahakumbh editions.",
    path: "/proceedings",
    publicationType: "Proceedings",
  }),
  proceeding1: createPublicationMetadata({
    title: "Proceedings Volume I",
    description: "Shiksha Mahakumbh research proceedings — volume 1.",
    path: "/proceeding1",
    publicationType: "Proceedings",
  }),
  proceeding2: createPublicationMetadata({
    title: "Proceedings Volume II",
    description: "Shiksha Mahakumbh research proceedings — volume 2.",
    path: "/proceeding2",
    publicationType: "Proceedings",
  }),
  proceeding3: createPublicationMetadata({
    title: "Proceedings Volume III",
    description: "Shiksha Mahakumbh research proceedings — volume 3.",
    path: "/proceeding3",
    publicationType: "Proceedings",
  }),
  journals: createPublicationMetadata({
    title: "Journals",
    description: "Publications and journals affiliated with Shiksha Mahakumbh Abhiyan.",
    path: "/journals",
    publicationType: "Journal",
  }),
  books: createPublicationMetadata({
    title: "Books",
    description: "Books and publications from the Shiksha Mahakumbh knowledge platform.",
    path: "/books",
    publicationType: "Book",
  }),
  upcomingevent: createEventMetadata({
    title: "शिक्षा महाकुंभ 6.0 — Upcoming Programmes",
    description:
      "Upcoming programmes and registration for Shiksha Mahakumbh Abhiyan edition 6.0.",
    path: "/upcoming-events",
  }),
  pastEvents: createEventMetadata({
    title: "Past Editions — शिक्षा महाकुंभ 1.0 to 5.0",
    description:
      "Official archive of five completed Shiksha Mahakumbh Abhiyan editions: NIT Jalandhar, NIT Kurukshetra, NIT Srinagar, Kurukshetra University, and NIPER Mohali. Themes, venues, impact, and galleries.",
    path: "/past-events",
    keywords: [
      "Shiksha Mahakumbh past editions",
      "Indian Education Conference",
      "Education Conclave India",
      "Department of Holistic Education",
      "National Education Event",
    ],
  }),
  committeepage: createCommitteeMetadata({
    title: "Organising Committee",
    description: "Committee members for Shiksha Mahakumbh Abhiyan.",
    path: "/committees",
  }),
  gallery: createPageMetadata({
    title: "Photo Gallery",
    description: "Photos from Shiksha Mahakumbh national education summits.",
    path: "/gallery",
  }),
  media: createPageMetadata({
    title: "Media Centre — Press, Archives & Coverage",
    description:
      "Shiksha Mahakumbh media centre: press releases, digital and print archives, photo and video galleries, and national coverage.",
    path: "/media-center",
    keywords: [
      "Shiksha Mahakumbh media",
      "education press India",
      "Mahakumbh digital media archive",
    ],
  }),
  pressRelease: createArticleMetadata({
    title: "Press Releases",
    description: "Official press releases from Shiksha Mahakumbh Abhiyan.",
    path: "/press",
  }),
  donation: createPageMetadata({
    title: "Donation & Sponsorship",
    description: "Support Shiksha Mahakumbh through donation and sponsorship.",
    path: "/donation",
  }),
  feedback: createPageMetadata({
    title: "Feedback",
    description: "Share feedback on Shiksha Mahakumbh programmes and events.",
    path: "/feedback",
  }),
  topics: createPageMetadata({
    title: "Conference Topics",
    description: "Research and conference themes for Shiksha Mahakumbh.",
    path: "/Topics",
  }),
  abstract: createPageMetadata({
    title: "Multi Track Conference",
    description: "Multi Track Conference submissions via Microsoft CMT for Shiksha Mahakumbh.",
    path: "/abstract",
  }),
  fulllengthpaper: createPublicationMetadata({
    title: "Multi Track Conference",
    description: "Multi Track Conference submission via Microsoft CMT.",
    path: "/fulllengthpaper",
    publicationType: "Paper",
  }),
  conclave: createEventMetadata({
    title: "VC & Policy Conclaves",
    description:
      "Higher education conclaves and policy dialogues at Shiksha Mahakumbh — vice-chancellors, policymakers, and institutions.",
    path: "/conclave",
    keywords: ["VC conclave", "higher education policy", "Shiksha Mahakumbh"],
  }),
  noticeboard: createPageMetadata({
    title: "Notice Board",
    description:
      "Official notices and announcements for Shiksha Mahakumbh 6.0 programmes and deadlines.",
    path: "/noticeboard",
    keywords: ["SMK notices", "announcements", "registration deadlines"],
  }),
  videos: createPageMetadata({
    title: "Videos",
    description: "Video gallery from Shiksha Mahakumbh Abhiyan national editions.",
    path: "/videos",
  }),
  keynotespeakers: createPageMetadata({
    title: "Keynote Speakers",
    description: "Distinguished keynote speakers at Shiksha Mahakumbh national summits.",
    path: "/keynotespeakers",
  }),
  paper: createPageMetadata({
    title: "Multi Track Conference",
    description: "Multi Track Conference via Microsoft CMT for Shiksha Mahakumbh.",
    path: "/paper",
  }),
  pastEventSm24: createEventMetadata({
    title: "शिक्षा महाकुंभ 4.0 — Kurukshetra University (2024)",
    description:
      "Shiksha Mahakumbh 4.0 at Kurukshetra University, 16–17 December 2024. Theme: Indian Education System for Global Development.",
    path: "/past_event/sm24",
    keywords: ["SMK 4.0", "Kurukshetra University", "Indian Education Conference"],
  }),
  pastEventSm23: createEventMetadata({
    title: "शिक्षा महाकुंभ 1.0 — NIT Jalandhar (2023)",
    description:
      "Shiksha Mahakumbh 1.0 at NIT Jalandhar, 9–11 June 2023. Theme: Recent Advances in School Education.",
    path: "/past_event/sm23",
    keywords: ["SMK 1.0", "NIT Jalandhar", "School Education Conference"],
  }),
  pastEventSm25: createEventMetadata({
    title: "शिक्षा महाकुंभ 5.0 — NIPER Mohali (2025)",
    description:
      "Shiksha Mahakumbh 5.0 at NIPER Mohali, 31 October – 2 November 2025. Theme: Classroom to Society — Building a Healthier World through Education.",
    path: "/past_event/sm25",
    keywords: ["SMK 5.0", "NIPER Mohali", "Higher Education Summit"],
  }),
  pastEventSk24: createEventMetadata({
    title: "शिक्षा महाकुंभ 3.0 — NIT Srinagar (2024)",
    description:
      "Shiksha Mahakumbh 3.0 at NIT Srinagar, 29–30 June 2024. Theme: Academic-driven Startups in Developing Economy of J & K.",
    path: "/past_event/sk24",
    keywords: ["SMK 3.0", "NIT Srinagar", "Academic Innovation Summit"],
  }),
  pastEventSk23: createEventMetadata({
    title: "शिक्षा महाकुंभ 2.0 — NIT Kurukshetra (2023)",
    description:
      "Shiksha Mahakumbh 2.0 at NIT Kurukshetra, 20 December 2023. Theme: Role of Academic-driven Startups in Economy.",
    path: "/past_event/sk23",
    keywords: ["SMK 2.0", "NIT Kurukshetra", "Research Conference India"],
  }),
  workshopTdp: createEventMetadata({
    title: "Teacher Development Program",
    description: "Teacher Development Program in collaboration with NITTTR — past workshop archive.",
    path: "/past_event/Teacher_Development_Program",
  }),
  workshopEnglish: createEventMetadata({
    title: "Spoken English Workshop",
    description: "Spoken English workshop for educators — Shiksha Mahakumbh past programmes.",
    path: "/past_event/Spoken_English_Workshop",
  }),
  workshopInnovation: createEventMetadata({
    title: "Innovation & Entrepreneurship Workshop",
    description:
      "Innovation and entrepreneurship workshop for schools — CSIO Chandigarh programme archive.",
    path: "/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop",
  }),
  vibhagPrachar: createPageMetadata({
    title: "Prachar Vibhag — SMK 6.0",
    description: "Communications and outreach for Shiksha Mahakumbh 6.0.",
    path: "/departments/prachar",
  }),
  vibhagPrabandhan: createPageMetadata({
    title: "Prabandhan Vibhag — SMK 6.0",
    description: "Programme management division — Shiksha Mahakumbh 6.0.",
    path: "/departments/prabandhan",
  }),
  vibhagSampark: createPageMetadata({
    title: "Sampark Vibhag — SMK 6.0",
    description: "Institutional liaison and stakeholder engagement — Shiksha Mahakumbh 6.0.",
    path: "/departments/sampark",
  }),
  vibhagVitt: createPageMetadata({
    title: "Vitt Vibhag — SMK 6.0",
    description: "Finance and resource management — Shiksha Mahakumbh 6.0.",
    path: "/departments/vitt",
  }),
  merchandise: createPageMetadata({
    title: "Official Merchandise",
    description:
      "Official Shiksha Mahakumbh merchandise — T-shirts, mugs, caps, and conference bags symbolizing Bharat's educational renaissance.",
    path: "/merchandise",
    keywords: ["Shiksha Mahakumbh merchandise", "education summit store"],
  }),
  talkShow: createPageMetadata({
    title: "Talk Show",
    description: "Education talk shows and dialogues from Shiksha Mahakumbh Abhiyan.",
    path: "/TalkShow",
  }),
} as const;

const PRESS_TITLES: Record<number, { title: string; description: string }> = {
  1: {
    title: "Press — Baton Ceremony SMK 4.0",
    description:
      "Press coverage: Baton Ceremony kicks off Shiksha Mahakumbh 4.0 at Kurukshetra University.",
  },
  2: {
    title: "Press — Shiksha Mahakumbh 4.0",
    description: "Media article on Shiksha Mahakumbh 4.0 programmes and national participation.",
  },
  3: {
    title: "Press — Residential Camp Success",
    description: "Press report on residential training camp success for Shiksha Mahakumbh.",
  },
  4: {
    title: "Press — आवासीय अभ्यास वर्ग",
    description: "Hindi press coverage of residential practice camp milestones.",
  },
  5: {
    title: "Press — Shiksha Mahakumbh Coverage",
    description: "National media coverage of Shiksha Mahakumbh education movement.",
  },
  6: {
    title: "Press — Education Summit Coverage",
    description: "Press article on summit outcomes and institutional participation.",
  },
  7: {
    title: "Press — Mahakumbh Programme Update",
    description: "Latest press update on Shiksha Mahakumbh Abhiyan activities.",
  },
  8: {
    title: "Press — Education Movement",
    description: "Media story on the Shiksha Mahakumbh national education movement.",
  },
  9: {
    title: "Press — Summit Highlights",
    description: "Press highlights from Shiksha Mahakumbh national programmes.",
  },
};

/** Copy + image path for JSON-LD and metadata (single source) */
export function getPressArticleContent(pressNumber: number) {
  const copy = PRESS_TITLES[pressNumber] ?? {
    title: `Press Release ${pressNumber}`,
    description: `Media coverage — Shiksha Mahakumbh press article ${pressNumber}.`,
  };
  return {
    ...copy,
    path: PRESS_CANONICAL_PATHS[pressNumber] ?? `/press/article-${pressNumber}`,
    image: PRESS_OG_IMAGES[pressNumber] ?? "/sLogo.png",
  };
}

export function pressArticleMeta(pressNumber: number) {
  const copy = getPressArticleContent(pressNumber);
  return createArticleMetadata({
    title: copy.title,
    description: copy.description,
    path: PRESS_CANONICAL_PATHS[pressNumber] ?? `/press/article-${pressNumber}`,
    keywords: ["Shiksha Mahakumbh press", "education news India", "SMK media"],
    image: getPressOgImageUrl(pressNumber),
  });
}

export function committeeYearMeta(
  slug: string,
  edition: string,
  year: string
) {
  return createCommitteeMetadata({
    title: "Organising Committee",
    description: `Committee members for ${edition} (${year}).`,
    path: `/committee/${slug}`,
    edition,
  });
}

export const NO_INDEX_META = {
  admin: createNoIndexMetadata({ title: "Admin", path: "/admin" }),
  noticeboarddata: createNoIndexMetadata({
    title: "Notice Board Data",
    path: "/noticeboarddata",
  }),
} as const;
