# Data Migration Readiness

**Date:** 2026-05-29  
**Status:** Ready in tooling — **NOT EXECUTED** (explicit approval required)

---

## Scripts Audited

| Script | npm command | Purpose |
|--------|-------------|---------|
| `scripts/firebase-export.mjs` | `npm run firebase:export` | Export Firestore → JSON |
| `scripts/firebase-import-supabase.mjs` | `npm run firebase:import` | Import JSON → Prisma/Supabase |

---

## Export (`firebase:export`)

**Requirements:**

- `FIREBASE_SERVICE_ACCOUNT_JSON` env var
- `firebase-admin` package (**not in `package.json`** — install temporarily: `npm i -D firebase-admin`)

**Usage:**

```bash
npm run firebase:export -- --out=./exports/firebase
```

**Collections exported:** registrations, registrationCounters, conclave/delegate/NGO/volunteer/participant, abstracts, best practices, talent, accommodation, organiser, school/HEI projects, etc.

**Status:** Script present and documented. **Not run** during this audit.

---

## Import (`firebase:import`)

**Requirements:**

- `DATABASE_URL` (or DIRECT_URL for bulk writes)
- Export directory from export step

**Usage:**

```bash
npm run firebase:import -- --in=./exports/firebase
```

**Behavior:**

- Idempotent on `registrationId` — skips existing rows
- Maps Firestore collection names → Prisma registration types via `COLLECTION_TYPE_MAP`
- Normalizes email/name fields from heterogeneous Firebase documents

**Status:** Script present. **Not run** — production import forbidden without explicit approval.

---

## Current Data State

| Store | Registrations | Notes |
|-------|---------------|-------|
| Firebase (live) | ≥1 (`SMK2026-000001`) | Served by production API |
| Supabase | **0** | Empty, ready for import |

**Risk if cutover without import:** New registrations on Supabase; legacy Firebase data orphaned unless import runs first.

---

## Pre-Import Checklist

- [ ] Explicit stakeholder approval for production Firebase read
- [ ] Install `firebase-admin` dev dependency
- [ ] Verify `FIREBASE_SERVICE_ACCOUNT_JSON` (Vercel legacy var or local)
- [ ] Export to `./exports/firebase` with manifest / row counts
- [ ] Dry-run import against staging Supabase (recommended)
- [ ] Production import with operator monitoring
- [ ] Post-import: `SELECT count(*) FROM registrations`
- [ ] Reconcile `registration_counters.last_number` with max registration ID
- [ ] Remove `FIREBASE_SERVICE_ACCOUNT_JSON` from Vercel

---

## Counter Alignment

Supabase counter seeded: `SMK2026`, `lastNumber=1`.  
Live Firebase has `SMK2026-000001` — post-import, counter must be bumped to prevent ID collision.

---

## Verdict

| Gate | Result |
|------|--------|
| Export script | ✅ Ready (needs firebase-admin) |
| Import script | ✅ Ready |
| Staging dry-run | ❌ Not done |
| Production import | ❌ **BLOCKED** — awaiting approval |

---

*Scripts reviewed from source — no production data operations performed.*
