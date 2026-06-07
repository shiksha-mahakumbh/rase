/**
 * Controlled vocabulary for Shiksha Mahakumbh knowledge graph (Phase 2 foundation).
 */

export const SMK_EDITIONS = ["smk4", "smk5", "smk6"] as const;
export type SmkEdition = (typeof SMK_EDITIONS)[number];

export const SMK_EVENT_TYPES = [
  "mahakumbh",
  "kumbh",
  "workshop",
  "conclave",
  "press",
  "olympiad",
  "awards",
] as const;

export const SMK_AUDIENCES = [
  "school",
  "hei",
  "ngo",
  "volunteer",
  "delegate",
  "researcher",
] as const;

export const SMK_TRACKS = [
  "research",
  "olympiad",
  "awards",
  "exhibition",
  "policy",
  "innovation",
  "skill-development",
] as const;

export const SMK_LOCALES = ["en", "hi", "fr", "es", "ar"] as const;

export type TopicTaxonomy = {
  edition?: SmkEdition;
  eventType?: (typeof SMK_EVENT_TYPES)[number];
  audience?: (typeof SMK_AUDIENCES)[number];
  track?: (typeof SMK_TRACKS)[number];
  locale?: (typeof SMK_LOCALES)[number];
};
