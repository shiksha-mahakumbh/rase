import {
  getEditionByNumber,
  mediaArchivePath,
  PAST_EDITIONS,
} from "@/data/past-editions";

export interface MediaArchiveChild {
  label: string;
  link: string;
}

export interface MediaArchiveItem {
  label: string;
  engLabel: string;
  year: string;
  theme: string;
  color: string;
  image: string;
  category: "edition" | "digital" | "print";
  children: MediaArchiveChild[];
  archive?: {
    year: string;
    label: string;
    engLabel: string;
    children: MediaArchiveChild[];
  }[];
}

function editionMediaItem(
  editionNum: string,
  color: string,
  image: string,
  archiveEdition?: string
): MediaArchiveItem {
  const e = getEditionByNumber(editionNum)!;
  const item: MediaArchiveItem = {
    label: e.title,
    engLabel: `Shiksha Mahakumbh ${editionNum}`,
    year: e.year,
    theme: e.theme,
    color,
    image,
    category: "edition",
    children: [
      { label: "Digital Media", link: mediaArchivePath(editionNum, "digital") },
      { label: "Print Media", link: mediaArchivePath(editionNum, "print") },
    ],
  };
  if (archiveEdition) {
    const arch = getEditionByNumber(archiveEdition)!;
    item.archive = [
      {
        year: arch.year,
        label: arch.title,
        engLabel: arch.title,
        children: [
          { label: "Digital Media", link: mediaArchivePath(archiveEdition, "digital") },
          { label: "Print Media", link: mediaArchivePath(archiveEdition, "print") },
        ],
      },
    ];
  }
  return item;
}

/** Primary media navigation cards — editions 4.0 & 3.0 with nested 1.0 / 2.0 archives */
export const MEDIA_ARCHIVE_ITEMS: MediaArchiveItem[] = [
  editionMediaItem("4.0", "from-blue-700 to-indigo-800", "/images/smk4.jpg", "1.0"),
  editionMediaItem("3.0", "from-orange-500 to-red-600", "/images/smk3.jpg", "2.0"),
];

export const PRESS_COVERAGE_LINKS = [
  { label: "Press Releases", href: "/press" },
  { label: "Press 1", href: "/press/baton-ceremony-smk-4" },
  { label: "Press 2", href: "/press/shiksha-mahakumbh-4-0" },
  { label: "Press 3", href: "/press/residential-camp-success" },
  { label: "Press 4", href: "/press/residential-camp-hindi" },
  { label: "Press 5", href: "/press/national-coverage" },
  { label: "Press 6", href: "/press/education-summit-coverage" },
  { label: "Press 7", href: "/press/mahakumbh-programme-update" },
  { label: "Press 8", href: "/press/education-movement" },
  { label: "Press 9", href: "/press/summit-highlights" },
] as const;

export const MEDIA_HUB_LINKS = [
  { label: "Gallery", href: "/gallery", icon: "📷" },
  { label: "Best Wishes", href: "/best-wishes", icon: "🙏" },
  { label: "DHE Journal", href: "https://pub.dhe.org.in", icon: "📘" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
] as const;

export type MediaFilter =
  | "all"
  | "editions"
  | "digital"
  | "print"
  | "press"
  | "gallery";

/** All past editions with media links — for programmatic menus */
export function allEditionMediaLinks() {
  return PAST_EDITIONS.map((e) => ({
    edition: e.edition,
    title: e.title,
    digital: mediaArchivePath(e.edition, "digital"),
    print: mediaArchivePath(e.edition, "print"),
  }));
}
