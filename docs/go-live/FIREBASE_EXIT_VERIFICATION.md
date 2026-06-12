# G0 — Firebase Exit Verification

**Audit date:** 2026-06-12  
**Auditor:** Principal Release Manager (audit-only)  
**Scope:** Post F1–F7 implementation verification

---

## Commands executed

```bash
rg -i "firebase|firestore|firebase-admin" src/
rg "from ['\"]firebase|from ['\"]firebase-admin" src/
node scripts/staging-security-check.mjs   # includes src_no_firebase_runtime
grep firebase package.json                  # no firebase / firebase-admin deps
```

---

## Results

### Runtime dependency check — **PASS**

| Check | Result |
|-------|--------|
| `firebase` / `firebase-admin` npm packages | **Removed** from `package.json` |
| ES/module imports from `firebase*` under `src/` | **0 matches** |
| `staging-security-check.mjs` → `src_no_firebase_runtime` | **PASS** (9/9 security checks) |

The application **does not load Firebase SDKs at runtime**.

### Broad string grep — **PASS with cosmetic debt**

`rg -i "firebase|firestore|firebase-admin" src/` returns **15 files**, all **non-runtime**:

| Category | Examples | Risk |
|----------|----------|------|
| Legacy alias | `formatFirestoreDate` in `saveRegistration.ts` | None — wraps `formatRegistrationDate` |
| UI copy | `privacy-policy` mentions Google Firebase | Stale legal text — update before go-live |
| Admin UI labels | `AdminSystemHealth` “Firestore rules”, `admin-nav` “Firebase registrations” | Misleading ops UI — P2 cleanup |
| Comments | `payment.service.ts`, `auth.ts`, `content/registry.ts` | None |

**Verdict:** Meets Firebase Exit success criterion (zero runtime dependencies). String cleanup recommended but not blocking.

---

## Deleted artifacts (confirmed absent)

- `src/lib/firebase*`, `src/lib/firebase-admin.ts`, `src/app/firebase.ts`
- `src/server/lib/firebase-admin-auth.ts`
- `src/server/services/firebase-registration.adapter.ts`
- `src/lib/firestore/*`, `src/lib/saveRegistration.server.ts`
- `src/app/api/health/firebase-admin/route.ts`

---

## Stale configuration still referencing Firebase

| Location | Issue | Go-live action |
|----------|-------|----------------|
| `.env.example` | Still lists `FIREBASE_SERVICE_ACCOUNT_JSON` as required | Update template to Supabase vars |
| `scripts/verify-env.mjs` | Firebase group still required for production | Update or deprecate script |
| Vercel Production/Preview/Dev | `FIREBASE_SERVICE_ACCOUNT_JSON` still present | Remove after migration complete |
| `package.json` | `seed:counter` → Firestore script name | Rename or remove |

---

## G0 verdict

| Criterion | Status |
|-----------|--------|
| Zero Firebase runtime in `src/` | **PASS** |
| Build without Firebase packages | **PASS** |
| Ops/docs/env templates aligned | **FAIL** (stale references remain) |

**Phase G0 overall:** **CONDITIONAL PASS** — code exit complete; operational cleanup pending.
