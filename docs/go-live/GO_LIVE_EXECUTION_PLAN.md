# Go-Live Execution Plan

**Audit date:** 2026-06-12  
**Status:** Plan only — **do not execute without explicit approval**

---

## Preconditions

- [ ] Stakeholder sign-off on canonical domain: `https://www.shikshamahakumbh.com`
- [ ] Maintenance window scheduled
- [ ] Firestore + Firebase Storage backup completed
- [ ] Supabase project backup / PITR enabled
- [ ] Razorpay webhook change window agreed

---

## Phase 1 — Staging validation (no production impact)

### 1.1 Environment

```bash
# Copy env template and fill Supabase + secrets (local or staging project)
cp .env.example .env.local
# Set NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
# Set REGISTRATION_BACKEND=supabase (or unset)
# Remove FIREBASE_* vars

node scripts/staging-env-check.mjs
node scripts/staging-security-check.mjs
```

### 1.2 Database

```bash
npx prisma validate
npx prisma migrate status
npx prisma migrate deploy          # staging DATABASE_URL only
node scripts/supabase/seed-rbac.mjs
npm run seed:cms                   # if CMS content needed
```

### 1.3 Supabase console (manual)

- [ ] Create storage buckets: `registrations`, `documents`, `gallery`, `brochures`, `committee`, `downloads`
- [ ] Apply SQL from `supabase/policies/*.sql` via SQL editor
- [ ] Create Supabase Auth users for admins; link in `users.auth_user_id`

### 1.4 Build

```bash
npm ci
npm run build
npx tsc --noEmit
```

---

## Phase 2 — Data migration (staging dry-run first)

### 2.1 Export Firestore

```bash
npm i -D firebase-admin   # temporary
export FIREBASE_SERVICE_ACCOUNT_JSON='...'   # from secure vault
npm run firebase:export -- --out=./exports/firebase-staging
```

### 2.2 Import to staging Postgres

```bash
export DATABASE_URL='...staging...'
export DIRECT_URL='...staging...'
npm run firebase:import -- --in=./exports/firebase-staging
```

### 2.3 Validate counts

Compare export `manifest.json` totals vs:

```sql
SELECT COUNT(*) FROM registrations;
SELECT COUNT(*) FROM payment_records;
SELECT COUNT(*) FROM uploaded_files;
SELECT * FROM registration_counters;
```

### 2.4 Storage migration (manual/script gap)

- Export Firebase Storage manifest (not yet automated)
- Upload to Supabase buckets
- Insert `uploaded_files` rows or rewrite URLs in metadata

**Do not proceed to production until staging counts match.**

---

## Phase 3 — Vercel production config (no deploy yet)

Documented commands — **run only when approved:**

```bash
# Set canonical site URL
vercel env add NEXT_PUBLIC_SITE_URL production
# https://www.shikshamahakumbh.com

# Explicit Prisma URLs (recommended)
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production

# Mirror admin + Supabase vars on Preview
vercel env add NEXT_PUBLIC_SITE_URL preview
vercel env add ADMIN_SESSION_SECRET preview
# ... (full list in VERCEL_ENV_AUDIT.md)

# Remove obsolete secret
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON production
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON preview
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON development
```

---

## Phase 4 — Production migration + deploy

### 4.1 Import production data

```bash
npm run firebase:export -- --out=./exports/firebase-prod
npm run firebase:import -- --in=./exports/firebase-prod
node scripts/supabase/seed-rbac.mjs
```

### 4.2 Deploy

```bash
git push origin main          # only when approved
vercel --prod                 # or CI deploy hook
```

### 4.3 Post-deploy config

- [ ] Razorpay Dashboard → Webhook URL → `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook`
- [ ] Google Search Console → submit new sitemap
- [ ] Verify domain redirects (apex → www)

---

## Phase 5 — Smoke tests (read-only + controlled writes on staging first)

```bash
# Public read checks
node scripts/production-smoke-test.mjs https://www.shikshamahakumbh.com

# Health
curl https://www.shikshamahakumbh.com/api/v2/health

# Security (expect 401 without auth)
curl -i https://www.shikshamahakumbh.com/api/registration/test-id

# Admin login (manual): /admin → email/password

# Registration submit (staging only, with test data + captcha)
# POST /api/registration/submit

# Razorpay test webhook (dashboard test mode or signed curl with test secret)
```

See also: `docs/deployment/POST_DEPLOY_SMOKE_TESTS.md`

---

## Rollback plan

| Trigger | Action |
|---------|--------|
| Deploy breaks site | Vercel → instant rollback to previous deployment |
| Bad migration | Stop traffic; restore Supabase from backup; do **not** re-run import |
| Payment webhook errors | Revert Razorpay webhook URL to last known good |
| SEO wrong domain | Fix `NEXT_PUBLIC_SITE_URL` + redeploy (no DB rollback) |

**Recovery time objective:** < 30 min for deploy rollback; migration rollback depends on Supabase backup (hours).

---

## Ownership checklist

| Task | Owner |
|------|-------|
| Domain DNS + Vercel domains | DevOps |
| Env vars | DevOps |
| Firestore export | Backend |
| Supabase RLS + buckets | Backend / DBA |
| Razorpay webhook | Finance + Backend |
| SEO reindex | Marketing |
| Admin user creation | Super Admin |

---

**This plan is documentation only. No steps were executed during the G0–G8 audit.**
