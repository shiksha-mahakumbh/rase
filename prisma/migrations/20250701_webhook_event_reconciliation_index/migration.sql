-- Index for admin webhook reconciliation filters (processed / signature_valid).
CREATE INDEX IF NOT EXISTS "webhook_events_processed_signature_valid_created_at_idx"
ON "webhook_events" ("processed", "signature_valid", "created_at" DESC);
