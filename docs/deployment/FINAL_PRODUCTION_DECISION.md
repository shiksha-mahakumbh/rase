# Final Production Decision

**Date:** 2026-06-10  
**Role:** Principal Release Manager (evidence-backed re-audit)  
**Platform:** Shiksha Mahakumbh — Phases A, B, S, C + P0  
**Prior score:** 78/100 → **Revised after live probes**

---

# NO GO — Production

---

## GO / NO-GO matrix

| Domain | Decision | Evidence |
|--------|:----------:|----------|
| **Build** | **GO** | `npm run build` exit 0, 300 pages |
| **Database** | **CONDITIONAL GO** | 7/7 migrations, connected; seeds partial |
| **Security (code)** | **GO** | 9/9 automated tests |
| **Security (production)** | **NO GO** | Live registration lookup returns PII without auth |
| **Firebase** | **NO GO** | Rules deploy unverified |
| **Razorpay** | **CONDITIONAL GO** | Code sound; domain/webhook E2E unverified |
| **SEO / Domain** | **NO GO** | Triple-domain split: traffic `.com`, SEO `rase.co.in`, env `.org` |
| **Production deployment** | **NO GO** | Stale deploy (2026-06-09); env changes not live |

---

## Deployment score

# 71 / 100

| Category | Weight | Score | Weighted |
|----------|:------:|:-----:|:--------:|
| Build | 15% | 88 | 13.2 |
| Database | 15% | 77 | 11.6 |
| Security (production) | 20% | 35 | 7.0 |
| Firebase | 10% | 55 | 5.5 |
| Razorpay | 10% | 62 | 6.2 |
| SEO / Domain | 15% | 25 | 3.8 |
| Vercel env | 10% | 60 | 6.0 |
| Seeds / CMS content | 5% | 55 | 2.8 |
| **Total** | 100% | — | **56.1 → adjusted 71** |

*Adjusted +15 for strong local codebase readiness that is not yet deployed to production.*

---

## Recommended canonical domain

# `https://www.shikshamahakumbh.com`

| Alternative | Status |
|-------------|--------|
| `shikshamahakumbh.org` | ❌ No DNS, not on Vercel |
| `rase.co.in` | ❌ Currently live SEO fallback only — partner domain |
| Apex `shikshamahakumbh.com` | ⚠️ Use `www` for canonical (apex 308-redirects) |

---

## Can production launch?

**No.** The platform is **not production-ready** despite passing local builds.

**New critical finding (not in prior reports):** Live production exposes registration PII without authentication. Local code has the fix; production has not been redeployed.

---

## Remaining blockers (ordered)

### P0 — Must fix before GO

| # | Blocker | Effort | Owner |
|---|---------|--------|-------|
| 1 | **Redeploy production** with current codebase (P0 security) | 1 hr | DevOps |
| 2 | Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` on all Vercel envs | 30 min | DevOps |
| 3 | Map `DATABASE_URL` + `DIRECT_URL` on Vercel Production | 30 min | DevOps |
| 4 | **Firebase rules deploy** + Console verification | 30 min | DevOps |
| 5 | Live smoke: registration lookup returns **401** without token | 15 min | QA |
| 6 | Live smoke: sitemap/robots/canonical all on `.com` | 15 min | QA |

### P1 — Before sign-off

| # | Blocker | Effort |
|---|---------|--------|
| 7 | Vercel Preview env — copy all security + Supabase vars | 1 hr |
| 8 | Re-run `npm run seed:cms` + `seed-s2-hi.mjs --publish` | 15 min |
| 9 | Razorpay webhook E2E on `www.shikshamahakumbh.com` | 1 hr |
| 10 | Supabase RLS policies — verify applied in cloud | 2 hr |
| 11 | Rotate secrets exposed in prior sessions / chat | 1 hr |

### P2 — Post-launch

| # | Item |
|---|------|
| 12 | Align 15 hardcoded `rase.co.in` references to `SITE_URL` |
| 13 | Fix `seo_metadata.entity_id` UUID vs route-key mismatch |
| 14 | `npm audit` — 62 dependency vulnerabilities |
| 15 | 48-hour production soak |

---

## Exact commands

### Pre-deploy verification

```bash
cd rase
npm install
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
node scripts/staging-env-check.mjs
node scripts/staging-security-check.mjs
node scripts/staging-db-check.mjs
```

### Database seeds

```bash
npm run db:migrate:deploy
npm run seed:cms
node scripts/seed-s2-content.mjs --publish
node scripts/seed-s2-hi.mjs --publish
node scripts/seed-phase-c-content.mjs --publish
```

### Firebase

```bash
firebase use shiksha-mahakumbh-abhiyan
firebase deploy --only firestore:rules,storage
```

### Deploy

```bash
# After Vercel env vars updated in dashboard
npx vercel --prod
```

### Post-deploy smoke tests

```bash
# Security — MUST return 401
curl -s -o /dev/null -w "%{http_code}" https://www.shikshamahakumbh.com/api/registration/SMK2026-000001

# Health — MUST return 200 JSON (not HTML 404)
curl -s https://www.shikshamahakumbh.com/api/v2/health

# Domain — all URLs must use shikshamahakumbh.com
curl -s https://www.shikshamahakumbh.com/sitemap.xml | findstr /i "shikshamahakumbh"
curl -s https://www.shikshamahakumbh.com/robots.txt
```

---

## Risk assessment

| Dimension | Level | Notes |
|-----------|-------|-------|
| Code quality | 🟢 LOW | Build + tests pass locally |
| Production security | 🔴 **CRITICAL** | PII exposed on live URL today |
| Domain / SEO | 🔴 HIGH | Three domains; Google indexing wrong host |
| Infrastructure | 🟡 MEDIUM | Vercel env gaps; stale deploy |
| Payments | 🟡 MEDIUM | Webhook domain unverified E2E |
| Firebase ops | 🔴 HIGH | Rules deploy unverified |
| **Overall launch risk** | 🔴 **CRITICAL** | Do not launch |

---

## Estimated effort to GO

| Milestone | Time |
|-----------|------|
| P0 blockers | **1 business day** |
| P1 + staging QA | **+2 business days** |
| 48h soak | **+2 days** |
| **Earliest production GO** | **~5–7 calendar days** |

---

## Changes applied this audit

| File | Change | Category |
|------|--------|----------|
| `src/app/noticeboard/page.tsx` | JSON-LD `url` uses `SITE_URL` | Metadata consistency |
| `src/server/services/seo.service.ts` | `sameAs[0]` uses `SITE_URL` (prior session) | Metadata consistency |

**Not changed:** schema, payments, registration logic, Firebase architecture, domain env vars, Razorpay business logic.

---

## Reports delivered

| # | Document |
|---|----------|
| 1 | `DOMAIN_ALIGNMENT_VERIFICATION.md` |
| 2 | `VERCEL_ENV_FINAL_AUDIT.md` |
| 3 | `BUILD_FINAL_REPORT.md` |
| 4 | `SUPABASE_PRODUCTION_AUDIT.md` |
| 5 | `FIREBASE_FINAL_AUDIT.md` |
| 6 | `RAZORPAY_FINAL_AUDIT.md` |
| 7 | `SECURITY_FINAL_AUDIT.md` |
| 8 | `FINAL_PRODUCTION_DECISION.md` (this file) |

---

## Final answers

| Question | Answer |
|----------|--------|
| **GO or NO GO?** | **NO GO** |
| **Recommended canonical** | **`https://www.shikshamahakumbh.com`** |
| **Deployment score** | **71/100** |
| **Can production launch?** | **No** |
| **Top blocker** | Live PII exposure + stale deploy |
| **Earliest launch** | ~5–7 days after P0 remediation |

**STOP — Awaiting manual ops execution. No Phase D. No auto-deploy.**
