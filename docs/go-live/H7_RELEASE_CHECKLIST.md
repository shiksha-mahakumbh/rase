# H7 — Production Release Checklist

**Audit date:** 2026-05-29  
**Purpose:** Exact commands for P0 go-live remediation  
**Prerequisite:** All H1–H6 blockers understood; no step deploys automatically from this document

---

## Pre-Deploy

### 1. Verify local build gate

```bash
cd rase
npm install
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
node scripts/staging-security-check.mjs
```

**Pass criteria:** Build exit 0; security check 9/9 PASS.

---

### 2. Fix Vercel Production environment

```bash
npx vercel env ls
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
```

Set values:
- `DATABASE_URL` = value of `POSTGRES_PRISMA_URL`
- `DIRECT_URL` = value of `POSTGRES_URL_NON_POOLING`
- `NEXT_PUBLIC_SITE_URL` = `https://www.shikshamahakumbh.com`

---

### 3. Sync Preview environment (minimum)

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
vercel env add RAZORPAY_KEY_ID preview
vercel env add RAZORPAY_KEY_SECRET preview
vercel env add RECAPTCHA_SECRET_KEY preview
```

---

### 4. Apply database migrations

```bash
npx prisma migrate deploy
npx prisma migrate status
```

**Pass criteria:** `Database schema is up to date!`

---

### 5. Create Supabase Storage buckets

Create in Supabase Dashboard → Storage (or CLI):

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

### 6. Apply RLS policies

```bash
psql "$DIRECT_URL" -f supabase/policies/registrations.sql
psql "$DIRECT_URL" -f supabase/policies/admin.sql
psql "$DIRECT_URL" -f supabase/policies/cms.sql
psql "$DIRECT_URL" -f supabase/policies/analytics.sql
psql "$DIRECT_URL" -f supabase/policies/phase_b.sql
```

Verify:
```bash
psql "$DIRECT_URL" -c "SELECT count(*) FROM pg_policies WHERE schemaname IN ('public','storage');"
```

---

### 7. Migrate Firebase data to Supabase

```bash
npm run firebase:export
npm run firebase:import
```

Verify counts:
```bash
node --input-type=module -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); console.log({ registrations: await p.registration.count(), payments: await p.paymentRecord.count(), files: await p.uploadedFile.count(), counters: await p.registrationCounter.findMany() }); await p.\$disconnect();"
```

**Pass criteria:** Registration count matches export manifest; counters seeded.

---

### 8. Fix local environment

```bash
# In .env (local only):
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
DATABASE_URL=<pooler URL>
DIRECT_URL=<direct URL>
```

---

### 9. Commit Supabase exit source (required before deploy)

```bash
git status
git add -A
git commit -m "feat: complete Firebase exit and Supabase production cutover"
```

**Note:** Commit only when authorized by release owner. This checklist documents the required step; audit did not execute commit.

---

## Deploy

### 10. Deploy to Vercel Production

```bash
npx vercel --prod
```

Alternative (if CI-driven):
```bash
git push origin main
```

---

### 11. Confirm deployment promoted

```bash
npx vercel ls
npx vercel inspect <deployment-url>
```

**Pass criteria:** New deployment timestamp; aliases include `www.shikshamahakumbh.com`.

---

## Post-Deploy

### 12. Security smoke tests

```bash
curl.exe -s -o NUL -w "lookup-no-auth:%{http_code}\n" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
curl.exe -s -o NUL -w "lookup-bad-email:%{http_code}\n" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001?email=wrong@example.com"
curl.exe -s -o NUL -w "webhook-unsigned:%{http_code}\n" -X POST "https://www.shikshamahakumbh.com/api/payments/razorpay-webhook" -H "Content-Type: application/json" -d "{}"
curl.exe -s -o NUL -w "datadekh:%{http_code}\n" "https://www.shikshamahakumbh.com/participantregistrationdatadekh"
```

**Pass criteria:** lookup → **401**; webhook unsigned → **401**; datadekh → **307** to admin.

---

### 13. Domain / SEO smoke tests

```bash
curl.exe -s "https://www.shikshamahakumbh.com/robots.txt" | findstr Sitemap
curl.exe -s "https://www.shikshamahakumbh.com/sitemap.xml" | findstr shikshamahakumbh.com
curl.exe -s "https://www.shikshamahakumbh.com/" | findstr canonical
```

**Pass criteria:** All URLs contain `www.shikshamahakumbh.com`, not `rase.co.in`.

---

### 14. Health and database

```bash
curl.exe -s "https://www.shikshamahakumbh.com/api/v2/health"
npm run smoke:prod
```

---

### 15. Razorpay webhook registration

In Razorpay Dashboard → Webhooks, set URL:
```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

Send test event; verify:
```bash
node --input-type=module -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); console.log(await p.webhookEvent.count()); await p.\$disconnect();"
```

---

### 16. Remove legacy Firebase env

```bash
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON production
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON preview
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON development
```

Redeploy after removal:
```bash
npx vercel --prod
```

---

### 17. Re-run Phase H audit

Generate fresh H1–H8 reports; target Production Score ≥ 85 and GO decision.

---

## Rollback

### Immediate (traffic)

```bash
npx vercel ls
npx vercel rollback
```

Or Vercel Dashboard → Deployments → Promote previous production deployment (`dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` or prior).

---

### Environment

```bash
# Restore previous env from Vercel deployment "Environment Variables" snapshot if new secrets break auth
npx vercel env ls
```

---

### Database

```bash
# Do NOT drop Supabase data — keep for replay
# If cutover causes issues, rollback app to Firebase-era deployment (previous Vercel promote)
# Reconcile registrations manually from export JSON if needed
```

---

### Razorpay

Revert webhook URL in Razorpay Dashboard to last known working endpoint.

---

### Verification after rollback

```bash
curl.exe -s -o NUL -w "%{http_code}" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
curl.exe -s "https://www.shikshamahakumbh.com/robots.txt"
```

---

## Checklist Summary

| Phase | Steps | Status (2026-05-29) |
|-------|-------|---------------------|
| Pre-deploy | 1–9 | ❌ Not complete |
| Deploy | 10–11 | ❌ Not executed |
| Post-deploy | 12–17 | ❌ Pending |
| Rollback | Documented | Ready if needed |

---

*Commands only. No steps executed during Phase H audit.*
