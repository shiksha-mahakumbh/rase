/** Academic Council page — hero, stats, and programme hub index (Shiksha Mahakumbh 6.0). */

import {
  ACADEMIC_PUBLICATION_NOTE,
  conferenceTracksForHub,
} from "@/data/academic-council-tracks";

export type AcademicCouncilTabId =
  | "OverviewPage"
  | "ConferencePage"
  | "ConclavePage"
  | "AwardsPage"
  | "OlympiadPage"
  | "ExhibitionPage"
  | "ProjectsPage"
  | "BestPracticesPage"
  | "PatrikaPage"
  | "CulturalPage";

export const ACADEMIC_COUNCIL_HERO = {
  eyebrow: "Shiksha Mahakumbh 6.0 · Meeting of the Minds · NIT Hamirpur",
  title: "Academic Council",
  subtitle:
    "Multi-track international conference, thematic conclaves, DHE Olympiads, exhibitions, student projects, best practices, Bal Shodh Patrika, and excellence awards — 9–11 October 2026.",
  tagline:
    "The Academic Backbone of Shiksha Mahakumbh — Integrating Knowledge, Innovation, and Impact.",
} as const;

export const ACADEMIC_COUNCIL_STATS = [
  { label: "Conference Tracks", value: "15", hint: "Hybrid multi-track research" },
  { label: "Thematic Conclaves", value: "7", hint: "Policy & leadership dialogues" },
  { label: "Olympiad Streams", value: "3", hint: "English · Maths · Technology" },
  { label: "Programme Pillars", value: "10", hint: "Unified academic framework" },
] as const;

export const ACADEMIC_COUNCIL_EVENT = {
  startDate: "2026-10-09",
  endDate: "2026-10-11",
  venue: "NIT Hamirpur",
  location: "Hamirpur, Himachal Pradesh, India",
  contactEmail: "academics@shikshamahakumbh.com",
  contactPhone: "+91 79034 31900",
} as const;

export interface ProgrammeHubItem {
  titleEn: string;
  titleHi?: string;
  topics?: string[];
}

export interface ProgrammeHubSection {
  id: string;
  tabId: AcademicCouncilTabId;
  icon: string;
  titleEn: string;
  titleHi: string;
  description: string;
  accent: "navy" | "saffron";
  items: ProgrammeHubItem[];
  footerNote?: string;
}

export const ACADEMIC_PROGRAMME_HUB: ProgrammeHubSection[] = [
  {
    id: "conclaves",
    tabId: "ConclavePage",
    icon: "🎓",
    titleEn: "Academic Conclaves",
    titleHi: "शैक्षणिक अधिवेशन",
    description:
      "High-impact dialogue platforms for vice-chancellors, educators, scientists, entrepreneurs, CSR leaders, media, and meritorious students.",
    accent: "navy",
    items: [
      { titleEn: "Vice-Chancellor, Director, NEP Implementers Conclave", titleHi: "कुलपति / निदेशक, एनईपी कार्यान्वयनकर्ता अधिवेशन" },
      { titleEn: "Principals & Outstanding Teachers Conclave", titleHi: "प्राचार्य एवं उत्कृष्ट शिक्षक अधिवेशन" },
      { titleEn: "Scientists & Research Scholars Conclave", titleHi: "वैज्ञानिक एवं शोधार्थी अधिवेशन" },
      { titleEn: "Startup Leaders / Entrepreneurs Conclave", titleHi: "स्टार्टअप लीडर्स / उद्यमी अधिवेशन" },
      { titleEn: "CSR & NGO Conclave", titleHi: "सीएसआर एवं एनजीओ अधिवेशन" },
      { titleEn: "Media Conclave", titleHi: "मीडिया अधिवेशन" },
      { titleEn: "Talent Conclave (90%+ Achievers)", titleHi: "प्रतिभा अधिवेशन" },
    ],
  },
  {
    id: "conference",
    tabId: "ConferencePage",
    icon: "📚",
    titleEn: "Multi-Track Conference",
    titleHi: "बहु-विषयक सम्मेलन",
    description:
      "Hybrid international research conference with peer-reviewed publication pathways across sciences, engineering, education, health, culture, and Indian Knowledge Systems.",
    accent: "saffron",
    footerNote: ACADEMIC_PUBLICATION_NOTE,
    items: conferenceTracksForHub(),
  },
  {
    id: "olympiad",
    tabId: "OlympiadPage",
    icon: "🧠",
    titleEn: "DHE Olympiads",
    titleHi: "डीएचई ओलंपियाड",
    description:
      "Nationwide school outreach in English, Mathematics, and Technology for Classes 3–10. Top achievers honoured at Shiksha Mahakumbh 6.0.",
    accent: "navy",
    items: [
      { titleEn: "DHE English Olympiad", titleHi: "अंग्रेज़ी" },
      { titleEn: "DHE Maths Olympiad", titleHi: "गणित" },
      { titleEn: "DHE Tech Olympiad", titleHi: "प्रौद्योगिकी" },
    ],
    footerNote:
      "Classes 3–10. Registration and exam dates to be announced. Felicitation at Shiksha Mahakumbh 6.0 (9–11 Oct 2026, NIT Hamirpur). Apply via the registration hub.",
  },
  {
    id: "awards",
    tabId: "AwardsPage",
    icon: "🏆",
    titleEn: "Excellence Awards",
    titleHi: "पुरस्कार",
    description:
      "Faculty and student excellence across research publications, books, patents, startups, and funded projects.",
    accent: "saffron",
    items: [
      { titleEn: "Faculty Excellence Award", titleHi: "संकाय उत्कृष्टता पुरस्कार" },
      { titleEn: "School Level Recognition", titleHi: "विद्यालय स्तर" },
      { titleEn: "College / University Level Recognition", titleHi: "महाविद्यालय / विश्वविद्यालय स्तर" },
    ],
    footerNote:
      "Nominations and applications via the registration hub. Timeline to be announced; awards presented at Shiksha Mahakumbh 6.0.",
  },
  {
    id: "exhibition",
    tabId: "ExhibitionPage",
    icon: "🏛️",
    titleEn: "Exhibition",
    titleHi: "प्रदर्शनी",
    description:
      "Theme: Shiksha, Prakriti aur Pragati — educating for development and harmony with nature. 9–11 October 2026 at NIT Hamirpur.",
    accent: "navy",
    items: [
      { titleEn: "Innovation & Research Exhibition", titleHi: "नवाचार एवं अनुसंधान प्रदर्शनी" },
      { titleEn: "EdTech & Skill Development Exhibition", titleHi: "एडटेक एवं कौशल विकास प्रदर्शनी" },
      { titleEn: "Student Innovation Pavilion", titleHi: "छात्र नवाचार मंडप" },
      { titleEn: "Community Development Models", titleHi: "सामुदायिक विकास मॉडल" },
    ],
  },
  {
    id: "cultural",
    tabId: "CulturalPage",
    icon: "🎭",
    titleEn: "Cultural Programmes",
    titleHi: "सांस्कृतिक कार्यक्रम",
    description:
      "Folk dance, music, and artistic presentations celebrating Bharat's diverse cultural heritage alongside Himachali traditions.",
    accent: "saffron",
    items: [
      {
        titleEn: "Cultural performances representing Bharat's diverse heritage",
        titleHi: "भारत की विविध सांस्कृतिक विरासत को प्रदर्शित करने वाली प्रस्तुतियाँ",
      },
      { titleEn: "Folk dance, music and artistic presentations", titleHi: "लोकनृत्य, संगीत एवं कलात्मक प्रस्तुतियाँ" },
    ],
  },
  {
    id: "patrika",
    tabId: "PatrikaPage",
    icon: "📘",
    titleEn: "Bal Shodh Patrika",
    titleHi: "बाल शोध पत्रिका",
    description:
      "National student research journal nurturing inquiry and innovation among school learners in Classes 9–12.",
    accent: "navy",
    items: [
      { titleEn: "Section 1 — Classes 9–10: Basic research & project documentation", titleHi: "खंड 1 — कक्षा 9–10" },
      { titleEn: "Section 2 — Classes 11–12: Advanced research & analytical studies", titleHi: "खंड 2 — कक्षा 11–12" },
    ],
    footerNote:
      "Submission timelines to be announced. School entries via the registration hub under relevant student research categories.",
  },
  {
    id: "best-practices",
    tabId: "BestPracticesPage",
    icon: "🌍",
    titleEn: "Best Practices",
    titleHi: "सर्वोत्तम प्रथाएँ",
    description:
      "Identify, showcase, and scale replicable education, governance, and community engagement models aligned with Viksit Bharat 2047.",
    accent: "saffron",
    items: [
      { titleEn: "Academic Innovations & EdTech Integration", titleHi: "शैक्षिक नवाचार एवं एडटेक" },
      { titleEn: "Community & Social Impact Initiatives", titleHi: "सामुदायिक प्रभाव पहल" },
      { titleEn: "Institutional Excellence & Sustainability", titleHi: "संस्थागत उत्कृष्टता" },
      { titleEn: "Indian Knowledge System (IKS) Practices", titleHi: "भारतीय ज्ञान प्रणाली प्रथाएँ" },
    ],
    footerNote: "Submit models via the registration hub. Shortlisted entries may present at Shiksha Mahakumbh 6.0.",
  },
  {
    id: "projects",
    tabId: "ProjectsPage",
    icon: "🚀",
    titleEn: "Student Projects",
    titleHi: "छात्र परियोजनाएँ",
    description:
      "National platform for school (Classes 6–10) and higher-education students to present innovation-driven working models.",
    accent: "saffron",
    items: [
      { titleEn: "School Level — Classes 6–10: Models & problem-solving ideas", titleHi: "विद्यालय स्तर — कक्षा 6–10" },
      { titleEn: "College Level — UG/PG: Research-based solutions & prototypes", titleHi: "महाविद्यालय स्तर — स्नातक/स्नातकोत्तर" },
    ],
    footerNote: "Project display registration opens via the unified registration hub.",
  },
];

export const ACADEMIC_COUNCIL_SEO = {
  title: "Academic Council — Conference, Conclaves & Olympiads",
  description:
    "Shiksha Mahakumbh 6.0 Academic Council at NIT Hamirpur (9–11 Oct 2026): 15-track international conference, 7 conclaves, DHE Olympiads, exhibitions, Bal Shodh Patrika, best practices, student projects, and excellence awards. Peer-reviewed publication pathway.",
  keywords: [
    "Academic Council Shiksha Mahakumbh",
    "Shiksha Mahakumbh 6.0 conference",
    "NIT Hamirpur education summit 2026",
    "multi-track research conference India",
    "NEP 2020 education conclave",
    "DHE Olympiad English Maths Technology",
    "Bal Shodh Patrika student research",
    "Department of Holistic Education",
    "Viksit Bharat 2047 education",
    "Indian Knowledge Systems conference",
    "international education conference India",
    "SCI Scopus Web of Science publication",
  ],
} as const;
