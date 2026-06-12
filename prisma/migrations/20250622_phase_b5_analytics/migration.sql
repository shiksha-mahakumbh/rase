-- Phase B.5: Visitor Intelligence & Analytics

DO $$ BEGIN CREATE TYPE "DeviceType" AS ENUM ('desktop', 'mobile', 'tablet', 'bot', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "PageCategory" AS ENUM (
  'homepage', 'registration', 'conclave', 'event', 'download',
  'noticeboard', 'media', 'committee', 'press', 'other'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'visitor_tracked';

-- Extend visitor_analytics rollup
ALTER TABLE "visitor_analytics" ADD COLUMN IF NOT EXISTS "unique_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "visitor_analytics" ADD COLUMN IF NOT EXISTS "returning_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "visitor_analytics" ADD COLUMN IF NOT EXISTS "bot_filtered" INTEGER NOT NULL DEFAULT 0;

-- visitor_sessions
CREATE TABLE IF NOT EXISTS "visitor_sessions" (
  "id" UUID NOT NULL,
  "session_id" TEXT NOT NULL,
  "visitor_id" TEXT NOT NULL,
  "is_returning" BOOLEAN NOT NULL DEFAULT false,
  "is_bot" BOOLEAN NOT NULL DEFAULT false,
  "ip_hash" TEXT,
  "user_agent" TEXT,
  "referrer" TEXT,
  "landing_path" TEXT NOT NULL,
  "last_path" TEXT,
  "page_view_count" INTEGER NOT NULL DEFAULT 1,
  "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_active_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ended_at" TIMESTAMPTZ(6),
  CONSTRAINT "visitor_sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "visitor_sessions_session_id_key" ON "visitor_sessions"("session_id");
CREATE INDEX IF NOT EXISTS "visitor_sessions_visitor_id_idx" ON "visitor_sessions"("visitor_id");
CREATE INDEX IF NOT EXISTS "visitor_sessions_started_at_idx" ON "visitor_sessions"("started_at");
CREATE INDEX IF NOT EXISTS "visitor_sessions_last_active_at_idx" ON "visitor_sessions"("last_active_at");
CREATE INDEX IF NOT EXISTS "visitor_sessions_is_bot_started_at_idx" ON "visitor_sessions"("is_bot", "started_at");

-- visitor_page_views
CREATE TABLE IF NOT EXISTS "visitor_page_views" (
  "id" UUID NOT NULL,
  "session_id" UUID NOT NULL,
  "path" TEXT NOT NULL,
  "page_category" "PageCategory" NOT NULL DEFAULT 'other',
  "title" TEXT,
  "referrer" TEXT,
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "utm_term" TEXT,
  "utm_content" TEXT,
  "duration_ms" INTEGER,
  "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "visitor_page_views_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "visitor_page_views_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "visitor_sessions"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "visitor_page_views_path_idx" ON "visitor_page_views"("path");
CREATE INDEX IF NOT EXISTS "visitor_page_views_page_category_viewed_at_idx" ON "visitor_page_views"("page_category", "viewed_at");
CREATE INDEX IF NOT EXISTS "visitor_page_views_viewed_at_idx" ON "visitor_page_views"("viewed_at");

-- visitor_events
CREATE TABLE IF NOT EXISTS "visitor_events" (
  "id" UUID NOT NULL,
  "session_id" UUID NOT NULL,
  "event_type" TEXT NOT NULL,
  "event_name" TEXT NOT NULL,
  "path" TEXT,
  "entity_type" TEXT,
  "entity_id" UUID,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "visitor_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "visitor_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "visitor_sessions"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "visitor_events_event_type_occurred_at_idx" ON "visitor_events"("event_type", "occurred_at");
CREATE INDEX IF NOT EXISTS "visitor_events_entity_type_entity_id_idx" ON "visitor_events"("entity_type", "entity_id");

-- visitor_devices
CREATE TABLE IF NOT EXISTS "visitor_devices" (
  "id" UUID NOT NULL,
  "session_id" UUID NOT NULL,
  "device_type" "DeviceType" NOT NULL DEFAULT 'unknown',
  "browser" TEXT,
  "browser_version" TEXT,
  "os" TEXT,
  "os_version" TEXT,
  "screen_width" INTEGER,
  "screen_height" INTEGER,
  CONSTRAINT "visitor_devices_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "visitor_devices_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "visitor_sessions"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "visitor_devices_session_id_key" ON "visitor_devices"("session_id");
CREATE INDEX IF NOT EXISTS "visitor_devices_device_type_idx" ON "visitor_devices"("device_type");

-- visitor_locations
CREATE TABLE IF NOT EXISTS "visitor_locations" (
  "id" UUID NOT NULL,
  "session_id" UUID NOT NULL,
  "country" TEXT,
  "country_code" TEXT,
  "state" TEXT,
  "city" TEXT,
  CONSTRAINT "visitor_locations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "visitor_locations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "visitor_sessions"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "visitor_locations_session_id_key" ON "visitor_locations"("session_id");
CREATE INDEX IF NOT EXISTS "visitor_locations_country_code_idx" ON "visitor_locations"("country_code");
CREATE INDEX IF NOT EXISTS "visitor_locations_country_state_idx" ON "visitor_locations"("country", "state");

-- traffic_sources
CREATE TABLE IF NOT EXISTS "traffic_sources" (
  "id" UUID NOT NULL,
  "session_id" UUID NOT NULL,
  "source" TEXT,
  "medium" TEXT,
  "campaign" TEXT,
  "term" TEXT,
  "content" TEXT,
  "referrer_domain" TEXT,
  CONSTRAINT "traffic_sources_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "traffic_sources_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "visitor_sessions"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "traffic_sources_session_id_key" ON "traffic_sources"("session_id");
CREATE INDEX IF NOT EXISTS "traffic_sources_source_medium_idx" ON "traffic_sources"("source", "medium");
