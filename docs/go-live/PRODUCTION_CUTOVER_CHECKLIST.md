# Production Cutover Checklist

**Date:** 2026-05-29  
**Platform:** Shiksha Mahakumbh  
**Status:** Pre-launch — operator execution required

---

## Pre-Flight (before Step 1)

- [ ] Stakeholder approval for production Firebase export/import
- [ ] Maintenance window communicated (if applicable)
- [ ] Rollback deploy ID noted: `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt`
- [ ] On-call contact assigned for 48-hour observation

---

## Step 1 — Commit Remaining Files

```bash
git status
git add supabase/policies/registrations.sql
git add scripts/deploy-supabase-production.mjs scripts/apply-deploy-production.mjs
git add docs/go-live/
git commit -m "Go-live prep: RLS fix, deploy helper, and release signoff pack"
```

**Verify:** `git status` clean (except intentional ignores).

---

## Step 2 — Push to GitHub

```bash
git push origin main
```

**Verify:** Remote `main` at `469381e` + go-live commit.

---

## Step 3 — Apply `storage-production.sql`

Supabase Dashboard → SQL Editor → paste and run:

```
supabase/policies/storage-production.sql
```

Or via CLI with elevated privileges:

```bash
# Requires psql or Supabase SQL editor
psql "$DIRECT_URL" -f supabase/policies/storage-production.sql
```

**Verify:**

```sql
SELECT count(*) FROM pg_policies WHERE schemaname = 'storage';
-- Expected: ≥ 8
```

---

## Step 4 — Configure Vercel Env Aliases

```bash
# Production
vercel env add DATABASE_URL production
# Value = POSTGRES_PRISMA_URL (copy from dashboard)

vercel env add DIRECT_URL production
# Value = POSTGRES_URL_NON_POOLING

vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Value = https://www.shikshamahakumbh.com

# Sync Preview (all Production secrets)
# Use Vercel dashboard bulk copy or vercel env add per variable
```

**Verify:**

```bash
npx vercel env ls production | findstr "DATABASE_URL DIRECT_URL SITE_URL"
```

---

## Step 5 — Firebase Export / Import

```bash
# One-time dev dependency
npm i -D firebase-admin

# Export (requires FIREBASE_SERVICE_ACCOUNT_JSON)
npm run firebase:export -- --out=./exports/firebase

# Review manifest / row counts before import
ls exports/firebase/

# Import to Supabase
npm run firebase:import -- --in=./exports/firebase
```

**Verify:**

```bash
npx prisma studio
# OR
# SELECT count(*) FROM registrations;
# Reconcile registration_counters.last_number with max ID
```

---

## Step 6 — Deploy Vercel Production

```bash
npx prisma migrate deploy   # confirm on production DB
npm run db:seed             # idempotent; verify counter
npx vercel --prod
```

**Verify:** New deployment ID; build completes; alias resolves.

---

## Step 7 — Verify Registration Endpoint Returns 401

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# Expected: 401

curl -s \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001?email=test@example.com"
# Expected: 404 (wrong email) — NOT 200 with PII
```

---

## Step 8 — Verify Sitemap Emits `.com`

```bash
curl -s https://www.shikshamahakumbh.com/sitemap.xml | head -10
# Expected: <loc>https://www.shikshamahakumbh.com/...

curl -s https://www.shikshamahakumbh.com/robots.txt
# Expected: Sitemap: https://www.shikshamahakumbh.com/sitemap.xml
```

---

## Step 9 — Verify Razorpay Payment Flow

- [ ] Create test registration on production
- [ ] Complete Razorpay checkout (test mode or live per config)
- [ ] Confirm webhook received (`webhook_events` row or admin log)
- [ ] Confirm `payment_records` status updated in Supabase
- [ ] Razorpay dashboard webhook URL = `https://www.shikshamahakumbh.com/api/...`

---

## Step 10 — Verify Supabase Persistence

```sql
SELECT count(*) FROM registrations;
SELECT count(*) FROM storage.buckets;        -- 8
SELECT count(*) FROM pg_policies WHERE schemaname IN ('public','storage');
-- public ≥ 55, storage ≥ 8

SELECT prefix, last_number FROM registration_counters;
```

- [ ] New registration persists after page refresh
- [ ] File upload lands in correct bucket (if applicable)

---

## Step 11 — Start 48-Hour Observation Period

| Monitor | Threshold | Action |
|---------|-----------|--------|
| Registration API 5xx | > 1% for 5 min | Rollback deploy |
| Registration lookup 200 without auth | Any occurrence | **Immediate rollback** |
| Payment webhook failures | > 3 consecutive | Check Razorpay + env secrets |
| Supabase connection errors | Any spike | Check DATABASE_URL pooler |
| Error logs (Vercel) | New Firebase errors | Investigate stale code path |

**Observation log:** Record deploy ID, import counts, first registration ID, operator sign-off times.

---

## Post-Observation Cleanup

- [ ] Remove `FIREBASE_SERVICE_ACCOUNT_JSON` from all Vercel environments
- [ ] Remove `firebase-admin` dev dependency if added temporarily
- [ ] Update privacy policy copy (Firebase → Supabase)
- [ ] Re-run `FINAL_GO_LIVE_AUTHORIZATION.md` assessment → target ≥ 85/100

---

*Operator checklist — no steps executed during this audit.*
