# P7 — Release Execution Plan

**Audit date:** 2026-05-29  
**Prior reports:** H7, `docs/deployment/PRODUCTION_EXECUTION_CHECKLIST.md`  
**Scope:** Exact commands — **not executed in this audit**

---

## Phase A — Pre-Deploy Gates

### A1. Local build verification

```bash
cd rase
npm install
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
node scripts/staging-security-check.mjs
```

**Pass:** Exit 0; security 9/9 PASS.

---

### A2. Authorize and commit Supabase exit source

```bash
git status
git diff --stat HEAD
# After release owner approval only:
git add -A
git commit -m "feat: Supabase production cutover — Firebase exit complete"
```

**Blocker today:** 151 uncommitted files; production cannot receive changes without commit + push (when authorized).

---

### A3. Vercel environment — Production

```bash
npx vercel env ls
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
```

Values:
- `DATABASE_URL` = copy from `POSTGRES_PRISMA_URL`
- `DIRECT_URL` = copy from `POSTGRES_URL_NON_POOLING`
- `NEXT_PUBLIC_SITE_URL` = `https://www.shikshamahakumbh.com`

---

### A4. Vercel environment — Preview (minimum)

```bash
vercel env add DATABASE_URL preview
vercel env add DIRECT_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview
vercel env add ADMIN_SESSION_SECRET preview
vercel env add ADMIN_OPS_SECRET preview
vercel env add REGISTRATION_LOOKUP_SECRET preview
vercel env add NEXT_PUBLIC_SITE_URL preview
vercel env add RAZORPAY_WEBHOOK_SECRET preview
```

---

## Phase B — Database & Storage

### B1. Migrations

```bash
npx prisma migrate deploy
npx prisma migrate status
```

---

### B2. Create Supabase Storage buckets

Via Supabase Dashboard → Storage, create:

```
registrations
documents
brochures
gallery
committee
resumes
papers
media
downloads
```

---

### B3. Apply RLS policies

```bash
psql "$DIRECT_URL" -f supabase/policies/registrations.sql
psql "$DIRECT_URL" -f supabase/policies/admin.sql
psql "$DIRECT_URL" -f supabase/policies/cms.sql
psql "$DIRECT_URL" -f supabase/policies/analytics.sql
psql "$DIRECT_URL" -f supabase/policies/phase_b.sql
```

Verify:
```bash
psql "$DIRECT_URL" -c "SELECT count(*) FROM pg_policies;"
```

---

### B4. Data migration

```bash
npm run firebase:export
npm run firebase:import
```

Verify:
```bash
node --input-type=module -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); console.log({ r: await p.registration.count(), pay: await p.paymentRecord.count(), files: await p.uploadedFile.count() }); await p.\$disconnect();"
```

---

### B5. RBAC seed (if required)

```bash
npm run db:seed
```

---

## Phase C — Deploy

### C1. Push (when authorized)

```bash
git push origin main
```

---

### C2. Deploy to Vercel Production

```bash
npx vercel --prod
```

---

### C3. Confirm deployment

```bash
npx vercel ls
npx vercel inspect <latest-production-url>
```

---

## Phase D — Post-Deploy Validation

### D1. Security smoke

```bash
curl.exe -s -o NUL -w "lookup:%{http_code}\n" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
curl.exe -s -o NUL -w "webhook:%{http_code}\n" -X POST "https://www.shikshamahakumbh.com/api/payments/razorpay-webhook" -H "Content-Type: application/json" -d "{}"
curl.exe -s -o NUL -w "datadekh:%{http_code}\n" "https://www.shikshamahakumbh.com/participantregistrationdatadekh"
```

**Pass:** lookup=401, webhook=401, datadekh=307.

---

### D2. Domain / SEO smoke

```bash
curl.exe -s "https://www.shikshamahakumbh.com/robots.txt" | findstr shikshamahakumbh.com
curl.exe -s "https://www.shikshamahakumbh.com/sitemap.xml" | findstr shikshamahakumbh.com
curl.exe -s "https://www.shikshamahakumbh.com/" | findstr canonical
```

---

### D3. Health & database

```bash
curl.exe -s "https://www.shikshamahakumbh.com/api/v2/health"
npm run smoke:prod
```

---

### D4. Razorpay webhook

Update Razorpay Dashboard webhook URL:
```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

Send test event; verify `webhook_events` row count increases.

---

### D5. Firebase cleanup

```bash
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON production
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON preview
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON development
npx vercel --prod
```

---

### D6. Re-audit

Re-run P1–P8; target score ≥ 85/100.

---

## Phase E — Rollback

### E1. Immediate traffic rollback

```bash
npx vercel ls
npx vercel rollback
```

Or Vercel Dashboard → Promote deployment `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` (2026-06-09).

---

### E2. Razorpay

Revert webhook URL in Razorpay Dashboard to last known working endpoint.

---

### E3. Database

Do **not** drop Supabase data. Roll back application to prior Vercel deployment; reconcile from export JSON if needed.

---

### E4. Post-rollback verify

```bash
curl.exe -s -o NUL -w "%{http_code}" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
curl.exe -s "https://www.shikshamahakumbh.com/robots.txt"
```

---

## Execution Status (2026-05-29)

| Phase | Status |
|-------|--------|
| A — Pre-deploy | ❌ Not started |
| B — DB/Storage | ❌ Not started |
| C — Deploy | ❌ Not executed |
| D — Post-deploy | ❌ Pending |
| E — Rollback | Documented only |

---

*Commands only. No deploy, commit, or push performed.*
