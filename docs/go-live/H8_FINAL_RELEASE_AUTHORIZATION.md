# H8 — Final Release Authorization

**Audit date:** 2026-05-29  
**Phase:** H — P0 Go-Live Remediation Audit  
**Prior score (Phase G):** 47/100  
**Current score (Phase H):** **44/100**

---

## Production Score: **44 / 100**

| Category | Max | Score | Evidence |
|----------|-----|-------|----------|
| Source & build readiness | 15 | 14 | TS/build pass; 151 files uncommitted |
| Vercel environment (H1) | 15 | 7 | Missing `DATABASE_URL`/`DIRECT_URL`; wrong SITE_URL on live |
| Supabase runtime (H2) | 20 | 5 | Schema OK; **0 data**, **0 buckets**, **0 RLS** |
| Deployment parity (H3) | 15 | 0 | Jun 9 deploy; Firebase-era live |
| Domain canonicalization (H4) | 10 | 2 | Host OK; SEO on `rase.co.in` |
| Razorpay (H5) | 10 | 7 | Code + live 401; no E2E |
| Security (H6) | 15 | 2 | Source pass; **live PII leak** |
| Data migration | — | -13 | Penalty: empty DB + prod on old backend |

---

## Decision: **NO GO**

Production cutover to Supabase **must not proceed**. Critical security regression is live; target backend is empty; Firebase-exit source is not committed or deployed.

---

## P0 Blockers

| ID | Blocker | Report | Evidence |
|----|---------|--------|----------|
| P0-1 | **Live registration PII leak** — lookup returns 200 without auth | H6 | curl 2026-05-29 |
| P0-2 | **151 uncommitted files** — Supabase exit not in git/deploy pipeline | H3 | `git diff --stat HEAD` |
| P0-3 | **Stale production deploy** (2026-06-09) — pre-security-fix | H3 | `vercel inspect` |
| P0-4 | **Supabase DB empty** — 0 registrations, payments, files, counters | H2 | Prisma count |
| P0-5 | **No storage buckets** in Supabase | H2 | `storage.buckets` query → `[]` |
| P0-6 | **No RLS policies** applied | H2 | `pg_policies` count → 0 |
| P0-7 | **`DATABASE_URL` / `DIRECT_URL` missing** on Vercel Production | H1 | `vercel env ls` |
| P0-8 | **Wrong canonical domain** in sitemap/robots/OG/JSON-LD | H4 | Live HTML |
| P0-9 | **Data migration not executed** | H2, H7 | Empty tables + live has SMK2026-000001 on old stack |

---

## P1 Issues

| ID | Issue |
|----|-------|
| P1-1 | `FIREBASE_SERVICE_ACCOUNT_JSON` on all Vercel envs |
| P1-2 | Preview environment nearly empty |
| P1-3 | Local `.env` uses `https://shikshamahakumbh.org` (wrong) |
| P1-4 | `/api/v2/health` returns 404 on live |
| P1-5 | Razorpay dashboard webhook URL not verified |
| P1-6 | `rase.co.in` Vercel alias causes duplicate SEO |
| P1-7 | Build-time Prisma SEO UUID errors (non-fatal) |

---

## Estimated Time to GO

| Workstream | Estimate | Owner |
|------------|----------|-------|
| Commit + review Supabase exit source | 2–4 hours | Engineering |
| Vercel env remediation (H1) | 1 hour | Release Engineer |
| Storage buckets + RLS (H2) | 2–4 hours | Backend |
| Firebase export/import + count verify | 4–8 hours | Backend |
| Production deploy + smoke tests (H7) | 2 hours | Release Engineer |
| Razorpay webhook + test payment | 1–2 hours | Payments |
| Phase H re-audit | 2 hours | Release Engineer |
| **Total (sequential, with coordination)** | **2–3 business days** | |

Aggressive same-day GO is **not realistic** given data migration and security verification requirements.

---

## Required Manual Actions (Ordered)

1. **Review and commit** 151-file Supabase exit working tree (authorized owner approval)
2. **Add** `DATABASE_URL`, `DIRECT_URL`, fix `NEXT_PUBLIC_SITE_URL` on Vercel Production
3. **Create** Supabase Storage buckets (H2 list)
4. **Apply** RLS policy SQL files
5. **Run** `firebase:export` → `firebase:import`; verify row counts
6. **Deploy** to Vercel Production (`npx vercel --prod`)
7. **Verify** registration lookup returns **401** without credentials
8. **Verify** sitemap/robots/canonical use `www.shikshamahakumbh.com`
9. **Update** Razorpay webhook URL to canonical domain; send test event
10. **Remove** `FIREBASE_SERVICE_ACCOUNT_JSON` from Vercel
11. **Re-run** Phase H audit → target score ≥ **85/100** for GO

---

## Evidence Summary

| Source | Key finding |
|--------|-------------|
| `npx vercel env ls` | Missing Prisma env names; Firebase legacy present |
| `npx prisma migrate status` | 7/7 migrations applied |
| Prisma row counts | All critical tables empty |
| `pg_policies` / `storage.buckets` | Zero policies; zero buckets |
| `git diff --stat HEAD` | 151 files uncommitted |
| `vercel inspect` | Prod deploy 2026-06-09 |
| Live curl | Registration 200 + PII; canonical `rase.co.in` |
| `staging-security-check.mjs` | 9/9 PASS (source only) |
| Webhook curl | 401 unsigned (live partial parity) |

---

## GO Criteria (Re-Audit Target)

| Gate | Threshold |
|------|-----------|
| Production Score | ≥ 85/100 |
| Registration lookup without auth | HTTP 401 |
| Supabase registration count | Matches export |
| Storage buckets | ≥ 7 created |
| RLS policies | > 0 applied |
| Canonical domain | 100% `www.shikshamahakumbh.com` in SEO assets |
| Deploy age | Post-commit Supabase exit |
| Razorpay test webhook | Row in `webhook_events` |

---

## Report Index (Phase H)

| Report | File |
|--------|------|
| H1 Vercel Env | `H1_VERCEL_ENV_REMEDIATION.md` |
| H2 Supabase Runtime | `H2_SUPABASE_RUNTIME_AUDIT.md` |
| H3 Deployment Drift | `H3_DEPLOYMENT_DRIFT_AUDIT.md` |
| H4 Domain | `H4_DOMAIN_CANONICALIZATION.md` |
| H5 Razorpay | `H5_RAZORPAY_PRODUCTION_AUDIT.md` |
| H6 Security | `H6_SECURITY_VERIFICATION.md` |
| H7 Checklist | `H7_RELEASE_CHECKLIST.md` |
| H8 Authorization | `H8_FINAL_RELEASE_AUTHORIZATION.md` (this document) |

---

## Authorization Sign-Off

| Role | Decision | Date |
|------|----------|------|
| Principal Release Engineer (Phase H) | **NO GO** | 2026-05-29 |
| Product Owner | _Pending_ | |
| Engineering Lead | _Pending_ | |

---

*Phase H complete. No deploy. No commit. No push. No production modifications.*
