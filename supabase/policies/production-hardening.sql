-- Production RLS hardening — explicit deny policies for core PII tables
-- Run after registrations.sql (is_admin_user function)

-- registrations: deny all anon access (default deny when RLS on, explicit for audit)
CREATE POLICY registrations_deny_anon_all ON registrations
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY registrations_deny_auth_insert ON registrations
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user());

CREATE POLICY registrations_deny_auth_delete ON registrations
  FOR DELETE TO authenticated
  USING (public.is_admin_user());

-- uploaded_files: admin only
CREATE POLICY uploaded_files_deny_anon_all ON uploaded_files
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY uploaded_files_admin_update ON uploaded_files
  FOR UPDATE TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- users: deny anon entirely
CREATE POLICY users_deny_anon_all ON users
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY users_deny_auth_insert ON users
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user());

CREATE POLICY users_deny_auth_delete ON users
  FOR DELETE TO authenticated
  USING (public.is_admin_user());

-- registration_counters: no client access (service role only)
CREATE POLICY registration_counters_deny_all ON registration_counters
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);
