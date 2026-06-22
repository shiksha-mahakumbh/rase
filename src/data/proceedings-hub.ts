import { editionTitle, getEditionByNumber } from "@/data/past-editions";
import { SITE_URL } from "@/config/site";

export type ProceedingsVolumeEntry = {
  id: string;
  volume: "I" | "II" | "III";
  /** Shiksha Mahakumbh edition when applicable */
  edition?: string;
  label: string;
  theme: string;
  year: string;
  venue: string;
  dates: string;
  paperCount: number;
  coverSrc: string;
  coverAlt: string;
  pdfHref: string;
  readHref: string;
  pastEventHref?: string;
  accent: string;
};

const smk20 = getEditionByNumber("2.0")!;
const smk30 = getEditionByNumber("3.0")!;

export const PROCEEDINGS_PAGE_HERO = {
  eyebrow: "Publications",
  title: "Conference Proceedings",
  subtitle:
    "Peer-reviewed paper compilations from Shiksha Mahakumbh Abhiyan national conferences — browse online, preview PDFs, or download full volumes for research and institutional reference.",
} as const;

export const PROCEEDINGS_STATS = [
  { label: "Volumes", value: "3", hint: "Full proceedings online" },
  { label: "Papers", value: "93+", hint: "Abstracts & author listings" },
  { label: "Editions", value: "2.0 — 3.0+", hint: "SMK national conferences" },
  { label: "Format", value: "PDF + web", hint: "Preview, download, read online" },
] as const;

/** Correct volume ↔ edition mapping (Vol. I = SMK 2.0, Vol. II = SMK 3.0, Vol. III = thematic volume). */
export const PROCEEDINGS_CATALOG: ProceedingsVolumeEntry[] = [
  {
    id: "proceeding-vol-1",
    volume: "I",
    edition: "2.0",
    label: `Proceedings Volume I · ${editionTitle("2.0")}`,
    theme: smk20.theme,
    year: smk20.year,
    venue: smk20.venue,
    dates: smk20.dates,
    paperCount: 56,
    coverSrc: "/proceeding1.jpg",
    coverAlt: `Proceedings Volume I — ${smk20.theme}, ${smk20.venue} ${smk20.year}`,
    pdfHref: "/Proceeding1.pdf",
    readHref: "/proceeding1",
    pastEventHref: smk20.href,
    accent: "from-brand-navy to-slate-800",
  },
  {
    id: "proceeding-vol-2",
    volume: "II",
    edition: "3.0",
    label: `Proceedings Volume II · ${editionTitle("3.0")}`,
    theme: smk30.theme,
    year: smk30.year,
    venue: smk30.venue,
    dates: smk30.dates,
    paperCount: 30,
    coverSrc: "/proceeding2.jpg",
    coverAlt: `Proceedings Volume II — ${smk30.theme}, ${smk30.venue} ${smk30.year}`,
    pdfHref: "/Proceeding2.pdf",
    readHref: "/proceeding2",
    pastEventHref: smk30.href,
    accent: "from-emerald-700 to-teal-900",
  },
  {
    id: "proceeding-vol-3",
    volume: "III",
    label: "Proceedings Volume III",
    theme: "Integration of Bhartiya Traditional and Modern Education System for Sustainability",
    year: "2024",
    venue: "National conference proceedings",
    dates: "2024",
    paperCount: 7,
    coverSrc: "/proceeding3.jpg",
    coverAlt:
      "Proceedings Volume III — Integration of Bhartiya Traditional and Modern Education System for Sustainability",
    pdfHref: "/Proceeding3.pdf",
    readHref: "/proceeding3",
    accent: "from-amber-600 to-orange-900",
  },
];

export const PROCEEDINGS_SEO_KEYWORDS = [
  "Shiksha Mahakumbh proceedings",
  "RASE conference papers",
  "academic-driven startups proceedings",
  "Indian education research papers",
  "Department of Holistic Education publications",
  "NIT Kurukshetra Shiksha Mahakumbh",
  "NIT Srinagar conference proceedings",
  "Bhartiya traditional education research",
];

export const PROCEEDINGS_CANONICAL_URL = `${SITE_URL}/proceedings`;

export function getProceedingVolumeByPath(path: string): ProceedingsVolumeEntry | undefined {
  return PROCEEDINGS_CATALOG.find((v) => v.readHref === path);
}
