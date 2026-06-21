/** Academic Council page — hero, stats, and programme hub index (Shiksha Mahakumbh 6.0). */

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
  contactPhone: "+91-7903431900",
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
    footerNote:
      "Papers submitted will be published in SCI / Scopus / Web of Science indexed journals after peer review.",
    items: [
      {
        titleEn: "Fundamental & Applied Sciences",
        titleHi: "मौलिक एवं अनुप्रयुक्त विज्ञान",
        topics: ["Physics", "Chemistry", "Mathematics", "Botany", "Zoology", "Data Sciences", "Earth and Space Sciences"],
      },
      {
        titleEn: "Engineering & Technology",
        titleHi: "अभियंत्रण एवं प्रौद्योगिकी",
        topics: ["All engineering branches", "AI", "Drone and Robotics", "Data Engineering", "Quantum Technology"],
      },
      {
        titleEn: "Management & Entrepreneurship",
        titleHi: "प्रबंधन एवं उद्यमिता",
        topics: ["Entrepreneurship", "Startups", "Innovation", "Family and small scale business"],
      },
      {
        titleEn: "Education Systems & Pedagogy",
        titleHi: "शिक्षा प्रणाली एवं शिक्षण पद्धति",
        topics: ["Gurukul system", "School and Higher education", "Inclusive education"],
      },
      {
        titleEn: "EdTech & Digital Education",
        titleHi: "एडटेक एवं डिजिटल शिक्षा",
        topics: ["Online and digital education", "AI in education"],
      },
      {
        titleEn: "Health Sciences & Traditional Medicine",
        titleHi: "स्वास्थ्य विज्ञान एवं पारंपरिक चिकित्सा",
        topics: ["AYUSH", "Public Health", "Preventive care", "Modern Education"],
      },
      {
        titleEn: "Sports & Well-being",
        titleHi: "खेल एवं कल्याण",
        topics: ["Mental and physical health", "Yoga", "Life style", "Sports sciences"],
      },
      {
        titleEn: "Agriculture & Veterinary Sciences",
        titleHi: "कृषि एवं पशु चिकित्सा विज्ञान",
        topics: ["Sustainable agriculture", "Agri-Tech", "Animal Husbandry"],
      },
      {
        titleEn: "Environment, Sustainability & Water Resources",
        titleHi: "पर्यावरण एवं सतत विकास",
        topics: ["Climate change", "Water management", "Solid waste management", "Environmental pollution"],
      },
      {
        titleEn: "Culture, Arts & Heritage",
        titleHi: "संस्कृति, कला एवं विरासत",
        topics: ["Bharatiya and Tribal culture", "Traditions and folks", "Performing art"],
      },
      {
        titleEn: "Languages & Linguistics",
        titleHi: "भाषाएँ एवं भाषाविज्ञान",
        topics: ["Bharatiya languages", "Translation Technology"],
      },
      {
        titleEn: "Vocational & Skill-Based Education",
        titleHi: "व्यावसायिक एवं कौशल आधारित शिक्षा",
        topics: ["Vocational skill", "Skill inculcation", "Crafts"],
      },
      {
        titleEn: "Bharatiya Knowledge System (BKS)",
        titleHi: "भारतीय ज्ञान प्रणाली",
        topics: ["Bharatiya Philosophy", "Gurukul education", "Vedic literature — Shri Madbhagwat Gita, Ramayana, Vedas"],
      },
    ],
  },
  {
    id: "olympiad",
    tabId: "OlympiadPage",
    icon: "🧠",
    titleEn: "DHE Olympiads",
    titleHi: "डीएचई ओलंपियाड",
    description:
      "Nationwide school outreach in English, Mathematics, and Technology for Classes 3–10. Top achievers honoured at Shiksha Mahakumbh 2026.",
    accent: "navy",
    items: [
      { titleEn: "DHE English Olympiad", titleHi: "अंग्रेज़ी" },
      { titleEn: "DHE Maths Olympiad", titleHi: "गणित" },
      { titleEn: "DHE Tech Olympiad", titleHi: "प्रौद्योगिकी" },
    ],
    footerNote: "Classes 3–10: Elementary and secondary level. Top achievers felicitated at Shiksha Mahakumbh 2026.",
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
      { titleEn: "Faculty Excellence Award", titleHi: "संकाय एवं छात्र उत्कृष्टता पुरस्कार" },
      { titleEn: "School Level Recognition", titleHi: "विद्यालय स्तर" },
      { titleEn: "College / University Level Recognition", titleHi: "महाविद्यालय / विश्वविद्यालय स्तर" },
    ],
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
      { titleEn: "Section 1 — Classes 9–10: Basic research & project documentation" },
      { titleEn: "Section 2 — Classes 11–12: Advanced research & analytical studies" },
    ],
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
      { titleEn: "Academic Innovations & EdTech Integration" },
      { titleEn: "Community & Social Impact Initiatives" },
      { titleEn: "Institutional Excellence & Sustainability" },
      { titleEn: "Indian Knowledge System (IKS) Practices" },
    ],
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
      { titleEn: "School Level — Classes 6–10: Models & problem-solving ideas" },
      { titleEn: "College Level — UG/PG: Research-based solutions & prototypes" },
    ],
  },
];

export const ACADEMIC_COUNCIL_SEO = {
  title: "Academic Council — Conference, Conclaves & Olympiads",
  description:
    "Shiksha Mahakumbh 6.0 Academic Council at NIT Hamirpur (9–11 Oct 2026): 15-track international conference, 7 conclaves, DHE Olympiads, exhibitions, Bal Shodh Patrika, best practices, student projects, and excellence awards. SCI/Scopus/WoS publication pathway.",
  keywords: [
    "Academic Council Shiksha Mahakumbh",
    "Shiksha Mahakumbh 6.0 conference",
    "NIT Hamirpur education summit 2026",
    "multi-track research conference India",
    "NEP 2026 education conclave",
    "DHE Olympiad English Maths Technology",
    "Bal Shodh Patrika student research",
    "Department of Holistic Education",
    "Viksit Bharat 2047 education",
    "Indian Knowledge Systems conference",
    "international education conference India",
    "SCI Scopus Web of Science publication",
  ],
} as const;
