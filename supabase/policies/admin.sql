-- RLS: admin, audit, and content management tables

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY users_self_select ON users
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY users_admin_select ON users
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY audit_logs_admin_select ON audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY email_logs_admin_select ON email_logs
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY committees_admin_select ON committees
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY committees_admin_manage ON committees
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY contact_messages_admin_select ON contact_messages
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY feedback_admin_select ON feedback
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- Public content tables: read for authenticated admins; writes via service role API
CREATE POLICY events_admin_select ON events
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY announcements_public_select ON announcements
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);
