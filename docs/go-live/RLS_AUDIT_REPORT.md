# RLS Audit Report

**Date:** 2026-06-12  
**Database policy count (pre-apply):** 0  
**Policy files:** `supabase/policies/*.sql`

---

## Policy Inventory

| File | Tables / scope | Purpose |
|------|----------------|---------|
| `registrations.sql` | registrations, payments, files, counters | `is_admin_user()` + admin SELECT |
| `production-hardening.sql` | registrations, uploaded_files, users, counters | Explicit anon deny |
| `payments.sql` | payment_records, webhook_events | Admin read; deny client insert |
| `admin.sql` | users, roles, audit, CMS admin tables | RBAC self-read + admin |
| `cms.sql` | CMS content tables | Admin manage |
| `analytics.sql` | visitor_analytics | Admin read |
| `phase_b.sql` | Phase B tables | Admin policies |
| `storage-production.sql` | storage.objects | Deny client writes; public media read |

---

## Requirements Matrix

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Anonymous access denied (PII tables) | `production-hardening.sql` deny anon ALL | ✅ In SQL |
| Service role allowed | App uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS) | ✅ By design |
| Admin role restricted | `is_admin_user()` via Supabase Auth + RBAC | ✅ In SQL |
| Audit-safe | No anon on audit_logs; admin read only | ✅ In SQL |
| Registration counters | Deny all client roles | ✅ In SQL |
| Storage writes | Deny anon/auth insert/update/delete | ✅ In SQL |

---

## Apply Order

```
supabase/sql/003_deploy_rls.sql
  → registrations.sql
  → production-hardening.sql
  → payments.sql
  → admin.sql
  → cms.sql
  → analytics.sql
  → phase_b.sql
  → storage-production.sql
```

---

## Deployment Status

| Check | Result |
|-------|--------|
| Policies applied to DB | ❌ **0** — pending cutover |
| `is_admin_user()` function | ❌ Not in DB until apply |

### Apply command

```bash
psql "$DIRECT_URL" -f supabase/sql/003_deploy_rls.sql
# OR
npm run db:deploy-supabase -- --rls-only
```

---

## Post-Apply Verification

```sql
SELECT count(*) FROM pg_policies WHERE schemaname IN ('public','storage');
-- Expected: > 30
```

---

*Evidence: policy file review, pg_policies count query (0 pre-apply).*
