# G8 — Final Release Authorization

**Audit date:** 2026-05-29  
**Phase:** G — Supabase Go-Live Readiness & Production Cutover Audit  
**Principal Release Engineer decision:** **NO GO**

---

## Production Score: **47 / 100**

| Category | Max | Score | Notes |
|----------|-----|-------|-------|
| Source & build (G7) | 20 | 18 | TS, Prisma, 303-page build pass |
| Firebase exit (G2) | 10 | 10 | No runtime SDK |
| Supabase runtime (G1) | 20 | 6 | Schema OK; **zero data** |
| Vercel env (G3) | 15 | 8 | Prod mostly set; name gaps; Preview broken |
| Domain & SEO (G4) | 10 | 2 | Live on .com; SEO on .co.in |
| Razorpay code (G5) | 10 | 8 | Code solid; no live test |
| Security (G6) | 15 | 5 | Source pass; **live PII leak** |
| Storage / RLS | — | — | **UNKNOWN** (not scored) |

---

## Decision: **NO GO**

Production deployment validation is **incomplete**. Source migration (Firebase Exit F1–F7) is ready in repo; **production cutover must not proceed** until P0 blockers are resolved and re-audited.

---

## P0 Blockers

| # | Blocker | Evidence |
|---|---------|----------|
| P0-1 | **Supabase DB empty** — 0 registrations, 0 payments, 0 files, no counters | G1 — Prisma count 2026-05-29 |
| P0-2 | **Data migration not executed** — Firebase export/import not verified end-to-end | G1, scripts exist but not run |
| P0-3 | **Live production ≠ current source** — registration lookup returns **200 + PII without auth** | G6 — curl live 2026-05-29 |
| P0-4 | **`DATABASE_URL` / `DIRECT_URL` missing on Vercel Production** (Prisma expects exact names) | G3 — `vercel env ls` |
| P0-5 | **Domain/SEO mismatch** — live `www.shikshamahakumbh.com` serves canonical/sitemap/OG as `www.rase.co.in` | G4 — live HTML |
| P0-6 | **Supabase Storage buckets & RLS** — not verified in console | G1 — UNKNOWN |
| P0-7 | **Razorpay webhook** — not live-tested against new endpoint + empty DB | G5 — UNKNOWN |

---

## P1 Improvements

| # | Item |
|---|------|
| P1-1 | Remove `FIREBASE_SERVICE_ACCOUNT_JSON` from all Vercel envs post-migration |
| P1-2 | Sync full env set to **Preview** for PR smoke tests |
| P1-3 | Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` and redeploy |
| P1-4 | Fix invalid UUID rows in `seo_metadata` causing build-time Prisma errors |
| P1-5 | Resolve ESLint `react-hooks/exhaustive-deps` and `no-img-element` warnings |
| P1-6 | Rename/cosmetic cleanup of legacy "Firestore"/"Firebase" strings in UI |
| P1-7 | npm audit triage (45 reported vulnerabilities) |
| P1-8 | Confirm Razorpay dashboard webhook URL points to production domain |

---

## Exact Commands Required Before Deploy

**Run from project root (`rase/`). Do not execute deploy until checklist complete.**

### A. Environment (Vercel — manual, no auto-push)

```bash
npx vercel env ls
# Add Prisma names (copy values from POSTGRES_* aliases):
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://www.shikshamahakumbh.com

# After migration complete:
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON production
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON preview
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON development
```

### B. Database migration apply (against Supabase)

```bash
npx prisma validate
npx prisma migrate deploy
npx prisma generate
```

### C. Firebase → Supabase data migration

```bash
npm run firebase:export
npm run firebase:import
# Verify counts:
node --input-type=module -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); console.log(await p.registration.count()); await p.\$disconnect();"
```

### D. Supabase Storage (console / CLI — verify buckets exist)

Expected buckets per code: `registrations`, `documents`, `brochures`, `gallery`, `committee`.

Apply RLS:
```bash
# Requires psql or Supabase SQL editor
psql "$DIRECT_URL" -f supabase/policies/registrations.sql
psql "$DIRECT_URL" -f supabase/policies/admin.sql
# ... remaining policy files
```

### E. Pre-deploy build gate

```bash
npm install
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
node scripts/staging-security-check.mjs
```

### F. Deploy (when authorized — not part of this audit)

```bash
npx vercel --prod
# OR git push to production branch per team workflow
```

### G. Post-deploy smoke (required before GO)

```bash
npm run smoke:prod
curl.exe -s -o NUL -w "%{http_code}" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# MUST return 401 without token/email

curl.exe -s "https://www.shikshamahakumbh.com/robots.txt"
# Sitemap must reference www.shikshamahakumbh.com
```

---

## Expected Production Cutover Sequence

```mermaid
sequenceDiagram
    participant Ops as Release Engineer
    participant FB as Firebase (read-only)
    participant SB as Supabase
    participant VC as Vercel Prod
    participant RZ as Razorpay

    Ops->>SB: migrate deploy + verify schema
    Ops->>FB: firebase:export (final snapshot)
    Ops->>SB: firebase:import + verify row counts
    Ops->>SB: Create storage buckets + apply RLS
    Ops->>VC: Set DATABASE_URL, DIRECT_URL, SITE_URL
    Ops->>VC: Remove FIREBASE_SERVICE_ACCOUNT_JSON
    Ops->>VC: Deploy new build (vercel --prod)
    Ops->>VC: Smoke: registration 401, sitemap domain, health
    Ops->>RZ: Update webhook URL to /api/payments/razorpay-webhook
    Ops->>RZ: Send test webhook; verify PaymentRecord row
    Ops->>Ops: 48h monitoring (below)
    Ops->>Ops: Re-run Phase G audit → target GO
```

**Order is strict:** data import **before** traffic cutover; env fix **before** deploy; Razorpay webhook **after** deploy URL stable.

---

## Rollback Sequence

If post-deploy failures occur:

1. **Immediate traffic:** Redeploy previous Vercel deployment (Dashboard → Deployments → Promote previous) **or** `vercel rollback`
2. **Do not delete** Supabase data — keep for forensic replay
3. **Registration writes:** If dual-write was not enabled, revert to last known-good Firebase-backed deployment (previous build)
4. **Razorpay:** Point webhook back to last known working URL if payment processing breaks
5. **Env:** Restore previous env snapshot from Vercel deployment metadata if new secrets caused auth failures
6. **Communications:** Pause new registrations if lookup/payment inconsistent; post status page update
7. **Post-mortem:** Re-run G1/G6 probes before second attempt

**Rollback time objective:** &lt; 15 minutes to previous Vercel deployment (no schema rollback required).

---

## 48-Hour Monitoring Checklist

### Hour 0–4 (critical)

- [ ] `/api/v2/health` returns database connected
- [ ] Registration submit (test) creates Prisma row
- [ ] Registration lookup returns **401** without credentials
- [ ] Admin login + HMAC session; legacy cookie rejected
- [ ] Razorpay test payment + webhook updates `payment_records`
- [ ] File upload lands in Supabase Storage + `uploaded_files` row
- [ ] Error rate in Vercel logs &lt; baseline
- [ ] No 5xx spike on `/api/registration/*`

### Hour 4–24

- [ ] Compare registration count vs Firebase export manifest
- [ ] Payment status reconciliation (Paid vs Razorpay dashboard)
- [ ] Sitemap/robots served with `www.shikshamahakumbh.com`
- [ ] Google Search Console crawl errors (if access available)
- [ ] reCAPTCHA failures not blocking legitimate users

### Hour 24–48

- [ ] Admin datadekh pages load from Prisma
- [ ] Counter increments correctly for new SMK IDs
- [ ] Audit log entries for payments/registrations
- [ ] Supabase connection pool saturation check
- [ ] Remove or rotate `FIREBASE_SERVICE_ACCOUNT_JSON` if still present
- [ ] Schedule Phase G re-audit for **GO** sign-off

---

## Report Index (Phase G)

| Report | File |
|--------|------|
| G1 Supabase Runtime | `SUPABASE_RUNTIME_VERIFICATION.md` |
| G2 Firebase Removal | `FIREBASE_REMOVAL_VERIFICATION.md` |
| G3 Vercel Env | `VERCEL_ENV_FINAL_AUDIT.md` |
| G4 Domain & SEO | `DOMAIN_FINAL_VERIFICATION.md` |
| G5 Razorpay | `RAZORPAY_GO_LIVE_AUDIT.md` |
| G6 Security | `SECURITY_GO_LIVE_VERIFICATION.md` |
| G7 Build | `BUILD_RELEASE_REPORT.md` |
| G8 Authorization | `FINAL_RELEASE_AUTHORIZATION.md` (this document) |

---

## Authorization Sign-Off

| Role | Name | Decision | Date |
|------|------|----------|------|
| Principal Release Engineer | Phase G Audit (automated) | **NO GO** | 2026-05-29 |
| Product Owner | _Pending_ | | |
| Engineering Lead | _Pending_ | | |

**Next step:** Resolve P0 blockers → re-run Phase G → target score ≥ 85 for GO.

---

*Audit complete. No implementation. No deployment. No commits.*
