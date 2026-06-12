-- RLS: Phase B tables

ALTER TABLE notice_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_bars ENABLE ROW LEVEL SECURITY;

CREATE POLICY notice_categories_public_select ON notice_categories
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY notice_categories_admin_all ON notice_categories
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY notices_public_select ON notices
  FOR SELECT TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND status IN ('published', 'scheduled')
    AND (publish_at IS NULL OR publish_at <= NOW())
    AND (expire_at IS NULL OR expire_at > NOW())
  );

CREATE POLICY notices_admin_all ON notices
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY notice_attachments_public_select ON notice_attachments
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notices n
      WHERE n.id = notice_attachments.notice_id
        AND n.deleted_at IS NULL
        AND n.status IN ('published', 'scheduled')
        AND (n.publish_at IS NULL OR n.publish_at <= NOW())
        AND (n.expire_at IS NULL OR n.expire_at > NOW())
    )
  );

CREATE POLICY notice_attachments_admin_all ON notice_attachments
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY site_settings_public_select ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY site_settings_admin_all ON site_settings
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY menus_public_select ON menus
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL AND is_active = true);

CREATE POLICY menus_admin_all ON menus
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY menu_items_public_select ON menu_items
  FOR SELECT TO anon, authenticated
  USING (
    is_visible = true
    AND EXISTS (
      SELECT 1 FROM menus m
      WHERE m.id = menu_items.menu_id AND m.deleted_at IS NULL AND m.is_active = true
    )
  );

CREATE POLICY menu_items_admin_all ON menu_items
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY announcement_bars_public_select ON announcement_bars
  FOR SELECT TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND is_active = true
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at > NOW())
  );

CREATE POLICY announcement_bars_admin_all ON announcement_bars
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
