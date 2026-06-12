# Final Deployment Sequence

**Date:** 2026-05-29  
**Role:** Production Release Commander  
**Platform:** Shiksha Mahakumbh (`dhe-projects/rase-co-in`)  
**Pre-condition:** Git clean, 10 commits ahead, build 303 pages, security 15/15, buckets 8/8, public RLS 55

**Constraints for this document:** Operator executes. No automated deploy during documentation.

---

## Launch Sequence Overview

| Step | Action | Est. time |
|------|--------|-----------|
| 1 | `git push origin main` | 2 min |
| 2 | Storage SQL execution | 5 min |
| 3 | Vercel env updates | 10 min |
| 4 | Firebase export | 15–30 min |
| 5 | Firebase import | 15–45 min |
| 6 | `npx vercel --prod` | 5 min |
| 7 | Post-deploy verification | 20 min |
| **Total** | | **~1.5–2 hours** |

Detailed guides: `STORAGE_SQL_EXECUTION_GUIDE.md`, `VERCEL_CUTOVER_GUIDE.md`, `FIREBASE_MIGRATION_EXECUTION_GUIDE.md`

---

## Step 1 — Git Push

### Command

```bash
git status
git log origin/main..HEAD --oneline
git push origin main
```

### Expected output

```
git status
→ nothing to commit, working tree clean

git log origin/main..HEAD --oneline
→ 10 commits listed (d758002 through 3e6acb9)

git push origin main
→ Enumerating objects...
→ To github.com:.../rase-co-in.git
   5eea41b..3e6acb9  main -> main
```

### Verify

```bash
git log origin/main..HEAD --oneline
```

**Expected:** Empty (0 commits ahead).

---

## Step 2 — Storage SQL Execution

### Command

1. Open **Supabase Dashboard → SQL Editor**
2. Paste full contents of `supabase/policies/storage-production.sql`
3. Run

See `STORAGE_SQL_EXECUTION_GUIDE.md` for exact SQL blocks.

### Verify

```sql
SELECT count(*) FROM pg_policies WHERE schemaname = 'storage';
-- Expected: 8

SELECT count(*) FROM storage.buckets;
-- Expected: 8
```

### Expected output

| Query | Result |
|-------|--------|
| Storage policies | 8 |
| Public policies | 55 |
| Buckets | 8 |

---

## Step 3 — Vercel Env Updates

### Commands

```bash
vercel env add DATABASE_URL production
# Paste value from POSTGRES_PRISMA_URL

vercel env add DIRECT_URL production
# Paste value from POSTGRES_URL_NON_POOLING

vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://www.shikshamahakumbh.com

npx vercel env ls production
```

### Expected output

```
DATABASE_URL                    Encrypted    Production
DIRECT_URL                      Encrypted    Production
NEXT_PUBLIC_SITE_URL            Encrypted    Production
NEXT_PUBLIC_SUPABASE_URL        Encrypted    Production
NEXT_PUBLIC_SUPABASE_ANON_KEY    Encrypted    Production
SUPABASE_SERVICE_ROLE_KEY       Encrypted    Production
RAZORPAY_WEBHOOK_SECRET         Encrypted    Production
```

See `VERCEL_CUTOVER_GUIDE.md` for full mapping table.

---

## Step 4 — Firebase Export

### Commands

```bash
npm i -D firebase-admin
npx vercel env pull .env.local --environment=production
# Ensures FIREBASE_SERVICE_ACCOUNT_JSON available

npm run firebase:export -- --out=./exports/firebase
```

### Expected output

```
exported registrations: N docs
exported conclave_registrations: N docs
...
export complete: ./exports/firebase
```

### Verify

```bash
cat exports/firebase/manifest.json
```

**Expected:** JSON with `exportedAt` timestamp and per-collection `count` fields. **Record all counts.**

---

## Step 5 — Firebase Import

### Commands

```bash
npx prisma migrate deploy
npm run db:seed

npm run firebase:import -- --in=./exports/firebase
```

### Expected output

```
registrations { imported: N, skipped: 0 }
conclave_registrations { imported: N, skipped: 0 }
...
```

File created: `exports/firebase/import-summary.json`

### Verify

```sql
SELECT count(*) FROM registrations;
-- Expected: matches sum of imported counts (allowing for skipped no-email rows)

SELECT prefix, last_number FROM registration_counters;
-- Update last_number to max ID — see FIREBASE_MIGRATION_EXECUTION_GUIDE.md
```

**Counter update example:**

```sql
UPDATE registration_counters SET last_number = 42, updated_at = now()
WHERE prefix = 'SMK2026';
```

---

## Step 6 — Vercel Production Deploy

### Commands

```bash
npx prisma migrate status
npm run build
npx vercel --prod
```

### Expected output

```
Prisma migrate status
→ Database schema is up to date!

npm run build
→ ✓ Generating static pages (303/303)
→ exit 0

npx vercel --prod
→ Production: https://rase-co-in.vercel.app [copied]
→ Deploying...
→ ✅ Production: https://www.shikshamahakumbh.com [2m]
```

### Verify

```bash
npx vercel ls --prod
```

**Expected:** New deployment at top, age < 5 minutes, status ● Ready.

---

## Step 7 — Post-Deploy Verification

### 7a — Registration security

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
```

**Expected:** `401`

```bash
curl -s \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001" | head -c 200
```

**Expected:** JSON with `"error"` — **no** `email` or `contactNumber` fields.

### 7b — Domain / SEO

```bash
curl -s https://www.shikshamahakumbh.com/sitemap.xml | head -10
```

**Expected:**

```xml
<loc>https://www.shikshamahakumbh.com</loc>
```

```bash
curl -s https://www.shikshamahakumbh.com/robots.txt | findstr Sitemap
```

**Expected:**

```
Sitemap: https://www.shikshamahakumbh.com/sitemap.xml
```

### 7c — Supabase persistence

```sql
SELECT count(*) FROM registrations;        -- > 0 post-import
SELECT count(*) FROM storage.buckets;      -- 8
SELECT count(*) FROM pg_policies
WHERE schemaname IN ('public','storage');  -- 63 (55+8)
```

### 7d — Security tests (local against prod config)

```bash
npm run test:security
```

**Expected:** `15/15 PASS`

### 7e — Razorpay smoke test (manual)

- [ ] Submit test registration on production
- [ ] Complete Razorpay checkout
- [ ] Confirm webhook received (`webhook_events` row or admin log)
- [ ] Confirm `payment_records` status updated

### 7f — Start 48-hour observation

| Monitor | Threshold | Action |
|---------|-----------|--------|
| Registration 200 without auth | Any | **Immediate rollback** |
| API 5xx | > 1% for 5 min | Rollback deploy |
| Payment webhook failures | 3+ consecutive | Check secrets |

---

## Rollback Procedure

If verification fails:

```bash
# 1. Promote previous deployment in Vercel Dashboard
#    Target: dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt (2026-06-09)

# 2. Restore env if changed
vercel env add NEXT_PUBLIC_SITE_URL production
# Previous value if needed

# 3. Database — no destructive DDL
# Partial import rollback:
# DELETE FROM registrations WHERE metadata IS NOT NULL;

# 4. Keep Firebase read-only for 30 days
```

---

## GO Score Estimate After Successful Execution

### Current score: **68 / 100** (NO GO)

| Category | Max | Current | After launch |
|----------|-----|---------|--------------|
| Source & remediation | 15 | 15 | 15 |
| Build & TypeScript | 10 | 9 | 9 |
| Security (source + live) | 15 | 15* | **15** |
| Supabase infra + data | 15 | 11 | **15** |
| Domain (live canonical) | 10 | 8 | **10** |
| Vercel environment | 10 | 4 | **10** |
| Production deployed | 15 | 0 | **15** |
| Data migration penalty | — | -4 | **0** |

\*Source only today; live fails until redeploy.

### Projected score: **89 / 100 — GO**

**GO threshold:** ≥ 85/100

Deductions remaining after launch:
- Build SEO UUID warnings (-1)
- 48-hour observation not complete (informational, not scored)

Conservative estimate if Razorpay smoke test deferred: **87 / 100 — GO**

---

## Final Signoff Checklist

- [ ] Step 1: Git pushed, 0 commits ahead
- [ ] Step 2: Storage policies = 8
- [ ] Step 3: All 8 Vercel vars present
- [ ] Step 4: Export manifest recorded
- [ ] Step 5: Import counts reconciled, counter updated
- [ ] Step 6: New production deploy live
- [ ] Step 7: Registration 401, sitemap .com, Supabase rows > 0
- [ ] 48-hour observation started
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` removal scheduled (post-observation)

---

## Document Index

| Guide | Purpose |
|-------|---------|
| `STORAGE_SQL_EXECUTION_GUIDE.md` | Step 2 detail |
| `VERCEL_CUTOVER_GUIDE.md` | Step 3 detail |
| `FIREBASE_MIGRATION_EXECUTION_GUIDE.md` | Steps 4–5 detail |
| `FINAL_DEPLOYMENT_SEQUENCE.md` | This document |
| `CUTOVER_READY_SIGNOFF.md` | Pre-launch status |
| `FINAL_GO_LIVE_AUTHORIZATION.md` | Authorization framework |

---

*Documentation complete — no push, deploy, SQL execution, or migration performed — 2026-05-29.*
