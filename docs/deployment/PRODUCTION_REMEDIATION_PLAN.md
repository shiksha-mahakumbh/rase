# Production Remediation Plan

**Date:** 2026-06-11  
**Objective:** Move platform from **NO GO** → **GO** with minimal risk  
**Constraints:** No Phase D, no business-logic changes, no schema redesign

---

## Pre-conditions

- [ ] Stakeholder approves canonical: `https://www.shikshamahakumbh.com`
- [ ] Maintenance window communicated (15–30 min)
- [ ] Firebase CLI authenticated
- [ ] Vercel CLI authenticated (`internsdhe` / `dhe-projects/rase-co-in`)

---

## Step 1 — Vercel environment updates (Dashboard)

**Duration:** ~30 minutes

### 1.1 Set canonical (all environments)

```
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
```

Environments: **Production**, **Preview**, **Development**

### 1.2 Map Prisma URLs (all environments)

```
DATABASE_URL = <copy POSTGRES_PRISMA_URL value>
DIRECT_URL   = <copy POSTGRES_URL_NON_POOLING value>
```

### 1.3 Copy to Preview (from Production)

- `ADMIN_OPS_SECRET`
- `ADMIN_SESSION_SECRET`
- `REGISTRATION_LOOKUP_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### 1.4 Update local env (developer machine)

```bash
# .env and .env.local
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
```

---

## Step 2 — Local pre-deploy verification

**Duration:** ~10 minutes

```bash
cd rase

npm install
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build

node scripts/staging-security-check.mjs    # expect 9/9 PASS
node scripts/staging-db-url-audit.mjs        # expect REMOTE_SUPABASE_CONFIGURED
node scripts/staging-env-check.mjs           # expect 21/21 PASS
```

**Gate:** `npm run build` exit code **0** (300 pages).

---

## Step 3 — Database seeds (if needed)

**Duration:** ~15 minutes

```bash
npm run db:migrate:deploy
npm run seed:cms
node scripts/seed-s2-content.mjs --publish
node scripts/seed-s2-hi.mjs --publish
node scripts/seed-phase-c-content.mjs --publish
node scripts/staging-db-check.mjs
```

**Gate:** `notices > 0`, `downloads > 0` after `seed:cms`.

---

## Step 4 — Firebase rules deploy

**Duration:** ~15 minutes

```bash
firebase use shiksha-mahakumbh-abhiyan
firebase deploy --only firestore:rules,storage
```

### Console verification

1. Firestore → Rules → confirm `registrations` → `allow create: if false`
2. Storage → Rules → confirm all paths → `allow write: if false`
3. Rules simulator: anonymous create on `registrations` → **denied**

**Gate:** Console rules text matches `firebase/firestore.rules` (not backup file).

---

## Step 5 — Razorpay webhook URL

**Duration:** ~10 minutes (Dashboard)

Update Razorpay Dashboard webhook to:

```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

Send test event → verify Firestore `paymentStatus` updates.

---

## Step 6 — Production deployment

**Duration:** ~10–20 minutes

```bash
npx vercel --prod
```

Wait for build completion in Vercel Dashboard. Confirm deployment promoted to Production.

---

## Step 7 — Smoke tests (mandatory)

**Duration:** ~15 minutes

### 7.1 Security (P0)

```bash
# MUST return 401
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
```

```bash
# With valid token (from registration success flow) — expect 200 summary WITHOUT email
curl -s "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001?token=<TOKEN>"
```

### 7.2 Health

```bash
curl -s "https://www.shikshamahakumbh.com/api/v2/health"
# Expect: 200 JSON (not 404 HTML)
```

### 7.3 Domain / SEO

```bash
curl -s "https://www.shikshamahakumbh.com/sitemap.xml" | findstr /i "shikshamahakumbh"
# All <loc> must use shikshamahakumbh.com — zero rase.co.in

curl -s "https://www.shikshamahakumbh.com/robots.txt"
# Sitemap: must point to www.shikshamahakumbh.com/sitemap.xml
```

### 7.4 Homepage canonical

```bash
curl -s "https://www.shikshamahakumbh.com/" | findstr /i "canonical"
# Expect: https://www.shikshamahakumbh.com
```

### 7.5 Razorpay webhook

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST \
  "https://www.shikshamahakumbh.com/api/payments/razorpay-webhook"
# Expect: 401 (no signature) — NOT 404
```

### 7.6 Functional

- [ ] Homepage loads with CMS sections
- [ ] `/registration` loads
- [ ] `/admin` login works
- [ ] `/noticeboard` loads

---

## Step 8 — Rollback plan

If smoke tests fail:

```bash
# Vercel Dashboard → Deployments → [previous known-good] → Promote to Production
```

| Failure type | Action |
|--------------|--------|
| Security regression (401 fails) | Rollback immediately |
| Domain wrong in sitemap | Fix env → redeploy (do not rollback if security OK) |
| Payment webhook broken | Disable webhook in Razorpay dashboard temporarily |
| DB issues | Do **NOT** run `prisma migrate reset` — forward-fix only |

---

## Step 9 — Post-launch soak

- 48-hour monitoring of registration lookups (should be 401 without auth)
- Monitor Razorpay webhook delivery logs
- Google Search Console: submit new sitemap

---

## Estimated timeline

| Phase | Duration |
|-------|----------|
| Steps 1–2 | 1 hour |
| Steps 3–5 | 1 hour |
| Step 6–7 | 1 hour |
| Soak | 48 hours |
| **Earliest GO sign-off** | **~3 hours ops + 48h soak** |

**This plan documents steps only. No steps executed in this audit.**
