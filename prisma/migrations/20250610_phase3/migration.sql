-- Phase 3 schema extensions

-- AlterEnum AuditAction
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'registration_deleted';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'payment_completed';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'committee_member_added';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'committee_member_removed';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'event_created';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'event_updated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'admin_logout';

-- New enums
DO $$ BEGIN
  CREATE TYPE "EventStatus" AS ENUM ('draft', 'published', 'unpublished', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "NewsletterStatus" AS ENUM ('subscribed', 'unsubscribed', 'bounced');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- StorageBucket extensions
ALTER TYPE "StorageBucket" ADD VALUE IF NOT EXISTS 'media';
ALTER TYPE "StorageBucket" ADD VALUE IF NOT EXISTS 'downloads';

-- registration_counters year column
ALTER TABLE "registration_counters" ADD COLUMN IF NOT EXISTS "year" INTEGER NOT NULL DEFAULT 2026;
CREATE UNIQUE INDEX IF NOT EXISTS "registration_counters_year_key" ON "registration_counters"("year");

-- committee_members is_active
ALTER TABLE "committee_members" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;

-- events extensions
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "venue" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "banner_url" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "status" "EventStatus" NOT NULL DEFAULT 'draft';
CREATE INDEX IF NOT EXISTS "events_status_event_date_idx" ON "events"("status", "event_date");

-- downloads download_count
ALTER TABLE "downloads" ADD COLUMN IF NOT EXISTS "download_count" INTEGER NOT NULL DEFAULT 0;

-- webhook_events
CREATE TABLE IF NOT EXISTS "webhook_events" (
  "id" UUID NOT NULL,
  "payment_record_id" UUID,
  "event_type" TEXT NOT NULL,
  "razorpay_event_id" TEXT,
  "payload" JSONB NOT NULL DEFAULT '{}',
  "signature_valid" BOOLEAN NOT NULL DEFAULT false,
  "processed" BOOLEAN NOT NULL DEFAULT false,
  "error_message" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "webhook_events_razorpay_event_id_key" ON "webhook_events"("razorpay_event_id");
CREATE INDEX IF NOT EXISTS "webhook_events_event_type_created_at_idx" ON "webhook_events"("event_type", "created_at");

-- newsletter_subscriptions
CREATE TABLE IF NOT EXISTS "newsletter_subscriptions" (
  "id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "full_name" TEXT,
  "status" "NewsletterStatus" NOT NULL DEFAULT 'subscribed',
  "source" TEXT DEFAULT 'website',
  "subscribed_ip" TEXT,
  "unsubscribed_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  "deleted_at" TIMESTAMPTZ(6),
  CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscriptions_email_key" ON "newsletter_subscriptions"("email");
CREATE INDEX IF NOT EXISTS "newsletter_subscriptions_status_created_at_idx" ON "newsletter_subscriptions"("status", "created_at");
