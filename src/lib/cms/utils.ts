import type { CmsHomepage } from "./types";

export function getSection(
  homepage: CmsHomepage | null | undefined,
  key: string
): CmsHomepage["sections"][0] | undefined {
  return homepage?.sections.find((s) => s.sectionKey === key && s.isVisible);
}

export function sectionItems<T>(
  section: { content: Record<string, unknown> } | undefined,
  field = "items"
): T[] {
  if (!section?.content) return [];
  const val = section.content[field];
  return Array.isArray(val) ? (val as T[]) : [];
}

export function sectionField<T>(
  section: { content: Record<string, unknown> } | undefined,
  field: string,
  fallback: T
): T {
  if (!section?.content || section.content[field] == null) return fallback;
  return section.content[field] as T;
}
