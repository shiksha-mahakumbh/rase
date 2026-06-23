import { SITE_URL } from "@/config/site";
import { SOUVENIR_CATALOG } from "@/data/souvenir-abstracts-hub";

export const PUBLICATIONS_PAGE_HERO = {
  eyebrow: "Publications · Global Access",
  title: "Publications & Research",
  subtitle:
    "Proceedings, books, journals, and curated research resources from Shiksha Mahakumbh Abhiyan — free online access for national and international education delegates, researchers, and institutions.",
} as const;

export const PUBLICATIONS_STATS = [
  { label: "Proceedings", value: "3 volumes", hint: "93+ indexed online" },
  {
    label: "Souvenirs",
    value: `${SOUVENIR_CATALOG.length} editions`,
    hint: "MTC abstract booklets 4.0 & 5.0",
  },
  { label: "Books", value: "1 title", hint: "SMK 1.0 compendium" },
  { label: "Journals", value: "DHE platform", hint: "pub.dhe.org.in" },
] as const;

export const PUBLICATIONS_SEO_KEYWORDS = [
  "Shiksha Mahakumbh publications",
  "Indian education research papers",
  "NEP 2020 conference proceedings",
  "Department of Holistic Education journals",
  "international education delegates India",
  "RASE conference publications",
];

export const PUBLICATIONS_CANONICAL_URL = `${SITE_URL}/publications`;
