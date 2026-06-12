# RLS Security Audit (Phase F4)

**Date:** 2026-06-11  
**Objective:** Document Supabase RLS posture replacing Firebase Rules  
**Constraint:** Audit only — policies exist in repo but deployment unverified

---

## Firebase Rules being replaced

| Firebase rule | Supabase equivalent |
|---------------|---------------------|
| `registrations` create: false (anonymous) | No INSERT policy for `anon`/`authenticated` on `registrations` |
| `registrations` read: admin only | `registrations_admin_select` policy |
| Storage write: false (anonymous) | `deny_public_write` on `storage.objects` |
| Catch-all deny | Default deny + service role API only |

---

## Policy files (source of truth)

| File | Tables / scope | Status |
|------|----------------|--------|
| `supabase/policies/registrations.sql` | Registration domain + `is_admin_user()` | **Draft in repo** |
| `supabase/policies/admin.sql` | RBAC, audit, CMS tables | **Draft in repo** |
| `supabase/policies/cms.sql` | Pages, notices, media CMS | **Draft in repo** |
| `supabase/policies/analytics.sql` | Visitor analytics | **Draft in repo** |
| `supabase/policies/storage.sql` | Storage bucket policies | **Template comments** |
| `supabase/policies/phase_b.sql` | Phase B tables | **Draft in repo** |

---

## `is_admin_user()` function

**File:** `supabase/policies/registrations.sql` L5-22

```sql
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u
    INNER JOIN user_roles ur ON ur.user_id = u.id
    INNER JOIN roles r ON r.id = ur.role_id
    WHERE u.auth_user_id = auth.uid()
      AND u.is_active = true
      AND u.deleted_at IS NULL
  );
$$;
```

**Depends on:** Supabase Auth `auth.uid()` linked to `users.auth_user_id` (F1 migration).

---

## Registration domain policies

| Table | RLS enabled | Policies | Anonymous access |
|-------|:-----------:|----------|:----------------:|
| `registrations` | ✅ | admin SELECT, UPDATE | **DENIED** |
| `registration_counters` | ✅ | none (service role only) | **DENIED** |
| `payment_records` | ✅ | admin SELECT | **DENIED** |
| `uploaded_files` | ✅ | admin SELECT | **DENIED** |
| Type extension tables | ✅ | via API layer | **DENIED** |

**API layer:** `/api/v2/*` uses `SUPABASE_SERVICE_ROLE_KEY` which **bypasses RLS**. Security enforced at Route Handler level (auth cookie, rate limits, input validation).

---

## Admin-only policies

**File:** `supabase/policies/admin.sql`

| Table | Policy | Operations |
|-------|--------|------------|
| `users` | `users_self_select` | Own profile read |
| `users` | `users_admin_select` | Admin read all |
| `audit_logs` | `audit_logs_admin_select` | Admin read |
| `committees` | `committees_admin_manage` | Admin CRUD |
| `contact_messages` | admin select | Admin read |
| `feedback` | admin select | Admin read |

---

## Registration ownership policies (gap analysis)

**Current:** No per-registration owner policy (public users don't get Supabase Auth accounts).

| Access pattern | Implementation |
|----------------|----------------|
| Public submit registration | Service role API (`/api/v2/registration/submit`) |
| Public lookup own registration | HMAC token or email verify in Route Handler — **not RLS** |
| Admin view all | `is_admin_user()` SELECT policies |
| Admin update status | `registrations_admin_update` |

**Recommendation:** Do **not** add broad authenticated INSERT policies. Keep writes service-role-only through validated API routes (matches Firebase `create: false` model).

**Optional future:** Registration owner JWT for participants — out of scope for exit program.

---

## Upload access policies

**File:** `supabase/policies/storage.sql`

| Bucket | Public read | Public write | Admin read |
|--------|:-----------:|:------------:|:----------:|
| `registrations` | ❌ | ❌ | ✅ (authenticated admin) |
| `resumes` | ❌ | ❌ | ✅ |
| `papers` | ❌ | ❌ | ✅ |
| `gallery` | ✅ (published) | ❌ | ✅ |
| `documents` | ✅ (published) | ❌ | ✅ |

**Enforcement:** All registration uploads via Next.js API with `SUPABASE_SERVICE_ROLE_KEY`.

---

## Deployment procedure

```bash
# 1. Apply policies to Supabase (staging first)
psql $DATABASE_URL -f supabase/policies/registrations.sql
psql $DATABASE_URL -f supabase/policies/admin.sql
psql $DATABASE_URL -f supabase/policies/cms.sql
psql $DATABASE_URL -f supabase/policies/analytics.sql
psql $DATABASE_URL -f supabase/policies/phase_b.sql

# 2. Storage policies via Supabase Dashboard or CLI
#    (storage.sql is template — enable per bucket)

# 3. Verify RLS enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'registrations';
```

---

## Security comparison matrix

| Control | Firebase (current) | Supabase RLS (target) | API layer |
|---------|:------------------:|:---------------------:|:---------:|
| Anonymous registration create | DENIED (rules) | DENIED (no policy) | Service role API |
| Anonymous registration read | DENIED | DENIED | 401 without token |
| Admin registration read | Admin SDK only | `is_admin_user()` | Cookie + RBAC |
| Payment record write | Server only | Service role API | Webhook HMAC |
| File upload | Admin SDK only | Service role API | MIME + size validation |
| PII in public API | Route Handler strips | Route Handler strips | `toPublicRegistrationSummary` |

---

## Gaps to close before cutover

| # | Gap | Priority | Action |
|---|-----|----------|--------|
| 1 | RLS policies not deployed to Supabase | P0 | Run SQL files on staging/prod |
| 2 | Storage policies are comments only | P0 | Create actual policies in Dashboard |
| 3 | `auth_user_id` not populated on `users` | P0 | F1 auth migration |
| 4 | Service role key in Vercel Preview missing | P1 | Copy from Production |
| 5 | No RLS test automation | P2 | Add `scripts/supabase/rls-check.mjs` |

---

## Validation tests

```sql
-- As anon role (should return 0 rows)
SET ROLE anon;
SELECT * FROM registrations LIMIT 1;

-- As authenticated non-admin (should return 0 rows)
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "<non-admin-uuid>"}';
SELECT * FROM registrations LIMIT 1;

-- Service role (via API) should work
```

---

**Not deployed — documentation only.**
