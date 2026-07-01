-- Tiered RBAC: permission-scoped RLS helpers (run after seed.sql)
-- Replaces binary is_admin_user() checks with has_permission(slug) where tiering matters.

CREATE OR REPLACE FUNCTION public.has_permission(perm_slug text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    INNER JOIN user_roles ur ON ur.user_id = u.id
    INNER JOIN role_permissions rp ON rp.role_id = ur.role_id
    INNER JOIN permissions p ON p.id = rp.permission_id
    WHERE u.auth_user_id = auth.uid()
      AND u.is_active = true
      AND u.deleted_at IS NULL
      AND p.slug = perm_slug
  );
$$;

-- ─── Registrations (tiered) ───────────────────────────────────────────────────

DROP POLICY IF EXISTS registrations_admin_select ON registrations;
CREATE POLICY registrations_admin_select ON registrations
  FOR SELECT TO authenticated
  USING (public.has_permission('registrations.read'));

DROP POLICY IF EXISTS registrations_admin_update ON registrations;
CREATE POLICY registrations_admin_update ON registrations
  FOR UPDATE TO authenticated
  USING (public.has_permission('registrations.update'))
  WITH CHECK (public.has_permission('registrations.update'));

-- ─── Audit & email logs ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS audit_logs_admin_select ON audit_logs;
CREATE POLICY audit_logs_admin_select ON audit_logs
  FOR SELECT TO authenticated
  USING (public.has_permission('audit_logs.read'));

DROP POLICY IF EXISTS email_logs_admin_select ON email_logs;
CREATE POLICY email_logs_admin_select ON email_logs
  FOR SELECT TO authenticated
  USING (public.has_permission('audit_logs.read'));

-- ─── Committees (tiered) ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS committees_admin_select ON committees;
CREATE POLICY committees_admin_select ON committees
  FOR SELECT TO authenticated
  USING (public.has_permission('committees.read'));

DROP POLICY IF EXISTS committees_admin_manage ON committees;
CREATE POLICY committees_admin_manage ON committees
  FOR ALL TO authenticated
  USING (public.has_permission('committees.manage'))
  WITH CHECK (public.has_permission('committees.manage'));

-- ─── Contact & feedback ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS contact_messages_admin_select ON contact_messages;
CREATE POLICY contact_messages_admin_select ON contact_messages
  FOR SELECT TO authenticated
  USING (public.has_permission('contact.read'));

DROP POLICY IF EXISTS feedback_admin_select ON feedback;
CREATE POLICY feedback_admin_select ON feedback
  FOR SELECT TO authenticated
  USING (public.has_permission('feedback.read'));

-- Users table: self-read unchanged; admin list requires users.manage
DROP POLICY IF EXISTS users_admin_select ON users;
CREATE POLICY users_admin_select ON users
  FOR SELECT TO authenticated
  USING (public.has_permission('users.manage'));
