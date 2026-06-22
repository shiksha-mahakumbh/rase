import { createPageMetadata } from "@/lib/seo/metadata";
import { PROCEEDINGS_PAGE_HERO, getProceedingVolumeByPath } from "@/data/proceedings-hub";
import { PRESS_CANONICAL_PATHS } from "@/constants/canonical-routes";
import {
  createArticleMetadata,
  createCommitteeMetadata,
  createEventMetadata,
  createPublicationMetadata,
  createNoIndexMetadata,
} from "@/lib/seo/metadataBuilders";
import { getPressOgImageUrl, PRESS_OG_IMAGES } from "@/lib/seo/pressShare";
import { committeePathFromSlug } from "@/lib/committee/edition-slugs";

/** Central registry for static public routes — extend as layouts are added */
export const PUBLIC_PAGE_META = {
  proceedings: createPublicationMetadata({
    title: PROCEEDINGS_PAGE_HERO.title,
    description: PROCEEDINGS_PAGE_HERO.subtitle,
    path: "/proceedings",
    publicationType: "Proceedings",
  }),
  proceeding1: createPublicationMetadata({
    title: "Proceedings Volume I — Shiksha Mahakumbh 2.0",
    description: `${getProceedingVolumeByPath("/proceeding1")!.theme}. ${getProceedingVolumeByPath("/proceeding1")!.paperCount} papers — read online or download PDF.`,
    path: "/proceeding1",
    publicationType: "Proceedings",
  }),
  proceeding2: createPublicationMetadata({
    title: "Proceedings Volume II — Shiksha Mahakumbh 1.0",
    description: `${getProceedingVolumeByPath("/proceeding2")!.theme}. ${getProceedingVolumeByPath("/proceeding2")!.paperCount} papers indexed online — read or download Proceeding2.pdf.`,
    path: "/proceeding2",
    publicationType: "Proceedings",
  }),
  proceeding3: createPublicationMetadata({
    title: "Proceedings Volume III — Shiksha Mahakumbh 3.0",
    description: `${getProceedingVolumeByPath("/proceeding3")!.theme}. ${getProceedingVolumeByPath("/proceeding3")!.paperCount}+ papers indexed online — read or download Proceeding3.pdf.`,
    path: "/proceeding3",
    publicationType: "Proceedings",
  }),
  journals: createPublicationMetadata({
    title: "DHE Journal",
    description:
      "Official journal platform for Shiksha Mahakumbh and Department of Holistic Education research publications.",
    path: "/journals",
  }),
  books: createPublicationMetadata({
    title: "Books — Recent Advances in School Education & SMK Publications",
    description:
      "Published books from Shiksha Mahakumbh Abhiyan including Recent Advances in School Education — the RASE 2023 compendium from Shiksha Mahakumbh 1.0 at NIT Jalandhar. Request copies via the Department of Holistic Education.",
    path: "/books",
    publicationType: "Book",
    keywords: [
      "Recent Advances in School Education",
      "Shiksha Mahakumbh books",
      "RASE 2023 book",
      "Shiksha Mahakumbh 1.0 publication",
      "Department of Holistic Education books",
    ],
  }),
  upcomingevent: createEventMetadata({
    title: "Upcoming Events — Shiksha Mahakumbh 6.0 & 7.0",
    description:
      "Register for Shiksha Mahakumbh 6.0 at NIT Hamirpur (October 2026). Shiksha Mahakumbh 7.0 at IIT Jammu — coming soon. National education summit aligned with NEP 2020.",
    path: "/upcoming-events",
  }),
  pastEvents: createEventMetadata({
    title: "Past Editions — शिक्षा महाकुंभ 1.0 to 5.0",
    description:
      "Official archive of five completed Shiksha Mahakumbh Abhiyan national editions: NIT Jalandhar (1.0), NIT Kurukshetra (2.0), NIT Srinagar (3.0), Kurukshetra University (4.0), and NIPER Mohali (5.0). Themes, impact stats, proceedings, galleries, and campaign reports.",
    path: "/past-events",
    keywords: [
      "Shiksha Mahakumbh past editions",
      "Indian Education Conference",
      "Education Conclave India",
      "Department of Holistic Education",
      "National Education Event",
      "NEP 2020 conference",
      "Shiksha Mahakumbh proceedings",
    ],
  }),
  committeepage: createCommitteeMetadata({
    title: "Organising Committee",
    description: "Committee members for Shiksha Mahakumbh Abhiyan.",
    path: "/committees",
  }),
  gallery: createPageMetadata({
    title: "Photo & Video Gallery — Shiksha Mahakumbh 1.0 to 6.0",
    description:
      "Edition-wise photo albums and YouTube documentaries from Shiksha Mahakumbh Abhiyan — national education summits at NITs and universities across India. Browse Google Drive galleries and watch coverage on @ShikshaMahakumbh.",
    path: "/gallery",
    keywords: [
      "Shiksha Mahakumbh gallery",
      "Shiksha Mahakumbh photos",
      "Shiksha Mahakumbh videos",
      "Indian education conference gallery",
      "National education summit photos",
      "Department of Holistic Education media",
      "NEP 2020 education event",
    ],
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
    title: "Donate & Sponsor — 80G Tax Benefit | Shiksha Mahakumbh",
    description:
      "Support Shiksha Mahakumbh with secure Razorpay payments. Instant 80G receipt by email — download or print. PAN mandatory.",
    path: "/donation",
    keywords: [
      "Shiksha Mahakumbh donation",
      "80G tax deductible donation",
      "sponsor education summit India",
    ],
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
    title: "Video Gallery",
    description:
      "Shiksha Mahakumbh documentaries and conference coverage on the official YouTube channel @ShikshaMahakumbh.",
    path: "/gallery",
    keywords: ["Shiksha Mahakumbh YouTube", "education conference videos", "RASE documentaries"],
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
  pastEventSmk20: createEventMetadata({
    title: "शिक्षा महाकुंभ 2.0 — NIT Kurukshetra (2023)",
    description:
      "Shiksha Mahakumbh 2.0 (Shiksha Kumbh) at NIT Kurukshetra, 20 December 2023. Theme: Role of Academic-driven Startups in Economy. Proceedings Volume I — 65 papers.",
    path: "/past_event/shiksha-mahakumbh-2.0",
    keywords: ["SMK 2.0", "NIT Kurukshetra", "Academic startups", "Proceeding1"],
  }),
  pastEventSmk30: createEventMetadata({
    title: "शिक्षा महाकुंभ 3.0 — NIT Srinagar (2024)",
    description:
      "Shiksha Mahakumbh 3.0 at NIT Srinagar, 29–30 June 2024. RASE 2024 — 59 research papers, 1,800+ participants, J&K startup economy. Proceedings Volume III — 61 papers.",
    path: "/past_event/shiksha-mahakumbh-3.0",
    keywords: ["SMK 3.0", "NIT Srinagar", "Jammu Kashmir", "Proceeding3"],
  }),
  pastEventSmk40: createEventMetadata({
    title: "शिक्षा महाकुंभ 4.0 — Kurukshetra University (2024)",
    description:
      "Shiksha Mahakumbh 4.0 at Kurukshetra University, 16–17 December 2024. Theme: Indian Education System for Global Development. 91 research papers, 21 conclaves, 2,400+ attendees.",
    path: "/past_event/shiksha-mahakumbh-4.0",
    keywords: ["SMK 4.0", "Kurukshetra University", "Indian Education Conference", "global education"],
  }),
  pastEventSmk50: createEventMetadata({
    title: "शिक्षा महाकुंभ 5.0 — NIPER Mohali (2025)",
    description:
      "Shiksha Mahakumbh 5.0 at NIPER Mohali, 31 October – 2 November 2025. Theme: Classroom to Society — Building a Healthier World through Education. 284 research papers, 10 conclaves.",
    path: "/past_event/shiksha-mahakumbh-5.0",
    keywords: ["SMK 5.0", "NIPER Mohali", "DHE Olympiad", "Higher Education Summit"],
  }),
  pastEventSmk10: createEventMetadata({
    title: "शिक्षा महाकुंभ 1.0 — NIT Jalandhar (2023)",
    description:
      "Shiksha Mahakumbh 1.0 at NIT Jalandhar, 9–11 June 2023. Theme: Recent Advances in School Education. 81 research papers, 5,000+ footfall, NEP 2020 implementation conference. Proceedings Volume II.",
    path: "/past_event/shiksha-mahakumbh-1.0",
    keywords: [
      "SMK 1.0",
      "NIT Jalandhar",
      "School Education Conference",
      "NEP 2020",
      "Proceeding2",
      "Sarvhitkari Educational Society",
    ],
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
  label: string,
  detail: string,
  year: string
) {
  return createCommitteeMetadata({
    title: label,
    description: `Advisory, organising, and conference committee members for ${detail} (${year}). National education leadership from IITs, NITs, universities, Vidya Bharti, and DHE.`,
    path: committeePathFromSlug(slug),
    keywords: [
      "organising committee",
      "national advisory committee",
      "Shiksha Mahakumbh",
      label,
    ],
  });
}

export const NO_INDEX_META = {
  admin: createNoIndexMetadata({ title: "Admin", path: "/admin" }),
  noticeboarddata: createNoIndexMetadata({
    title: "Notice Board Data",
    path: "/noticeboarddata",
  }),
} as const;
