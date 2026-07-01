# Prisma / Supabase database operations

Production database: **Supabase PostgreSQL** via Prisma 6. Schema: `prisma/schema.prisma`.

## Golden rules

1. **Never run `npm run db:push` on production.** It bypasses migration history and can drift from other environments. The script is guarded against Supabase/production URLs unless `ALLOW_DB_PUSH=1` is set for emergencies.
2. **Always use migrations for production schema changes:**
   - Local: `npm run db:migrate` (creates migration + applies)
   - Production: automatic via [Prisma Migrate Deploy](https://github.com/shiksha-mahakumbh/rase/actions/workflows/prisma-migrate-deploy.yml) on push to `main` when `prisma/**` changes
3. **Require both URLs in production:**
   - `DATABASE_URL` — Supabase pooler (runtime + migrate deploy)
   - `DIRECT_URL` — direct connection (migrations, audits, `next build` SSG)
4. **Validate before merge:** `npm run db:validate` runs in CI on every push/PR.

## Commands

| Command | Use |
|---------|-----|
| `npm run db:validate` | Schema syntax check (no DB) |
| `npm run db:generate` / `db:generate:safe` | Regenerate client (safe = OneDrive workaround) |
| `npm run db:migrate` | Dev: create + apply migration |
| `npm run db:migrate:deploy` | Production: apply pending migrations only |
| `npm run db:push` | **Dev only** — blocked on production-like URLs |
| `npm run audit:prisma` | Read-only production drift audit (needs `DIRECT_URL`) |
| `npm run db:seed` | RBAC seed (`scripts/supabase/seed-rbac.mjs`) |

## CI / scheduled checks

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Every PR/push | `prisma validate` |
| `prisma-migrate-deploy.yml` | Push to `main` (`prisma/**`) | `validate` + `migrate deploy` |
| `prisma-audit.yml` | Weekly + manual | `validate` + `audit:prisma` vs production |

GitHub Actions secrets: `DATABASE_URL`, `DIRECT_URL` (see `.github/DEPLOY_SECRETS.md`).

## Runtime client

- Singleton: `src/server/db/prisma.ts`
- Serverless pool: `connection_limit=1` at runtime
- Build/SSG: uses `DIRECT_URL` with higher limit when `NEXT_PHASE=phase-production-build`
- Raw SQL: health probe only (`SELECT 1` tagged template)

## Registration IDs

`saveRegistration()` allocates `SMK2026-######` inside the same transaction as the insert (no burned IDs on failed saves).

## Error helpers

`src/lib/prisma/errors.ts` — `isPrismaUniqueViolation`, `isPrismaNotFound`, `isPrismaForeignKeyViolation`, `isPrismaConnectionError`.

## Local Windows / OneDrive

If `prisma generate` fails with EPERM, run `npm run db:generate:safe`.
