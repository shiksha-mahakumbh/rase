# Production Deployment Checklist

**Date:** June 2026  
**Target:** Shiksha Mahakumbh Phase A–C + P0  
**Decision baseline:** Deployment score 78/100

---

## Phase 0 — Pre-flight (must complete)

### Domain & DNS

- [ ] Stakeholder confirms canonical: `https://shikshamahakumbh.com`
- [ ] `shikshamahakumbh.com` assigned to Vercel Production on `rase-co-in`
- [ ] `NEXT_PUBLIC_SITE_URL` updated to `.com` on all Vercel environments
- [ ] Razorpay webhook URL confirmed: `https://shikshamahakumbh.com/api/payments/razorpay-webhook`

### Environment (Vercel Production)

- [ ] `ADMIN_OPS_SECRET` ✅ (present)
- [ ] `ADMIN_SESSION_SECRET` ✅
- [ ] `REGISTRATION_LOOKUP_SECRET` ✅
- [ ] `RAZORPAY_WEBHOOK_SECRET` ✅
- [ ] `NEXT_PUBLIC_SUPABASE_URL` ✅
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ✅
- [ ] `DATABASE_URL` mapped (from `POSTGRES_PRISMA_URL` or explicit)
- [ ] `DIRECT_URL` mapped (from `POSTGRES_URL_NON_POOLING` or explicit)
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` ✅
- [ ] `RECAPTCHA_*` ✅
- [ ] `RAZORPAY_KEY_*` (live keys — intentional)

### Local verification commands

```bash
node scripts/staging-env-check.mjs       # 21/21
node scripts/staging-db-url-audit.mjs    # REMOTE_SUPABASE_CONFIGURED
node scripts/staging-security-check.mjs  # 9/9
npx tsc --noEmit
npx prisma validate
npm run build                            # exit 0
```

---

## Phase 1 — Database

### Migrations (7/7 applied ✅)

| # | Migration | Status |
|---|-----------|--------|
| 1 | `20250609_init` | ✅ |
| 2 | `20250610_phase3` | ✅ |
| 3 | `20250620_phase35_cms_foundation` | ✅ |
| 4 | `20250621_phase_b_cms` | ✅ |
| 5 | `20250622_phase_b5_analytics` | ✅ |
| 6 | `20250629_phase_s2_foundation` | ✅ |
| 7 | `20250701_phase_c_organizational_cms` | ✅ |

```bash
npm run db:migrate:deploy   # re-run to confirm; expect "no pending"
```

### Seeds

| Script | Status | Action |
|--------|--------|--------|
| `seed:cms` | ⚠️ Fixed, re-run needed | `npm run seed:cms` |
| `seed-s2-content` | ✅ Done | — |
| `seed-s2-hi` | ⚠️ Fixed, re-run needed | `node scripts/seed-s2-hi.mjs --publish` |
| `seed-phase-c-content` | ✅ Done | — |

```bash
npm run seed:cms
node scripts/seed-s2-hi.mjs --publish
node scripts/staging-db-check.mjs
```

**Expected counts after full seed:** homepage ≥1, notices >0, committees ≥2, speakers ≥2

---

## Phase 2 — Firebase

```bash
firebase deploy --only firestore:rules,storage
```

- [ ] Console: `registrations` → `create: false`
- [ ] Console: storage → `write: false` for clients
- [ ] Confirm **NOT** deploying `firestore.rules.production-backup`

---

## Phase 3 — Build artifacts

| Check | Status |
|-------|--------|
| Route conflict (`downloads/[id]`) | ✅ Fixed |
| `postinstall: prisma generate` | ✅ Added |
| Build exit code 0 | ✅ Verified (300 pages) |
| ESLint errors | ✅ None (warnings only) |
| SSG pages with DB | ✅ 300 generated with cloud DB |

### Route generation

| Type | Count (approx) |
|------|----------------|
| Static (○) | Majority |
| SSG (●) | CMS dynamic slugs |
| Dynamic (ƒ) | API routes, admin |

No unresolved dynamic segment conflicts.

---

## Phase 4 — CMS content verification

| Public route | Data source | Seed status |
|--------------|-------------|-------------|
| `/` | `loadCmsHomepage()` | ⚠️ Re-seed needed |
| `/speakers` | Phase C | ✅ 2 speakers |
| `/events` | Phase C | ✅ 2 events |
| `/partners` | Phase C | ✅ 3 partners |
| `/committee/*` | Phase C | ✅ 2 committees |
| `/media-center` | Phase C | ✅ 3 items |
| `/press` | S2 seed | ✅ |
| `/gallery` | S2 seed | ✅ |
| `/noticeboard` | seed:cms | ⚠️ 0 notices — re-seed |
| `/downloads` | seed:cms | ⚠️ 0 downloads — re-seed |

---

## Phase 5 — Analytics

| Component | Status |
|-----------|--------|
| `visitor_sessions` table | ✅ Migrated |
| `visitor_analytics` table | ✅ Migrated |
| `POST /api/v2/analytics/track` | ✅ Code ready |
| `GET /api/v2/analytics/stats` | ✅ Requires DB at runtime |
| `VisitorPageTracker` client | ✅ In `ClientChrome` |
| Vercel geo headers | ✅ Used |

- [ ] Post-deploy: visit homepage → check `visitor_analytics` row for today

---

## Phase 6 — Webhook endpoints

| Endpoint | Method | Secret | Domain must match |
|----------|--------|--------|-------------------|
| `/api/payments/razorpay-webhook` | POST | `RAZORPAY_WEBHOOK_SECRET` | `.com` |
| `/api/registration/submit` | POST | Firebase + reCAPTCHA | Either |
| `/api/v2/health` | GET | None | Either |

### Razorpay events to enable

- [ ] `payment.captured`
- [ ] `payment.failed`
- [ ] `order.paid`

---

## Phase 7 — Deploy

```bash
npx vercel --prod
```

- [ ] Build succeeds on Vercel (check deployment logs)
- [ ] No Prisma client generation errors
- [ ] Domain resolves to new deployment

---

## Phase 8 — Post-deploy verification

### Security smoke tests

```bash
curl -s -o /dev/null -w "%{http_code}" https://shikshamahakumbh.com/api/registration/SMK2026-000001
# Expect: 401

curl -s https://shikshamahakumbh.com/api/v2/health
# Expect: 200 JSON
```

### Functional smoke tests

- [ ] Homepage loads with CMS sections
- [ ] Registration submit (test mode / small amount)
- [ ] Admin login → `/admin/cms` loads
- [ ] Razorpay test webhook → Firestore `paymentStatus: Paid`
- [ ] Sitemap: all URLs on `.com`
- [ ] `robots.txt` sitemap pointer correct

---

## Rollback

```bash
# Vercel Dashboard → Deployments → Previous → Promote to Production
# Do NOT rollback Prisma migrations — forward-fix only
# If webhook issues: disable webhook in Razorpay dashboard temporarily
```

---

## Sign-off

| Role | Name | Date | GO/NO GO |
|------|------|------|----------|
| Release Manager | | | |
| DevOps | | | |
| Security | | | |
| QA | | | |
| Stakeholder (domain) | | | |
