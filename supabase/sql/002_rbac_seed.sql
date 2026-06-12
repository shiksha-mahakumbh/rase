-- Shiksha Mahakumbh — RBAC + registration counter seed
-- Delegates to canonical seed file. Run after Prisma migrate deploy.
-- Usage: psql "$DIRECT_URL" -f supabase/sql/002_rbac_seed.sql

\ir ../seed.sql
