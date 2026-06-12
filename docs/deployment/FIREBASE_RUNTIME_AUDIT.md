# Firebase Runtime Audit

**Date:** 2026-06-10  
**Project:** `shiksha-mahakumbh-abhiyan`  
**Method:** Rules source review + `firebase.json` + `staging-security-check.mjs`

---

## Summary

| Check | Source repo | Production deployed | Verdict |
|-------|:-----------:|:-------------------:|---------|
| Firestore rules strict | ✅ | **UNVERIFIED** | **UNVERIFIED_FIREBASE_DEPLOYMENT** |
| Storage rules strict | ✅ | **UNVERIFIED** | **UNVERIFIED_FIREBASE_DEPLOYMENT** |
| Backup rules excluded | ✅ | N/A | PASS |
| Admin SDK on Vercel | ✅ | ✅ | PASS |

---

## Firestore rules (`firebase/firestore.rules`)

### Anonymous access

| Collection | Anonymous read | Anonymous write |
|------------|:--------------:|:---------------:|
| `registrations/{docId}` | ❌ (admin only) | **❌ `create: false` L24** |
| `registrationCounters` | ❌ | ❌ |
| `paymentRecords` | ❌ | ❌ |
| Catch-all | ❌ (admin read) | ❌ |

**Registrations cannot be read or written anonymously.** Admin SDK (server) bypasses rules — expected.

### Key lines

| Rule | Line |
|------|------|
| `allow create: if false` on registrations | 24 |
| `allow read, update, delete: if isAdminUser()` | 25 |
| Catch-all deny write | 47-49 |

**Automated test:** `firestore_rules_deny_create` — **PASS**

---

## Storage rules (`firebase/storage.rules`)

| Path | Anonymous read | Anonymous write |
|------|:--------------:|:---------------:|
| `registrations/{type}/**` | ❌ (admin) | **❌ `write: false` L12** |
| Catch-all `/**` | ❌ (admin) | **❌ `write: false` L17** |

---

## Backup rules — not referenced ✅

| File | In `firebase.json`? |
|------|:-------------------:|
| `firebase/firestore.rules` | ✅ L3 |
| `firebase/storage.rules` | ✅ L7 |
| `firebase/firestore.rules.production-backup` | ❌ **Not referenced** |

Backup contains `allow create: if validRegistrationCreate()` — dangerous if manually deployed.

**Test:** `backup_rules_documented_danger` — **PASS**

---

## Production deployment status

| Question | Answer |
|----------|--------|
| Are strict rules in repository? | **YES** |
| Can Firebase Console deployment be confirmed? | **NO** |
| Classification | **UNVERIFIED_FIREBASE_DEPLOYMENT** |

**Required before GO:**

```bash
firebase deploy --only firestore:rules,storage
# Then verify in Firebase Console
```

---

## Vercel wiring

`FIREBASE_SERVICE_ACCOUNT_JSON` present on: Production, Preview, Development ✅

---

## Verdict

| Item | Status |
|------|--------|
| Source rules safe | ✅ PASS |
| Production rules deployed | ❌ **UNVERIFIED_FIREBASE_DEPLOYMENT** |
| Firebase runtime GO | ❌ **NO GO** |

**No Firebase changes made.**
