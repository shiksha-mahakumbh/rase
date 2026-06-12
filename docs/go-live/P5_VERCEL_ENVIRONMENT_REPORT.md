# P5 — Vercel Environment Report

**Audit date:** 2026-05-29  
**Command:** `npx vercel env ls`  
**Project:** `dhe-projects/rase-co-in`  
**Prior reports:** H1, `docs/deployment/VERCEL_ENV_GAP_ANALYSIS.md`

Encrypted values — contents **UNKNOWN** from CLI; live behavior used as proxy for `NEXT_PUBLIC_SITE_URL`.

---

## Required Variables Matrix

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `NEXT_PUBLIC_SITE_URL` | ✅* | ❌ | ✅* |
| `DATABASE_URL` | ❌ | ❌ | ❌ |
| `DIRECT_URL` | ❌ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ❌ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ |
| `ADMIN_OPS_SECRET` | ✅ | ❌ | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ | ❌ | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ❌ | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ❌ | ✅ |

\*Present; live SEO indicates **incorrect effective value** (`rase.co.in` not `shikshamahakumbh.com`).

---

## Missing

### Production
- `DATABASE_URL` (alias: `POSTGRES_PRISMA_URL` only)
- `DIRECT_URL` (alias: `POSTGRES_URL_NON_POOLING` only)

### Preview (all required vars except Postgres aliases)
- All Supabase vars, all admin secrets, `NEXT_PUBLIC_SITE_URL`, `RAZORPAY_WEBHOOK_SECRET`, `DATABASE_URL`, `DIRECT_URL`

### Development
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`, `DIRECT_URL`

---

## Incorrect (inferred)

| Variable | Issue | Evidence |
|----------|-------|----------|
| `NEXT_PUBLIC_SITE_URL` (Production) | Likely `https://www.rase.co.in` or unset → fallback | Live canonical/sitemap |
| Local `.env` | `https://shikshamahakumbh.org` | Prior H1 audit |
| `.env.example` | `https://www.rase.co.in` | File content |

---

## Unused / Redundant (Production)

| Variable | Notes |
|----------|-------|
| `SUPABASE_URL` | Duplicate of `NEXT_PUBLIC_SUPABASE_URL` pattern |
| `SUPABASE_ANON_KEY` | Duplicate of public anon key |
| `SUPABASE_PUBLISHABLE_KEY` | Overlap with `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SECRET_KEY` | Overlap with service role naming |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Not in required list; parallel to anon key |

---

## Legacy

| Variable | Environments | Status |
|----------|--------------|--------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development | **Legacy** — remove post-migration |

---

## Functional Aliases (Production)

| Prisma expects | Vercel provides |
|----------------|-----------------|
| `DATABASE_URL` | `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | `POSTGRES_URL_NON_POOLING` |

⚠️ Name mismatch — Prisma will not read aliases without explicit `DATABASE_URL`/`DIRECT_URL`.

---

## P5 Summary

| Category | Production | Preview | Development |
|----------|------------|---------|-------------|
| Missing required | 2 | 10 | 6 |
| Incorrect (inferred) | 1 | — | — |
| Legacy | 1 | 1 | 1 |

**P0:** Add `DATABASE_URL`, `DIRECT_URL`, fix `NEXT_PUBLIC_SITE_URL` on Production.

---

*Evidence: `npx vercel env ls` 2026-05-29. No env modifications.*
