# Deployment Execution — Final Verification

**Date:** 2026-05-29  
**Auditor:** Principal Release Engineer  
**Project:** `dhe-projects/rase-co-in`  
**Method:** Vercel CLI + Supabase live queries + git state

---

## Deployment Readiness Matrix

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Code on GitHub | ⚠️ | `origin/main` at `a0e2c08`; local `0dd6736` 1 commit ahead (verification docs) |
| Production deploy from HEAD | ❌ | Latest prod deploy ~3 days old |
| `DATABASE_URL` | ❌ Missing | `npx vercel env ls production` |
| `DIRECT_URL` | ❌ Missing | Same |
| `NEXT_PUBLIC_SITE_URL` value | ❌ Wrong live | Live canonical = `rase.co.in` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Present | Encrypted |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Present | Encrypted |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Present | Encrypted |
| Admin / Razorpay secrets | ✅ Present | Encrypted |
| Preview env complete | ❌ | Only Postgres + Firebase legacy |
| Storage buckets | ✅ **8/8** | Live query |
| Public RLS | ✅ **55** | Live query |
| Storage RLS | ❌ **0/8** | Requires SQL Editor |
| Firebase data in Supabase | ❌ | 0 registrations |
| Security tests | ✅ | 25/25 PASS |

---

## Vercel Environment — Production

### Required mappings (NOT applied)

| Variable | Status | Action |
|----------|--------|--------|
| `DATABASE_URL` | ❌ | Add = value of `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | ❌ | Add = value of `POSTGRES_URL_NON_POOLING` |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ Name exists | Set to `https://www.shikshamahakumbh.com` |

### Aliases available for mapping

| Existing var | Maps to |
|--------------|---------|
| `POSTGRES_PRISMA_URL` | → `DATABASE_URL` |
| `POSTGRES_URL_NON_POOLING` | → `DIRECT_URL` |

### Legacy to remove post-migration

`FIREBASE_SERVICE_ACCOUNT_JSON` — Production, Preview, Development

---

## Vercel Environment — Preview

| Variable | Preview |
|----------|---------|
| `POSTGRES_URL` | ✅ |
| `POSTGRES_PRISMA_URL` | ✅ |
| `POSTGRES_URL_NON_POOLING` | ✅ |
| `POSTGRES_PASSWORD` | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ (legacy) |
| All app secrets (Supabase, admin, SITE_URL, Razorpay) | ❌ **Missing** |

Preview cannot run full smoke tests without env sync.

---

## Production Deploy Status

```
npx vercel ls --prod
→ Latest deployment ~3 days old
→ Pre-remediation build (sitemap lastmod 2026-06-09)
```

Current HEAD includes: Firebase Exit, Supabase integration, domain source fix, security gates, visitor analytics upsert (`a0e2c08`).

---

## Supabase Infrastructure

| Component | Count | Target |
|-----------|-------|--------|
| Storage buckets | **8** | 8 ✅ |
| Public RLS policies | **55** | ≥55 ✅ |
| Storage RLS policies | **0** | 8 ❌ |
| Prisma migrations | **7/7** | Applied ✅ |
| Registrations | **0** | >0 after import ❌ |

Storage RLS SQL: `supabase/policies/storage-production.sql` via Supabase Dashboard SQL Editor.

---

## Ordered Pre-Deploy Checklist

1. Push local commit `0dd6736` (if desired)
2. Apply storage RLS in Supabase SQL Editor
3. Add `DATABASE_URL` + `DIRECT_URL` on Vercel Production
4. Update `NEXT_PUBLIC_SITE_URL` to `https://www.shikshamahakumbh.com`
5. Firebase export → import (with approval)
6. Reconcile `registration_counters.last_number`
7. `npx vercel --prod`
8. Post-deploy verification (401, sitemap .com, row counts)

See `FINAL_DEPLOYMENT_SEQUENCE.md` for exact commands.

---

## Signoff

**Deployment execution readiness: NO GO**

All operator steps above must complete before production launch.

---

*Fresh Vercel CLI + Supabase queries — 2026-05-29.*
