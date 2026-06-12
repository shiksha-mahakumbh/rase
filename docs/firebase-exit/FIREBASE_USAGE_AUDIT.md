# Firebase Usage Audit (Phase F0)

**Date:** 2026-06-11  
**Role:** Principal Architect — Firebase Exit Program  
**Scope:** Full repository audit — `src/`, `firebase/`, `scripts/`, `package.json`  
**Constraint:** Discovery only — **no code changes**

---

## Executive summary

| Layer | Status | Files (src) |
|-------|--------|:-----------:|
| Firebase Auth (client) | **Active** — Google OAuth admin login | 4 |
| Firestore (client SDK) | **Active** — registrations, admin, legacy forms | 50+ |
| Firebase Storage (client SDK) | **Active** — NGO/resume uploads | 5 |
| Firebase Admin SDK | **Active** — server writes, payments, uploads | 12 |
| Firebase Rules / Deploy | **Present** — `firebase/` directory | 5 |
| Supabase parallel path | **Partial** — v2 API, Prisma models exist | 15+ |

**Default runtime:** `REGISTRATION_BACKEND=firebase` (per `.env`, `scripts/staging-env-check.mjs`, `scripts/supabase/seed-rbac.mjs` L92).

**Grep count:** `rg -i "firebase|firestore|firebase-admin" src/` → **74 files**, **~200+ references**.

**Exit readiness:** **~40%** — Supabase schema and v2 services exist; majority of user-facing flows still hit Firebase.

---

## Dependency inventory

### npm packages (`package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `firebase` | ^10.14.1 | Client SDK (Auth, Firestore, Storage) |
| `firebase-admin` | ^12.7.0 | Server SDK (Firestore, Storage) |

### Configuration files

| File | Purpose |
|------|---------|
| `firebase.json` | Rules deploy config |
| `.firebaserc` | Project alias `shiksha-mahakumbh-abhiyan` |
| `firebase/firestore.rules` | Production security rules |
| `firebase/storage.rules` | Storage security rules |
| `firebase/firestore.rules.production-backup` | **Dangerous** — never deploy |
| `firebase/RULES_DEPLOYMENT.md` | Deploy procedure |
| `firestore.indexes.json` | Firestore indexes |

### Environment variables

| Variable | Used by |
|----------|---------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | `firebase-admin` server init |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Alt admin init (scripts) |
| `REGISTRATION_BACKEND` | Backend switch (`firebase` \| `supabase` \| `dual`) |
| `VISITOR_COUNTER_USE_FIRESTORE` | Visitor analytics fallback |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Admin bootstrap emails |
| Inline config in `src/lib/firebase/client.ts` | Client Firebase app |

---

## 1. Firebase Auth usage

| File | Lines / area | Purpose | Replacement strategy |
|------|--------------|---------|---------------------|
| `src/lib/adminAuth.tsx` | 10-17, 69-100 | Google OAuth via `signInWithPopup`, `onAuthStateChanged` | Supabase Auth Google provider + `AdminProvider` rewrite |
| `src/lib/firebase/registration-services.ts` | 1-7 | `getAuth(app)` export | Remove; use `@supabase/ssr` browser client |
| `src/lib/firebase/lazy.ts` | 4-7 | Lazy `getFirebaseAuth()` | Remove |
| `src/lib/resolveAdminRole.ts` | 1-71 | Role from Firestore `adminUsers/{uid}` | Query `users` + `user_roles` + `roles` via Supabase/Prisma |
| `src/server/lib/firebase-admin-auth.ts` | 2, 47-57 | `verifyIdToken()` server validation | Supabase `getUser(jwt)` or session cookie verify |
| `src/app/api/admin/session/route.ts` | 2, 10-13 | Exchange Firebase ID token → HMAC cookie | Exchange Supabase session → existing HMAC cookie (keep middleware) |
| `src/app/api/admin/gateway/[...path]/route.ts` | 2, 8 | Gateway auth via Firebase | `verifySupabaseAdmin()` |
| `src/lib/admin-cms-api.ts` | 1 | `auth.currentUser.getIdToken()` for CMS API | Supabase session token or cookie-only (server validates cookie) |

**Middleware note:** `src/middleware.ts` uses **HMAC `ADMIN_SESSION_COOKIE`** — not Firebase directly. Preserve this pattern; only change token exchange at `/api/admin/session`.

---

## 2. Firestore usage

### Server-side (Admin SDK)

| File | Purpose | Replacement |
|------|---------|-------------|
| `src/lib/firebase-admin.ts` | App init, `getAdminFirestore()`, `getAdminStorage()`, counter | Delete; use Prisma + `getSupabaseAdmin()` |
| `src/lib/saveRegistration.server.ts` | Registration ID counter + master doc write | `registration.service.ts` (exists) |
| `src/lib/firestore/payments.server.ts` | Razorpay webhook → update `paymentStatus` | `payment.service.ts` (partial exists) |
| `src/app/api/registration/send-email/route.ts` | Email status updates on registration docs | Prisma `email_logs` + `registrations.emailDeliveryStatus` |
| `src/app/api/registration/[registrationId]/route.ts` | Lookup via Firestore when `backend=firebase` | Default `REGISTRATION_BACKEND=supabase` |
| `src/app/api/registration/lookup/route.ts` | Same dual-backend lookup | Same |
| `src/server/services/firebase-registration.adapter.ts` | Adapter to `saveRegistration.server` | Delete after cutover |
| `src/server/backend/index.ts` | `firebase` / `supabase` / `dual` switch | Remove Firebase branch |
| `src/lib/firestore/visitors.server.ts` | Visitor counter in Firestore | `visitor-analytics.service.ts` (Supabase — exists) |
| `src/app/api/health/firebase-admin/route.ts` | Ops diagnostic endpoint | Replace with `/api/v2/health` only |

### Client-side (Firestore SDK)

| File | Collection(s) | Purpose | Replacement |
|------|---------------|---------|-------------|
| `src/lib/saveRegistration.ts` | `registrations` | Client registration write (legacy) | `useRegistrationSubmit` → `/api/v2/registration/submit` |
| `src/lib/services/firestore/registrations.ts` | `registrations` | Admin table pagination | `/api/v2/admin/registrations` (exists) |
| `src/app/admin/page.tsx` | `registrations` | Admin dashboard batch ops | CMS admin API |
| `src/app/admin/registrations/[id]/page.tsx` | `registrations` | Detail view + update | `/api/v2/admin/registrations` |
| `src/lib/noticeboard/getEvents.ts` | events collection | Noticeboard ISR data | Supabase `notices` table (CMS) |
| `src/components/contact/ContactUsForm.tsx` | contact | Direct client write | `/api/v2/contact` (exists) |
| `src/components/footer/FooterContactForm.tsx` | contact | Direct client write | `/api/v2/contact` |
| `src/app/component/wishes_received.tsx` | keynote speakers | Legacy speaker merge | Supabase `speaker_profiles` or static data |

### Legacy registration forms (direct Firestore client writes)

| File | Collection | Type |
|------|------------|------|
| `src/app/component/Registration/NGOForm.tsx` | `registrations` + Storage | NGO |
| `src/app/component/Registration/OrganizerReg.tsx` | `organiserregistration` | Organizer |
| `src/app/component/Registration/ConclaveForm.tsx` | via `saveRegistration` | Conclave |
| `src/app/component/Registration/VolunteerForm.tsx` | via `saveRegistration` | Volunteer |
| `src/app/component/Registration/Best_Practices.tsx` | via `saveRegistration` | Best Practices |
| `src/app/component/Registration/TalentForm.tsx` | via `saveRegistration` | Talent |
| `src/app/component/Registration/DelegateForm.tsx` | via `saveRegistration` | Delegate |
| `src/app/component/Registration/SchoolProjectForm.tsx` | type-specific | School |
| `src/app/component/Registration/HeiProjectForm.tsx` | type-specific | HEI |
| `src/app/component/Registration/AbstractSubmission.tsx` | abstracts | Abstract |
| `src/app/component/RegistrationForm.tsx` | registrations | Generic |
| + 20 `*datadekh` admin pages | various | Legacy admin viewers |

**Strategy:** Route all through `useRegistrationSubmit` → `getRegistrationService()` → Supabase only.

---

## 3. Firebase Storage usage

| File | Path pattern | Purpose | Replacement |
|------|--------------|---------|-------------|
| `src/lib/firebase-admin.ts` | `getAdminStorage()` | Server bucket access | `storage.service.ts` |
| `src/app/api/registration/upload/route.ts` | `registrations/{type}/` | Server upload (Firebase) | `/api/v2/registration/upload` (Supabase — check exists) |
| `src/lib/uploadFile.ts` | client Storage SDK | Client-side upload helper | Signed URL flow via API |
| `src/app/component/Registration/NGOForm.tsx` | `registrations/NGO/` | Client upload | Supabase signed upload URL |

**Existing Supabase storage:** `src/server/services/storage.service.ts`, `media-library.service.ts` — signed upload/download implemented for CMS buckets.

**Target buckets:** `registrations`, `resumes`, `papers`, `media`, `downloads` (map to Prisma `StorageBucket` enum + Supabase bucket config).

---

## 4. Firebase Admin SDK usage

| Entry point | Consumers |
|-------------|-----------|
| `getAdminFirestore()` | registration routes, payments, send-email, saveRegistration.server, firebase-admin-auth |
| `getAdminStorage()` | registration/upload route |
| `getAuth(getAdminApp())` | firebase-admin-auth token verify |
| `diagnoseFirebaseAdmin()` | `/api/health/firebase-admin` |

**Replacement:** Prisma for all DB; `getSupabaseAdmin()` for storage; Supabase Auth for admin token verify.

---

## 5. Middleware dependencies

| File | Firebase? | Notes |
|------|:---------:|-------|
| `src/middleware.ts` | **No** | Uses HMAC `ADMIN_SESSION_COOKIE` via `verifyAdminSessionTokenEdge` |
| `src/lib/security/admin-session.ts` | **No** | HMAC session signing |
| `src/lib/security/admin-session-edge.ts` | **No** | Edge-compatible verify |

**Migration impact:** Low — only change how `/api/admin/session` mints the cookie.

---

## 6. Registration dependencies

```
Client form
  → useRegistrationSubmit / saveRegistration (client Firestore)  [LEGACY]
  → /api/registration/submit → backend/index.ts
       → firebase: saveRegistration.server.ts → Firestore
       → supabase: registration.service.ts → Prisma/Postgres
       → dual: both

Lookup
  → /api/registration/[id] → firebase OR registration.service  [DUAL]
  → /api/v2/registration/[id] → registration.service only      [SUPABASE]

Payments
  → /api/payments/razorpay-webhook → payments.server.ts (Firestore)  [FIREBASE]
  → payment.service.ts (Supabase) — not wired to webhook yet
```

**Prisma models already exist:** `Registration`, `PaymentRecord`, `UploadedFile`, type extensions, `RegistrationCounter` — no new schema required for F2 (see `REGISTRATION_MIGRATION.md`).

---

## 7. Upload dependencies

| Route | Backend | Status |
|-------|---------|--------|
| `/api/registration/upload` | Firebase Storage | **Active (default)** |
| `/api/v2/registration/upload` | Supabase Storage | **Exists** |
| CMS media upload | Supabase via `media-library.service.ts` | **Active** |

---

## 8. Admin login dependencies

```
User → Google OAuth (Firebase Auth)
     → resolveAdminRole() → Firestore adminUsers/{uid}
     → POST /api/admin/session (Firebase ID token)
     → HMAC cookie set
     → middleware validates cookie on /admin/* data routes
```

**Supabase target:**

```
User → Supabase Auth (email/password or Google)
     → users.auth_user_id linked
     → user_roles → roles (RBAC seed exists: scripts/supabase/seed-rbac.mjs)
     → POST /api/admin/session (Supabase JWT)
     → same HMAC cookie pattern
```

---

## 9. Scripts & tooling (non-runtime but must migrate)

| Script | Firebase use |
|--------|--------------|
| `scripts/seed-firestore-counter.mjs` | Admin SDK counter seed |
| `scripts/production-registration-audit.mjs` | Full Firestore/Storage probe |
| `scripts/launch-go-live-audit.mjs` | Firestore REST reads |
| `scripts/prod-readonly-probe.mjs` | Firestore REST |
| `scripts/staging-security-check.mjs` | Validates `firebase/firestore.rules` |
| `scripts/staging-env-check.mjs` | Requires `FIREBASE_SERVICE_ACCOUNT_JSON` |
| `scripts/verify-env.mjs` | Firebase env group |

---

## 10. Replacement strategy summary

| Firebase component | Target | Existing code |
|------------------|--------|---------------|
| Firebase Auth | Supabase Auth + RBAC | `users`, `roles`, `seed-rbac.mjs` |
| Firestore registrations | Prisma `registrations` + extensions | `registration.service.ts` |
| Firestore payments | Prisma `payment_records` | `payment.service.ts` |
| Firestore adminUsers | Prisma `users` + `user_roles` | `seed-rbac.mjs` |
| Firestore visitor counter | Prisma `visitor_analytics` | `visitor-analytics.service.ts` |
| Firebase Storage | Supabase Storage | `storage.service.ts` |
| Firebase Rules | Supabase RLS + API auth | `supabase/policies/*.sql` |
| firebase-admin health | `/api/v2/health` | Exists |

---

## 11. Migration phases (recommended order)

1. **F1** — Supabase Auth + admin session exchange
2. **F2** — Flip `REGISTRATION_BACKEND=supabase`; wire Razorpay webhook to Prisma
3. **F3** — Migrate uploads to Supabase Storage signed URLs
4. **F4** — Deploy RLS policies to Supabase
5. **F5** — Export Firestore → import Postgres (runbook only)
6. **F6** — Remove packages, files, env vars
7. **F7** — Validation + sign-off

---

## 12. Risk register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Production data only in Firestore | **Critical** | F5 export before cutover |
| Dual-backend drift | **High** | Remove `dual` mode after validation |
| 20+ legacy `*datadekh` pages | **Medium** | Deprecate or redirect to `/admin` CMS |
| Client-side direct Firestore writes bypass API security | **High** | Remove client SDK imports first |
| Razorpay webhook still on Firestore | **Critical** | Switch webhook handler in F2 |

---

**STOP — Phase F0 complete. No code changes made.**
