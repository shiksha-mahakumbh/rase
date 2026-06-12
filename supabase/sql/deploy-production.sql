-- Shiksha Mahakumbh — Production deploy (buckets + RLS + seed)
-- Usage: psql "$DIRECT_URL" -f supabase/sql/deploy-production.sql

\ir 001_storage_buckets.sql
\ir 002_rbac_seed.sql
\ir 003_deploy_rls.sql
