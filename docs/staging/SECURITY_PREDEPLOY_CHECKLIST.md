# Security Pre-Deploy Checklist

**Date:** June 2026  
**Automated test:** `node scripts/staging-security-check.mjs` → **9/9 PASS**

---

## Checklist

| # | Control | Category | Status | Notes |
|---|---------|----------|--------|-------|
| 1 | Registration GET requires token/email | P0 | **PASS** | Source verified |
| 2 | Public registration response strips PII | P0 | **PASS** | `toPublicRegistrationSummary` |
| 3 | Lookup HMAC token crypto | P0 | **PASS** | Automated test |
| 4 | Admin signed HttpOnly session | P0 | **PASS** | Code + crypto test |
| 5 | Legacy cookie `=1` rejected | P0 | **PASS** | Middleware source |
| 6 | `ADMIN_OPS_SECRET` configured | P0 | **BLOCKER** | Missing in env |
| 7 | `ADMIN_SESSION_SECRET` configured | P0 | **BLOCKER** | Missing in env |
| 8 | `REGISTRATION_LOOKUP_SECRET` configured | P0 | **BLOCKER** | Missing in env |
| 9 | All v2 admin routes `requireAdmin` | P0 | **PASS** | 52 routes |
| 10 | Admin gateway Firebase verify | P0 | **PASS** | Before ops-secret inject |
| 11 | `x-ops-secret` not in client bundle | P0 | **PASS** | Server-only |
| 12 | Firestore strict rules in repo | P0 | **PASS** | `create: false` on registrations |
| 13 | Firestore rules deployed to staging | P0 | **BLOCKER** | Manual deploy required |
| 14 | Storage rules deny client write | P0 | **PASS** | Repo verified |
| 15 | `REGISTRATION_BACKEND=firebase` | Constraint | **PASS** | Unchanged |
| 16 | Rate limiting on lookup (10/min) | P1 | **PASS** | Code configured |
| 17 | Rate limiting distributed (Vercel) | P1 | **WARNING** | In-memory only |
| 18 | Upload route authenticated | P1 | **WARNING** | Still open |
| 19 | Supabase RLS applied | P1 | **BLOCKER** | SQL files not deployed |
| 20 | `RAZORPAY_WEBHOOK_SECRET` set | P1 | **BLOCKER** | Missing in env |
| 21 | CSP header | P2 | **WARNING** | Not configured |

---

## Category summary

| Category | Count |
|----------|------:|
| **PASS** | 12 |
| **WARNING** | 3 |
| **BLOCKER** | 6 |

---

## Pre-deploy security actions (ordered)

### Must complete before staging approval

1. Set `ADMIN_OPS_SECRET`, `ADMIN_SESSION_SECRET`, `REGISTRATION_LOOKUP_SECRET` on Vercel
2. `firebase deploy --only firestore:rules,storage` to **staging** Firebase project
3. Runtime smoke test:
   - `GET /api/registration/SMK2026-000001` → 401
   - Forgeable cookie `smk_admin_session=1` on datadekh route → redirect
   - Admin login → `Set-Cookie` HttpOnly with signed value

### Should complete before production

4. Set `RAZORPAY_WEBHOOK_SECRET`
5. Apply Supabase RLS policies from `supabase/policies/*.sql`
6. Lock down `/api/v2/registration/upload`

---

## Firebase rules deployment doc

See `firebase/RULES_DEPLOYMENT.md` — deploy **only** `firestore.rules`, never `production-backup`.

---

## Verdict

**Code security: PASS**  
**Environment security: BLOCKER** (6 items)  
**Staging security signoff: NOT APPROVED**
