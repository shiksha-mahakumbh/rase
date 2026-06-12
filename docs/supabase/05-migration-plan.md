# 6. Migration Plan

## Strategy: parallel build → dual-write → cutover → decommission

**Zero data loss. Zero downtime for public site.**

## Phase M0 — Prerequisites

- [ ] Supabase project created (production + staging)
- [ ] Prisma migrations applied
- [ ] Storage buckets created
- [ ] RBAC roles seeded
- [ ] `registration_counters` seeded (`SMK2026`, `last_number` = current Firebase value)
- [ ] Google OAuth configured in Supabase Auth

## Phase M1 — Historical import (read-only Firebase → Supabase)

| Source (Firestore `default`) | Target | Script |
|------------------------------|--------|--------|
| `registrations` | `registrations` | `scripts/supabase/migrate-firestore.mjs` |
| `conclave_registrations` | `conclave_registrations` | same |
| `delegate_registrations` | `delegate_registrations` | same |
| `best_practices` | `best_practice_registrations` | same |
| `paymentRecords` | `payment_records` | same |
| `audit_logs` | `audit_logs` | same |
| `adminUsers` | `users` + `user_roles` | same |
| `events` | `events` | same |
| `contactMessages` | `contact_messages` | same |
| `registrationCounters/smk2026` | `registration_counters` | same |

**Per-record fields preserved:**
- `firebase_master_doc_id` / `firebase_type_doc_id`
- `source = 'migration'`
- Original `createdAt` / `updatedAt`

## Phase M2 — Storage migration

| Firebase Storage path | Supabase bucket |
|-----------------------|-----------------|
| `registrations/*` | `registrations` |
| Award files | `awards` |
| Best practice files | `best-practices` |

Script: `scripts/supabase/migrate-storage.mjs`

Creates `uploaded_files` rows with `storage_path`, `signed_url`, version=1.

## Phase M3 — Verification (blocking gate)

Script: `scripts/supabase/verify-migration.mjs`

| Check | Tolerance |
|-------|-----------|
| Registration count | 0 difference |
| Payment record count | 0 difference |
| Audit log count | 0 difference |
| Counter `last_number` | ≥ Firebase `lastNumber` |
| Sample 50 registrations field-by-field | 100% match |
| File count per bucket | 0 difference |
| All `registration_id` unique | PASS |
| All FK relationships valid | PASS |

## Phase M4 — Dual-write window

Env: `REGISTRATION_BACKEND=dual`

New submissions write to **both** Firebase and Supabase. Compare outputs for 7 days.

## Phase M5 — Cutover

1. Set `REGISTRATION_BACKEND=supabase`
2. Point `/api/registration/*` proxies to `/api/v2/*` (or swap feature flag in `useRegistrationSubmit`)
3. Switch admin auth from Firebase → Supabase Google OAuth
4. Monitor 48 hours

## Phase M6 — Decommission Firebase

Only after:
- [ ] 48h zero P1 incidents
- [ ] Migration verification re-run PASS
- [ ] Backup of Firestore export archived
- [ ] Backup of Firebase Storage archived

Remove: `FIREBASE_SERVICE_ACCOUNT_JSON`, Firebase client imports, `firebase-admin.ts`.

## Rollback plan

| Trigger | Action |
|---------|--------|
| Supabase write failures > 1% | Set `REGISTRATION_BACKEND=firebase` |
| Data mismatch detected | Stop dual-write, restore from Firebase |
| Auth outage | Fall back to Firebase Auth for admin |

Rollback time target: **< 5 minutes** (env var flip only).
