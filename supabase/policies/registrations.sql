-- RLS: registration domain tables
-- Public access is denied; Next.js /api/v2/* uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

-- Helper: admin user linked to Supabase Auth
CREATE OR REPLACE FUNCTION public.is_admin_user()
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
    INNER JOIN roles r ON r.id = ur.role_id
    WHERE u.auth_user_id = auth.uid()
      AND u.is_active = true
      AND u.deleted_at IS NULL
      AND r.deleted_at IS NULL
  );
$$;

-- ─── Enable RLS ──────────────────────────────────────────────────────────────

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE conclave_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegate_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_practice_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE olympiad_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- ─── Admin read policies (authenticated Supabase users with RBAC) ───────────

CREATE POLICY registrations_admin_select ON registrations
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY registrations_admin_update ON registrations
  FOR UPDATE TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY payment_records_admin_select ON payment_records
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY uploaded_files_admin_select ON uploaded_files
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- registration_counters: service role only (no client policies)
-- Type extension tables inherit access via registration FK joins in API layer
