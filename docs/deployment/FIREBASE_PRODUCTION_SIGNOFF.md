# Firebase Production Signoff

**Date:** 2026-06-11  
**Method:** Rules source inspection, `firebase.json`, `firebase/RULES_DEPLOYMENT.md`, `staging-security-check.mjs`  
**Signoff status:** **NOT SIGNED** — production deployment unverified

---

## Signoff summary

| Check | Source repo | Production deployed | Status |
|-------|:-----------:|:-------------------:|--------|
| Registration reads denied (anonymous) | ✅ | **Unverified** | **FAIL** |
| Registration writes denied (anonymous) | ✅ | **Unverified** | **FAIL** |
| Registration create denied | ✅ | **Unverified** | **FAIL** |
| Storage registration paths write denied | ✅ | **Unverified** | **FAIL** |
| Backup rules excluded from deploy | ✅ | N/A | **PASS** |
| Deploy procedure documented | ✅ | N/A | **PASS** |
| Automated source rules test | ✅ | N/A | **PASS** |

**Classification:** `UNVERIFIED_FIREBASE_DEPLOYMENT`

**Cannot sign off for production GO.**

---

## Firestore rules (`firebase/firestore.rules`)

### Registrations — anonymous access

| Operation | Line | Rule | Anonymous | Admin |
|-----------|------|------|:---------:|:-----:|
| `create` | 24 | `allow create: if false` | **DENIED** | **DENIED** |
| `read` | 25 | `allow read: if isAdminUser()` | **DENIED** | Allowed |
| `update` | 25 | `allow update: if isAdminUser()` | **DENIED** | Allowed |
| `delete` | 25 | `allow delete: if isAdminUser()` | **DENIED** | Allowed |

### Supporting collections

| Collection | Anonymous read | Anonymous write | Lines |
|------------|:--------------:|:---------------:|-------|
| `adminUsers` | Self-read only if signed in | **DENIED** | 18-20 |
| `registrationCounters` | **DENIED** | **DENIED** | 28-29 |
| `paymentRecords` | **DENIED** | **DENIED** create/update/delete | 32-34 |
| `audit_logs` | **DENIED** | **DENIED** | 37-39 |
| `accommodationRequests` | **DENIED** | **DENIED** | 42-44 |
| Catch-all `{collection}/{docId}` | **DENIED** | **DENIED** | 47-49 |

**Source verdict:** Anonymous registration reads and writes are **denied**.

---

## Storage rules (`firebase/storage.rules`)

| Path | Anonymous read | Anonymous write | Lines |
|------|:--------------:|:---------------:|-------|
| `registrations/{type}/**` | **DENIED** (admin only) | **`allow write: if false`** | 10-12 |
| Catch-all `/**` | **DENIED** (admin only) | **`allow write: if false`** | 15-17 |

**Source verdict:** Anonymous writes to registration storage paths are **denied**.

---

## Deploy configuration

**`firebase.json`:**

```json
{
  "firestore": { "rules": "firebase/firestore.rules" },
  "storage":   { "rules": "firebase/storage.rules" }
}
```

| File | Referenced in `firebase.json`? | Safe to deploy? |
|------|:------------------------------:|:---------------:|
| `firebase/firestore.rules` | ✅ L3 | ✅ |
| `firebase/storage.rules` | ✅ L7 | ✅ |
| `firebase/firestore.rules.production-backup` | ❌ **Excluded** | ⚠️ **DANGEROUS** — never deploy |

Automated test `backup_rules_documented_danger`: **PASS** (2026-06-11)

---

## Deployment procedure

**Document:** `firebase/RULES_DEPLOYMENT.md`

### Pre-deploy

```bash
cd rase
firebase login
firebase use <production-project-id>   # confirm correct project
firebase projects:list
```

### Deploy

```bash
firebase deploy --only firestore:rules,storage
```

### Post-deploy Console verification

1. Firebase Console → **Firestore** → **Rules**
   - Confirm `match /registrations/{docId}` shows `allow create: if false`
   - Confirm read/update/delete require `isAdminUser()`
2. Firebase Console → **Storage** → **Rules**
   - Confirm `registrations/{type}/**` has `allow write: if false`
3. Record rules publish timestamp and operator in change log

### Optional runtime probe (requires Firebase test client)

Attempt anonymous `get` on `registrations/{docId}` — expect **permission-denied**.

---

## Vercel Firebase credential

| Variable | Scope | Status |
|----------|-------|--------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development | ✅ Present |

Server-side Firebase Admin SDK can authenticate; rules enforcement is independent of Admin SDK (client SDK subject to rules).

---

## Signoff checklist

| # | Item | Owner | Done? |
|---|------|-------|:-----:|
| 1 | Confirm production Firebase project ID | Ops | ❌ |
| 2 | `firebase deploy --only firestore:rules,storage` | Ops | ❌ |
| 3 | Console screenshot: Firestore rules L23-26 | Ops | ❌ |
| 4 | Console screenshot: Storage rules L10-12 | Ops | ❌ |
| 5 | Verify backup rules NOT active in Console | Ops | ❌ |
| 6 | Release Manager signoff | RM | ❌ |

---

## Signoff decision

| Question | Answer |
|----------|--------|
| Source rules production-ready? | **YES** |
| Production rules verified deployed? | **NO** |
| Signoff for GO? | **NO** |

**Required before GO:** Execute deployment procedure + Console confirmation.

**No Firebase deploy executed in this audit.**
