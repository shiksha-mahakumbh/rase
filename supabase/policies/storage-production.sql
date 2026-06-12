-- Supabase Storage object policies — production
-- All uploads go through Next.js service role; deny direct client writes.

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Deny anonymous and authenticated direct uploads (service role bypasses RLS)
CREATE POLICY storage_deny_anon_insert ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (false);

CREATE POLICY storage_deny_auth_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY storage_deny_anon_update ON storage.objects
  FOR UPDATE TO anon
  USING (false);

CREATE POLICY storage_deny_auth_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (false);

CREATE POLICY storage_deny_anon_delete ON storage.objects
  FOR DELETE TO anon
  USING (false);

CREATE POLICY storage_deny_auth_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (false);

-- Public read for published media and downloads buckets only
CREATE POLICY storage_media_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('media', 'downloads'));

-- Admin read all buckets via RBAC
CREATE POLICY storage_admin_read ON storage.objects
  FOR SELECT TO authenticated
  USING (public.is_admin_user());
