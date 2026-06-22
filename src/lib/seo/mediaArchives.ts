import { createPageMetadata } from "@/lib/seo/metadata";

const ARCHIVE_PAGES = {
  shikshamahakumbh2024digitalmedia: {
    title: "शिक्षा महाकुंभ 4.0 — Digital Media Archive",
    description:
      "Digital media coverage from Shiksha Mahakumbh Abhiyan edition 4.0 at Kurukshetra University.",
    path: "/media/shiksha-mahakumbh/4.0/digital",
  },
  shikshamahakumbh2023digitalmedia: {
    title: "शिक्षा महाकुंभ 1.0 — Digital Media Archive",
    description:
      "Digital media coverage from Shiksha Mahakumbh Abhiyan edition 1.0 at NIT Jalandhar.",
    path: "/media/shiksha-mahakumbh/1.0/digital",
  },
  shikshakumbh2024digitalmedia: {
    title: "शिक्षा महाकुंभ 3.0 — Digital Media Archive",
    description:
      "Digital media coverage from Shiksha Mahakumbh Abhiyan edition 3.0 at NIT Srinagar.",
    path: "/media/shiksha-mahakumbh/3.0/digital",
  },
  shikshakumbh2023digitalmedia: {
    title: "शिक्षा महाकुंभ 2.0 — Digital Media Archive",
    description:
      "Digital media coverage from Shiksha Mahakumbh Abhiyan edition 2.0 at NIT Kurukshetra.",
    path: "/media/shiksha-mahakumbh/2.0/digital",
  },
  printmediashikshamahakumbh2024: {
    title: "शिक्षा महाकुंभ 4.0 — Print Media Archive",
    description:
      "Print media coverage from Shiksha Mahakumbh Abhiyan edition 4.0 at Kurukshetra University.",
    path: "/media/shiksha-mahakumbh/4.0/print",
  },
  printmediashikshamahakumbh2023: {
    title: "शिक्षा महाकुंभ 1.0 — Print Media Archive",
    description:
      "Print media coverage from Shiksha Mahakumbh Abhiyan edition 1.0 at NIT Jalandhar.",
    path: "/media/shiksha-mahakumbh/1.0/print",
  },
  printmediashikshakumbh2024: {
    title: "शिक्षा महाकुंभ 3.0 — Print Media Archive",
    description:
      "Print media coverage from Shiksha Mahakumbh Abhiyan edition 3.0 at NIT Srinagar.",
    path: "/media/shiksha-mahakumbh/3.0/print",
  },
  printmediashikshakumbh2023: {
    title: "शिक्षा महाकुंभ 2.0 — Print Media Archive",
    description:
      "Print media coverage from Shiksha Mahakumbh Abhiyan edition 2.0 at NIT Kurukshetra.",
    path: "/media/shiksha-mahakumbh/2.0/print",
  },
  shikshamahakumbh2025digitalmedia: {
    title: "शिक्षा महाकुंभ 5.0 — Digital Media Archive",
    description:
      "Digital media coverage from Shiksha Mahakumbh Abhiyan edition 5.0 at NIPER Mohali — national portals, Ladakh UT, YouTube, and social media.",
    path: "/media/shiksha-mahakumbh/5.0/digital",
  },
  printmediashikshamahakumbh2025: {
    title: "शिक्षा महाकुंभ 5.0 — Print Media Archive",
    description:
      "85 print media clippings from Shiksha Mahakumbh Abhiyan edition 5.0 at NIPER Mohali.",
    path: "/media/shiksha-mahakumbh/5.0/print",
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
      "Shiksha Mahakumbh Abhiyan media",
      "education press India",
      "Mahakumbh digital archive",
      "NIPER Mohali Shiksha Mahakumbh",
      "SMK 5.0 print media",
    ],
  });
}
