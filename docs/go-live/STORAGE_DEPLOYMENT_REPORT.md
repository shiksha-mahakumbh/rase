# Storage Deployment Report

**Date:** 2026-06-12  
**Service:** `src/server/services/storage.service.ts`

---

## Storage Service Audit

| Capability | Implementation | Status |
|------------|----------------|--------|
| Upload API | `POST /api/registration/upload`, `POST /api/v2/registration/upload` | ✅ PASS |
| Signed URLs | `getSignedUrl()` via Supabase admin | ✅ PASS |
| Delete flow | `deleteFile()` + soft-delete Prisma row | ✅ PASS |
| MIME allowlist | 10 MB max, extension check | ✅ PASS |
| Audit log | `writeAuditLog` on upload/delete | ✅ PASS |

### Upload bucket mapping (code → Supabase Storage name)

| UploadBucket | Supabase bucket | Prisma enum |
|--------------|-----------------|-------------|
| `registrations` | `registrations` | registrations |
| `resumes` | `resumes` | registrations |
| `papers` | `papers` | documents |
| `brochures` | `brochures` | brochures |
| `media` | `media` | gallery |
| `committee` | `committee` | committee |
| `downloads` | `downloads` | documents |

---

## Buckets Defined in SQL

**File:** `supabase/sql/001_storage_buckets.sql`

| Bucket | Public | Size limit |
|--------|--------|------------|
| registrations | false | 10 MB |
| resumes | false | 10 MB |
| papers | false | 10 MB |
| brochures | false | 10 MB |
| media | true | 10 MB |
| committee | false | 10 MB |
| downloads | true | 10 MB |
| receipts | false | 5 MB |

---

## Deployment Status

| Check | Result |
|-------|--------|
| Buckets in Supabase DB | ❌ **0** (SQL pending apply) |
| Live upload route | ❌ 500/404 on stale deploy |

### Apply command (cutover step)

```bash
psql "$DIRECT_URL" -f supabase/sql/001_storage_buckets.sql
# OR
npm run db:deploy-supabase -- --buckets-only
```

---

## Live vs Source

| Route | Live | Source |
|-------|------|--------|
| `POST /api/v2/registration/upload` | 404 | Exists |
| `POST /api/registration/upload` | 500 | Supabase path |

---

*Evidence: storage.service.ts, live curl (P1), DB bucket count query.*
