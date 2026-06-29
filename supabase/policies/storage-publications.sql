-- Public read for proceedings PDF bucket (uploads via service role only).

CREATE POLICY storage_publications_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'publications');
