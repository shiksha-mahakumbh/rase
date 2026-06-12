# Final Deployment Decision

**Date:** June 2026  
**Platform:** Shiksha Mahakumbh (Phases A–C + P0)  
**Deployment score:** **78 / 100**

---

## Decision

# CONDITIONAL GO (staging) · NO GO (production)

| Target | Decision | Rationale |
|--------|----------|-----------|
| **Staging / Preview deploy** | **CONDITIONAL GO** | Build passes; DB live; secrets on Production+Dev; fix Preview env first |
| **Production go-live** | **NO GO** | Domain mismatch P0; Firebase rules not deployed; partial seeds; no live smoke tests |

---

## Deployment score breakdown

| Pillar | Weight | Score | Notes |
|--------|-------:|------:|-------|
| Code & build | 20% | 18/20 | `tsc` ✅, `build` ✅, route conflict fixed |
| Database & Supabase | 15% | 13/15 | 7 migrations ✅; partial seeds |
| Environment | 15% | 11/15 | Local 21/21; Vercel Preview gaps |
| Security (code) | 20% | 18/20 | 9/9 automated tests |
| Security (ops) | 10% | 5/10 | Firebase rules not deployed; secrets rotated needed |
| Domain & SEO | 10% | 4/10 | `.org` vs `.com` mismatch |
| Payments | 10% | 9/10 | Webhook code ✅; domain alignment needed |
| **Total** | 100% | **78/100** | |

---

## Remaining blockers

### P0 (production)

| # | Blocker | Owner |
|---|---------|-------|
| 1 | **Domain mismatch** — `NEXT_PUBLIC_SITE_URL=.org`, Vercel hosts `.com`, Razorpay webhook `.com` | Ops + stakeholder |
| 2 | **Firebase rules not deployed** to production Firebase project | DevOps |
| 3 | **No live smoke tests** on production URL | QA |

### P1 (before sign-off)

| # | Blocker | Owner |
|---|---------|-------|
| 4 | Vercel **Preview** missing 5 security/site vars | DevOps |
| 5 | Verify `DATABASE_URL` on Vercel Production (vs `POSTGRES_*` only) | DevOps |
| 6 | Re-run failed seed scripts (`seed:cms`, `seed-s2-hi`) | DevOps |
| 7 | Apply Supabase RLS policies | DevOps |
| 8 | Rotate secrets exposed in chat | Security |

---

## Exact commands to run

### Pre-deploy (local verification)

```bash
cd rase
node scripts/staging-env-check.mjs          # expect 21/21
node scripts/staging-db-url-audit.mjs       # expect REMOTE_SUPABASE_CONFIGURED
node scripts/staging-db-check.mjs           # expect connected: true
node scripts/staging-security-check.mjs     # expect 9/9
npx tsc --noEmit
npx prisma validate
npm run build
```

### Complete seeding (after seed script fixes)

```bash
npm run seed:cms
node scripts/seed-s2-hi.mjs --publish
node scripts/staging-db-check.mjs
```

### Firebase rules

```bash
firebase deploy --only firestore:rules,storage
```

### Vercel deploy

```bash
npx vercel link --yes
# Add Preview env vars in dashboard first
npx vercel --prod
```

---

## Production deployment sequence

```
1. Resolve canonical domain (recommend .com)
2. Update NEXT_PUBLIC_SITE_URL on all Vercel environments
3. Align Razorpay webhook URL to canonical domain
4. Add missing Preview env vars
5. Verify DATABASE_URL + DIRECT_URL on Production
6. Re-run seed scripts
7. firebase deploy --only firestore:rules,storage
8. npm run build (local sanity)
9. npx vercel --prod
10. Post-deploy verification (below)
11. 48h soak period
12. Production GO decision
```

---

## Rollback sequence

```
1. Vercel Dashboard → Deployments → Previous deployment → Promote to Production
2. If DB migration issue: do NOT rollback schema — forward-fix only
3. If env var issue: revert env in Vercel → Redeploy
4. If Firebase rules issue: redeploy prior rules from git history
5. If payment webhook issue: disable webhook in Razorpay dashboard temporarily
6. Communicate incident; rotate compromised secrets
```

---

## Post-deploy verification checklist

### Infrastructure

- [ ] `curl -sI https://<canonical-domain>/` returns 200
- [ ] `curl -s https://<canonical-domain>/api/v2/health` returns JSON
- [ ] Sitemap URLs use single canonical domain
- [ ] `robots.txt` sitemap pointer correct

### Security

- [ ] `GET /api/registration/SMK2026-000001` → **401** (no token)
- [ ] Forgeable cookie `smk_admin_session=1` on protected route → redirect
- [ ] Admin login → HttpOnly signed cookie set

### CMS

- [ ] `/` homepage loads with CMS content
- [ ] `/speakers`, `/events`, `/partners` show seeded data
- [ ] `/admin/cms` CRUD smoke test

### Payments

- [ ] Razorpay test payment → webhook 200 → Firestore `Paid`

### Registration

- [ ] Submit test registration (Firebase) → success token → lookup works

---

## Domain mismatch resolution (exact steps)

**Do NOT auto-changed in this audit.**

1. **Decision:** Canonical = `https://shikshamahakumbh.com` (recommended)
2. **Vercel:** Assign `shikshamahakumbh.com` to Production; add `.org` redirect if owned
3. **Env:** `NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.com` everywhere
4. **Razorpay:** Webhook = `https://shikshamahakumbh.com/api/payments/razorpay-webhook`
5. **Code PR (later):** Unify hardcoded `.com` references to `SITE_URL`; align email TLDs
6. **Verify:** `curl sitemap.xml` — all `<loc>` use one domain

See `DOMAIN_MISMATCH_AUDIT.md` for full file inventory.

---

## Files changed in this audit (Phase 8 safe fixes)

| File | Change |
|------|--------|
| `package.json` | `postinstall: prisma generate` |
| `scripts/seed-cms-content.mjs` | `counters` → `counter` section type |
| `scripts/seed-s2-hi.mjs` | Fix `NoticeCategory` query (no `locale`) |

**No changes to:** payment logic, registration, Firebase, schema, or domain env vars.

---

## Documents generated

| Phase | Document |
|-------|----------|
| 1 | `DOMAIN_MISMATCH_AUDIT.md` |
| 2 | `VERCEL_ENV_AUDIT.md` |
| 3 | `BUILD_READINESS_REPORT.md` |
| 4 | `RAZORPAY_AUDIT.md` |
| 5 | `SUPABASE_AUDIT.md` |
| 6 | `SECURITY_GO_LIVE_AUDIT.md` |
| 7 | `FINAL_DEPLOYMENT_DECISION.md` (this file) |

---

## Final answers

| Question | Answer |
|----------|--------|
| Production-ready? | **NO** — domain + Firebase deploy + smoke tests pending |
| Staging-ready? | **CONDITIONAL GO** — after Preview env vars + domain decision |
| Domain mismatch? | **YES** — `.org` env vs `.com` Vercel/code/webhook |
| Deployment score | **78/100** |
| Est. time to production GO | **2–4 days** after domain decision + ops checklist |

**STOP — No Phase D. No auto-deploy. Awaiting stakeholder domain decision.**
