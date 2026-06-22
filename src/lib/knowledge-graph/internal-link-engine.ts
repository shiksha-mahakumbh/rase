import { SITE_URL } from "@/config/site";
import { getContentByPath, getContentForPillar } from "./content-map";
import {
  EDUCATION_PILLAR_ENTITIES,
  type EducationPillarId,
} from "./entities/education-pillars";
import { PILLAR_BY_ID, PILLAR_REGISTRY, type PillarSlug } from "./pillar-registry";
import { getRelatedPillars } from "./relationships";
import { getAuthorityForPath, getPillarAuthorityWeight } from "./authority-map";
import {
  DEFAULT_RELATED_LINK_LIMIT,
  getCuratedLinksForPath,
  getCuratedLinksForPillar,
  isBlockedRelatedLink,
  type InternalLinkSuggestion,
} from "./site-cleanup";

export type { InternalLinkSuggestion };

function sortByWeight(links: InternalLinkSuggestion[]): InternalLinkSuggestion[] {
  return [...links].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
}

function dedupeLinks(links: InternalLinkSuggestion[]): InternalLinkSuggestion[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function filterLinks(links: InternalLinkSuggestion[]): InternalLinkSuggestion[] {
  return links.filter((link) => !isBlockedRelatedLink(link.href));
}

/**
 * Links for a pillar landing page — curated first, then filtered legacy suggestions.
 */
export function getRelatedLinksForPillar(
  pillarId: EducationPillarId,
  limit = DEFAULT_RELATED_LINK_LIMIT
): InternalLinkSuggestion[] {
  const curated = getCuratedLinksForPillar(pillarId, limit);
  if (curated?.length) return curated;

  const pillar = EDUCATION_PILLAR_ENTITIES.find((p) => p.id === pillarId);
  const links: InternalLinkSuggestion[] = [];

  const content = filterLinks(
    getContentForPillar(pillarId).map((entry) => ({
      href: entry.path,
      label: entry.title,
      reason: `content:${entry.clusterId}`,
      weight: entry.priority ? 80 + entry.priority : 70,
    }))
  );

  links.push(...content);

  if (pillar) {
    for (const path of pillar.routes) {
      if (isBlockedRelatedLink(path)) continue;
      if (!links.some((l) => l.href === path)) {
        links.push({
          href: path,
          label: pillar.label,
          reason: `route:${pillarId}`,
          weight: 65,
        });
      }
    }
  }

  const related = getRelatedPillars(pillarId);
  for (const relId of related) {
    const rel = PILLAR_BY_ID[relId];
    if (rel && !isBlockedRelatedLink(rel.path)) {
      links.push({
        href: rel.path,
        label: rel.label,
        reason: `related-pillar:${relId}`,
        weight: 55,
      });
    }
  }

  return sortByWeight(dedupeLinks(links)).slice(0, limit);
}

export function getCrossPillarLinks(
  fromPillar: EducationPillarId,
  toPillars: EducationPillarId[]
): InternalLinkSuggestion[] {
  return toPillars.flatMap((id) =>
    getRelatedLinksForPillar(id, 2).map((link) => ({
      ...link,
      reason: `cross:${fromPillar}->${id}`,
    }))
  );
}

/** Curated internal links for public pages — max 4 by default */
export function getInternalLinksForPath(
  path: string,
  limit = DEFAULT_RELATED_LINK_LIMIT
): InternalLinkSuggestion[] {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  const pathCurated = getCuratedLinksForPath(normalized, limit);
  if (pathCurated?.length) return pathCurated;

  const entry = getContentByPath(normalized);
  const pillarId = entry?.pillarId ?? getAuthorityForPath(normalized)?.pillarId;
  if (!pillarId) return [];

  const pillarCurated = getCuratedLinksForPillar(pillarId, limit);
  if (pillarCurated?.length) return pillarCurated;

  return getRelatedLinksForPillar(pillarId, limit);
}

export function getEducationHubLinks(): InternalLinkSuggestion[] {
  return PILLAR_REGISTRY.filter((p) => !isBlockedRelatedLink(p.path)).map((p) => ({
    href: p.path,
    label: p.label,
    reason: `pillar:${p.id}`,
    weight: getPillarAuthorityWeight(p.id),
  }));
}

export function getClusterLinksForPillar(
  pillarId: EducationPillarId
): InternalLinkSuggestion[] {
  return getCuratedLinksForPillar(pillarId, DEFAULT_RELATED_LINK_LIMIT) ?? [];
}

export function resolvePillarSlug(path: string): PillarSlug | undefined {
  const entry = PILLAR_REGISTRY.find((p) => p.path === path);
  return entry?.slug;
}

/** For JSON-LD ItemList on hub pages */
export function getPillarItemListItems(): { name: string; url: string }[] {
  return PILLAR_REGISTRY.filter((p) => !isBlockedRelatedLink(p.path)).map((p) => ({
    name: p.label,
    url: `${SITE_URL}${p.path}`,
  }));
}
