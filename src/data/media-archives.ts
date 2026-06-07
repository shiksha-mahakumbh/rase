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

export const MEDIA_ARCHIVE_ITEMS: MediaArchiveItem[] = [
  {
    label: "शिक्षा महाकुंभ 4.0",
    engLabel: "Shiksha Mahakumbh 4.0",
    year: "2024",
    theme: "Indian Education System for Global Development",
    color: "from-blue-700 to-indigo-800",
    image: "/images/smk4.jpg",
    category: "edition",
    children: [
      { label: "Digital Media", link: "/media/shiksha-mahakumbh/2024/digital" },
      { label: "Print Media", link: "/media/shiksha-mahakumbh/2024/print" },
    ],
    archive: [
      {
        year: "2023",
        label: "शिक्षा महाकुंभ 1.0",
        engLabel: "Shiksha Mahakumbh 1.0",
        children: [
          { label: "Digital Media", link: "/media/shiksha-mahakumbh/2023/digital" },
          { label: "Print Media", link: "/media/shiksha-mahakumbh/2023/print" },
        ],
      },
    ],
  },
  {
    label: "शिक्षा महाकुंभ 3.0",
    engLabel: "Shiksha Mahakumbh 3.0",
    year: "2024",
    theme: "Role of Startups in Developing Economy of",
    color: "from-orange-500 to-red-600",
    image: "/images/smk3.jpg",
    category: "edition",
    children: [
      { label: "Digital Media", link: "/media/shiksha-kumbh/2024/digital" },
      { label: "Print Media", link: "/media/shiksha-kumbh/2024/print" },
    ],
    archive: [
      {
        year: "2023",
        label: "शिक्षा महाकुंभ 2.0",
        engLabel: "Shiksha Mahakumbh 2.0",
        children: [
          { label: "Digital Media", link: "/media/shiksha-kumbh/2023/digital" },
          { label: "Print Media", link: "/media/shiksha-kumbh/2023/print" },
        ],
      },
    ],
  },
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
  { label: "Photo Gallery", href: "/gallery", icon: "📷" },
  { label: "Video Gallery", href: "/videos", icon: "🎬" },
  { label: "Best Wishes", href: "/best-wishes", icon: "🙏" },
  { label: "Journals", href: "/journals", icon: "📘" },
  { label: "Proceedings", href: "/proceedings", icon: "📚" },
] as const;

export type MediaFilter =
  | "all"
  | "editions"
  | "digital"
  | "print"
  | "press"
  | "gallery";
