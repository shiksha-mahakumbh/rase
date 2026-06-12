-- Phase B: Notice Board, Homepage CMS extensions, Downloads, Settings, Menus, Announcement Bars

-- Extend PageSectionType
ALTER TYPE "PageSectionType" ADD VALUE IF NOT EXISTS 'counter';
ALTER TYPE "PageSectionType" ADD VALUE IF NOT EXISTS 'testimonial';
ALTER TYPE "PageSectionType" ADD VALUE IF NOT EXISTS 'partner';
ALTER TYPE "PageSectionType" ADD VALUE IF NOT EXISTS 'announcement';
ALTER TYPE "PageSectionType" ADD VALUE IF NOT EXISTS 'featured_events';
ALTER TYPE "PageSectionType" ADD VALUE IF NOT EXISTS 'featured_programs';

-- New enums
DO $$ BEGIN CREATE TYPE "NoticeStatus" AS ENUM ('draft', 'scheduled', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "DownloadType" AS ENUM ('brochure', 'report', 'guidelines', 'circular', 'poster', 'presentation', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "DownloadStatus" AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "MenuType" AS ENUM ('header', 'footer', 'quick_links', 'mobile');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "AnnouncementBarType" AS ENUM ('global', 'registration_alert', 'deadline_reminder', 'emergency');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AuditAction extensions
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'notice_created';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'notice_updated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'notice_published';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'notice_deleted';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'download_updated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'settings_updated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'menu_updated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'announcement_bar_updated';

-- Extend downloads table
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "download_type" "DownloadType" NOT NULL DEFAULT 'other';
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "is_current" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "replaced_by_id" UUID;
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "status" "DownloadStatus" NOT NULL DEFAULT 'published';
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMPTZ(6);
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "media_asset_id" UUID;

DO $$ BEGIN
  ALTER TABLE "downloads" ADD CONSTRAINT "downloads_replaced_by_id_fkey"
    FOREIGN KEY ("replaced_by_id") REFERENCES "downloads"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "downloads" ADD CONSTRAINT "downloads_media_asset_id_fkey"
    FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "downloads_status_is_current_expires_at_idx"
  ON "downloads"("status", "is_current", "expires_at");
CREATE INDEX IF NOT EXISTS "downloads_download_type_category_idx"
  ON "downloads"("download_type", "category");
CREATE INDEX IF NOT EXISTS "downloads_tags_idx" ON "downloads" USING GIN ("tags");

-- notice_categories
CREATE TABLE IF NOT EXISTS "notice_categories" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "notice_categories_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "notice_categories_slug_key" ON "notice_categories"("slug");

-- notices
CREATE TABLE IF NOT EXISTS "notices" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category_id" UUID,
  "description" TEXT NOT NULL,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "status" "NoticeStatus" NOT NULL DEFAULT 'draft',
  "is_pinned" BOOLEAN NOT NULL DEFAULT false,
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "publish_at" TIMESTAMPTZ(6),
  "expire_at" TIMESTAMPTZ(6),
  "published_at" TIMESTAMPTZ(6),
  "created_by_id" UUID,
  "updated_by_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "notices_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notices_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "notice_categories"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "notices_slug_locale_key" ON "notices"("slug", "locale");
CREATE INDEX IF NOT EXISTS "notices_status_publish_at_expire_at_idx" ON "notices"("status", "publish_at", "expire_at");
CREATE INDEX IF NOT EXISTS "notices_is_pinned_priority_idx" ON "notices"("is_pinned", "priority");

-- notice_attachments
CREATE TABLE IF NOT EXISTS "notice_attachments" (
  "id" UUID NOT NULL,
  "notice_id" UUID NOT NULL,
  "media_asset_id" UUID,
  "file_name" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL DEFAULT 0,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notice_attachments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notice_attachments_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "notices"("id") ON DELETE CASCADE,
  CONSTRAINT "notice_attachments_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "notice_attachments_notice_id_sort_order_idx" ON "notice_attachments"("notice_id", "sort_order");

-- site_settings
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" UUID NOT NULL,
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "organization_name" TEXT,
  "tagline" TEXT,
  "logo_url" TEXT,
  "favicon_url" TEXT,
  "contact_email" TEXT,
  "support_email" TEXT,
  "phone_numbers" JSONB NOT NULL DEFAULT '[]',
  "office_addresses" JSONB NOT NULL DEFAULT '[]',
  "social_links" JSONB NOT NULL DEFAULT '{}',
  "copyright_text" TEXT,
  "footer_content" JSONB,
  "registration_open" BOOLEAN NOT NULL DEFAULT true,
  "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
  "extra" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "site_settings_locale_key" ON "site_settings"("locale");

-- menus
CREATE TABLE IF NOT EXISTS "menus" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "menu_type" "MenuType" NOT NULL,
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "menus_slug_locale_key" ON "menus"("slug", "locale");

-- menu_items
CREATE TABLE IF NOT EXISTS "menu_items" (
  "id" UUID NOT NULL,
  "menu_id" UUID NOT NULL,
  "parent_id" UUID,
  "label" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "is_external" BOOLEAN NOT NULL DEFAULT false,
  "open_in_new_tab" BOOLEAN NOT NULL DEFAULT false,
  "icon" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_visible" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE,
  CONSTRAINT "menu_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menu_items"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "menu_items_menu_id_sort_order_idx" ON "menu_items"("menu_id", "sort_order");
CREATE INDEX IF NOT EXISTS "menu_items_parent_id_idx" ON "menu_items"("parent_id");

-- announcement_bars
CREATE TABLE IF NOT EXISTS "announcement_bars" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "bar_type" "AnnouncementBarType" NOT NULL DEFAULT 'global',
  "color_theme" TEXT NOT NULL DEFAULT 'primary',
  "cta_label" TEXT,
  "cta_url" TEXT,
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "is_dismissible" BOOLEAN NOT NULL DEFAULT true,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "starts_at" TIMESTAMPTZ(6),
  "ends_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "announcement_bars_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "announcement_bars_is_active_starts_at_ends_at_idx"
  ON "announcement_bars"("is_active", "starts_at", "ends_at");
CREATE INDEX IF NOT EXISTS "announcement_bars_bar_type_locale_idx"
  ON "announcement_bars"("bar_type", "locale");

-- Seed: notice categories
INSERT INTO "notice_categories" ("id", "name", "slug", "sort_order", "updated_at")
VALUES
  ('50000000-0000-4000-8000-000000000001', 'General', 'general', 0, NOW()),
  ('50000000-0000-4000-8000-000000000002', 'Circulars', 'circulars', 1, NOW()),
  ('50000000-0000-4000-8000-000000000003', 'Events', 'events', 2, NOW()),
  ('50000000-0000-4000-8000-000000000004', 'Registration', 'registration', 3, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Seed: default site settings (en)
INSERT INTO "site_settings" ("id", "locale", "organization_name", "tagline", "registration_open", "maintenance_mode", "updated_at")
VALUES (
  '50000000-0000-4000-8000-000000000010',
  'en',
  'Department of Holistic Education (DHE)',
  'Shiksha Mahakumbh Abhiyan',
  true,
  false,
  NOW()
)
ON CONFLICT ("id") DO NOTHING;

-- Seed: default menus
INSERT INTO "menus" ("id", "name", "slug", "menu_type", "locale", "updated_at")
VALUES
  ('50000000-0000-4000-8000-000000000020', 'Header Navigation', 'header', 'header', 'en', NOW()),
  ('50000000-0000-4000-8000-000000000021', 'Footer Navigation', 'footer', 'footer', 'en', NOW()),
  ('50000000-0000-4000-8000-000000000022', 'Quick Links', 'quick-links', 'quick_links', 'en', NOW())
ON CONFLICT ("id") DO NOTHING;
