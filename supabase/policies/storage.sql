-- Supabase Storage bucket policies
-- Apply in Supabase Dashboard → Storage → Policies, or via supabase CLI.
-- Buckets: registrations, awards, best-practices, brochures, gallery, committee, documents, receipts, exports

-- ─── registrations bucket ────────────────────────────────────────────────────
-- Uploads via /api/v2/registration/upload (service role). No public write.

-- INSERT policy (service role only — no anon/authenticated insert policies)
-- SELECT: signed URLs generated server-side; optional admin read-all

-- Example policy definitions (enable per bucket in Dashboard):

-- CREATE POLICY "registrations_admin_read"
-- ON storage.objects FOR SELECT TO authenticated
-- USING (
--   bucket_id = 'registrations'
--   AND public.is_admin_user()
-- );

-- CREATE POLICY "gallery_public_read"
-- ON storage.objects FOR SELECT TO anon, authenticated
-- USING (bucket_id = 'gallery');

-- CREATE POLICY "documents_public_read"
-- ON storage.objects FOR SELECT TO anon, authenticated
-- USING (bucket_id = 'documents');

-- CREATE POLICY "deny_public_write_all_buckets"
-- ON storage.objects FOR INSERT TO anon, authenticated
-- WITH CHECK (false);

-- Note: service_role key bypasses storage RLS. All registration uploads
-- must go through Next.js route handlers with file validation.
