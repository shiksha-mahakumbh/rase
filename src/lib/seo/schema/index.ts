/**
 * Central schema.org JSON-LD builders — use one primary type per page to avoid duplicates.
 */
export {
  buildEducationalOrganizationSchema,
  buildPersonSchema,
  buildCourseSchema,
  buildArticleSchema,
  buildNewsArticleSchema,
  buildEventSchema,
  buildEducationEventSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
  buildResearchProjectSchema,
  buildEducationalOccupationalProgramSchema,
  buildCollectionPageSchema,
  buildBookSchema,
  buildItemListSchema,
  buildWebPageSchema,
  buildProfilePageSchema,
  buildDatasetSchema,
  buildScholarlyArticleSchema,
  orgReference,
} from "./builders";

/** Phase 1 builders (unchanged paths for registration, press, etc.) */
export {
  buildEducationalOrganizationJsonLd,
  buildRegistrationEventJsonLd,
  buildRegistrationFaqJsonLd,
  buildPersonJsonLd,
  buildNewsArticleJsonLd,
} from "@/lib/seo/schemas";

export { buildBreadcrumbJsonLd, buildOrganizationJsonLd } from "@/lib/seo/jsonLd";
