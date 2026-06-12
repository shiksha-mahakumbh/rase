# G2 — Supabase Production Readiness

**Audit date:** 2026-06-12  
**Method:** Prisma validate/migrate status, schema review, policy file review, read-only DB counts

---

## Database connectivity

| Variable | Local `.env` | Vercel Production |
|----------|--------------|-------------------|
| `DATABASE_URL` | ✅ Present | ❌ **Missing** — use `POSTGRES_PRISMA_URL` alias only |
| `DIRECT_URL` | ✅ Present | ❌ **Missing** — use `POSTGRES_URL_NON_POOLING` alias only |

Prisma connects successfully locally to Supabase Postgres (`db.rcpbfrauyyyorptckrlp.supabase.co`).

**Action:** Map Vercel integration vars to Prisma names **or** add explicit `DATABASE_URL` / `DIRECT_URL` in Production (recommended for clarity).

---

## Migrations

```text
7 migrations found in prisma/migrations
Database schema is up to date!
```

| Migration | Purpose |
|-----------|---------|
| `20250609_init` | Core registration engine |
| `20250610_phase3` | Phase 3 extensions |
| `20250620_phase35_cms_foundation` | CMS |
| `20250621_phase_b_cms` | CMS B |
| `20250622_phase_b5_analytics` | Analytics |
| `20250629_phase_s2_foundation` | S2 |
| `20250701_phase_c_organizational_cms` | Org CMS |

**Schema:** ✅ Applied  
**Data:** ❌ Empty (0 registrations)

---

## Tables & indexes (registration domain)

From `prisma/schema.prisma` — verified in init migration:

| Model | Indexes | FK relations |
|-------|---------|--------------|
| `Registration` | type, status, payment, email, createdAt, deletedAt | → extensions, files, payments |
| `PaymentRecord` | registrationId, razorpayPaymentId unique | → Registration |
| `UploadedFile` | registrationId, bucket+path | → Registration |
| `RegistrationCounter` | prefix unique | — |
| Type extensions (Conclave, Delegate, …) | registrationId unique | → Registration |

**Tables exist:** ✅ (schema level)  
**Data populated:** ❌

---

## RLS policies

Policy SQL exists under `supabase/policies/`:

| File | Coverage |
|------|----------|
| `registrations.sql` | RLS enabled on registration + payment + uploaded_files; admin SELECT/UPDATE via `is_admin_user()` |
| `admin.sql`, `cms.sql`, `analytics.sql`, `phase_b.sql` | CMS/analytics domains |
| `storage.sql` | **Comments/examples only** — not executable deploy script |

### Verification status

| Check | Status |
|-------|--------|
| Policy SQL authored | ✅ |
| Applied to production Supabase | **UNVERIFIED** (no SQL audit query run) |
| `is_admin_user()` function deployed | **UNVERIFIED** |

**Risk:** Server routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). RLS protects direct client access — still required for defense-in-depth.

---

## Storage buckets

Code expects buckets (`storage.service.ts`):

`registrations`, `resumes`, `papers` (→ `documents`), `brochures`, `media` (→ `gallery`), `committee`, `downloads`

`supabase/policies/storage.sql` documents buckets but **does not create them**.

| Check | Status |
|-------|--------|
| Bucket list documented | ✅ |
| Buckets created in Supabase Dashboard | **UNVERIFIED** |
| Storage RLS policies applied | **UNVERIFIED** |

---

## Supabase Auth

Vercel Production has:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

Preview environment: **missing** most Supabase vars (see VERCEL_ENV_AUDIT.md).

RBAC seed: `scripts/supabase/seed-rbac.mjs` sets `registration.backend=supabase` — **must be run** on target DB (counter seed not confirmed in live DB).

---

## G2 verdict

| Area | Score |
|------|-------|
| Schema/migrations | ✅ Ready |
| Data | ❌ Empty |
| RLS deployed | ⚠️ Unverified |
| Storage buckets | ⚠️ Unverified |
| Env var naming on Vercel | ⚠️ Alias-only |

**G2 overall:** **CONDITIONAL** — infrastructure scaffold ready; production data and Supabase console config unverified.
