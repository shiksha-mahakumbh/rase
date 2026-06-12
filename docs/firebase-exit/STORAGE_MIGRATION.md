# Storage Migration (Phase F3)

**Date:** 2026-06-11  
**Objective:** Replace Firebase Storage with Supabase Storage  
**Constraint:** Plan only — not implemented

---

## Current state

### Firebase Storage

| File | Bucket / path | Purpose |
|------|---------------|---------|
| `src/lib/firebase-admin.ts` | `shiksha-mahakumbh-abhiyan.firebasestorage.app` | Admin SDK bucket |
| `src/app/api/registration/upload/route.ts` | `registrations/{type}/{filename}` | Server-side upload |
| `src/lib/uploadFile.ts` | Client SDK upload | Legacy helper |
| `src/app/component/Registration/NGOForm.tsx` | `registrations/NGO/` | Client upload |

**Rules:** `firebase/storage.rules` — admin read only, all writes denied (server uses Admin SDK bypass).

### Supabase Storage (partial)

| File | Buckets | Purpose |
|------|---------|---------|
| `src/server/services/storage.service.ts` | `registrations`, `brochures`, `media`, `committee`, `downloads` | Signed URLs + Prisma `uploaded_files` |
| `src/server/services/media-library.service.ts` | CMS media | Admin upload/delete |
| `src/app/api/v2/registration/upload/route.ts` | Supabase path | v2 upload route |

---

## Target bucket architecture

| Bucket | Contents | Access |
|--------|----------|--------|
| `registrations` | Form attachments (NGO docs, delegate proofs) | Signed upload via API; signed download |
| `resumes` | Volunteer/CV uploads | Signed URLs; admin read |
| `papers` | Abstracts, full-length papers | Signed URLs; admin read |
| `media` | CMS images, gallery (alias: `gallery` in Prisma) | Public read for published; admin write |
| `downloads` | PDFs, brochures (alias: `documents`) | Public read for published assets |

**Prisma `StorageBucket` enum** (L226-238): maps logical buckets — align Supabase bucket names with enum or maintain `BUCKET_MAP` in `storage.service.ts`.

---

## Upload flow (target)

```
Client
  → POST /api/v2/registration/upload (multipart)
       OR
  → POST /api/v2/storage/signed-upload (get signed URL)
  → PUT to Supabase Storage (signed URL, time-limited)
  → POST /api/v2/registration/submit (includes storagePath refs)

Server
  → validate MIME, size (10 MB — existing)
  → rate limit (existing)
  → supabase.storage.from(bucket).upload(path, file)
  → insert UploadedFile row (Prisma)
  → return { storagePath, signedDownloadUrl }
```

### Signed upload URL pattern

```typescript
// Pseudocode — pattern exists in storage.service.ts
const { data, error } = await supabase.storage
  .from(bucket)
  .createSignedUploadUrl(`${registrationId}/${fieldName}/${uuid}.${ext}`, {
    upsert: false,
  });
```

### Signed download URL pattern

```typescript
const { data } = await supabase.storage
  .from(bucket)
  .createSignedUrl(storagePath, 3600); // 1 hour
```

---

## Migration mapping

### Firebase → Supabase path translation

| Firebase path | Supabase path |
|---------------|---------------|
| `registrations/Conclave/{file}` | `registrations/conclave/{registrationId}/{file}` |
| `registrations/NGO/{file}` | `registrations/ngo/{registrationId}/{file}` |
| `registrations/Volunteer/{file}` | `resumes/{registrationId}/{file}` |
| `registrations/Participant/{file}` | `papers/{registrationId}/{file}` |

Store mapping in `uploaded_files.storage_path` + `firebase` metadata during migration.

---

## Files to change

| File | Action |
|------|--------|
| `src/app/api/registration/upload/route.ts` | Redirect to v2 or delete |
| `src/lib/uploadFile.ts` | Rewrite for signed URL flow |
| `src/app/component/Registration/NGOForm.tsx` | Remove `firebase/storage` imports |
| `src/lib/firebase-admin.ts` | Remove `getAdminStorage()` |
| `firebase/storage.rules` | Delete in F6 |

---

## Supabase Storage policies

See `supabase/policies/storage.sql` — template policies exist.

**Deploy:**

```sql
-- Deny all public writes
CREATE POLICY deny_public_write ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

-- Admin read on registrations bucket
CREATE POLICY registrations_admin_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'registrations' AND public.is_admin_user());

-- Public read on gallery/documents (published assets only)
CREATE POLICY gallery_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'gallery');
```

**Note:** Service role bypasses RLS — all registration uploads must go through validated API routes.

---

## File migration (F5 coordination)

1. List all objects in Firebase Storage bucket (Admin SDK or Console export)
2. Download to staging volume
3. Upload to matching Supabase bucket path
4. Update `uploaded_files.storage_path` and `publicUrl` in Postgres
5. Verify signed download URLs resolve

**No production file deletion until validation complete.**

---

## Validation gates

| Test | Expected |
|------|----------|
| Upload PDF via registration form | 200 + `storagePath` in response |
| Download via signed URL | File accessible for 1h |
| Upload without auth to bucket | Denied (no public write) |
| Admin list attachments | Prisma `uploaded_files` rows |
| CMS media upload | Unchanged (already Supabase) |
| File size > 10 MB | 400 rejection |

---

**Not implemented — documentation only.**
