import type { ContentCategory, ContentItem, ContentHubFilters } from "./types";
import { CMT_SUBMIT_PATH } from "@/lib/registration/config";

/**
 * Static registry — migrate to CMS without changing public types.
 */
export const CONTENT_REGISTRY: ContentItem[] = [
  {
    slug: "press-releases",
    title: "Press Releases",
    excerpt: "Official announcements and media coverage.",
    category: "news",
    tags: ["press", "media"],
    publishedAt: "2024-11-01",
    href: "/press",
    featured: true,
  },
  {
    slug: "proceedings",
    title: "Research Proceedings",
    excerpt: "Peer-reviewed papers from national editions.",
    category: "research",
    tags: ["research", "proceedings"],
    publishedAt: "2024-06-01",
    href: "/proceedings",
    featured: true,
  },
  {
    slug: "souvenir-abstracts-mtc",
    title: "Souvenir Abstracts — MTC",
    excerpt:
      "MTC abstract booklets for SMK 4.0 (Kurukshetra University, Dec 2024) and SMK 5.0 (NIPER Mohali, Oct–Nov 2025) — preview and download PDFs.",
    category: "research",
    tags: ["souvenir", "MTC", "abstracts", "4.0", "5.0"],
    publishedAt: "2025-11-02",
    href: "/publications/souvenir-abstracts-mtc",
    featured: true,
  },
  {
    slug: "journals",
    title: "Journals & Publications",
    excerpt: "Viksit Bharat and affiliated journals.",
    category: "research",
    tags: ["journal", "publication"],
    publishedAt: "2024-01-01",
    href: "https://pub.dhe.org.in",
  },
  {
    slug: "multi-track-conference",
    title: "Multi Track Conference",
    excerpt: "Submit papers and abstracts via Microsoft CMT.",
    category: "research",
    tags: ["CMT", "conference", "abstract", "paper"],
    publishedAt: "2025-01-01",
    href: CMT_SUBMIT_PATH,
    featured: true,
  },
  {
    slug: "registration",
    title: "Register for Shiksha Mahakumbh 6.0",
    excerpt: "Official delegate, conclave, olympiad, awards, and accommodation registration.",
    category: "event-report",
    tags: ["registration", "SMK6", "delegate"],
    publishedAt: "2026-01-01",
    href: "/registration",
    featured: true,
  },
  {
    slug: "participant-portal",
    title: "Participant Portal — My Registration",
    excerpt: "Download receipts, badges, and certificates with your registration ID.",
    category: "insight",
    tags: ["dashboard", "portal", "receipt", "badge"],
    publishedAt: "2026-01-01",
    href: "/dashboard",
    featured: true,
  },
  {
    slug: "donation",
    title: "Donation — Support Shiksha Mahakumbh Abhiyan",
    excerpt: "Contribute to the national education movement and holistic education mission.",
    category: "insight",
    tags: ["donation", "support", "vitt"],
    publishedAt: "2025-01-01",
    href: "/donation",
  },
  {
    slug: "contact",
    title: "Contact Us",
    excerpt: "Reach the organizing committee, academic council, and department teams.",
    category: "news",
    tags: ["contact", "help", "support"],
    publishedAt: "2024-01-01",
    href: "/contact-us",
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    excerpt: "Registration, events, research submission, and participant portal help.",
    category: "insight",
    tags: ["FAQ", "help", "registration"],
    publishedAt: "2025-01-01",
    href: "/faq",
  },
  {
    slug: "downloads-brochures",
    title: "Edition Brochures & Downloads",
    excerpt: "Official SMK edition brochures, schedules, and resource PDFs.",
    category: "article",
    tags: ["brochure", "downloads", "SMK6"],
    publishedAt: "2026-01-01",
    href: "/downloads",
  },
  {
    slug: "workshops",
    title: "Workshops",
    excerpt: "Hands-on workshops and capacity-building programmes.",
    category: "event-report",
    tags: ["workshops", "training"],
    publishedAt: "2025-01-01",
    href: "/workshops",
  },
  {
    slug: "noticeboard",
    title: "Notice Board",
    excerpt: "Official notices and announcements for participants.",
    category: "news",
    tags: ["notice", "announcements"],
    publishedAt: "2025-01-01",
    href: "/noticeboard",
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    excerpt: "Registration fee refund terms for paid categories.",
    category: "policy",
    tags: ["refund", "payment", "policy"],
    publishedAt: "2026-01-01",
    href: "/refund-policy",
  },
  {
    slug: "academic-council",
    title: "Academic Council",
    excerpt: "Multi-track conference, conclaves, and academic programmes for SMK 6.0.",
    category: "event-report",
    tags: ["academic", "conclave", "conference"],
    publishedAt: "2026-01-01",
    href: "/departments/academic-council",
    featured: true,
  },
  {
    slug: "merchandise",
    title: "Official Merchandise",
    excerpt: "Shiksha Mahakumbh Abhiyan branded merchandise and souvenirs.",
    category: "article",
    tags: ["merchandise", "store"],
    publishedAt: "2025-01-01",
    href: "/merchandise",
  },
  {
    slug: "nep-policy",
    title: "NEP 2020 Alignment",
    excerpt: "Policy framing for conclaves and academic council tracks.",
    category: "policy",
    tags: ["NEP", "policy"],
    publishedAt: "2025-03-01",
    href: "/introduction",
  },
  {
    slug: "smk-6-event-report",
    title: "Shiksha Mahakumbh 6.0",
    excerpt: "Upcoming summit at NIT Hamirpur, 9–11 October 2026.",
    category: "event-report",
    tags: ["SMK6", "event"],
    publishedAt: "2026-01-01",
    href: "/upcoming-events",
    featured: true,
  },
  {
    slug: "past-editions",
    title: "Past Editions Archive",
    excerpt: "Historical programmes and outcomes.",
    category: "event-report",
    tags: ["archive", "history"],
    publishedAt: "2023-01-01",
    href: "/past-events",
  },
];

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  article: "Articles",
  news: "News",
  research: "Research",
  policy: "Policy Updates",
  insight: "Education Insights",
  "event-report": "Event Reports",
};

export function getCategoryLabel(cat: ContentCategory): string {
  return CATEGORY_LABELS[cat];
}

export function filterContent(filters: ContentHubFilters): {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  let items = [...CONTENT_REGISTRY];

  if (filters.category) {
    items = items.filter((i) => i.category === filters.category);
  }
  if (filters.tag) {
    items = items.filter((i) =>
      i.tags.some((t) => t.toLowerCase() === filters.tag?.toLowerCase())
    );
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.excerpt.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  CONTENT_REGISTRY.forEach((i) => i.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
