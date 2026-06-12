# F7 — Validation

**Status:** Complete (local build; no deploy)

## Commands run

```bash
npx prisma validate          # OK
npm install                  # firebase packages removed
npx tsc --noEmit             # OK (after TS fixes)
npm run build                # OK (exit 0)
rg -i "firebase|firestore|firebase-admin" src/   # 0 matches
```

## Build result

- Next.js 15.0.7 production build succeeded
- ESLint: warnings only (pre-existing img/hook deps); no blocking errors

## Type fixes applied during F7

- Datadekh pages: `useAdminRegistrationData` state wiring
- `RegistrationRow` export from `registrations-client.ts`
- Upload route: `isSupportedType` for legacy types (Volunteer, NGO, etc.)
- `adminCmsUpload` added to `admin-cms-api.ts`
- `AdminGate` email/password login
- Bulk audit action → `registration_updated`

## Out of scope (not run)

- Production deploy
- `firebase:export` / `firebase:import` execution
- Production data migration (Phase D)
- Live Razorpay webhook switchover

## Recommended pre-go-live checks

1. Set `REGISTRATION_BACKEND=supabase` (or unset; default is supabase)
2. Configure Supabase Auth admin users + Prisma RBAC seed
3. Run export/import in staging with snapshot backup
4. Smoke-test registration submit + admin list + file upload
5. Point Razorpay webhook to production URL after DB cutover
