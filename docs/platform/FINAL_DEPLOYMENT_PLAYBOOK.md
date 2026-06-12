# Final Deployment Playbook

**Date:** May 2026  
**Stack:** Vercel · Supabase · GitHub · Firebase (registration)

---

## Environment architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   GitHub    │────▶│   Vercel     │────▶│ Supabase Postgres│
│   (main)    │     │  (Next.js)   │     │ + Storage        │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
                    ┌──────▼───────┐
                    │   Firebase   │
                    │ (registration)│
                    └──────────────┘
```

---

## Required environment variables

### Vercel (production)

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | ✅ | Supabase pooler |
| `DIRECT_URL` | ✅ | Migrations |
| `ADMIN_OPS_SECRET` | ✅ | CMS gateway |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ | Admin auth |
| `NEXT_PUBLIC_SITE_URL` | ✅ | https://www.rase.co.in |
| `REGISTRATION_BACKEND` | ✅ | `firebase` (unchanged) |
| `RECAPTCHA_SECRET` | ✅ | Contact forms |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ✅ | Client |
| `RAZORPAY_*` | ✅ | Payment (unchanged) |

### Supabase

| Item | Action |
|------|--------|
| Apply all migrations | `npx prisma migrate deploy` |
| Apply RLS policies | 6 SQL files in `supabase/policies/` |
| Storage buckets | media, downloads, gallery |
| Connection pooling | Enable PgBouncer |

---

## Production checklist

### Pre-deploy (S0)

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds locally
- [ ] Migration `20250622_phase_b5_analytics` reviewed
- [ ] `npm run seed:cms` tested on staging
- [ ] RLS policies applied on staging Supabase
- [ ] Firebase service account valid
- [ ] No secrets in client bundle audit

### Deploy

- [ ] Deploy to Vercel preview first
- [ ] Smoke test: `/`, `/hi`, `/noticeboard`, `/downloads`
- [ ] Visitor counter `source: "supabase"` (not fallback)
- [ ] Admin CMS login + save test
- [ ] Firebase registration submit test (unchanged)
- [ ] Razorpay test payment (staging keys)

### Post-deploy

- [ ] Submit sitemap to Google Search Console
- [ ] Verify hreflang in GSC
- [ ] Monitor Vercel Web Vitals 48h
- [ ] Check `/api/v2/health`
- [ ] Verify robots.txt and sitemap.xml

---

## Staging checklist

| Step | Command/Action |
|------|----------------|
| Branch deploy | `staging` or preview PR |
| Seed CMS | `npm run seed:cms` |
| Hindi seed | Extend seed script |
| Analytics test | POST /api/visitors, verify counts |
| Admin exclusion | Visit /admin, confirm no tracking |
| Lighthouse mobile | Homepage, noticeboard ≥90 |

---

## Backup strategy

| Asset | Method | Frequency |
|-------|--------|-----------|
| Supabase Postgres | Supabase daily backups + PITR | Daily |
| Media storage | Supabase storage backup | Weekly |
| Firebase registrations | Firebase export | Weekly |
| CMS content export | `seed:cms` reverse + DB dump | Before major migration |
| Git repository | GitHub | Continuous |

### Recovery RTO/RPO targets

| Tier | RPO | RTO |
|------|-----|-----|
| CMS content | 24h | 4h |
| Registrations | 1h | 2h |
| Full site | 24h | 8h |

---

## Rollback strategy

### Vercel rollback

```
1. Vercel Dashboard → Deployments → Promote previous deployment
2. Verify /api/v2/health
3. If migration issue: DO NOT auto-rollback DB — assess separately
```

### Database rollback

```
1. Prisma migrations are forward-only
2. Use Supabase PITR for catastrophic failure
3. Never rollback Firebase registration data from Supabase migration
```

### CMS content rollback

```
1. PageRevision API exists — build UI in Tier 2
2. Manual: restore from seed script + DB dump
```

---

## CI/CD recommendations

| Stage | Gate |
|-------|------|
| PR | `tsc`, `build`, lint |
| Staging | Lighthouse ≥90, smoke tests |
| Production | Manual approval + checklist |
| Post-deploy | Health check webhook |

---

## What NOT to deploy (until approved)

- Firebase → Supabase registration cutover
- Phase C modules (committees, speakers, events UI)
- Abstract/paper submission backends
- `REGISTRATION_BACKEND` change

**Status: PLAYBOOK ONLY — no deployment performed**
