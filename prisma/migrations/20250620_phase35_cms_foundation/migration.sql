-- Phase 3.5: Core CMS Foundation (Pages, SEO, Media Library)

-- Enums
DO $$ BEGIN CREATE TYPE "ContentLocale" AS ENUM ('en', 'hi', 'es', 'fr', 'ar', 'ru');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "PageStatus" AS ENUM ('draft', 'scheduled', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "PageType" AS ENUM ('static', 'homepage', 'about', 'policy', 'international', 'landing', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "PageSectionType" AS ENUM ('hero', 'content', 'cta', 'stats', 'gallery', 'faq', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "MediaAssetType" AS ENUM ('image', 'pdf', 'document', 'video', 'brochure', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AuditAction extensions
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'page_created';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'page_updated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'page_published';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'page_deleted';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'media_asset_created';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'media_asset_deleted';

-- pages
CREATE TABLE IF NOT EXISTS "pages" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "page_type" "PageType" NOT NULL DEFAULT 'static',
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "excerpt" TEXT,
  "content" TEXT,
  "status" "PageStatus" NOT NULL DEFAULT 'draft',
  "publish_at" TIMESTAMPTZ(6),
  "published_at" TIMESTAMPTZ(6),
  "created_by_id" UUID,
  "updated_by_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_locale_key" ON "pages"("slug", "locale");
CREATE INDEX IF NOT EXISTS "pages_status_publish_at_idx" ON "pages"("status", "publish_at");
CREATE INDEX IF NOT EXISTS "pages_page_type_locale_idx" ON "pages"("page_type", "locale");

-- page_sections
CREATE TABLE IF NOT EXISTS "page_sections" (
  "id" UUID NOT NULL,
  "page_id" UUID NOT NULL,
  "section_key" TEXT NOT NULL,
  "section_type" "PageSectionType" NOT NULL DEFAULT 'content',
  "title" TEXT,
  "content" JSONB NOT NULL DEFAULT '{}',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_visible" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "page_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "page_sections_page_id_section_key_key" ON "page_sections"("page_id", "section_key");
CREATE INDEX IF NOT EXISTS "page_sections_page_id_sort_order_idx" ON "page_sections"("page_id", "sort_order");

-- page_revisions
CREATE TABLE IF NOT EXISTS "page_revisions" (
  "id" UUID NOT NULL,
  "page_id" UUID NOT NULL,
  "version" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT,
  "sections_snapshot" JSONB NOT NULL DEFAULT '[]',
  "created_by_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "page_revisions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "page_revisions_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "page_revisions_page_id_version_key" ON "page_revisions"("page_id", "version");
CREATE INDEX IF NOT EXISTS "page_revisions_page_id_created_at_idx" ON "page_revisions"("page_id", "created_at");

-- seo_metadata
CREATE TABLE IF NOT EXISTS "seo_metadata" (
  "id" UUID NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" UUID NOT NULL,
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "seo_title" TEXT,
  "meta_description" TEXT,
  "meta_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "canonical_url" TEXT,
  "robots" TEXT NOT NULL DEFAULT 'index,follow',
  "og_title" TEXT,
  "og_description" TEXT,
  "og_image_url" TEXT,
  "twitter_card" TEXT NOT NULL DEFAULT 'summary_large_image',
  "twitter_title" TEXT,
  "twitter_description" TEXT,
  "twitter_image_url" TEXT,
  "schema_json_ld" JSONB,
  "hreflang_alternates" JSONB DEFAULT '[]',
  "sitemap_include" BOOLEAN NOT NULL DEFAULT true,
  "sitemap_priority" DECIMAL(2,1),
  "sitemap_changefreq" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "seo_metadata_entity_type_entity_id_locale_key"
  ON "seo_metadata"("entity_type", "entity_id", "locale");

-- media_folders
CREATE TABLE IF NOT EXISTS "media_folders" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "parent_id" UUID,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "media_folders_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "media_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "media_folders"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "media_folders_slug_parent_id_key" ON "media_folders"("slug", "parent_id");

-- media_assets
CREATE TABLE IF NOT EXISTS "media_assets" (
  "id" UUID NOT NULL,
  "folder_id" UUID,
  "file_name" TEXT NOT NULL,
  "original_name" TEXT NOT NULL,
  "storage_path" TEXT NOT NULL,
  "public_url" TEXT,
  "mime_type" TEXT NOT NULL,
  "asset_type" "MediaAssetType" NOT NULL DEFAULT 'other',
  "size_bytes" INTEGER NOT NULL,
  "alt_text" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "usage_count" INTEGER NOT NULL DEFAULT 0,
  "version" INTEGER NOT NULL DEFAULT 1,
  "is_current" BOOLEAN NOT NULL DEFAULT true,
  "replaced_by_id" UUID,
  "uploaded_by_id" UUID,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "media_assets_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "media_folders"("id") ON DELETE SET NULL,
  CONSTRAINT "media_assets_replaced_by_id_fkey" FOREIGN KEY ("replaced_by_id") REFERENCES "media_assets"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "media_assets_folder_id_idx" ON "media_assets"("folder_id");
CREATE INDEX IF NOT EXISTS "media_assets_tags_idx" ON "media_assets" USING GIN ("tags");
CREATE INDEX IF NOT EXISTS "media_assets_asset_type_is_current_idx" ON "media_assets"("asset_type", "is_current");

-- Default media folders
INSERT INTO "media_folders" ("id", "name", "slug", "sort_order", "updated_at")
VALUES
  ('40000000-0000-4000-8000-000000000001', 'General', 'general', 0, NOW()),
  ('40000000-0000-4000-8000-000000000002', 'Notices', 'notices', 1, NOW()),
  ('40000000-0000-4000-8000-000000000003', 'Events', 'events', 2, NOW()),
  ('40000000-0000-4000-8000-000000000004', 'Committees', 'committees', 3, NOW()),
  ('40000000-0000-4000-8000-000000000005', 'Homepage', 'homepage', 4, NOW()),
  ('40000000-0000-4000-8000-000000000006', 'Downloads', 'downloads', 5, NOW())
ON CONFLICT ("id") DO NOTHING;
