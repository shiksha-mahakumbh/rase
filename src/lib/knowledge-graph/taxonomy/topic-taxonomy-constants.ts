/** Re-export and extend topic taxonomy (edition, audience, track) */
export {
  SMK_EDITIONS,
  SMK_EVENT_TYPES,
  SMK_AUDIENCES,
  SMK_TRACKS,
  SMK_LOCALES,
  type SmkEdition,
  type TopicTaxonomy,
} from "../topic-taxonomy";

export const TOPIC_CONTENT_TYPES = [
  "landing",
  "article",
  "event",
  "press",
  "publication",
  "registration",
  "admin",
] as const;

export type TopicContentType = (typeof TOPIC_CONTENT_TYPES)[number];
