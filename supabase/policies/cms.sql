-- RLS: Phase 3.5 CMS tables (pages, SEO, media library)

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Published pages: public read
CREATE POLICY pages_public_select ON pages
  FOR SELECT TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND status = 'published'
    AND (publish_at IS NULL OR publish_at <= NOW())
  );

CREATE POLICY pages_admin_all ON pages
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Sections visible when parent page is published
CREATE POLICY page_sections_public_select ON page_sections
  FOR SELECT TO anon, authenticated
  USING (
    is_visible = true
    AND EXISTS (
      SELECT 1 FROM pages p
      WHERE p.id = page_sections.page_id
        AND p.deleted_at IS NULL
        AND p.status = 'published'
        AND (p.publish_at IS NULL OR p.publish_at <= NOW())
    )
  );

CREATE POLICY page_sections_admin_all ON page_sections
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY page_revisions_admin_all ON page_revisions
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- SEO metadata: public read for published entities
CREATE POLICY seo_metadata_public_select ON seo_metadata
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY seo_metadata_admin_all ON seo_metadata
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Media: public read for non-deleted assets with public URLs
CREATE POLICY media_assets_public_select ON media_assets
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL AND is_current = true);

CREATE POLICY media_assets_admin_all ON media_assets
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY media_folders_public_select ON media_folders
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);

CREATE POLICY media_folders_admin_all ON media_folders
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
