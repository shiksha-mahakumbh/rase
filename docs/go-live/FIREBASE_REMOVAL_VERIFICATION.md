# G2 — Firebase Removal Verification

**Audit date:** 2026-05-29  
**Verdict:** ✅ **PASS (runtime)** — no Firebase SDK in application runtime; migration scripts retain historical references

---

## 1. Search: `src/`

**Command:** `rg -i "firebase|firestore|firebase-admin" src/`

**Result:** 15 files, **15 matches total** — all non-runtime:

| Category | Examples | Runtime impact |
|----------|----------|----------------|
| Legacy naming / comments | `formatFirestoreDate`, payment service header comment | None |
| Admin UI labels | "Firebase" in health/analytics components | Display only |
| Privacy policy text | Mentions Firebase in legal copy | Static content |
| Export alias | `exportRegistrations` legacy naming | Uses Prisma path |

**Critical check:** `rg "from ['\"]firebase|require\(['\"]firebase" src/` → **0 matches**

✅ **No Firebase import statements in `src/`.**

---

## 2. Search: `scripts/`

**Command:** `rg -i "firebase|firestore|firebase-admin" scripts/`

**Result:** 11 script files with references — **migration / audit tooling only:**

| Script | Purpose |
|--------|---------|
| `firebase-export.mjs` | Export Firestore → JSON |
| `firebase-import-supabase.mjs` | Import to Supabase/Prisma |
| `seed-firestore-counter.mjs` | Legacy counter seed |
| `production-registration-audit.mjs` | Historical audit |
| `staging-security-check.mjs` | Includes `src_no_firebase_runtime` test |
| `verify-env.mjs`, `launch-go-live-audit.mjs`, others | Audit helpers |

✅ **No runtime dependency** — scripts are intentional migration artifacts.

---

## 3. `package.json`

**Dependencies / devDependencies:** No `firebase`, `firebase-admin`, or `@firebase/*` packages.

**npm scripts (legacy names retained):**
```json
"seed:counter": "node scripts/seed-firestore-counter.mjs",
"firebase:export": "node scripts/firebase-export.mjs",
"firebase:import": "node scripts/firebase-import-supabase.mjs"
```

⚠️ Script names reference Firebase for **one-time migration**; they do not load Firebase at app runtime.

---

## 4. `package-lock.json`

**Command:** `rg -i '"firebase"|firebase-admin package-lock.json`

**Result:** **0 matches**

✅ No locked Firebase packages.

---

## 5. Automated Verification

**Command:** `node scripts/staging-security-check.mjs`

```json
{
  "test": "src_no_firebase_runtime",
  "status": "PASS",
  "detail": "No Firebase runtime imports under src/"
}
```

**Overall:** 9/9 tests PASS (2026-05-29).

---

## 6. Vercel Residual

`FIREBASE_SERVICE_ACCOUNT_JSON` still present on **Production, Preview, Development** (Vercel env list, 2026-05-29).

This is **not a runtime code dependency** but is a **go-live hygiene item** — remove after migration scripts are retired.

---

## 7. Confirmations

| Requirement | Status |
|-------------|--------|
| No runtime Firebase references in `src/` | ✅ CONFIRMED |
| No Firestore code paths in app runtime | ✅ CONFIRMED (Prisma/Supabase services used) |
| No Firebase auth dependency | ✅ CONFIRMED (Supabase Auth + HMAC admin session) |
| Firebase packages removed from lockfile | ✅ CONFIRMED |

---

## 8. G2 Summary

**Firebase Exit (F1–F7) source verification: PASS.**

Remaining Firebase surface area is limited to:
1. Migration scripts (expected)
2. Vercel env var `FIREBASE_SERVICE_ACCOUNT_JSON` (remove post-migration)
3. Static text / legacy function names (cosmetic)

---

*No code changes. No deployment.*
