import { createPageMetadata } from "@/lib/seo/metadata";

const ARCHIVE_PAGES = {
  shikshamahakumbh2024digitalmedia: {
    title: "Shiksha Mahakumbh 4.0 — Digital Media Archive",
    description:
      "Digital media coverage and online archives from Shiksha Mahakumbh 4.0 at Kurukshetra University (2024).",
    path: "/media/shiksha-mahakumbh/2024/digital",
  },
  shikshamahakumbh2023digitalmedia: {
    title: "Shiksha Mahakumbh 1.0 — Digital Media Archive",
    description:
      "Digital media coverage and online archives from Shiksha Mahakumbh 1.0 at NIT Jalandhar (2023).",
    path: "/media/shiksha-mahakumbh/2023/digital",
  },
  shikshakumbh2024digitalmedia: {
    title: "Shiksha Mahakumbh 3.0 — Digital Media Archive",
    description:
      "Digital media coverage and online archives from Shiksha Mahakumbh 3.0 at NIT Srinagar (2024).",
    path: "/media/shiksha-kumbh/2024/digital",
  },
  shikshakumbh2023digitalmedia: {
    title: "Shiksha Mahakumbh 2.0 — Digital Media Archive",
    description:
      "Digital media coverage and online archives from Shiksha Mahakumbh 2.0 at NIT Kurukshetra (2023).",
    path: "/media/shiksha-kumbh/2023/digital",
  },
  printmediashikshamahakumbh2024: {
    title: "Shiksha Mahakumbh 4.0 — Print Media Archive",
    description:
      "Newspaper and print media coverage from Shiksha Mahakumbh 4.0 at Kurukshetra University (2024).",
    path: "/media/shiksha-mahakumbh/2024/print",
  },
  printmediashikshamahakumbh2023: {
    title: "Shiksha Mahakumbh 1.0 — Print Media Archive",
    description:
      "Newspaper and print media coverage from Shiksha Mahakumbh 1.0 at NIT Jalandhar (2023).",
    path: "/media/shiksha-mahakumbh/2023/print",
  },
  printmediashikshakumbh2024: {
    title: "Shiksha Mahakumbh 3.0 — Print Media Archive",
    description:
      "Newspaper and print media coverage from Shiksha Mahakumbh 3.0 at NIT Srinagar (2024).",
    path: "/media/shiksha-kumbh/2024/print",
  },
  printmediashikshakumbh2023: {
    title: "Shiksha Mahakumbh 2.0 — Print Media Archive",
    description:
      "Newspaper and print media coverage from Shiksha Mahakumbh 2.0 at NIT Kurukshetra (2023).",
    path: "/media/shiksha-kumbh/2023/print",
  },
} as const;

export type MediaArchiveSlug = keyof typeof ARCHIVE_PAGES;

export function mediaArchiveMeta(slug: MediaArchiveSlug) {
  const page = ARCHIVE_PAGES[slug];
  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: [
      "Shiksha Mahakumbh media",
      "education press India",
      "Mahakumbh digital archive",
    ],
  });
}
