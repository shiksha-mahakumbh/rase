# Security Validation — Staging

**Date:** June 2026  
**Script:** `node scripts/staging-security-check.mjs`  
**Build:** `npx tsc --noEmit` ✅

---

## P0 remediation — code validation

| Test | Result |
|------|--------|
| Lookup HMAC token — valid ID | ✅ PASS |
| Lookup token — wrong ID rejected | ✅ PASS |
| Lookup token — tampered signature rejected | ✅ PASS |
| Admin session HMAC — valid token | ✅ PASS |
| Legacy cookie `=1` rejected | ✅ PASS |
| GET `/api/registration/[id]` requires auth | ✅ PASS (source) |
| Middleware rejects legacy `=1` cookie | ✅ PASS (source) |
| Firestore strict rules deny `create` | ✅ PASS (repo) |
| Backup rules flagged dangerous | ✅ PASS (documented) |

**Code-level security: 9/9 PASS**

---

## Registration lookup hardening

| Check | Runtime tested | Code verified |
|-------|----------------|---------------|
| Bare GET by ID blocked | ❌ No server running | ✅ |
| Token-based lookup works | ❌ | ✅ |
| ID + email POST lookup | ❌ | ✅ Route exists |
| PII fields stripped from response | ❌ | ✅ `toPublicRegistrationSummary` |
| Rate limit 10/min | ❌ | ✅ Configured |

---

## Admin session hardening

| Check | Runtime tested | Code verified |
|-------|----------------|---------------|
| `POST /api/admin/session` sets HttpOnly cookie | ❌ | ✅ |
| Signed cookie verified in middleware | ❌ | ✅ Edge crypto |
| Legacy `smk_admin_session=1` rejected | ❌ | ✅ |
| Client no longer sets cookie via JS | ❌ | ✅ `adminAuth.tsx` |

**Blocker:** `ADMIN_OPS_SECRET` / `ADMIN_SESSION_SECRET` not set in local env — session signing will fail at runtime until configured.

---

## Firebase rules

| Rule file | Anonymous read | Anonymous write | Verdict |
|-----------|----------------|-----------------|---------|
| `firebase/firestore.rules` | ❌ Denied | ❌ Denied (`create: false` on registrations) | ✅ REPO PASS |
| `firebase/storage.rules` | ❌ Denied | ❌ Denied | ✅ REPO PASS |
| `firestore.rules.production-backup` | — | ✅ Allows create | ❌ DO NOT DEPLOY |

**Production/staging Firebase deploy:** ⚠️ **NOT VERIFIED** in this sprint (requires `firebase deploy`).

---

## Supabase RLS

| Policy file | Status |
|-------------|--------|
| `supabase/policies/registrations.sql` | Present — not applied |
| `supabase/policies/cms.sql` | Present — not applied |
| `supabase/policies/admin.sql` | Present — not applied |
| `supabase/policies/analytics.sql` | Present — not applied |
| `supabase/policies/storage.sql` | Comments only — **not implemented** |

**Runtime RLS verification:** ❌ BLOCKED — Supabase credentials missing + DB unreachable.

**Note:** App uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS. API-layer security is primary control.

---

## Rate limiting

| Route | Limit | Runtime tested |
|-------|-------|----------------|
| Registration lookup | 10/min | ❌ |
| Registration submit | 15/min | ❌ |
| v2 APIs | Per-route | ❌ |

**Known gap:** In-memory rate limits ineffective on Vercel multi-instance (documented P1).

---

## Verdict

| Layer | Result |
|-------|--------|
| P0 code remediation | ✅ PASS |
| Runtime security smoke test | ❌ BLOCKED (no staging server + missing secrets) |
| Firebase rules deploy | ⚠️ PENDING |
| Supabase RLS deploy | ⚠️ PENDING |

**Stage 4: PARTIAL PASS** — code verified; runtime validation pending staging deploy.
