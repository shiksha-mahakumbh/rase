-- Remaining FK covering indexes (part 2)
CREATE INDEX IF NOT EXISTS "event_media_event_id_idx" ON "event_media"("event_id");
CREATE INDEX IF NOT EXISTS "event_media_media_asset_id_idx" ON "event_media"("media_asset_id");
CREATE INDEX IF NOT EXISTS "generated_documents_registration_id_idx" ON "generated_documents"("registration_id");
CREATE INDEX IF NOT EXISTS "partners_media_asset_id_idx" ON "partners"("media_asset_id");
CREATE INDEX IF NOT EXISTS "research_submissions_registration_id_idx" ON "research_submissions"("registration_id");
CREATE INDEX IF NOT EXISTS "speaker_operations_event_session_id_idx" ON "speaker_operations"("event_session_id");
CREATE INDEX IF NOT EXISTS "speaker_profiles_media_asset_id_idx" ON "speaker_profiles"("media_asset_id");
CREATE INDEX IF NOT EXISTS "uploaded_files_uploaded_by_id_idx" ON "uploaded_files"("uploaded_by_id");
