-- Phase C: Organizational CMS — enums, column extensions, EntityRevision

DO $$ BEGIN CREATE TYPE "PartnerCategory" AS ENUM (
  'academic', 'knowledge', 'industry', 'media', 'csr', 'government',
  'ngo', 'international', 'technology', 'research', 'other'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "SpeakerCategory" AS ENUM (
  'keynote', 'plenary', 'track_chair', 'panelist', 'guest', 'other'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "EventCategory" AS ENUM (
  'summit', 'conclave', 'workshop', 'olympiad', 'exhibition', 'ceremony', 'other'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "MediaCenterCategory" AS ENUM (
  'news', 'press_release', 'media_mention', 'photo_gallery', 'video', 'interview', 'publication'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TYPE "CommitteeCategory" ADD VALUE IF NOT EXISTS 'Advisory_Board';
ALTER TYPE "CommitteeCategory" ADD VALUE IF NOT EXISTS 'National_Organizing_Committee';
ALTER TYPE "CommitteeCategory" ADD VALUE IF NOT EXISTS 'Steering_Committee';
ALTER TYPE "CommitteeCategory" ADD VALUE IF NOT EXISTS 'Event_Committee';
ALTER TYPE "MediaType" ADD VALUE IF NOT EXISTS 'interview';
ALTER TYPE "MediaType" ADD VALUE IF NOT EXISTS 'publication';

-- Committees
ALTER TABLE "committees" ADD COLUMN IF NOT EXISTS "edition" TEXT;
ALTER TABLE "committees" ADD COLUMN IF NOT EXISTS "locale" "ContentLocale" NOT NULL DEFAULT 'en';
ALTER TABLE "committees" ADD COLUMN IF NOT EXISTS "status" "PageStatus" NOT NULL DEFAULT 'draft';
ALTER TABLE "committees" ADD COLUMN IF NOT EXISTS "publish_at" TIMESTAMPTZ(6);

DROP INDEX IF EXISTS "committees_slug_key";
CREATE UNIQUE INDEX IF NOT EXISTS "committees_slug_edition_locale_key"
  ON "committees"("slug", "edition", "locale");
CREATE INDEX IF NOT EXISTS "committees_edition_locale_status_idx"
  ON "committees"("edition", "locale", "status");

UPDATE "committees" SET "status" = 'published' WHERE "is_published" = true AND "status" = 'draft';

-- Committee members
ALTER TABLE "committee_members" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "committee_members" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "committee_members" ADD COLUMN IF NOT EXISTS "social_links" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "committee_members" ADD COLUMN IF NOT EXISTS "locale" "ContentLocale";
ALTER TABLE "committee_members" ADD COLUMN IF NOT EXISTS "media_asset_id" UUID;

DO $$ BEGIN
  ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_media_asset_id_fkey"
    FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Events
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "edition" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "locale" "ContentLocale" NOT NULL DEFAULT 'en';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "category" "EventCategory" NOT NULL DEFAULT 'other';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "start_date" TIMESTAMPTZ(6);
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "end_date" TIMESTAMPTZ(6);
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "publish_at" TIMESTAMPTZ(6);
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "highlights" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "brochure_download_id" UUID;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "registration_link" TEXT;

UPDATE "events" SET "start_date" = "event_date" WHERE "start_date" IS NULL AND "event_date" IS NOT NULL;

DROP INDEX IF EXISTS "events_slug_key";
CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_locale_key" ON "events"("slug", "locale");
CREATE INDEX IF NOT EXISTS "events_locale_is_featured_idx" ON "events"("locale", "is_featured");

DO $$ BEGIN
  ALTER TABLE "events" ADD CONSTRAINT "events_brochure_download_id_fkey"
    FOREIGN KEY ("brochure_download_id") REFERENCES "downloads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Event media
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "locale" "ContentLocale" NOT NULL DEFAULT 'en';
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "status" "PageStatus" NOT NULL DEFAULT 'draft';
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "media_center_category" "MediaCenterCategory";
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "excerpt" TEXT;
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "edition" TEXT;
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "publish_at" TIMESTAMPTZ(6);
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "related_ids" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "event_media" ADD COLUMN IF NOT EXISTS "media_asset_id" UUID;

CREATE INDEX IF NOT EXISTS "event_media_media_center_category_status_publish_at_idx"
  ON "event_media"("media_center_category", "status", "publish_at");
CREATE INDEX IF NOT EXISTS "event_media_slug_locale_idx" ON "event_media"("slug", "locale");

DO $$ BEGIN
  ALTER TABLE "event_media" ADD CONSTRAINT "event_media_media_asset_id_fkey"
    FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Speakers
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "title" TEXT;
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "category" "SpeakerCategory" NOT NULL DEFAULT 'other';
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "edition" TEXT;
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "locale" "ContentLocale" NOT NULL DEFAULT 'en';
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "status" "PageStatus" NOT NULL DEFAULT 'draft';
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "publish_at" TIMESTAMPTZ(6);
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "social_links" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "languages" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "speaker_profiles" ADD COLUMN IF NOT EXISTS "media_asset_id" UUID;

UPDATE "speaker_profiles" SET "slug" = LOWER(REGEXP_REPLACE("full_name", '[^a-zA-Z0-9]+', '-', 'g'))
  WHERE "slug" IS NULL OR "slug" = '';

CREATE UNIQUE INDEX IF NOT EXISTS "speaker_profiles_slug_locale_key" ON "speaker_profiles"("slug", "locale");
CREATE INDEX IF NOT EXISTS "speaker_profiles_status_locale_is_featured_idx"
  ON "speaker_profiles"("status", "locale", "is_featured");

DO $$ BEGIN
  ALTER TABLE "speaker_profiles" ADD CONSTRAINT "speaker_profiles_media_asset_id_fkey"
    FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Partners
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "partner_category" "PartnerCategory" NOT NULL DEFAULT 'other';
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "locale" "ContentLocale" NOT NULL DEFAULT 'en';
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "status" "PageStatus" NOT NULL DEFAULT 'draft';
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "media_asset_id" UUID;

CREATE INDEX IF NOT EXISTS "partners_partner_category_status_locale_sort_order_idx"
  ON "partners"("partner_category", "status", "locale", "sort_order");

DO $$ BEGIN
  ALTER TABLE "partners" ADD CONSTRAINT "partners_media_asset_id_fkey"
    FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Entity revisions
CREATE TABLE IF NOT EXISTS "entity_revisions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "entity_type" TEXT NOT NULL,
  "entity_id" UUID NOT NULL,
  "version" INTEGER NOT NULL,
  "snapshot" JSONB NOT NULL,
  "created_by_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "entity_revisions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "entity_revisions_entity_type_entity_id_version_key"
  ON "entity_revisions"("entity_type", "entity_id", "version");
CREATE INDEX IF NOT EXISTS "entity_revisions_entity_type_entity_id_created_at_idx"
  ON "entity_revisions"("entity_type", "entity_id", "created_at");
