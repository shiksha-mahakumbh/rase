# Deployment Readiness Report — Staging

**Date:** June 2026

---

## Readiness by layer

| Layer | Code | Config | Data | Runtime | Ready? |
|-------|------|--------|------|---------|--------|
| Phase A CMS foundation | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Phase B CMS expansion | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Phase S2 content | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Phase C organizational | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| P0 security | ✅ | ❌ | — | ❌ | ❌ |
| Firebase registration | ✅ | ✅ | — | ❌ | ⚠️ |
| Razorpay payments | ✅ | ⚠️ | — | ❌ | ❌ |

---

## Pre-staging deploy checklist

### Environment (8 items failing)

- [ ] `ADMIN_OPS_SECRET`
- [ ] `ADMIN_SESSION_SECRET`
- [ ] `REGISTRATION_LOOKUP_SECRET`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `RAZORPAY_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_SITE_URL`

### Database

- [ ] Staging Supabase project provisioned
- [ ] `DATABASE_URL` + `DIRECT_URL` point to staging
- [ ] `npm run db:migrate:deploy` succeeds
- [ ] `staging-db-check.mjs` shows all tables exist

### Seeds

- [ ] `npm run seed:cms`
- [ ] `seed-s2-content.mjs --publish`
- [ ] `seed-s2-hi.mjs --publish`
- [ ] `seed-phase-c-content.mjs --publish`

### Firebase

- [ ] Deploy `firebase/firestore.rules` (strict)
- [ ] Deploy `firebase/storage.rules`
- [ ] Confirm NOT using `production-backup` rules

### Deploy

- [ ] Push to staging branch / Vercel Preview
- [ ] Verify build succeeds (`next build`)
- [ ] Smoke test top 10 routes

---

## Estimated effort to staging-ready

| Task | Time |
|------|------|
| Configure staging env vars | 2 hours |
| Provision/connect staging DB | 2 hours |
| Migrate + seed | 1 hour |
| Deploy + smoke test | 4 hours |
| Security validation | 2 hours |
| **Total** | **~1 day** |

---

## Production readiness (separate)

Production requires staging sign-off PLUS:

- Production env vars (live Razorpay keys)
- Production Firebase rules deploy
- Production DB migrate + seed
- P1: upload route hardening
- P1: Supabase RLS apply
- Full E2E registration + payment test
- Lighthouse audit on top routes

**Production ETA after staging sign-off:** ~1 week

---

## Deployment readiness score

| Target | Score |
|--------|------:|
| Staging deploy | **38%** |
| Production deploy | **25%** |
