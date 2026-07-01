-- Phase 3 database integrity: FK behavior, admin list indexes, retention support

-- Email log user FK: preserve delivery history when admin user is removed
ALTER TABLE "email_logs" DROP CONSTRAINT IF EXISTS "email_logs_user_id_fkey";
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Registration admin list / soft-delete filters
CREATE INDEX IF NOT EXISTS "registrations_deleted_at_created_at_idx"
  ON "registrations" ("deleted_at", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "registrations_type_status_created_at_idx"
  ON "registrations" ("registration_type", "registration_status", "created_at" DESC);
