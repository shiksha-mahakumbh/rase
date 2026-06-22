import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import { getEditionByNumber } from "@/data/past-editions";
import { SITE_URL } from "@/config/site";

/** Static PDF asset (served from /public/2024M/) */
export const SOUVENIR_ABSTRACTS_PDF_PATH = "/2024M/Souvenir Abstracts_MTC.pdf";

export const SOUVENIR_ABSTRACTS_PAGE_PATH = "/publications/souvenir-abstracts-mtc";

export const SOUVENIR_ABSTRACTS_CANONICAL_URL = `${SITE_URL}${SOUVENIR_ABSTRACTS_PAGE_PATH}`;

const smk40 = getEditionByNumber("4.0")!;

export const SOUVENIR_PAGE_HERO = {
  eyebrow: "Publications · Multi Track Conference",
  title: "Souvenir Abstracts — MTC",
  subtitle:
    "Compiled research abstracts from the Shiksha Mahakumbh Multi Track Conference — open PDF access for national and international delegates, reviewers, and institutions.",
} as const;

export const SOUVENIR_STATS = [
  { label: "Format", value: "PDF", hint: "Print-ready souvenir volume" },
  { label: "Conference", value: "MTC", hint: "Multi Track Conference" },
  { label: "Edition", value: "SMK 4.0+", hint: "Research programme" },
  { label: "Access", value: "Open", hint: "Free global download" },
] as const;

export const SOUVENIR_META = {
  title: smk40.title,
  theme: smk40.theme,
  venue: smk40.venue,
  year: smk40.year,
  dates: smk40.dates,
  coverSrc: "/proceeding2.jpg",
  coverAlt: "Souvenir Abstracts — Shiksha Mahakumbh Multi Track Conference",
} as const;

export const SOUVENIR_SEO_KEYWORDS = [
  "Shiksha Mahakumbh souvenir abstracts",
  "Multi Track Conference abstracts PDF",
  "MTC research abstracts India",
  "Shiksha Mahakumbh 4.0 conference",
  "NEP 2020 research conference",
  "international education delegates",
  "Department of Holistic Education publications",
  "Kurukshetra University conference abstracts",
];

export const SOUVENIR_TRACK_HIGHLIGHTS = [
  {
    id: "sciences",
    label: "Fundamental & Applied Sciences",
    hint: "Physics, chemistry, mathematics, data sciences",
    accent: "from-blue-600 to-indigo-800",
  },
  {
    id: "engineering",
    label: "Engineering & Technology",
    hint: "AI, robotics, quantum, all engineering branches",
    accent: "from-emerald-600 to-teal-800",
  },
  {
    id: "education",
    label: "Education & Holistic Learning",
    hint: "NEP 2020, school & higher education research",
    accent: "from-brand-saffron to-amber-600",
  },
  {
    id: "iks",
    label: "Indian Knowledge Systems",
    hint: "Culture, sustainability, traditional-modern integration",
    accent: "from-violet-600 to-indigo-900",
  },
] as const;

export const SOUVENIR_RELATED_LINKS = [
  { label: "Submit via CMT", href: CMT_SUBMISSION_URL, external: true, icon: "📝" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
  { label: "Publications Hub", href: "/publications", icon: "📖" },
  { label: "Academic Council", href: "/departments/academic-council", icon: "🎓" },
  { label: "Registration SMK 6.0", href: "/registration", icon: "✅" },
  { label: "DHE Journal", href: "https://pub.dhe.org.in", external: true, icon: "📘" },
] as const;
