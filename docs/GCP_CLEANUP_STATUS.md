# GCP Cleanup Status

**Updated:** 2026-06-20  
**Project:** `shiksha-mahakumbh-abhiyan`

## Completed

| Step | Status | Detail |
|------|--------|--------|
| Vercel `FIREBASE_SERVICE_ACCOUNT_JSON` removed | ✅ | All envs clean |
| Production on Supabase | ✅ | `/api/v2/health` → connected |
| Firestore export | ✅ | `exports/gcp-firestore/` — **4 docs** total |
| Storage export | ✅ | No bucket exists — empty manifest (nothing to archive) |
| Repo Firebase removal | ✅ | `npm run audit:firebase-removal` PASS |

### Firestore export summary

| Collection | Documents |
|------------|----------:|
| registrations | 1 |
| registrationCounters | 1 |
| conclave_registrations | 1 |
| audit_logs | 1 |
| All other collections | 0 |

Manifest: `exports/gcp-firestore/manifest.json`  
Archived at: `2026-06-20T08:00:27.802Z`

Production data lives in **Supabase** — Firestore held only legacy/test rows.

---

## Manual — project shutdown

**GCP project already deleted** (IAM API returned `Project #316847987997 has been deleted` on 2026-06-20).  
No further Console action needed for key or project removal.

---

## Security — completed

| Action | Status |
|--------|--------|
| Local key file deleted from Downloads | ✅ |
| GCP service account key revoked | ✅ (project deleted — keys removed with project) |

---

## Commands reference

```powershell
npm run audit:firebase-removal
npm run check:legacy-urls
npm run cleanup:vercel-firebase
```
