import type { ContentCategory, ContentItem, ContentHubFilters } from "./types";

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
    tags: ["CMT", "conference"],
    publishedAt: "2025-01-01",
    href: "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/",
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
