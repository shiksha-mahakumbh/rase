-- Covering indexes for foreign keys (Prisma audit performance fix)
-- Idempotent: CREATE INDEX IF NOT EXISTS

CREATE INDEX IF NOT EXISTS "webhook_events_payment_record_id_idx" ON "webhook_events"("payment_record_id");
CREATE INDEX IF NOT EXISTS "audit_logs_actor_user_id_idx" ON "audit_logs"("actor_user_id");
CREATE INDEX IF NOT EXISTS "email_logs_user_id_idx" ON "email_logs"("user_id");
CREATE INDEX IF NOT EXISTS "committee_members_media_asset_id_idx" ON "committee_members"("media_asset_id");
CREATE INDEX IF NOT EXISTS "events_brochure_download_id_idx" ON "events"("brochure_download_id");
CREATE INDEX IF NOT EXISTS "downloads_media_asset_id_idx" ON "downloads"("media_asset_id");
CREATE INDEX IF NOT EXISTS "downloads_replaced_by_id_idx" ON "downloads"("replaced_by_id");
CREATE INDEX IF NOT EXISTS "contact_messages_replied_by_id_idx" ON "contact_messages"("replied_by_id");
CREATE INDEX IF NOT EXISTS "feedback_replied_by_id_idx" ON "feedback"("replied_by_id");
CREATE INDEX IF NOT EXISTS "media_assets_replaced_by_id_idx" ON "media_assets"("replaced_by_id");
CREATE INDEX IF NOT EXISTS "notices_category_id_idx" ON "notices"("category_id");
CREATE INDEX IF NOT EXISTS "notice_attachments_media_asset_id_idx" ON "notice_attachments"("media_asset_id");
CREATE INDEX IF NOT EXISTS "visitor_page_views_session_id_idx" ON "visitor_page_views"("session_id");
CREATE INDEX IF NOT EXISTS "visitor_events_session_id_idx" ON "visitor_events"("session_id");
CREATE INDEX IF NOT EXISTS "media_album_items_media_asset_id_idx" ON "media_album_items"("media_asset_id");
