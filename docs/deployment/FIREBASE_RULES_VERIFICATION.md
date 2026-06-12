# Firebase Rules Verification

**Date:** 2026-06-11  
**Method:** Source inspection + `firebase.json` + `firebase/RULES_DEPLOYMENT.md` + `staging-security-check.mjs`

---

## Summary

| Check | Source repo | Production deployed | Status |
|-------|:-----------:|:-------------------:|--------|
| Firestore rules strict | ✅ | **Unverified** | **WARNING** |
| Storage rules strict | ✅ | **Unverified** | **WARNING** |
| Backup rules excluded | ✅ | N/A | **PASS** |
| Deploy instructions exist | ✅ | N/A | **PASS** |

**Classification:** `UNVERIFIED_FIREBASE_DEPLOYMENT`

---

## Firestore rules (`firebase/firestore.rules`)

### Registrations protection

| Rule | Line | Anonymous | Admin |
|------|------|-----------|-------|
| `registrations` create | 24 | **DENIED** (`false`) | N/A |
| `registrations` read | 25 | **DENIED** | Admin only |
| `registrations` update/delete | 25 | **DENIED** | Admin only |

### Other collections

| Collection | Anonymous read | Anonymous write | Lines |
|------------|:--------------:|:---------------:|-------|
| `registrationCounters` | ❌ | ❌ | 28-29 |
| `paymentRecords` | ❌ | ❌ create | 32-34 |
| `audit_logs` | ❌ | ❌ | 37-39 |
| `accommodationRequests` | ❌ | ❌ | 42-44 |
| Catch-all | ❌ | ❌ | 47-49 |

**Verdict:** Anonymous reads and writes on `registrations` are **denied in source**.

---

## Storage rules (`firebase/storage.rules`)

| Path | Anonymous read | Anonymous write | Lines |
|------|:--------------:|:---------------:|-------|
| `registrations/{type}/**` | ❌ (admin) | **❌ false** | 10-12 |
| Catch-all `/**` | ❌ (admin) | **❌ false** | 15-17 |

---

## Backup rules — not referenced

| File | In `firebase.json`? | Status |
|------|:-------------------:|--------|
| `firebase/firestore.rules` | ✅ L3 | **PASS** |
| `firebase/storage.rules` | ✅ L7 | **PASS** |
| `firebase/firestore.rules.production-backup` | ❌ | **PASS** (excluded) |

Automated test `backup_rules_documented_danger` — **PASS** (2026-06-11)

---

## Deployment instructions

**File:** `firebase/RULES_DEPLOYMENT.md`

```bash
firebase deploy --only firestore:rules,storage
```

Post-deploy Console checks documented:
- `registrations` → `allow create: if false`
- Anonymous read/write denied

---

## Production deployment status

| Question | Answer |
|----------|--------|
| Rules safe in git? | **YES** |
| Rules deployed to Firebase Console? | **CANNOT VERIFY** |
| Required before GO? | **YES** |

---

## Verdict

| Item | Status |
|------|--------|
| Source rules | **PASS** |
| Production deploy | **UNVERIFIED — WARNING** |
| Firebase GO | **NO** until Console verified |

**No Firebase changes made.**
