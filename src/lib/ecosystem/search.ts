import { ECOSYSTEM_REGISTRY } from "./registries";
import type { EcosystemItem, EcosystemKind, EcosystemSearchFilters } from "./types";

export const MAX_SEARCH_QUERY_LENGTH = 200;

function normalizeQuery(q?: string): string {
  return (q?.trim() ?? "").slice(0, MAX_SEARCH_QUERY_LENGTH);
}

function matchesQuery(item: EcosystemItem, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    item.title.toLowerCase().includes(lower) ||
    item.excerpt.toLowerCase().includes(lower) ||
    item.tags.some((t) => t.toLowerCase().includes(lower)) ||
    (item.organization?.toLowerCase().includes(lower) ?? false) ||
    (item.role?.toLowerCase().includes(lower) ?? false)
  );
}

export function searchEcosystem(filters: EcosystemSearchFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  let items = [...ECOSYSTEM_REGISTRY];

  if (filters.kind) {
    items = items.filter((i) => i.kind === filters.kind);
  }
  if (filters.category) {
    items = items.filter((i) => i.category === filters.category);
  }
  if (filters.tag) {
    items = items.filter((i) =>
      i.tags.some((t) => t.toLowerCase() === filters.tag?.toLowerCase())
    );
  }
  if (filters.q) {
    const q = normalizeQuery(filters.q);
    if (q) {
      items = items.filter((i) => matchesQuery(i, q));
    }
  }

  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function globalSearch(query: string, limit = 8) {
  const q = normalizeQuery(query);
  if (!q) return [];
  return searchEcosystem({ q, pageSize: limit }).items;
}

export function searchSpeakers(q: string) {
  return searchEcosystem({ q, kind: "speaker", pageSize: 24 }).items;
}

export function searchPublications(q: string) {
  return searchEcosystem({
    q,
    kind: "publication",
    pageSize: 24,
  }).items;
}

export function searchKnowledge(q: string) {
  const kinds: EcosystemKind[] = [
    "article",
    "news",
    "research",
    "policy",
    "insight",
    "event-report",
  ];
  const normalized = normalizeQuery(q);
  return ECOSYSTEM_REGISTRY.filter(
    (i) => kinds.includes(i.kind) && (!normalized || matchesQuery(i, normalized))
  ).slice(0, 24);
}

export function getAllEcosystemTags(): string[] {
  const set = new Set<string>();
  ECOSYSTEM_REGISTRY.forEach((i) => i.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
