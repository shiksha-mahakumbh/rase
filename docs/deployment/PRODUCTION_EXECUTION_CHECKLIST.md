# Production Execution Checklist

**Date:** 2026-06-11  
**Objective:** Move platform from **NO GO** → **GO**  
**Canonical:** `https://www.shikshamahakumbh.com`  
**Project:** `dhe-projects/rase-co-in`  
**Constraint:** Checklist only — **not executed in this audit**

---

## Pre-flight

- [ ] Stakeholder approves canonical domain
- [ ] Maintenance window communicated (15–30 min)
- [ ] Vercel CLI authenticated (`npx vercel whoami`)
- [ ] Firebase CLI authenticated (`firebase login`)
- [ ] Razorpay Dashboard access confirmed
- [ ] Supabase production credentials available

---

## Step 1 — Verify environment variables

**Duration:** ~30 min | **Owner:** Ops

### 1.1 Vercel Dashboard → `rase-co-in` → Settings → Environment Variables

Set on **Production, Preview, Development:**

```bash
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
```

Map Prisma aliases (copy values from existing vars):

```bash
DATABASE_URL     = <value of POSTGRES_PRISMA_URL>
DIRECT_URL       = <value of POSTGRES_URL_NON_POOLING>
```

### 1.2 Copy Production → Preview

```
ADMIN_OPS_SECRET
ADMIN_SESSION_SECRET
REGISTRATION_LOOKUP_SECRET
RAZORPAY_WEBHOOK_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RECAPTCHA_SECRET_KEY
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

### 1.3 Verify presence (CLI)

```powershell
Set-Location "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"
npx vercel env ls
```

### 1.4 Local developer env

```bash
# .env and .env.local
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
```

### 1.5 Gate

```powershell
node scripts/staging-env-check.mjs
# Expect: 21/21 PASS (local)
```

**☐ Step 1 complete**

---

## Step 2 — Run migrations

**Duration:** ~10 min | **Owner:** Ops

```powershell
Set-Location "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"

npx prisma validate
npx prisma generate
npm run db:migrate:deploy
```

Verify:

```powershell
node scripts/staging-db-check.mjs
# Expect: connected=true, migrations=7/7, tables=15/15
```

**☐ Step 2 complete**

---

## Step 3 — Run seeds

**Duration:** ~15 min | **Owner:** Ops

```powershell
Set-Location "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"

npm run seed:cms
node scripts/seed-s2-content.mjs --publish
node scripts/seed-s2-hi.mjs --publish
node scripts/seed-phase-c-content.mjs --publish
```

Verify:

```powershell
node scripts/staging-db-check.mjs
# Gate: notices > 0, downloads > 0
```

**☐ Step 3 complete**

---

## Step 4 — Deploy Firebase rules

**Duration:** ~15 min | **Owner:** Ops

```powershell
Set-Location "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"

firebase login
firebase use shiksha-mahakumbh-abhiyan
firebase deploy --only firestore:rules,storage
```

### Console verification

1. Firestore → Rules → `registrations` → `allow create: if false` (L24)
2. Storage → Rules → `registrations/{type}/**` → `allow write: if false` (L12)
3. Rules simulator: anonymous create on `registrations/test` → **denied**

**☐ Step 4 complete**

---

## Step 5 — Local pre-deploy build gate

**Duration:** ~10 min | **Owner:** Dev/Ops

```powershell
Set-Location "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"

npm install
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
node scripts/staging-security-check.mjs
node scripts/staging-db-url-audit.mjs
```

**Gate:** `npm run build` exit 0 (~300 pages); security check 9/9 PASS.

**☐ Step 5 complete**

---

## Step 6 — Deploy Vercel production

**Duration:** ~10–20 min | **Owner:** Ops

```powershell
Set-Location "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"
npx vercel --prod
```

Confirm in Vercel Dashboard:
- Build exit 0
- Deployment promoted to **Production**
- Domain `www.shikshamahakumbh.com` aliases to new deployment

### 6.1 Razorpay webhook URL (Dashboard)

```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

**☐ Step 6 complete**

---

## Step 7 — Smoke tests

**Duration:** ~15 min | **Owner:** QA/Ops

Execute full suite in `POST_DEPLOY_SMOKE_TESTS.md`.

**Critical gate:**

```powershell
curl.exe --max-time 30 -s -o NUL -w "%{http_code}" `
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# MUST print: 401
```

**☐ Step 7 complete — all gates PASS**

---

## Step 8 — Rollback (if smoke tests fail)

### 8.1 Immediate security regression (401 fails)

```text
Vercel Dashboard → Deployments → [previous deployment] → ⋮ → Promote to Production
```

Or CLI:

```powershell
npx vercel rollback
```

### 8.2 Domain/SEO wrong but security OK

Do **not** rollback. Fix `NEXT_PUBLIC_SITE_URL` → redeploy.

### 8.3 Payment webhook broken

1. Disable webhook in Razorpay Dashboard temporarily
2. Fix `RAZORPAY_WEBHOOK_SECRET` if misconfigured
3. Redeploy

### 8.4 Database issues

- **Never** run `prisma migrate reset` on production
- Forward-fix with targeted migration or data repair

### 8.5 Firebase rules regression

```powershell
# Re-deploy strict rules from repo
firebase deploy --only firestore:rules,storage
```

**☐ Rollback procedure documented and understood**

---

## Step 9 — Sign-off

- [ ] All `POST_DEPLOY_SMOKE_TESTS.md` gates PASS
- [ ] Firebase Console rules verified
- [ ] `FINAL_RELEASE_AUTHORIZATION.md` updated to GO
- [ ] 48-hour soak monitoring scheduled

---

## Execution log (fill at runtime)

| Step | Start | End | Operator | Result | Notes |
|------|-------|-----|----------|--------|-------|
| 1 Env | | | | | |
| 2 Migrate | | | | | |
| 3 Seeds | | | | | |
| 4 Firebase | | | | | |
| 5 Build | | | | | |
| 6 Deploy | | | | | |
| 7 Smoke | | | | | |

---

**This checklist is documentation only. No steps executed in this audit.**
