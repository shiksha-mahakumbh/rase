-- RLS: payment_records and webhook_events hardening
-- Requires public.is_admin_user() from registrations.sql

ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Admin read/update for payment reconciliation
CREATE POLICY payment_records_admin_select ON payment_records
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE POLICY payment_records_admin_update ON payment_records
  FOR UPDATE TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Webhook audit trail — admin read only; writes via service role API
CREATE POLICY webhook_events_admin_select ON webhook_events
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- Explicit deny: no anon/authenticated insert (service role bypasses RLS)
CREATE POLICY payment_records_deny_anon_insert ON payment_records
  FOR INSERT TO anon
  WITH CHECK (false);

CREATE POLICY payment_records_deny_auth_insert ON payment_records
  FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY webhook_events_deny_anon_insert ON webhook_events
  FOR INSERT TO anon
  WITH CHECK (false);

CREATE POLICY webhook_events_deny_auth_insert ON webhook_events
  FOR INSERT TO authenticated
  WITH CHECK (false);
