-- Public proceedings PDFs (Proceeding1–3) — off-repo CDN via Supabase Storage.
-- Run: node scripts/deploy-supabase-production.mjs --buckets-only (includes 001+002 via applyBuckets update)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('publications', 'publications', true, 62914560,
    ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
