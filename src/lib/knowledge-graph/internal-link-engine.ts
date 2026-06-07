import { SITE_URL } from "@/config/site";
import { getContentByPath, getContentForPillar } from "./content-map";
import {
  EDUCATION_PILLAR_ENTITIES,
  type EducationPillarId,
} from "./entities/education-pillars";
import { getEntitiesByPillar } from "./entity-map";
import { PILLAR_BY_ID, PILLAR_REGISTRY, type PillarSlug } from "./pillar-registry";
import { getRelatedPillars } from "./relationships";
import { getClustersForPillar } from "./topic-clusters";
import { getAuthorityForPath, getPillarAuthorityWeight } from "./authority-map";

export type InternalLinkSuggestion = {
  href: string;
  label: string;
  reason: string;
  weight?: number;
};

function sortByWeight(links: InternalLinkSuggestion[]): InternalLinkSuggestion[] {
  return [...links].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
}

/**
 * Links for a pillar landing page: clusters, mapped content, related pillars.
 */
export function getRelatedLinksForPillar(
  pillarId: EducationPillarId,
  limit = 8
): InternalLinkSuggestion[] {
  const pillar = EDUCATION_PILLAR_ENTITIES.find((p) => p.id === pillarId);
  const pillarMeta = PILLAR_BY_ID[pillarId];
  const links: InternalLinkSuggestion[] = [];

  if (pillarMeta) {
    links.push({
      href: "/education",
      label: "Education Ecosystem",
      reason: "hub",
      weight: 90,
    });
  }

  const content = getContentForPillar(pillarId);
  for (const entry of content) {
    links.push({
      href: entry.path,
      label: entry.title,
      reason: `content:${entry.clusterId}`,
      weight: entry.priority ? 80 + entry.priority : 70,
    });
  }

  if (pillar) {
    for (const path of pillar.routes) {
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
    if (rel) {
      links.push({
        href: rel.path,
        label: rel.label,
        reason: `related-pillar:${relId}`,
        weight: 55,
      });
    }
  }

  return sortByWeight(links).slice(0, limit);
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

/** Auto-inherit links for any mapped route */
export function getInternalLinksForPath(
  path: string,
  limit = 8
): InternalLinkSuggestion[] {
  const entry = getContentByPath(path);
  if (!entry) {
    const auth = getAuthorityForPath(path);
    if (auth) return getRelatedLinksForPillar(auth.pillarId, limit);
    return [];
  }

  const links = getRelatedLinksForPillar(entry.pillarId, limit);
  const pillarPage = PILLAR_BY_ID[entry.pillarId];
  if (pillarPage && !links.some((l) => l.href === pillarPage.path)) {
    links.unshift({
      href: pillarPage.path,
      label: pillarPage.label,
      reason: "pillar-landing",
      weight: getPillarAuthorityWeight(entry.pillarId),
    });
  }
  return sortByWeight(links).slice(0, limit);
}

export function getEducationHubLinks(): InternalLinkSuggestion[] {
  return PILLAR_REGISTRY.map((p) => ({
    href: p.path,
    label: p.label,
    reason: `pillar:${p.id}`,
    weight: getPillarAuthorityWeight(p.id),
  }));
}

export function getClusterLinksForPillar(
  pillarId: EducationPillarId
): InternalLinkSuggestion[] {
  return getClustersForPillar(pillarId).map((c) => ({
    href: PILLAR_BY_ID[pillarId]?.path ?? "/education",
    label: c.label,
    reason: `cluster:${c.id}`,
    weight: 50,
  }));
}

export function resolvePillarSlug(path: string): PillarSlug | undefined {
  const entry = PILLAR_REGISTRY.find((p) => p.path === path);
  return entry?.slug;
}

/** For JSON-LD ItemList on hub pages */
export function getPillarItemListItems(): { name: string; url: string }[] {
  return PILLAR_REGISTRY.map((p) => ({
    name: p.label,
    url: `${SITE_URL}${p.path}`,
  }));
}
