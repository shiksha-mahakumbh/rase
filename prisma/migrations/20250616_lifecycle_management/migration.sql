-- Phase 3: Registration Lifecycle Management

-- Enums
CREATE TYPE "CheckInStatus" AS ENUM ('Not Checked In', 'Checked In');
CREATE TYPE "CertificateLifecycleStatus" AS ENUM ('Not Applicable', 'Not Eligible', 'Eligible', 'Issued', 'Revoked');
CREATE TYPE "CertificateType" AS ENUM ('Participation', 'Presentation', 'Volunteer', 'Reviewer', 'Speaker', 'Organizer');
CREATE TYPE "BadgeTemplate" AS ENUM ('Delegate', 'Speaker', 'Volunteer', 'Organizer', 'Student', 'Exhibitor');
CREATE TYPE "ResearchSubmissionStatus" AS ENUM ('Submitted', 'Under Review', 'Accepted', 'Rejected', 'Revision Requested');
CREATE TYPE "CommunicationChannel" AS ENUM ('email', 'sms', 'whatsapp');
CREATE TYPE "CampaignStatus" AS ENUM ('draft', 'sending', 'completed', 'failed');

-- Registration lifecycle columns
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "check_in_status" "CheckInStatus" NOT NULL DEFAULT 'Not Checked In';
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "checked_in_at" TIMESTAMPTZ(6);
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "checked_in_by_user_id" UUID;
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "check_in_location" TEXT;
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "kit_distributed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "kit_distributed_at" TIMESTAMPTZ(6);
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "certificate_eligible" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "certificate_lifecycle_status" "CertificateLifecycleStatus" NOT NULL DEFAULT 'Not Applicable';

CREATE INDEX IF NOT EXISTS "registrations_check_in_status_idx" ON "registrations"("check_in_status");
CREATE INDEX IF NOT EXISTS "registrations_state_idx" ON "registrations"("state");
CREATE INDEX IF NOT EXISTS "registrations_institution_idx" ON "registrations"("institution");

-- Accommodation extension
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "bed_type" TEXT;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "building" TEXT;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "room_number" TEXT;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "bed_number" TEXT;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "room_id" UUID;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "check_in_date" DATE;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "check_out_date" DATE;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "allocated_at" TIMESTAMPTZ(6);
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "allocated_by_user_id" UUID;
ALTER TABLE "accommodation_requests" ADD COLUMN IF NOT EXISTS "accommodation_email_sent_at" TIMESTAMPTZ(6);

CREATE TABLE IF NOT EXISTS "accommodation_rooms" (
    "id" UUID NOT NULL,
    "building" TEXT NOT NULL,
    "room_number" TEXT NOT NULL,
    "bed_number" TEXT,
    "bed_type" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "occupied" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "accommodation_rooms_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "accommodation_rooms_building_room_number_bed_number_key" ON "accommodation_rooms"("building", "room_number", "bed_number");

CREATE TABLE IF NOT EXISTS "check_in_records" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "session_name" TEXT,
    "location" TEXT,
    "recorded_by_user_id" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "recorded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "check_in_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "check_in_records_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "check_in_records_registration_id_recorded_at_idx" ON "check_in_records"("registration_id", "recorded_at");

CREATE TABLE IF NOT EXISTS "session_attendances" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "session_name" TEXT NOT NULL,
    "attended_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recorded_by_user_id" UUID,
    CONSTRAINT "session_attendances_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "session_attendances_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "session_attendances_registration_id_session_name_key" ON "session_attendances"("registration_id", "session_name");

CREATE TABLE IF NOT EXISTS "attendee_certificates" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "certificate_no" TEXT NOT NULL,
    "certificate_type" "CertificateType" NOT NULL,
    "verify_code" TEXT NOT NULL,
    "issued_at" TIMESTAMPTZ(6),
    "issued_by_user_id" UUID,
    "storage_path" TEXT,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "attendee_certificates_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "attendee_certificates_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "attendee_certificates_registration_id_key" ON "attendee_certificates"("registration_id");
CREATE UNIQUE INDEX IF NOT EXISTS "attendee_certificates_certificate_no_key" ON "attendee_certificates"("certificate_no");
CREATE UNIQUE INDEX IF NOT EXISTS "attendee_certificates_verify_code_key" ON "attendee_certificates"("verify_code");

CREATE TABLE IF NOT EXISTS "attendee_badges" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "badge_template" "BadgeTemplate" NOT NULL,
    "generated_at" TIMESTAMPTZ(6),
    "storage_path" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "attendee_badges_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "attendee_badges_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "attendee_badges_registration_id_key" ON "attendee_badges"("registration_id");

CREATE TABLE IF NOT EXISTS "research_submissions" (
    "id" UUID NOT NULL,
    "registration_id" UUID,
    "title" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_email" TEXT NOT NULL,
    "institution" TEXT,
    "abstract_text" TEXT NOT NULL,
    "status" "ResearchSubmissionStatus" NOT NULL DEFAULT 'Submitted',
    "reviewer_user_id" UUID,
    "score" INTEGER,
    "remarks" TEXT,
    "recommendation" TEXT,
    "acceptance_letter_sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "research_submissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "communication_campaigns" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "target_filter" JSONB NOT NULL DEFAULT '{}',
    "subject" TEXT,
    "body_html" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "delivered_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "opened_count" INTEGER NOT NULL DEFAULT 0,
    "clicked_count" INTEGER NOT NULL DEFAULT 0,
    "created_by_user_id" UUID,
    "sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "communication_campaigns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "communication_recipients" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "registration_id" UUID,
    "email" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "communication_recipients_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "communication_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "communication_campaigns"("id") ON DELETE CASCADE
);

-- AuditAction extensions
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'check_in_recorded';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'kit_distributed';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'certificate_eligible';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'certificate_issued';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'badge_generated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'room_allocated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'research_submission_updated';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'communication_campaign_sent';
