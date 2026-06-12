# Firebase Exit Signoff

**Date:** 2026-05-29

---

## Runtime Import Audit — ✅ PASS

```bash
# Zero firebase/firebase-admin imports in src/
rg "from ['\"]firebase|from ['\"]firebase-admin" src/
→ No matches
```

Security test `src_no_firebase_runtime`: **PASS**

---

## Package Dependencies — ✅ PASS

| Check | Result |
|-------|--------|
| `package.json` dependencies | **No `firebase` or `firebase-admin` packages** |
| `package-lock.json` | **No firebase package entries** |

Migration tooling only (npm scripts, not runtime deps):

```json
"firebase:export": "node scripts/firebase-export.mjs",
"firebase:import": "node scripts/firebase-import-supabase.mjs"
```

`firebase-export.mjs` dynamically imports `firebase-admin` (dev-only, not bundled).

---

## Firestore Runtime Paths — ✅ PASS

No active Firestore read/write in `src/`. Registration, payment, and storage services use Supabase/Prisma:

- `src/server/services/registration.service.ts`
- `src/server/services/payment.service.ts`
- `src/server/services/storage.service.ts`

Backend default: `supabase` (seed + security test verified).

---

## Legacy References (non-runtime)

Cosmetic/documentation strings only — no runtime impact:

| Location | Reference |
|----------|-----------|
| `formatFirestoreDate` | Alias for `formatRegistrationDate` (date formatting) |
| `attributionForFirestore` | Alias export name |
| Admin UI labels | "Firebase registrations", "Firestore rules" (stale copy) |
| `privacy-policy/page.tsx` | Mentions Firebase infrastructure (content update post-launch) |

**Not blockers** — no SDK calls.

---

## Vercel Legacy Config — ⚠️ OPERATIONAL

`FIREBASE_SERVICE_ACCOUNT_JSON` still set on Production, Preview, Development.

Remove after Firebase export/import verified and production stable on Supabase.

---

## Signoff

| Gate | Status |
|------|--------|
| Zero Firebase SDK imports in `src/` | ✅ **APPROVED** |
| Zero firebase packages in lockfile | ✅ **APPROVED** |
| Zero Firestore runtime paths | ✅ **APPROVED** |
| Vercel Firebase env removed | ❌ Pending post-migration |

**Firebase exit signoff: APPROVED (codebase)** — operational cleanup of Vercel env remains.

---

*Evidence: ripgrep, `npm run test:security`, package.json review — 2026-05-29.*
