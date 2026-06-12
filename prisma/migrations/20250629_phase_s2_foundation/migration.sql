-- Phase S2: FAQ module, Media Albums, PageType extensions

ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'article';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'department';

DO $$ BEGIN CREATE TYPE "AlbumType" AS ENUM ('gallery', 'homepage', 'edition', 'press');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "FaqStatus" AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "faq_categories" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "faq_categories_slug_locale_key" ON "faq_categories"("slug", "locale");

CREATE TABLE IF NOT EXISTS "faqs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "category_id" UUID,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "status" "FaqStatus" NOT NULL DEFAULT 'draft',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "faqs_status_locale_is_featured_idx" ON "faqs"("status", "locale", "is_featured");
CREATE INDEX IF NOT EXISTS "faqs_category_id_sort_order_idx" ON "faqs"("category_id", "sort_order");

DO $$ BEGIN
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_fkey"
    FOREIGN KEY ("category_id") REFERENCES "faq_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "media_albums" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "album_type" "AlbumType" NOT NULL DEFAULT 'gallery',
  "locale" "ContentLocale" NOT NULL DEFAULT 'en',
  "edition" TEXT,
  "year" INTEGER,
  "cover_asset_id" UUID,
  "status" "PageStatus" NOT NULL DEFAULT 'draft',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "media_albums_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "media_albums_slug_locale_key" ON "media_albums"("slug", "locale");
CREATE INDEX IF NOT EXISTS "media_albums_album_type_status_idx" ON "media_albums"("album_type", "status");

CREATE TABLE IF NOT EXISTS "media_album_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "album_id" UUID NOT NULL,
  "media_asset_id" UUID,
  "image_url" TEXT,
  "caption" TEXT,
  "alt_text" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "media_album_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "media_album_items_album_id_sort_order_idx" ON "media_album_items"("album_id", "sort_order");

DO $$ BEGIN
  ALTER TABLE "media_album_items" ADD CONSTRAINT "media_album_items_album_id_fkey"
    FOREIGN KEY ("album_id") REFERENCES "media_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "media_album_items" ADD CONSTRAINT "media_album_items_media_asset_id_fkey"
    FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
