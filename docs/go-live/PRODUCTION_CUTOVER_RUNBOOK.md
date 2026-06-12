# Production Cutover Runbook

**Date:** 2026-06-12  
**Status:** Pre-cutover — source ready, production not deployed

---

## Execution Order

### 1. Commit ✅ (Phase 1 complete)

Firebase Exit committed to git. Subsequent phases committed incrementally.

### 2. Push

```bash
git push origin main
```

### 3. Vercel env verification

```bash
npx vercel env ls
```

Apply per `VERCEL_PRODUCTION_CHECKLIST.md`:
- `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SITE_URL`

### 4. Prisma migrate deploy

```bash
npx prisma migrate deploy
npx prisma migrate status
```

### 5. Seed execution

```bash
npm run db:seed
```

**Verified 2026-06-12:** 4 roles, 18 permissions, SMK2026 counter seeded.

### 6. Storage bucket creation

```bash
psql "$DIRECT_URL" -f supabase/sql/001_storage_buckets.sql
# OR
npm run db:deploy-supabase -- --buckets-only
```

Verify: `SELECT count(*) FROM storage.buckets;` → **8**

### 7. RLS deployment

```bash
psql "$DIRECT_URL" -f supabase/sql/003_deploy_rls.sql
# OR full deploy:
psql "$DIRECT_URL" -f supabase/sql/deploy-production.sql
```

Verify: `SELECT count(*) FROM pg_policies;` → **> 30**

### 8. Firebase data migration

```bash
npm run firebase:export
npm run firebase:import
```

Verify registration count matches export manifest.

### 9. Vercel production deploy

```bash
npx vercel --prod
```

### 10. Post-deploy validation

```bash
npm run test:security
npm run smoke:prod
curl.exe -s -o NUL -w "%{http_code}" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# MUST: 401

curl.exe -s "https://www.shikshamahakumbh.com/robots.txt" | findstr shikshamahakumbh.com
curl.exe -s "https://www.shikshamahakumbh.com/" | findstr shikshamahakumbh.com
```

Update Razorpay webhook URL:
```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

Remove legacy env:
```bash
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON production
npx vercel --prod
```

---

## Rollback Procedure

### Immediate (traffic)

```bash
npx vercel rollback
# Or promote deployment dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt
```

### Razorpay

Revert webhook URL in dashboard to last known working endpoint.

### Database

Do **not** drop Supabase data. Roll back app deployment only; reconcile from export JSON if needed.

### Verify rollback

```bash
curl.exe -s -o NUL -w "%{http_code}" "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
```

---

*No automatic deployment executed in this remediation program.*
