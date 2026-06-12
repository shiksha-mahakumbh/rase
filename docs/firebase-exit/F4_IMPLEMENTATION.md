# F4 — Storage Migration (Supabase Storage)

**Status:** Complete (implementation only)

## Summary

Registration file uploads use Supabase Storage through `storage.service.ts`. Legacy forms call `/api/registration/upload` via `uploadFile.ts`.

## Key files

| File | Role |
|------|------|
| `src/server/services/storage.service.ts` | Buckets: `registrations`, `resumes`, `papers`, etc. |
| `src/app/api/registration/upload/route.ts` | Public upload endpoint |
| `src/app/api/v2/registration/upload/route.ts` | v2 upload (extended buckets) |
| `src/lib/uploadFile.ts` | Client helper (FormData → API) |
| `src/lib/legacyFormSubmit.ts` | Multi-file support for legacy forms |

## Removed from runtime

- Firebase Storage client (`firebase/storage`)
- `getAdminStorage()` / Firebase admin storage

## CMS uploads

Admin media/downloads use `adminCmsUpload()` → `/api/admin/gateway/*` (Supabase-backed v2 admin APIs).
