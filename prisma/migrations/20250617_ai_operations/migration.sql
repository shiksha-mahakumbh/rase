-- Phase 4: AI Operations, Executive Dashboard & Automation

-- Enums
CREATE TYPE "WorkflowTrigger" AS ENUM ('registration_complete', 'payment_complete', 'accommodation_assigned', 'paper_accepted', 'certificate_available');
CREATE TYPE "WorkflowChannel" AS ENUM ('email', 'whatsapp', 'both');
CREATE TYPE "EventSessionType" AS ENUM ('conclave', 'workshop', 'paper_presentation', 'cultural', 'other');
CREATE TYPE "DocumentLetterType" AS ENUM ('invitation_letter', 'acceptance_letter', 'participation_letter', 'volunteer_letter', 'appreciation_letter');
CREATE TYPE "HonorariumStatus" AS ENUM ('not_applicable', 'pending', 'approved', 'paid');
CREATE TYPE "WhatsAppMessageStatus" AS ENUM ('queued', 'sent', 'delivered', 'failed', 'skipped');
CREATE TYPE "AlertSeverity" AS ENUM ('info', 'warning', 'critical');

-- Extend AuditAction
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'workflow_triggered';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'alumni_converted';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'whatsapp_sent';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'whatsapp_failed';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'document_generated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'session_attendance_recorded';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'volunteer_assigned';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'ai_insights_generated';

-- Session attendance link to catalog
ALTER TABLE "session_attendances" ADD COLUMN IF NOT EXISTS "event_session_id" UUID;
CREATE INDEX IF NOT EXISTS "session_attendances_event_session_id_idx" ON "session_attendances"("event_session_id");

CREATE TABLE IF NOT EXISTS "event_sessions" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "session_type" "EventSessionType" NOT NULL DEFAULT 'other',
    "description" TEXT,
    "venue" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "speaker_name" TEXT,
    "speaker_profile_id" UUID,
    "qr_token" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    CONSTRAINT "event_sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "event_sessions_slug_key" ON "event_sessions"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "event_sessions_qr_token_key" ON "event_sessions"("qr_token");
CREATE INDEX IF NOT EXISTS "event_sessions_start_at_idx" ON "event_sessions"("start_at");

ALTER TABLE "session_attendances" ADD CONSTRAINT "session_attendances_event_session_id_fkey"
    FOREIGN KEY ("event_session_id") REFERENCES "event_sessions"("id") ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS "volunteer_assignments" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "department" TEXT NOT NULL,
    "shift_start" TIMESTAMPTZ(6),
    "shift_end" TIMESTAMPTZ(6),
    "supervisor_name" TEXT,
    "supervisor_phone" TEXT,
    "attended_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "volunteer_assignments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "volunteer_assignments_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "volunteer_assignments_registration_id_key" ON "volunteer_assignments"("registration_id");

CREATE TABLE IF NOT EXISTS "speaker_operations" (
    "id" UUID NOT NULL,
    "registration_id" UUID,
    "speaker_profile_id" UUID,
    "event_session_id" UUID,
    "travel_status" TEXT,
    "accommodation_status" TEXT,
    "honorarium_status" "HonorariumStatus" NOT NULL DEFAULT 'not_applicable',
    "honorarium_amount" DECIMAL(12,2),
    "schedule_notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "speaker_operations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "speaker_operations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL,
    CONSTRAINT "speaker_operations_event_session_id_fkey" FOREIGN KEY ("event_session_id") REFERENCES "event_sessions"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "speaker_operations_registration_id_key" ON "speaker_operations"("registration_id");

CREATE TABLE IF NOT EXISTS "alumni_records" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "event_edition" TEXT NOT NULL DEFAULT 'SMK2026',
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "institution" TEXT,
    "state" TEXT,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "research_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "participation_history" JSONB NOT NULL DEFAULT '[]',
    "converted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "alumni_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "alumni_records_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "alumni_records_registration_id_key" ON "alumni_records"("registration_id");

CREATE TABLE IF NOT EXISTS "workflow_rules" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "trigger" "WorkflowTrigger" NOT NULL,
    "channel" "WorkflowChannel" NOT NULL DEFAULT 'email',
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "template_subject" TEXT,
    "template_body" TEXT,
    "config" JSONB NOT NULL DEFAULT '{}',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "workflow_rules_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "workflow_rules_trigger_name_key" ON "workflow_rules"("trigger", "name");

CREATE TABLE IF NOT EXISTS "ai_insight_snapshots" (
    "id" UUID NOT NULL,
    "generated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insights" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_insight_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "whatsapp_message_logs" (
    "id" UUID NOT NULL,
    "registration_id" UUID,
    "phone" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "WhatsAppMessageStatus" NOT NULL DEFAULT 'queued',
    "provider_message_id" TEXT,
    "error_message" TEXT,
    "sent_at" TIMESTAMPTZ(6),
    "delivered_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "whatsapp_message_logs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "whatsapp_message_logs_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "generated_documents" (
    "id" UUID NOT NULL,
    "document_type" "DocumentLetterType" NOT NULL,
    "registration_id" UUID,
    "title" TEXT NOT NULL,
    "recipient_name" TEXT,
    "storage_path" TEXT,
    "bulk_batch_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "generated_documents_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "generated_documents_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL
);

-- Default workflow rules
INSERT INTO "workflow_rules" ("id", "name", "trigger", "channel", "is_enabled", "template_subject", "template_body", "sort_order", "updated_at")
SELECT gen_random_uuid(), 'Welcome Email', 'registration_complete', 'email', true,
    'Welcome to Shiksha Mahakumbh 2026',
    '<p>Dear {{fullName}},</p><p>Your registration ({{registrationId}}) is confirmed. We look forward to seeing you at the event.</p>',
    1, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "workflow_rules" WHERE "trigger" = 'registration_complete' AND "name" = 'Welcome Email');

INSERT INTO "workflow_rules" ("id", "name", "trigger", "channel", "is_enabled", "template_subject", "template_body", "sort_order", "updated_at")
SELECT gen_random_uuid(), 'Payment Receipt + QR', 'payment_complete', 'both', true,
    'Payment Confirmed — Shiksha Mahakumbh',
    '<p>Dear {{fullName}},</p><p>Payment received for {{registrationId}}. Your receipt and QR code are ready.</p>',
    2, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "workflow_rules" WHERE "trigger" = 'payment_complete' AND "name" = 'Payment Receipt + QR');

INSERT INTO "workflow_rules" ("id", "name", "trigger", "channel", "is_enabled", "template_subject", "template_body", "sort_order", "updated_at")
SELECT gen_random_uuid(), 'Room Allocation Details', 'accommodation_assigned', 'both', true,
    'Your Accommodation — Shiksha Mahakumbh',
    '<p>Dear {{fullName}},</p><p>Your room has been assigned: {{building}} / {{roomNumber}}.</p>',
    3, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "workflow_rules" WHERE "trigger" = 'accommodation_assigned' AND "name" = 'Room Allocation Details');

INSERT INTO "workflow_rules" ("id", "name", "trigger", "channel", "is_enabled", "template_subject", "template_body", "sort_order", "updated_at")
SELECT gen_random_uuid(), 'Paper Acceptance Letter', 'paper_accepted', 'email', true,
    'Paper Accepted — Shiksha Mahakumbh',
    '<p>Dear {{authorName}},</p><p>Congratulations! Your paper "{{title}}" has been accepted.</p>',
    4, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "workflow_rules" WHERE "trigger" = 'paper_accepted' AND "name" = 'Paper Acceptance Letter');

INSERT INTO "workflow_rules" ("id", "name", "trigger", "channel", "is_enabled", "template_subject", "template_body", "sort_order", "updated_at")
SELECT gen_random_uuid(), 'Certificate Available', 'certificate_available', 'both', true,
    'Your Certificate is Ready',
    '<p>Dear {{fullName}},</p><p>Your certificate is available. Verify at {{certificateUrl}}</p>',
    5, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "workflow_rules" WHERE "trigger" = 'certificate_available' AND "name" = 'Certificate Available');
