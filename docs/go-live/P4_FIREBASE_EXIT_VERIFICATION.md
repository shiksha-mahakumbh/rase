# P4 — Firebase Exit Verification

**Audit date:** 2026-05-29  
**Prior reports:** `docs/firebase-exit/FINAL_FIREBASE_EXIT_REPORT.md`, G2, H2  
**Goal:** 0 runtime Firebase dependencies  
**Verdict:** ✅ **PASS (local source)** | ⚠️ **Production still Firebase-era**

---

## 1. `rg -i "firebase|firestore|firebase-admin" src/`

**Result:** 15 files, **non-runtime references only**

| Category | Examples |
|----------|----------|
| Comments / legacy names | `formatFirestoreDate`, payment service header |
| Admin UI labels | AnalyticsCharts, AdminSystemHealth |
| Privacy policy text | Static legal copy |
| Export aliases | `exportRegistrations` naming |

**Critical:** `rg "from ['\"]firebase|require\(['\"]firebase" src/` → **0 matches**

✅ No Firebase SDK imports in application runtime.

---

## 2. `package.json`

**Dependencies:** No `firebase`, `firebase-admin`, or `@firebase/*`.

**Scripts (migration tooling only):**
```json
"firebase:export": "node scripts/firebase-export.mjs",
"firebase:import": "node scripts/firebase-import-supabase.mjs",
"seed:counter": "node scripts/seed-firestore-counter.mjs"
```

---

## 3. `package-lock.json`

**grep** `"firebase"|firebase-admin` → **0 matches**

✅ No locked Firebase packages.

---

## 4. Middleware

**File:** `src/middleware.ts`

- HMAC admin session via `verifyAdminSessionTokenEdge`
- Legacy cookie `"1"` rejected (line 43)
- No Firebase imports

✅ Supabase/HMAC auth model in source.

---

## 5. API Routes

| Route | Firebase in source? |
|-------|---------------------|
| `api/registration/submit` | ❌ Prisma path |
| `api/registration/[id]` | ❌ Auth-gated lookup |
| `api/payments/razorpay-webhook` | ❌ Prisma payment service |
| `api/health/firebase-admin` | **Deleted** in working tree |

Live production registration behavior (open lookup + `contactNumber`) indicates **deployed routes still Firebase-era**.

---

## 6. Services

| Service | Backend |
|---------|---------|
| `registration.service.ts` | Prisma |
| `payment.service.ts` | Prisma |
| `storage.service.ts` | Supabase Storage |
| `supabase-admin-auth.ts` | Supabase Auth |

No `firebase-admin` imports in `src/server/`.

---

## 7. Auth Flows

| Flow | Source implementation |
|------|----------------------|
| Admin login | Supabase + HMAC session cookie |
| Admin session verify | `admin-session.ts` / edge variant |
| Registration lookup token | HMAC via `REGISTRATION_LOOKUP_SECRET` |

**Automated:** `staging-security-check.mjs` — `src_no_firebase_runtime`: **PASS**

---

## 8. Residual Firebase Surface

| Item | Type | Action |
|------|------|--------|
| Migration scripts in `scripts/` | Tooling | Keep until import done |
| `FIREBASE_SERVICE_ACCOUNT_JSON` on Vercel | Env legacy | Remove post-migration |
| Live production API | Runtime | **Redeploy required** |

---

## P4 Goal Assessment

| Criterion | Local source | Production |
|-----------|--------------|------------|
| 0 runtime Firebase SDK imports | ✅ | ❌ (stale deploy) |
| 0 Firebase packages in lockfile | ✅ | N/A |
| Auth on Supabase/HMAC | ✅ | UNKNOWN |
| Registration on Prisma | ✅ | ❌ |

**Firebase exit in source: VERIFIED.** Production cutover pending deploy + data migration.

---

*Evidence: ripgrep, `package.json`, `staging-security-check.mjs`, P1 live probes.*
