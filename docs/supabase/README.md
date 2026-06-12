# Shiksha Mahakumbh — Supabase Backend Rebuild

**Status:** Phase 1–3 + Phase 3.5 + Phase B + B.5 backend complete — **MIGRATION PAUSED**

> Phase 4 cutover paused until `docs/platform/` audit reports are approved.  
> `REGISTRATION_BACKEND=firebase` unchanged.  
**Rule:** Firebase remains active. No frontend page changes until backend is approved.

### Phase 2 artifacts (local)

| Artifact | Path |
|----------|------|
| Initial migration | `prisma/migrations/20250609_init/migration.sql` |
| RBAC seed (SQL) | `supabase/seed.sql` |
| RBAC seed (Prisma) | `scripts/supabase/seed-rbac.mjs` |
| RLS policies | `supabase/policies/` (`cms.sql`, `phase_b.sql`, `analytics.sql`) |
| Phase 3.5 CMS migration | `prisma/migrations/20250620_phase35_cms_foundation/` |
| Phase 3.5 docs | `docs/platform/PHASE35_IMPLEMENTATION.md` |
| Phase B migration | `prisma/migrations/20250621_phase_b_cms/` |
| Phase B docs | `docs/platform/PHASE_B_IMPLEMENTATION.md` |
| Phase B.5 analytics migration | `prisma/migrations/20250622_phase_b5_analytics/` |
| Phase B.5 docs | `docs/platform/PHASE_B5_IMPLEMENTATION.md` |
| Health probe | `GET /api/v2/health` |

## Deliverables

| # | Document | Path |
|---|----------|------|
| 1 | Architecture Diagram | [01-architecture.md](./01-architecture.md) |
| 2 | Prisma Schema | [../../prisma/schema.prisma](../../prisma/schema.prisma) |
| 3 | Folder Structure | [03-folder-structure.md](./03-folder-structure.md) |
| 4 | Database Design | [02-database-design.md](./02-database-design.md) |
| 5 | API Specifications | [04-api-specifications.md](./04-api-specifications.md) |
| 6 | Migration Plan | [05-migration-plan.md](./05-migration-plan.md) |
| 7 | Security Plan | [06-security-plan.md](./06-security-plan.md) |
| 8 | Deployment Plan | [07-deployment-plan.md](./07-deployment-plan.md) |
| 9 | Testing Plan | [08-testing-plan.md](./08-testing-plan.md) |
| 10 | Implementation Plan | [09-implementation-plan.md](./09-implementation-plan.md) |

## In-scope registration types (active backend)

Conclave · Delegate · Exhibition · Accommodation · Awards · Best Practices · Olympiad · Talent

## Explicitly out of scope (DO NOT BUILD)

Multitrack Conference · Abstract Submission · Paper Submission · Reviewer Workflow · Journal · Proceedings · Manuscript management

## Environment template

See [`.env.supabase.example`](../../.env.supabase.example)
