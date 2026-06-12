# F5 — Migration Scripts (Export / Import)

**Status:** Scripts created; **not executed** (per program constraints)

## Scripts

| Script | npm command | Purpose |
|--------|-------------|---------|
| `scripts/firebase-export.mjs` | `npm run firebase:export -- --out=./exports/firebase` | Export Firestore collections to JSON |
| `scripts/firebase-import-supabase.mjs` | `npm run firebase:import -- --in=./exports/firebase` | Import JSON into Postgres via Prisma |

## Prerequisites (export only)

Export requires temporary `firebase-admin` dev dependency and `FIREBASE_SERVICE_ACCOUNT_JSON`. Runtime app no longer depends on Firebase packages.

## Import behavior

- Maps legacy collection names → Prisma `RegistrationType`
- Skips rows when `registrationId` already exists
- Stores full Firestore document in `Registration.metadata`

## Runbook

See `DATA_MIGRATION_RUNBOOK.md` for ordered production migration steps.
