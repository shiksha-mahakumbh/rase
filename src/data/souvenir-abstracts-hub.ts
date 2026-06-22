import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import { editionTitle, getEditionByNumber } from "@/data/past-editions";
import { SMK_4_0_PATH, SMK_5_0_PATH } from "@/data/editions/paths";
import { SITE_URL } from "@/config/site";

export const SOUVENIR_ABSTRACTS_PAGE_PATH = "/publications/souvenir-abstracts-mtc";

export const SOUVENIR_ABSTRACTS_CANONICAL_URL = `${SITE_URL}${SOUVENIR_ABSTRACTS_PAGE_PATH}`;

const smk40 = getEditionByNumber("4.0")!;
const smk50 = getEditionByNumber("5.0")!;

export type SouvenirEditionEntry = {
  id: string;
  edition: string;
  label: string;
  theme: string;
  venue: string;
  dates: string;
  year: string;
  pdfHref: string;
  coverSrc: string;
  coverAlt: string;
  pastEventHref: string;
  accent: string;
  paperCountNote?: string;
};

/** MTC abstract souvenir booklets — SMK 4.0 & 5.0 */
export const SOUVENIR_CATALOG: SouvenirEditionEntry[] = [
  {
    id: "souvenir-smk-4.0",
    edition: "4.0",
    label: `Souvenir Abstracts · ${editionTitle("4.0")}`,
    theme: smk40.theme,
    venue: smk40.venue,
    dates: smk40.dates,
    year: smk40.year,
    pdfHref: "/souvenir-mtc/smk-4.0-abstract-booklet.pdf",
    coverSrc: "/souvenir-mtc/smk-4.0-cover.jpg",
    coverAlt: `Shiksha Mahakumbh 4.0 Souvenir — ${smk40.theme}, ${smk40.venue} ${smk40.year}`,
    pastEventHref: SMK_4_0_PATH,
    accent: "from-indigo-700 to-violet-900",
    paperCountNote: "91 research papers at SMK 4.0",
  },
  {
    id: "souvenir-smk-5.0",
    edition: "5.0",
    label: `Souvenir Abstracts · ${editionTitle("5.0")}`,
    theme: smk50.theme,
    venue: smk50.venue,
    dates: smk50.dates,
    year: smk50.year,
    pdfHref: "/souvenir-mtc/smk-5.0-abstract-booklet.pdf",
    coverSrc: "/souvenir-mtc/smk-5.0-cover.png",
    coverAlt: `Shiksha Mahakumbh 5.0 Souvenir — ${smk50.theme}, ${smk50.venue} ${smk50.year}`,
    pastEventHref: SMK_5_0_PATH,
    accent: "from-rose-600 to-orange-800",
    paperCountNote: "284 research papers at SMK 5.0",
  },
];

/** @deprecated Use SOUVENIR_CATALOG[0].pdfHref */
export const SOUVENIR_ABSTRACTS_PDF_PATH = SOUVENIR_CATALOG[0].pdfHref;

export const SOUVENIR_PAGE_HERO = {
  eyebrow: "Publications · Multi Track Conference",
  title: "Souvenir Abstracts — MTC",
  subtitle:
    "Compiled research abstracts from the Shiksha Mahakumbh Multi Track Conference — preview PDFs, download souvenir booklets, and explore abstracts from national and international delegates.",
} as const;

export const SOUVENIR_STATS = [
  { label: "Editions", value: "4.0 & 5.0", hint: "MTC abstract booklets" },
  { label: "Format", value: "PDF", hint: "Print-ready souvenir volumes" },
  { label: "Conference", value: "MTC", hint: "Multi Track Conference" },
  { label: "Access", value: "Open", hint: "Free global download" },
] as const;

export const SOUVENIR_SEO_KEYWORDS = [
  "Shiksha Mahakumbh souvenir abstracts",
  "Multi Track Conference abstracts PDF",
  "MTC research abstracts India",
  "Shiksha Mahakumbh 4.0 conference",
  "Shiksha Mahakumbh 5.0 conference",
  "NEP 2020 research conference",
  "international education delegates",
  "Department of Holistic Education publications",
  "Kurukshetra University conference abstracts",
  "NIPER Mohali conference abstracts",
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

export function getSouvenirByEdition(edition: string): SouvenirEditionEntry | undefined {
  return SOUVENIR_CATALOG.find((entry) => entry.edition === edition);
}
