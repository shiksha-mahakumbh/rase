-- Shiksha Mahakumbh — Supabase Storage buckets for production cutover
-- Run: psql "$DIRECT_URL" -f supabase/sql/001_storage_buckets.sql
-- Idempotent: ON CONFLICT DO NOTHING

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('registrations', 'registrations', false, 10485760,
    ARRAY['application/pdf','image/jpeg','image/png','image/webp','image/gif','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('resumes', 'resumes', false, 10485760,
    ARRAY['application/pdf','image/jpeg','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('papers', 'papers', false, 10485760,
    ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('brochures', 'brochures', false, 10485760,
    ARRAY['application/pdf','image/jpeg','image/png']),
  ('media', 'media', true, 10485760,
    ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4']),
  ('committee', 'committee', false, 10485760,
    ARRAY['application/pdf','image/jpeg','image/png']),
  ('downloads', 'downloads', true, 10485760,
    ARRAY['application/pdf','image/jpeg','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('receipts', 'receipts', false, 5242880,
    ARRAY['application/pdf','image/jpeg','image/png'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
