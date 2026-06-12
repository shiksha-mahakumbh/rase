-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('Yes', 'No');

-- CreateEnum
CREATE TYPE "VidyaBhartiStatus" AS ENUM ('Vidya Bharti', 'Non Vidya Bharti');

-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('Conclave', 'Delegate', 'Exhibition', 'Accommodation', 'Awards', 'Best Practices', 'Olympiad', 'Talent', 'Volunteer', 'NGO', 'Participant', 'Legacy Other');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('Pending', 'Submitted', 'Verified', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending Payment', 'Paid', 'Failed', 'Submitted', 'Not Required');

-- CreateEnum
CREATE TYPE "AccommodationStatus" AS ENUM ('Not Required', 'Requested', 'Confirmed', 'Allocated');

-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('sent', 'failed', 'pending', 'skipped');

-- CreateEnum
CREATE TYPE "EmailLogStatus" AS ENUM ('queued', 'sending', 'sent', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('registration_created', 'registration_updated', 'registration_status_changed', 'payment_created', 'payment_captured', 'payment_failed', 'payment_refunded', 'file_uploaded', 'file_deleted', 'email_sent', 'email_failed', 'admin_login', 'admin_action', 'migration_import', 'system_event');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('new', 'in_progress', 'replied', 'closed', 'spam');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('new', 'reviewed', 'replied', 'archived');

-- CreateEnum
CREATE TYPE "CommitteeCategory" AS ENUM ('National_Advisory_Board', 'Patrons', 'Chief_Patrons', 'Organizing_Committee', 'Academic_Committee', 'Technical_Committee', 'Research_Committee', 'Volunteer_Committee', 'Media_Committee', 'Hospitality_Committee', 'Other');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'document', 'press_release', 'album');

-- CreateEnum
CREATE TYPE "StorageBucket" AS ENUM ('registrations', 'awards', 'best_practices', 'brochures', 'gallery', 'committee', 'documents', 'receipts', 'exports');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('email', 'in_app', 'sms');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMPTZ(6),
    "last_login_ip" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_counters" (
    "id" UUID NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT 'SMK2026',
    "last_number" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "registration_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" UUID NOT NULL,
    "registration_id" TEXT NOT NULL,
    "registration_type" "RegistrationType" NOT NULL,
    "registration_status" "RegistrationStatus" NOT NULL DEFAULT 'Submitted',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'Not Required',
    "accommodation_status" "AccommodationStatus" NOT NULL DEFAULT 'Not Required',
    "email_delivery_status" "EmailDeliveryStatus",
    "full_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "designation" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "whatsapp_number" TEXT,
    "vidya_bharti" "VidyaBhartiStatus" NOT NULL,
    "accommodation_required" "YesNo" NOT NULL DEFAULT 'No',
    "accommodation_date" TEXT,
    "accommodation_type" TEXT,
    "participant_category" TEXT,
    "registration_fee" DECIMAL(12,2),
    "utr_number" TEXT,
    "transaction_id" TEXT,
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "firebase_master_doc_id" TEXT,
    "firebase_type_doc_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'supabase',
    "submitted_ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_status_history" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "from_status" "RegistrationStatus",
    "to_status" "RegistrationStatus" NOT NULL,
    "changed_by_user_id" UUID,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conclave_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "conclave_selection" TEXT NOT NULL,
    "participation_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "conclave_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delegate_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "delegate_category" TEXT NOT NULL,
    "pan_number" TEXT,
    "cheque_number" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "delegate_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibition_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "project_title" TEXT,
    "project_summary" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "exhibition_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "award_category" TEXT NOT NULL,
    "nomination_details" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "award_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_practice_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "area_of_work" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "word_count" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "best_practice_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olympiad_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "olympiad_track" TEXT NOT NULL,
    "school_name" TEXT,
    "grade" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "olympiad_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "talent_category" TEXT NOT NULL,
    "performance_title" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "talent_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_applications" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "volunteer_role" TEXT NOT NULL,
    "availability" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "volunteer_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ngo_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "ngo_name" TEXT NOT NULL,
    "registration_number" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "ngo_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant_registrations" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "participant_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "participant_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_requests" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "status" "AccommodationStatus" NOT NULL DEFAULT 'Requested',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "accommodation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" UUID NOT NULL,
    "registration_id" UUID,
    "bucket" "StorageBucket" NOT NULL,
    "storage_path" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "content_type" TEXT,
    "size_bytes" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "signed_url" TEXT,
    "uploaded_by_id" UUID,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_records" (
    "id" UUID NOT NULL,
    "registration_id" UUID NOT NULL,
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "razorpay_signature" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL,
    "webhook_event_id" TEXT,
    "is_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "refund_id" TEXT,
    "refund_status" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "payment_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actor_user_id" UUID,
    "registration_id" UUID,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" UUID NOT NULL,
    "registration_id" UUID,
    "to_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT,
    "status" "EmailLogStatus" NOT NULL DEFAULT 'queued',
    "provider" TEXT NOT NULL DEFAULT 'brevo',
    "provider_msg_id" TEXT,
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "committees" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "CommitteeCategory" NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "committees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "committee_members" (
    "id" UUID NOT NULL,
    "committee_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "designation" TEXT,
    "institution" TEXT,
    "photo_url" TEXT,
    "bio" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "committee_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMPTZ(6),
    "location" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_media" (
    "id" UUID NOT NULL,
    "event_id" UUID,
    "media_type" "MediaType" NOT NULL,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "storage_path" TEXT,
    "category" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "downloads" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "storage_path" TEXT,
    "category" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'new',
    "admin_reply" TEXT,
    "replied_by_id" UUID,
    "replied_at" TIMESTAMPTZ(6),
    "submitted_ip" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" UUID NOT NULL,
    "full_name" TEXT,
    "email" TEXT,
    "rating" INTEGER,
    "category" TEXT,
    "message" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'new',
    "admin_reply" TEXT,
    "replied_by_id" UUID,
    "replied_at" TIMESTAMPTZ(6),
    "submitted_ip" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "publish_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaker_profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "designation" TEXT,
    "institution" TEXT,
    "bio" TEXT,
    "photo_url" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "speaker_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "website" TEXT,
    "tier" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "website" TEXT,
    "category" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_analytics" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "daily_count" INTEGER NOT NULL DEFAULT 0,
    "total_count" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "visitor_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_user_id_key" ON "users"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_auth_user_id_idx" ON "users"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "registration_counters_prefix_key" ON "registration_counters"("prefix");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_registration_id_key" ON "registrations"("registration_id");

-- CreateIndex
CREATE INDEX "registrations_registration_type_idx" ON "registrations"("registration_type");

-- CreateIndex
CREATE INDEX "registrations_registration_status_idx" ON "registrations"("registration_status");

-- CreateIndex
CREATE INDEX "registrations_payment_status_idx" ON "registrations"("payment_status");

-- CreateIndex
CREATE INDEX "registrations_email_idx" ON "registrations"("email");

-- CreateIndex
CREATE INDEX "registrations_created_at_idx" ON "registrations"("created_at");

-- CreateIndex
CREATE INDEX "registrations_deleted_at_idx" ON "registrations"("deleted_at");

-- CreateIndex
CREATE INDEX "registration_status_history_registration_id_created_at_idx" ON "registration_status_history"("registration_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "conclave_registrations_registration_id_key" ON "conclave_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "delegate_registrations_registration_id_key" ON "delegate_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_registrations_registration_id_key" ON "exhibition_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "award_registrations_registration_id_key" ON "award_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "best_practice_registrations_registration_id_key" ON "best_practice_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "olympiad_registrations_registration_id_key" ON "olympiad_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "talent_registrations_registration_id_key" ON "talent_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_applications_registration_id_key" ON "volunteer_applications"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "ngo_registrations_registration_id_key" ON "ngo_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "participant_registrations_registration_id_key" ON "participant_registrations"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "accommodation_requests_registration_id_key" ON "accommodation_requests"("registration_id");

-- CreateIndex
CREATE INDEX "uploaded_files_registration_id_idx" ON "uploaded_files"("registration_id");

-- CreateIndex
CREATE INDEX "uploaded_files_bucket_storage_path_idx" ON "uploaded_files"("bucket", "storage_path");

-- CreateIndex
CREATE UNIQUE INDEX "payment_records_razorpay_payment_id_key" ON "payment_records"("razorpay_payment_id");

-- CreateIndex
CREATE INDEX "payment_records_registration_id_idx" ON "payment_records"("registration_id");

-- CreateIndex
CREATE INDEX "payment_records_razorpay_order_id_idx" ON "payment_records"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_registration_id_idx" ON "audit_logs"("registration_id");

-- CreateIndex
CREATE INDEX "email_logs_status_created_at_idx" ON "email_logs"("status", "created_at");

-- CreateIndex
CREATE INDEX "email_logs_registration_id_idx" ON "email_logs"("registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "committees_slug_key" ON "committees"("slug");

-- CreateIndex
CREATE INDEX "committees_category_sort_order_idx" ON "committees"("category", "sort_order");

-- CreateIndex
CREATE INDEX "committee_members_committee_id_sort_order_idx" ON "committee_members"("committee_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "event_media_media_type_is_featured_idx" ON "event_media"("media_type", "is_featured");

-- CreateIndex
CREATE INDEX "contact_messages_status_created_at_idx" ON "contact_messages"("status", "created_at");

-- CreateIndex
CREATE INDEX "feedback_status_created_at_idx" ON "feedback"("status", "created_at");

-- CreateIndex
CREATE INDEX "announcements_is_published_publish_at_idx" ON "announcements"("is_published", "publish_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_analytics_date_key" ON "visitor_analytics"("date");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_status_history" ADD CONSTRAINT "registration_status_history_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conclave_registrations" ADD CONSTRAINT "conclave_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delegate_registrations" ADD CONSTRAINT "delegate_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_registrations" ADD CONSTRAINT "exhibition_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_registrations" ADD CONSTRAINT "award_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_practice_registrations" ADD CONSTRAINT "best_practice_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olympiad_registrations" ADD CONSTRAINT "olympiad_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_registrations" ADD CONSTRAINT "talent_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_applications" ADD CONSTRAINT "volunteer_applications_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ngo_registrations" ADD CONSTRAINT "ngo_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant_registrations" ADD CONSTRAINT "participant_registrations_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_requests" ADD CONSTRAINT "accommodation_requests_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_media" ADD CONSTRAINT "event_media_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_replied_by_id_fkey" FOREIGN KEY ("replied_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_replied_by_id_fkey" FOREIGN KEY ("replied_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
