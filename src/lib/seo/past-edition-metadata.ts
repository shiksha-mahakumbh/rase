import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import { getEditionByHref } from "@/data/past-editions";
import { createEventMetadata } from "@/lib/seo/metadataBuilders";

const EDITION_META: Record<
  string,
  { description: string; keywords: string[] }
> = {
  "/past_event/shiksha-mahakumbh-1.0": {
    description:
      "Shiksha Mahakumbh 1.0 at NIT Jalandhar, 9–11 June 2023. Theme: Recent Advances in School Education. 81 research papers, 5,000+ footfall, NEP 2020 implementation conference. Proceedings Volume II.",
    keywords: [
      "SMK 1.0",
      "NIT Jalandhar",
      "School Education Conference",
      "NEP 2020",
      "Proceeding2",
      "Sarvhitkari Educational Society",
    ],
  },
  "/past_event/shiksha-mahakumbh-2.0": {
    description:
      "Shiksha Mahakumbh 2.0 (Shiksha Kumbh) at NIT Kurukshetra, 20 December 2023. Theme: Role of Academic-driven Startups in Economy. Proceedings Volume I — 65 papers.",
    keywords: ["SMK 2.0", "NIT Kurukshetra", "Academic startups", "Proceeding1"],
  },
  "/past_event/shiksha-mahakumbh-3.0": {
    description:
      "Shiksha Mahakumbh 3.0 at NIT Srinagar, 29–30 June 2024. RASE 2024 — 59 research papers, 1,800+ participants, J&K startup economy. Proceedings Volume III.",
    keywords: ["SMK 3.0", "NIT Srinagar", "Jammu Kashmir", "Proceeding3"],
  },
  "/past_event/shiksha-mahakumbh-4.0": {
    description:
      "Shiksha Mahakumbh 4.0 at Kurukshetra University, 16–17 December 2024. Theme: Indian Education System for Global Development. 91 research papers, 21 conclaves, 2,400+ attendees.",
    keywords: [
      "SMK 4.0",
      "Kurukshetra University",
      "Indian Education Conference",
      "global education",
    ],
  },
  "/past_event/shiksha-mahakumbh-5.0": {
    description:
      "Shiksha Mahakumbh 5.0 at NIPER Mohali, 31 October – 2 November 2025. Theme: Classroom to Society — Building a Healthier World through Education. 284 research papers, 10 conclaves.",
    keywords: ["SMK 5.0", "NIPER Mohali", "DHE Olympiad", "Higher Education Summit"],
  },
};

export function createPastEditionPageMetadata(href: string): Metadata {
  const edition = getEditionByHref(href);
  const meta = EDITION_META[href];
  if (!edition || !meta) {
    throw new Error(`Unknown past edition metadata path: ${href}`);
  }

  const title = `${edition.title} — ${edition.venue} (${edition.year})`;

  return createEventMetadata({
    title,
    description: meta.description,
    path: href,
    keywords: meta.keywords,
    image: edition.imageSrc ? `${SITE_URL}${edition.imageSrc}` : undefined,
  });
}
