import { editionTitle, getEditionByNumber } from "@/data/past-editions";
import { SITE_URL } from "@/config/site";

export type BookAvailability = "available" | "coming_soon";

export type BookCatalogEntry = {
  id: string;
  title: string;
  edition: string;
  year: string;
  venue: string;
  dates: string;
  status: BookAvailability;
  description: string;
  coverSrc: string;
  coverAlt: string;
  /** Set when a PDF / flipbook / Drive preview is confirmed */
  previewHref?: string;
  pastEventHref?: string;
  purchaseHref: string;
  accent: string;
};

const smk10 = getEditionByNumber("1.0")!;

export const BOOKS_PAGE_HERO = {
  eyebrow: "Publications",
  title: "Books",
  subtitle:
    "Published works documenting Shiksha Mahakumbh Abhiyan editions — preserving national education dialogues for researchers, institutions, and policymakers.",
} as const;

export const BOOKS_STATS = [
  { label: "Featured", value: "1 title", hint: "From Shiksha Mahakumbh 1.0" },
  { label: "Focus", value: "School education", hint: "RASE 2023 compendium" },
  { label: "Partners", value: "NIT Jalandhar", hint: "With Sarvhitkari / Vidya Bharti" },
  { label: "Acquire", value: "Contact DHE", hint: "Copies via enquiry" },
] as const;

export const BOOK_CATALOG: BookCatalogEntry[] = [
  {
    id: "recent-advances-school-education",
    title: "Recent Advances in School Education",
    edition: "1.0",
    year: smk10.year,
    venue: smk10.venue,
    dates: smk10.dates,
    status: "available",
    description:
      "Recent Advances in School Education is a compendium of events from the inauguration to the passing of the world's first Shiksha Mahakumbh, inspired by the spirit of Kumbh culture in ancient Bharat. Shiksha Mahakumbh is the brainchild of Dr. Thakur SKR, a prominent scientist of ISRO. The inaugural edition of Shiksha Mahakumbh — National Conference on Recent Advances in School Education (RASE 2023) — was organised by Sarvhitkari Educational Society, a prominent unit of Vidya Bharti – Akhil Bhartiya Shiksha Sansthan in the state of Punjab, in collaboration with Dr. B. R. Ambedkar National Institute of Technology Jalandhar. The conference was held from 9–11 June 2023 at NIT Jalandhar.",
    coverSrc: "/book.png",
    coverAlt: "Cover of Recent Advances in School Education — Shiksha Mahakumbh 1.0 compendium",
    pastEventHref: smk10.href,
    purchaseHref: "/contact-us",
    accent: "from-emerald-600 to-teal-800",
  },
];

export const BOOKS_SEO_KEYWORDS = [
  "Recent Advances in School Education",
  "Shiksha Mahakumbh books",
  "RASE 2023 book",
  "Shiksha Mahakumbh 1.0 publication",
  "Department of Holistic Education books",
  "Indian education conference publication",
  "NIT Jalandhar Shiksha Mahakumbh",
];

export const BOOKS_CANONICAL_URL = `${SITE_URL}/books`;

export const BOOKS_EDITION_NOTE = `${editionTitle("2.0")} through ${editionTitle("6.0")} book listings will be added as publication details are confirmed.`;
