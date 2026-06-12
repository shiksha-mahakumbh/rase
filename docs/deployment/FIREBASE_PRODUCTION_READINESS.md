# Firebase Production Readiness

**Date:** June 2026  
**Project:** `shiksha-mahakumbh-abhiyan` (from service account)  
**Registration backend:** `firebase` (unchanged)

---

## Summary

| Layer | Repo status | Deployed to production | Verdict |
|-------|-------------|------------------------|---------|
| Firestore rules (source) | ✅ Strict | **NOT VERIFIED** | **BLOCKER** |
| Storage rules (source) | ✅ Strict | **NOT VERIFIED** | **BLOCKER** |
| `firebase.json` config | ✅ Valid | N/A | Ready |
| Service account on Vercel | ✅ Present | Production + Preview + Dev | Ready |
| Dangerous backup rules | ⚠️ Exists in repo | Must NOT deploy | Documented |

**Firebase production readiness: NO GO until rules deployed and verified in Console.**

---

## Firestore rules audit (`firebase/firestore.rules`)

| Collection / pattern | create | read | update | delete | Verdict |
|---------------------|--------|------|--------|--------|---------|
| `adminUsers/{userId}` | ❌ | Self only | ❌ | ❌ | ✅ |
| `registrations/{docId}` | **❌ false** | Admin | Admin | Admin | ✅ P0 |
| `registrationCounters` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `paymentRecords` | ❌ | Admin | ❌ | ❌ | ✅ |
| `audit_logs` | ❌ | Admin | ❌ | ❌ | ✅ |
| `accommodationRequests` | ❌ | Admin | ❌ | ❌ | ✅ |
| Catch-all `{collection}/{docId}` | ❌ | Admin | ❌ | ❌ | ✅ |

**Automated test:** `staging-security-check.mjs` → `firestore_rules_deny_create` **PASS**

### Dangerous file (do not deploy)

| File | Risk |
|------|------|
| `firebase/firestore.rules.production-backup` | Allows `validRegistrationCreate()` — client-side registration create |

---

## Storage rules audit (`firebase/storage.rules`)

| Path | read | write | Verdict |
|------|------|-------|---------|
| `registrations/{type}/**` | Admin | **❌ false** | ✅ |
| Catch-all `/**` | Admin | **❌ false** | ✅ |

Client uploads must go through server API (Supabase storage or server-mediated paths).

---

## Deployment configuration

### `firebase.json`

```json
{
  "firestore": { "rules": "firebase/firestore.rules", "indexes": "firestore.indexes.json" },
  "storage": { "rules": "firebase/storage.rules" }
}
```

| Check | Status |
|-------|--------|
| Rules path correct | ✅ |
| Indexes file referenced | ✅ (`firestore.indexes.json`) |
| Hosting configured | ❌ Not used (Vercel hosts app) |

### Deploy command

```bash
firebase use shiksha-mahakumbh-abhiyan   # confirm project
firebase deploy --only firestore:rules,storage
```

Documented in `firebase/RULES_DEPLOYMENT.md`.

---

## Environment dependencies

| Variable | Vercel | Purpose |
|----------|--------|---------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Prod, Preview, Dev | Admin SDK — registration, webhooks, email |
| `REGISTRATION_BACKEND` | `firebase` | Must remain `firebase` |

---

## Production verification (post-deploy)

### Firebase Console checks

1. **Firestore → Rules** — confirm live rules show `allow create: if false` on `registrations`
2. **Storage → Rules** — confirm `allow write: if false` on all paths
3. **Compare** live rules text against `firebase/firestore.rules` in git (not backup file)

### Runtime smoke tests

```bash
# Anonymous client must NOT create registration (test via Firebase SDK or security rules simulator)
# Expected: permission-denied on registrations.create

# Razorpay webhook must update paymentStatus (server-side Admin SDK — bypasses rules)
```

---

## Risk assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Backup rules accidentally deployed | **P0** | Deploy only from `firebase/` strict files; delete backup from deploy scripts |
| Rules never deployed (prod still open) | **P0** | Console verification mandatory |
| Service account JSON leaked | **P1** | Rotate key if exposed in chat; Vercel encrypted vars |
| Indexes missing for queries | **P2** | Deploy indexes if query errors appear |

---

## Blockers

| # | Blocker | Owner |
|---|---------|-------|
| 1 | Firestore rules not confirmed deployed to production Firebase | DevOps |
| 2 | Storage rules not confirmed deployed | DevOps |
| 3 | No post-deploy rules verification logged | QA |

---

## Verdict

| Item | Ready? |
|------|--------|
| Rules source code | ✅ YES |
| Rules deployed to production | ❌ NO (unverified) |
| Firebase production GO | ❌ **NO** |
