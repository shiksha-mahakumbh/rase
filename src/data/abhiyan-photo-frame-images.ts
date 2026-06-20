/**
 * Image paths extracted from Shiksha Mahakumbh Abhiyan Photo Frame PDF (37 pages).
 * Page numbers verified against PDF text extraction (June 2026).
 */

const page = (n: number) =>
  `/abhiyan-photo-frame/pages/page-${String(n).padStart(2, "0")}.jpg`;

export const ABIYAN_FRAME_IMAGES = {
  cover: page(1),
  introduction: page(2),
  nefBanner: page(3),
  patronPage: page(4),
  patronPortrait: "/abhiyan-photo-frame/portraits/patron-raunija.jpg",
  advisorsPage: page(5),
  coOrganizersPage: page(20),
  partnersPage: page(22),
  honoredChiefMinistersPage: page(23),
  honoredGovernorsPage: page(24),
  unionMinistersPage: page(25),
  stateMinistersPage: page(26),
  decadeCollagePage: page(27),
  stagePage: page(28),
  exhibitionPage: page(29),
  conclavesPage: page(30),
  researchPapersPage: page(31),
  olympiadPage: page(32),
  programmesPage: page(33),
  mediaCoveragePage1: page(34),
  mediaCoveragePage2: page(35),
  coordinatorsPage: page(36),
  contactPage: page(37),
  advisorPortraits: [
    "/abhiyan-photo-frame/assets/p05-img-002.png",
    "/abhiyan-photo-frame/portraits/advisor-raghunandan.jpg",
    "/abhiyan-photo-frame/assets/p05-img-004.png",
    "/abhiyan-photo-frame/assets/p05-img-005.png",
    "/abhiyan-photo-frame/assets/p05-img-006.png",
    "/abhiyan-photo-frame/assets/p05-img-007.png",
    "/abhiyan-photo-frame/assets/p05-img-008.png",
  ],
  coordinatorPortraits: [
    "/abhiyan-photo-frame/assets/p36-img-260.png",
    "/abhiyan-photo-frame/assets/p36-img-262.png",
    "/abhiyan-photo-frame/assets/p36-img-263.png",
    "/abhiyan-photo-frame/assets/p36-img-264.png",
    "/abhiyan-photo-frame/assets/p36-img-265.png",
    "/abhiyan-photo-frame/assets/p36-img-266.png",
    "/abhiyan-photo-frame/assets/p36-img-267.png",
    "/abhiyan-photo-frame/assets/p36-img-268.png",
    "/abhiyan-photo-frame/assets/p36-img-269.png",
    "/abhiyan-photo-frame/assets/p36-img-270.png",
    "/abhiyan-photo-frame/assets/p36-img-271.png",
    "/abhiyan-photo-frame/assets/p36-img-272.png",
    "/abhiyan-photo-frame/assets/p36-img-273.png",
    "/abhiyan-photo-frame/assets/p36-img-274.png",
    "/abhiyan-photo-frame/assets/p36-img-275.png",
  ],
} as const;

/** Per-edition pages from the photo frame PDF */
export const EDITION_FRAME_IMAGES: Record<
  string,
  {
    /** Chief guest page — alias `hero` for edition cards */
    chiefGuests: string;
    hero: string;
    speakers: string;
    speakersExtra?: string;
  }
> = {
  "1.0": { chiefGuests: page(6), hero: page(6), speakers: page(11), speakersExtra: page(12) },
  "2.0": { chiefGuests: page(7), hero: page(7), speakers: page(13) },
  "3.0": { chiefGuests: page(8), hero: page(8), speakers: page(14) },
  "4.0": { chiefGuests: page(9), hero: page(9), speakers: page(15), speakersExtra: page(16) },
  "5.0": { chiefGuests: page(10), hero: page(10), speakers: page(17), speakersExtra: page(18) },
};

export const ABIYAN_FRAME_PAGE_LABELS: { page: number; label: string; labelEn: string }[] = [
  { page: 1, label: "आवरण", labelEn: "Cover" },
  { page: 2, label: "परिचय — शिक्षा महाकुंभ अभियान", labelEn: "Introduction" },
  { page: 3, label: "NEP 2020 — हमारे उद्देश्य", labelEn: "NEP 2020 alignment" },
  { page: 4, label: "संरक्षक — डॉ. ठाकुर एस. के. रौनजा", labelEn: "Patron" },
  { page: 5, label: "परामर्शदाता", labelEn: "Advisors" },
  { page: 6, label: "शिक्षा महाकुंभ 1.0 — प्रमुख अतिथि", labelEn: "Edition 1.0 chief guests" },
  { page: 7, label: "शिक्षा महाकुंभ 2.0 — प्रमुख अतिथि", labelEn: "Edition 2.0 chief guests" },
  { page: 8, label: "शिक्षा महाकुंभ 3.0 — प्रमुख अतिथि", labelEn: "Edition 3.0 chief guests" },
  { page: 9, label: "शिक्षा महाकुंभ 4.0 — प्रमुख अतिथि", labelEn: "Edition 4.0 chief guests" },
  { page: 10, label: "शिक्षा महाकुंभ 5.0 — प्रमुख अतिथि", labelEn: "Edition 5.0 chief guests" },
  { page: 11, label: "1.0 वक्ता (१)", labelEn: "Edition 1.0 speakers I" },
  { page: 12, label: "1.0 वक्ता (२)", labelEn: "Edition 1.0 speakers II" },
  { page: 13, label: "2.0 वक्ता", labelEn: "Edition 2.0 speakers" },
  { page: 14, label: "3.0 वक्ता", labelEn: "Edition 3.0 speakers" },
  { page: 15, label: "4.0 वक्ता (१)", labelEn: "Edition 4.0 speakers I" },
  { page: 16, label: "4.0 वक्ता (२)", labelEn: "Edition 4.0 speakers II" },
  { page: 17, label: "5.0 वक्ता (१)", labelEn: "Edition 5.0 speakers I" },
  { page: 18, label: "5.0 वक्ता (२)", labelEn: "Edition 5.0 speakers II" },
  { page: 19, label: "5.0 वक्ता (३)", labelEn: "Edition 5.0 speakers III" },
  { page: 20, label: "सह-आयोजक", labelEn: "Co-organizers" },
  { page: 21, label: "सह-आयोजक", labelEn: "Co-organizers (continued)" },
  { page: 22, label: "हमारे सहयोगी", labelEn: "Partners" },
  { page: 23, label: "गरिमामयी मुख्यमंत्री — निमंत्रण अभियान", labelEn: "Honored chief ministers" },
  { page: 24, label: "गरिमामयी राज्यपाल", labelEn: "Honored governors" },
  { page: 25, label: "केंद्रीय मंत्री", labelEn: "Union ministers" },
  { page: 26, label: "राज्य मंत्री", labelEn: "State ministers" },
  { page: 27, label: "दशक — संस्करण झलकियाँ", labelEn: "Decade collage" },
  { page: 28, label: "मंच", labelEn: "Stage" },
  { page: 29, label: "प्रदर्शनी", labelEn: "Exhibition" },
  { page: 30, label: "कॉनक्लेव", labelEn: "Conclaves" },
  { page: 31, label: "शोध प्रस्तुतियाँ", labelEn: "Research papers" },
  { page: 32, label: "ओलंपियाड केंद्र", labelEn: "Olympiad centres" },
  { page: 33, label: "विविध कार्यक्रम", labelEn: "Programmes" },
  { page: 34, label: "मीडिया कवरेज (१)", labelEn: "Media coverage I" },
  { page: 35, label: "मीडिया कवरेज (२)", labelEn: "Media coverage II" },
  { page: 36, label: "मुख्य कार्यकर्ता — समन्वयक", labelEn: "Coordinators" },
  { page: 37, label: "संपर्क", labelEn: "Contact" },
];

export function framePageImage(pageNumber: number): string {
  return page(pageNumber);
}

export function allFramePageImages(): { src: string; page: number; label: string; labelEn: string }[] {
  return ABIYAN_FRAME_PAGE_LABELS.map(({ page, label, labelEn }) => ({
    page,
    label,
    labelEn,
    src: framePageImage(page),
  }));
}
