# Backend — Supabase (Postgres + Storage + Auth)

**Status:** Firebase fully removed from this repository (May 2026).

## Production stack

| Capability | Implementation |
|------------|----------------|
| Database | Supabase PostgreSQL via Prisma |
| File uploads | Supabase Storage (`storage.service.ts`) |
| Admin auth | Supabase email/password + HMAC session cookie |
| Registrations | `POST /api/registration/submit` → Prisma |
| Payments | Razorpay webhook → `payment.service.ts` → Prisma |
| CMS / press | Prisma `Page`, `PageSection`, `SeoMetadata` |

## Verification

```bash
npm run verify:env
npm run test:security
npm run check:legacy-urls
npm run audit:firebase-removal
npx tsc --noEmit
```

Security check includes: no Firebase SDK in `src/`, no Firebase infra files, no `firebase-admin` package.

## Operator cleanup (GCP / Vercel)

See **[GCP_CLEANUP_STATUS.md](./GCP_CLEANUP_STATUS.md)** for export results and the one manual step left.

```bash
npm i -D firebase-admin                  # one-time, before export
npm run export:gcp-firestore
npm run export:gcp-storage
npm run cleanup:vercel-firebase        # dry-run
```

## Migration traceability

`registrations.firebase_master_doc_id` and `firebase_type_doc_id` columns retain original Firestore document IDs for imported rows. Prisma fields: `legacyMasterDocId`, `legacyTypeDocId`.
