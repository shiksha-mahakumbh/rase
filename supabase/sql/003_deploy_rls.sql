-- Shiksha Mahakumbh — Apply all RLS policies (production order)
-- Usage: psql "$DIRECT_URL" -f supabase/sql/003_deploy_rls.sql

\ir ../policies/registrations.sql
\ir ../policies/production-hardening.sql
\ir ../policies/payments.sql
\ir ../policies/admin.sql
\ir ../policies/cms.sql
\ir ../policies/analytics.sql
\ir ../policies/phase_b.sql
\ir ../policies/storage-production.sql
\ir ../policies/rbac-tiered.sql
