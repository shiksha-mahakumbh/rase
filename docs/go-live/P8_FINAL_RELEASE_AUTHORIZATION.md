# P8 — Final Release Authorization

**Audit date:** 2026-05-29  
**Program:** Production Readiness Remediation (P1–P8)  
**Prior score:** 44/100 (Phase H)  
**Current score:** **45/100**

---

## Production Score: **45 / 100**

| Category | Max | Score | Notes |
|----------|-----|-------|-------|
| Source & Firebase exit (P4) | 15 | 14 | 0 SDK imports; 151 files uncommitted |
| Supabase runtime (P3) | 20 | 5 | Schema OK; 0 data/buckets/RLS |
| Vercel environment (P5) | 15 | 7 | Missing Prisma env names; wrong SITE_URL live |
| Deployment parity (P1) | 15 | 0 | Jun 9 deploy; severe drift |
| Domain alignment (P2) | 10 | 3 | Host OK; SEO on rase.co.in |
| Security — source (P6) | 10 | 10 | 9/9 automated PASS |
| Security — live (P6) | 10 | 1 | PII leak on registration lookup |
| Razorpay (P5/H5) | 5 | 5 | Webhook 401 on live; code complete |

**GO threshold:** ≥ 85/100 — **not met**

---

## Decision: **NO GO**

---

## P0 Blockers

| # | Blocker | Report | Evidence |
|---|---------|--------|----------|
| 1 | Live registration PII leak (200 without auth) | P6 | curl 2026-05-29 |
| 2 | 151 uncommitted files — not in deploy pipeline | P1 | `git diff --stat HEAD` |
| 3 | Stale production deploy (2026-06-09) | P1 | `vercel inspect` |
| 4 | Supabase DB empty (0 registrations/payments/files) | P3 | Prisma counts |
| 5 | Zero storage buckets | P3 | `storage.buckets` → [] |
| 6 | Zero RLS policies | P3 | `pg_policies` → 0 |
| 7 | `DATABASE_URL` / `DIRECT_URL` missing on Vercel Production | P5 | `vercel env ls` |
| 8 | Wrong canonical domain on live SEO assets | P2 | canonical/sitemap → rase.co.in |
| 9 | Firebase data migration not executed | P3, P7 | Empty tables + live has SMK2026-000001 |

---

## P1 Blockers / Issues

| # | Issue |
|---|-------|
| 1 | `FIREBASE_SERVICE_ACCOUNT_JSON` on all Vercel envs |
| 2 | Preview environment nearly empty |
| 3 | `.env.example` and source fallbacks use `www.rase.co.in` |
| 4 | Local `.env` uses `shikshamahakumbh.org` |
| 5 | `/api/v2/health` 404 on live |
| 6 | Razorpay dashboard webhook URL not verified |
| 7 | `rase.co.in` Vercel alias — duplicate SEO |
| 8 | RBAC users table empty (0 users) |

---

## Estimated Hours to GO

| Workstream | Hours |
|------------|-------|
| Code review + commit authorization | 2–4 |
| Vercel env remediation | 1 |
| Storage buckets + RLS application | 3–4 |
| Firebase export/import + count verification | 4–8 |
| Production deploy + smoke tests | 2 |
| Razorpay webhook update + test | 1–2 |
| Domain redirect rules (rase.co.in) | 1 |
| P1–P8 re-audit | 2 |
| **Total** | **16–24 hours** (~2–3 business days) |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data loss on cutover | High if deploy before import | Critical | Import first; verify counts (P7 B4) |
| Registration downtime | Medium | High | Deploy off-peak; rollback plan ready |
| Payment webhook miss | Medium | High | Update Razorpay URL; test event |
| SEO ranking split | High (current) | Medium | Fix SITE_URL + 301 rase.co.in |
| Security exploit (PII) | **Active now** | Critical | **Priority redeploy** after commit |
| RLS absent | High | High | Apply policy SQL before public cutover |
| Uncommitted code lost | Medium | Critical | Commit to git before deploy |

---

## Report Index (Phase P)

| Phase | File |
|-------|------|
| P1 | `P1_DEPLOYMENT_DRIFT_VERIFICATION.md` |
| P2 | `P2_DOMAIN_ALIGNMENT_REPORT.md` |
| P3 | `P3_SUPABASE_GOLIVE_REPORT.md` |
| P4 | `P4_FIREBASE_EXIT_VERIFICATION.md` |
| P5 | `P5_VERCEL_ENVIRONMENT_REPORT.md` |
| P6 | `P6_SECURITY_RELEASE_GATE.md` |
| P7 | `P7_RELEASE_EXECUTION_PLAN.md` |
| P8 | `P8_FINAL_RELEASE_AUTHORIZATION.md` |

---

## Authorization

| Role | Decision | Date |
|------|----------|------|
| Principal Release Engineer | **NO GO** | 2026-05-29 |

---

*Phase P complete. No deploy. No commit. No push. No production modifications.*
