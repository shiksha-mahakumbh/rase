# F6 — Firebase Package & Runtime Removal

**Status:** Complete

## Removed packages

From `package.json` dependencies:

- `firebase`
- `firebase-admin`

(`npm install` removed 162 transitive packages.)

## Deleted source files

```
src/lib/firebase.ts
src/lib/firebase/*
src/lib/firebase-admin.ts
src/app/firebase.ts
firebase.ts (repo root)
src/server/lib/firebase-admin-auth.ts
src/server/services/firebase-registration.adapter.ts
src/lib/saveRegistration.server.ts
src/lib/firestore/payments.server.ts
src/lib/firestore/visitors.server.ts
src/lib/services/firestore/registrations.ts
src/lib/resolveAdminRole.ts
src/app/api/health/firebase-admin/route.ts
```

## Config updates

- `next.config.js` — removed `serverExternalPackages` Firebase entries
- `scripts/staging-env-check.mjs` — Supabase auth checks replace Firebase
- `scripts/staging-security-check.mjs` — `src/` zero-Firebase runtime check
- `scripts/supabase/seed-rbac.mjs` — `registration.backend` = `supabase`

## Legacy CMS pages

Firebase-only admin pages redirect to `/admin/cms`:

- `addwishesreceived`, `addvcdirector`, `addkeynotespeaker`, `noticeboarddata`

## Verification

```bash
rg -i "firebase|firestore|firebase-admin" src/
# → 0 matches
```
