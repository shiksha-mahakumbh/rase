import { editionTitle, getEditionByNumber } from "@/data/past-editions";

import {

  SMK_1_0_PATH,

  SMK_2_0_PATH,

  SMK_3_0_PATH,

} from "@/data/editions/paths";

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

  paperCountNote?: string;

  coverSrc: string;

  coverAlt: string;

  pdfHref: string;

  readHref: string;

  pastEventHref?: string;

  accent: string;

};



const smk10 = getEditionByNumber("1.0")!;

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

  { label: "Papers", value: "130+", hint: "Indexed abstracts & listings" },

  { label: "Editions", value: "1.0 — 3.0", hint: "SMK national conferences" },

  { label: "Format", value: "PDF + web", hint: "Preview, download, read online" },

] as const;



/** Vol. I = SMK 2.0 · Vol. II = SMK 1.0 · Vol. III = SMK 3.0 */

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

    paperCountNote: "65 papers presented (Proceeding1.pdf)",

    coverSrc: "/proceeding1.jpg",

    coverAlt: `Proceedings Volume I — ${smk20.theme}, ${smk20.venue} ${smk20.year}`,

    pdfHref: "/Proceeding1.pdf",

    readHref: "/proceeding1",

    pastEventHref: SMK_2_0_PATH,

    accent: "from-brand-navy to-slate-800",

  },

  {

    id: "proceeding-vol-2",

    volume: "II",

    edition: "1.0",

    label: `Proceedings Volume II · ${editionTitle("1.0")}`,

    theme: smk10.theme,

    year: smk10.year,

    venue: smk10.venue,

    dates: smk10.dates,

    paperCount: 7,

    paperCountNote: "Representative papers indexed online (Proceeding2.pdf); 81 papers at SMK 1.0",

    coverSrc: "/proceeding2.jpg",

    coverAlt: `Proceedings Volume II — ${smk10.theme}, ${smk10.venue} ${smk10.year}`,

    pdfHref: "/Proceeding2.pdf",

    readHref: "/proceeding2",

    pastEventHref: SMK_1_0_PATH,

    accent: "from-emerald-700 to-teal-900",

  },

  {

    id: "proceeding-vol-3",

    volume: "III",

    edition: "3.0",

    label: `Proceedings Volume III · ${editionTitle("3.0")}`,

    theme: smk30.theme,

    year: smk30.year,

    venue: smk30.venue,

    dates: smk30.dates,

    paperCount: 30,

    paperCountNote: "61 papers presented (Proceeding3.pdf)",

    coverSrc: "/proceeding3.jpg",

    coverAlt: `Proceedings Volume III — ${smk30.theme}, ${smk30.venue} ${smk30.year}`,

    pdfHref: "/Proceeding3.pdf",

    readHref: "/proceeding3",

    pastEventHref: SMK_3_0_PATH,

    accent: "from-amber-600 to-orange-900",

  },

];



export const PROCEEDINGS_SEO_KEYWORDS = [

  "Shiksha Mahakumbh proceedings",

  "RASE conference papers",

  "Proceeding1 NIT Kurukshetra",

  "Proceeding2 NIT Jalandhar school education",

  "Proceeding3 NIT Srinagar Jammu Kashmir",

  "academic-driven startups proceedings",

  "Indian education research papers",

  "Department of Holistic Education publications",

];



export const PROCEEDINGS_CANONICAL_URL = `${SITE_URL}/proceedings`;



export function getProceedingVolumeByPath(path: string): ProceedingsVolumeEntry | undefined {

  return PROCEEDINGS_CATALOG.find((v) => v.readHref === path);

}

