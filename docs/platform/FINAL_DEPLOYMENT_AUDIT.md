# Final Production Deployment Audit

**Date:** May 2026  
**Platforms:** Vercel, Supabase, Firebase, Razorpay  
**Status:** Deployment paused per project mandate — this audit is pre-launch readiness only

---

## Platform overview

| Platform | Role | Cutover status |
|----------|------|----------------|
| **Vercel** | Next.js hosting, serverless APIs | Active target |
| **Supabase** | PostgreSQL (Prisma), storage, RLS | Parallel — CMS path active |
| **Firebase** | Registration, Firestore, Storage | **Active** — do not remove |
| **Razorpay** | Payment processing | Active |

`REGISTRATION_BACKEND=firebase` — unchanged per mandate.

---

## Vercel configuration

**Current:** `vercel.json` contains only `{ "framework": "nextjs" }` — minimal.

| Gap | Recommendation |
|-----|----------------|
| No cron jobs | Add sitemap regeneration cron if needed |
| No edge config | Consider edge for public read APIs |
| Preview env isolation | Ensure production secrets not on Preview |
| No build command override | Default `next build` — verify Prisma generate in build |
| No function region | Set `ap-south-1` proximity to Supabase |

**Build checklist:**
- [ ] `prisma generate` runs in build (verify `package.json` postinstall)
- [ ] `DATABASE_URL` set for build-time if any SSG needs DB
- [ ] Node 20.x runtime

---

## Environment Variables Checklist

### Required — Core site

| Variable | Server/Client | In `.env.example` | In `verify-env` |
|----------|---------------|--------------------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | Client | ✅ | ✅ |
| `ADMIN_OPS_SECRET` | Server | ✅ | ❌ **Add to verify-env** |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Server | ✅ | ✅ |

### Required — Registration security

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client |
| `RECAPTCHA_SECRET_KEY` | Server — required in production |
| `RECAPTCHA_MIN_SCORE` | Default 0.5 |

### Required — Payments (Razorpay)

| Variable | Notes |
|----------|-------|
| `RAZORPAY_KEY_ID` | Server |
| `RAZORPAY_KEY_SECRET` | Server — never client |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client checkout |
| `RAZORPAY_WEBHOOK_SECRET` | **Required in production** — webhook 503 without it |

### Required — Email (SMTP)

| Variable | Notes |
|----------|-------|
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_PORT` | Or Brevo vars from `.env.supabase.example` |
| `REGISTRATION_EMAIL_SECRET` | Must differ from `ADMIN_OPS_SECRET` |
| `REGISTRATION_EMAIL_REQUIRE_SECRET` | Set `true` in production |

### Required — Supabase / Prisma (CMS)

| Variable | In `.env.supabase.example` | In `verify-env` |
|----------|---------------------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ |
| `DATABASE_URL` | ✅ | ❌ |
| `DIRECT_URL` | ✅ | ❌ |
| `REGISTRATION_BACKEND` | ✅ (`firebase`) | ❌ |

### Optional — Admin

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_ADMIN_EMAILS` | Bootstrap — minimize exposure |
| `ADMIN_BOOTSTRAP_EMAILS` | Server-only preferred — not in `.env.example` |

### Optional — Analytics / monitoring

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_GA_ID`, `GTM_ID`, `CLARITY_ID` | Analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring |
| `VISITOR_COUNTER_USE_FIRESTORE` | Default true |

**Action:** Merge `.env.example` + `.env.supabase.example` into unified production checklist; extend `verify-env.mjs`.

---

## Database Checklist

- [ ] Run `npx prisma migrate deploy` on production Supabase (migration `20250701_phase_c_organizational_cms` pending)
- [ ] Verify `DATABASE_URL` uses pooler (port 6543, `pgbouncer=true`)
- [ ] Verify `DIRECT_URL` for migrations only (port 5432)
- [ ] Apply RLS policies from `supabase/policies/*.sql` in Supabase dashboard
- [ ] Enable RLS on all tables matching Prisma schema
- [ ] Run `node scripts/supabase/seed-rbac.mjs` if Supabase Auth RBAC needed later
- [ ] Seed CMS content:
  - `node scripts/seed-s2-content.mjs --publish`
  - `node scripts/seed-phase-c-content.mjs --publish`
- [ ] Verify connection pooling limits for Vercel serverless concurrency
- [ ] Set up database backup schedule in Supabase
- [ ] Plan visitor analytics retention/archive job

---

## Storage Checklist

### Supabase Storage

- [ ] Create buckets: `registrations`, `brochures`, `media`, `committee`, `downloads`
- [ ] Apply storage policies from `supabase/policies/storage.sql` (currently comments only — **must implement**)
- [ ] Deny public write on all buckets
- [ ] Configure CDN/cache headers on public media bucket
- [ ] Verify CORS for upload routes

### Firebase Storage

- [ ] Deploy `firebase/storage.rules` (client writes denied)
- [ ] Audit signed URL TTL (currently ~10 years on registration upload — **reduce before launch**)
- [ ] Confirm bucket permissions for registration documents only

---

## SMTP Checklist

- [ ] SMTP credentials configured (SMTP or Brevo)
- [ ] `SMTP_FROM` domain has SPF, DKIM, DMARC records
- [ ] Test registration confirmation email end-to-end
- [ ] Test contact form notification to admin inbox
- [ ] Set `REGISTRATION_EMAIL_REQUIRE_SECRET=true`
- [ ] Rate limit email sending route (currently in-memory only)
- [ ] Monitor bounce/complaint handling

---

## Razorpay Checklist

- [ ] Live keys in production environment (not test keys)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` matches live `RAZORPAY_KEY_ID`
- [ ] Webhook URL: `https://<domain>/api/payments/razorpay-webhook`
- [ ] `RAZORPAY_WEBHOOK_SECRET` configured — webhook returns 503 without it in production
- [ ] Test payment flow: create-order → checkout → verify → webhook
- [ ] Confirm no duplicate webhook handlers (`/api/payments/*` vs legacy `/api/*`)
- [ ] **Known gap:** Server-side fee validation not implemented — add before high-traffic launch
- [ ] Monitor failed payments in admin dashboard

---

## Analytics Checklist

- [ ] GA4 / GTM configured with `NEXT_PUBLIC_GA_ID` / `GTM_ID`
- [ ] Microsoft Clarity (optional) — `CLARITY_ID`
- [ ] Visitor counter: confirm Firestore or Prisma path
- [ ] CMS analytics dashboard (`/admin/cms/analytics`) receiving events
- [ ] `/api/v2/analytics/track` endpoint tested
- [ ] Bot filtering configured in visitor analytics service
- [ ] Cookie consent aligned with analytics loading (`ClientChrome.tsx`)

---

## SEO Checklist

- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain (canonical base)
- [ ] `robots.ts` reviewed — disallows `/admin`, `/api/`, data routes
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Run CMS seed so `generateSitemapIndex()` includes dynamic slugs
- [ ] Add `/speakers`, `/partners`, `/hi/*` to sitemap
- [ ] 301 redirect `/keynotespeakers` → `/speakers`
- [ ] noindex on orphan form routes (`/addkeynotespeaker`, etc.)
- [ ] OG image: replace `sLogo.png` with proper 1200×630 asset
- [ ] Google Search Console property verified
- [ ] Bing Webmaster Tools (optional)

---

## Launch Checklist

### Pre-launch (blockers)

- [ ] **Fix C1:** Auth-protect registration lookup APIs
- [ ] **Fix C2:** Replace forgeable cookie on data viewer pages
- [ ] **Fix C3:** Deploy strict Firebase rules (not production-backup)
- [ ] Run all pending Prisma migrations
- [ ] Publish CMS content (seeds with `--publish`)
- [ ] `npm run verify:env` passes with extended checks
- [ ] `npx tsc --noEmit` passes
- [ ] Smoke test: registration flow end-to-end
- [ ] Smoke test: admin CMS CRUD for all 22 modules
- [ ] Smoke test: public routes with CMS + fallback

### Launch day

- [ ] DNS pointed to Vercel
- [ ] SSL certificate active
- [ ] Environment variables set on Vercel production
- [ ] Firebase rules deployed
- [ ] Supabase RLS policies applied
- [ ] Razorpay webhook registered
- [ ] Send test registration + payment
- [ ] Monitor error rates (Sentry if configured)
- [ ] Monitor Vercel function logs

### Post-launch (48h)

- [ ] Lighthouse audit on top 10 routes
- [ ] Search Console sitemap submit
- [ ] Review visitor analytics for anomalies
- [ ] Review contact/feedback inbox
- [ ] Confirm no PII in public API responses

---

## Rollback Checklist

- [ ] Vercel: instant rollback to previous deployment via dashboard
- [ ] Database: Supabase point-in-time recovery enabled (verify plan)
- [ ] Firebase: rules rollback procedure documented
- [ ] Razorpay: webhook can be disabled without code rollback
- [ ] CMS content: EntityRevision snapshots allow per-entity restore
- [ ] DNS: TTL low enough for quick revert (300s recommended during launch window)
- [ ] Keep previous Vercel deployment pinned for 7 days
- [ ] Document rollback decision tree: code vs DB vs content vs Firebase rules

---

## DevOps gaps

| Gap | Severity | Fix |
|-----|----------|-----|
| `verify-env` incomplete | High | Extend for Supabase + ADMIN_OPS_SECRET |
| Split env templates | Medium | Unified production doc |
| No distributed rate limiting | High | Upstash Redis / Vercel KV |
| No CI migration step | Medium | Add to GitHub Actions |
| No staging environment documented | Medium | Create Vercel Preview with staging DB |
| No uptime monitoring | Low | Add Vercel monitoring or external ping |
