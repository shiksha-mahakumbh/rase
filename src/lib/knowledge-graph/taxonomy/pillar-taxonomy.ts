import { PILLAR_REGISTRY, type PillarSlug } from "../pillar-registry";
import type { EducationPillarId } from "../entities/education-pillars";

export const PILLAR_TAXONOMY = PILLAR_REGISTRY.map((p) => ({
  id: p.id,
  slug: p.slug,
  path: p.path,
  label: p.label,
}));

export function pillarSlugFromId(id: EducationPillarId): PillarSlug | undefined {
  return PILLAR_REGISTRY.find((p) => p.id === id)?.slug;
}

export function pillarIdFromSlug(slug: string): EducationPillarId | undefined {
  return PILLAR_REGISTRY.find((p) => p.slug === slug)?.id;
}
