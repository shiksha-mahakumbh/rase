# F2 — Registration Backend Cutover

**Status:** Complete (implementation only)

## Summary

All registration writes and admin reads use Prisma/Supabase Postgres. Default backend is `supabase`; Firebase adapter removed.

## Key changes

| Area | Before | After |
|------|--------|-------|
| Default backend | `firebase` | `supabase` (`src/server/backend/index.ts`) |
| Public submit | Firestore / dual | `POST /api/registration/submit` → `registration.service.ts` |
| Legacy forms | Direct Firestore | `submitLegacyForm()` → `/api/registration/submit` |
| Admin list/detail | Firestore | `/api/admin/gateway/registrations` → Prisma |
| Bulk status | Firestore | `POST /api/v2/admin/registrations/bulk-status` |
| Legacy *datadekh pages | Firestore `getDocs` | `useAdminRegistrationData()` + admin gateway |

## New / updated helpers

- `src/lib/legacyFormSubmit.ts` — upload + save via API
- `src/lib/legacy/useAdminRegistrationData.ts` — admin data hook for legacy export pages
- `src/lib/saveRegistration.ts` — client wrapper (no Firestore)
- `src/server/lib/registration-types.ts` — `SUPPORTED_V2_TYPES`, Prisma type mapping

## Deleted

- `src/server/services/firebase-registration.adapter.ts`
- `src/lib/saveRegistration.server.ts`
- `src/lib/services/firestore/registrations.ts`
