-- RLS: Phase B.5 visitor analytics tables

ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY visitor_analytics_admin_select ON visitor_analytics
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY visitor_sessions_admin_all ON visitor_sessions
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY visitor_page_views_admin_select ON visitor_page_views
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY visitor_events_admin_select ON visitor_events
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY visitor_devices_admin_select ON visitor_devices
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY visitor_locations_admin_select ON visitor_locations
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY traffic_sources_admin_select ON traffic_sources
  FOR SELECT TO authenticated
  USING (public.is_admin_user());
