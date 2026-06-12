# Firebase Removal Report (Phase F6)

**Date:** 2026-06-11  
**Objective:** Document complete Firebase removal checklist  
**Status:** **NOT EXECUTED** — Firebase still active (74 src files reference Firebase)

---

## Removal gate

**Do not execute F6 until:**

- [ ] F1 Supabase Auth validated on staging
- [ ] F2 `REGISTRATION_BACKEND=supabase` on staging + production
- [ ] F3 all uploads on Supabase Storage
- [ ] F5 data migration validated (counts match)
- [ ] F7 build + smoke tests pass without Firebase env vars

---

## npm packages to remove

```bash
npm uninstall firebase firebase-admin
```

**Verify:**

```bash
npm ls firebase firebase-admin
# Expected: (empty)
```

---

## Source files to delete

### Core Firebase modules

| File | Purpose |
|------|---------|
| `firebase.ts` (root) | Legacy re-export |
| `src/lib/firebase.ts` | Re-export barrel |
| `src/app/firebase.ts` | App-level re-export |
| `src/lib/firebase/client.ts` | Client SDK init |
| `src/lib/firebase/registration-services.ts` | Auth + Storage exports |
| `src/lib/firebase/lazy.ts` | Lazy imports |
| `src/lib/firebase-admin.ts` | Admin SDK init |
| `src/server/lib/firebase-admin-auth.ts` | Firebase token verify |
| `src/server/services/firebase-registration.adapter.ts` | Firebase adapter |
| `src/lib/saveRegistration.server.ts` | Server Firestore writes |
| `src/lib/firestore/payments.server.ts` | Firestore payment webhook |
| `src/lib/firestore/visitors.server.ts` | Firestore visitor counter |
| `src/lib/services/firestore/registrations.ts` | Client-side admin queries |
| `src/app/api/health/firebase-admin/route.ts` | Firebase health diagnostic |

### Firebase config directory

| File / dir | Action |
|------------|--------|
| `firebase/firestore.rules` | Delete |
| `firebase/storage.rules` | Delete |
| `firebase/firestore.rules.production-backup` | Delete |
| `firebase/RULES_DEPLOYMENT.md` | Delete or archive |
| `firebase.json` | Delete |
| `.firebaserc` | Delete |
| `firestore.indexes.json` | Delete |

---

## Source files to refactor (remove Firebase imports)

### High priority (runtime paths)

| File | Change |
|------|--------|
| `src/lib/adminAuth.tsx` | Supabase Auth (F1) |
| `src/lib/resolveAdminRole.ts` | Prisma role lookup |
| `src/lib/saveRegistration.ts` | Delete or API-only wrapper |
| `src/lib/uploadFile.ts` | Supabase signed URLs |
| `src/server/backend/index.ts` | Remove Firebase/dual branches |
| `src/app/api/registration/[registrationId]/route.ts` | Supabase only |
| `src/app/api/registration/lookup/route.ts` | Supabase only |
| `src/app/api/registration/upload/route.ts` | Delete or proxy to v2 |
| `src/app/api/registration/send-email/route.ts` | Prisma updates |
| `src/app/api/payments/razorpay-webhook/route.ts` | `payment.service.ts` |
| `src/lib/useRegistrationSubmit.ts` | Remove `attributionForFirestore` naming |
| `src/types/registration.ts` | Remove `firebase/firestore` Timestamp import |

### Admin UI

| File | Change |
|------|--------|
| `src/app/admin/page.tsx` | API-based registration list |
| `src/app/admin/registrations/[id]/page.tsx` | API-based detail |
| `src/lib/admin-cms-api.ts` | Remove Firebase auth token |

### Legacy forms (50+ files)

All files in grep result under `src/app/component/Registration/`, `*datadekh`, `*data` pages — remove `firebase/firestore` and `firebase/storage` imports; route through unified submit API.

### Misc

| File | Change |
|------|--------|
| `src/lib/noticeboard/getEvents.ts` | Supabase `notices` CMS |
| `src/components/contact/ContactUsForm.tsx` | `/api/v2/contact` |
| `src/components/footer/FooterContactForm.tsx` | `/api/v2/contact` |
| `src/app/component/wishes_received.tsx` | Static or Supabase speakers |

---

## Scripts to delete or refactor

| Script | Action |
|--------|--------|
| `scripts/seed-firestore-counter.mjs` | Delete (use Prisma counter) |
| `scripts/production-registration-audit.mjs` | Archive or rewrite for Supabase |
| `scripts/launch-go-live-audit.mjs` | Remove Firestore phases |
| `scripts/prod-readonly-probe.mjs` | Delete |
| `scripts/staging-security-check.mjs` | Remove `firestore_rules_deny_create` test |
| `scripts/staging-env-check.mjs` | Remove Firebase env group |
| `scripts/verify-env.mjs` | Remove `firebase` env group |

---

## Environment variables to remove

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |
| `FIREBASE_PROJECT_ID` | All |
| `FIREBASE_CLIENT_EMAIL` | All |
| `FIREBASE_PRIVATE_KEY` | All |
| `VISITOR_COUNTER_USE_FIRESTORE` | All |
| `NEXT_PUBLIC_FIREBASE_*` (if any) | All |

**Set:**

```
REGISTRATION_BACKEND=supabase
```

---

## Docs to archive

Move to `docs/archive/firebase/`:

- `docs/deployment/FIREBASE_*.md` (8 files)
- `docs/security/FIREBASE_RULES_VERIFICATION.md`
- `firebase/RULES_DEPLOYMENT.md`

---

## Verification command

```bash
# Must return ZERO runtime matches after F6
rg -i "firebase|firestore|firebase-admin" src/ --glob "!*.md"

# Expected: 0 files (or only comments/strings in privacy policy — refactor those too)
```

**Current state (2026-06-11):**

```
rg "firebase|firestore|firebase-admin" src/ → 74 files
```

**Target:** 0 files

---

## package.json scripts to remove

```json
"seed:counter": "node scripts/seed-firestore-counter.mjs"  // DELETE
```

---

## Deployment workflow changes

| Remove | Replacement |
|--------|-------------|
| `firebase deploy --only firestore:rules,storage` | `psql -f supabase/policies/*.sql` |
| Firebase Console rules verification | Supabase RLS policy verification |
| `FIREBASE_SERVICE_ACCOUNT_JSON` in Vercel | Remove after cutover |

---

## Risk if removed prematurely

| Risk | Impact |
|------|--------|
| Remove before data migration | **Data loss exposure** — production registrations only in Firestore |
| Remove webhook Firestore handler before Prisma wired | **Payment status stuck** |
| Remove client SDK before forms migrated | **Registration submissions fail** |

---

**F6 NOT EXECUTED — Firebase fully active.**
