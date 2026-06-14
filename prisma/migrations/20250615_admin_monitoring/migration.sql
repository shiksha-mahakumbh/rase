-- Admin monitoring: receipt/QR tracking on registrations
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "receipt_generated_at" TIMESTAMPTZ(6);
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "receipt_sent_at" TIMESTAMPTZ(6);
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "receipt_downloaded_at" TIMESTAMPTZ(6);
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "qr_generated_at" TIMESTAMPTZ(6);
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "qr_storage_path" TEXT;
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "qr_sent_at" TIMESTAMPTZ(6);

-- Webhook retry tracking
ALTER TABLE "webhook_events" ADD COLUMN IF NOT EXISTS "retry_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "webhook_events" ADD COLUMN IF NOT EXISTS "last_processed_at" TIMESTAMPTZ(6);

-- AuditAction enum extensions
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'email_resent';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'receipt_generated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'qr_generated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'payment_verified';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'payment_recovered';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'webhook_retried';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'order_created';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'payment_initiated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'registration_saved';
