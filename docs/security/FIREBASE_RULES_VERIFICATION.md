# Firebase Rules Verification

**Date:** May 2026  
**Status:** REPO VERIFIED — production deploy must be confirmed manually

---

## Files in repository

| File | Purpose | Deploy? |
|------|---------|---------|
| `firebase/firestore.rules` | **Strict production rules** | ✅ YES |
| `firebase/storage.rules` | Storage deny-write | ✅ YES |
| `firebase/firestore.rules.production-backup` | **Dangerous legacy rules** | ❌ NEVER |

See `firebase/RULES_DEPLOYMENT.md` for deploy command.

---

## Firestore rules — strict (`firestore.rules`)

### PASS / FAIL matrix

| Collection | Anonymous read | Anonymous write | Admin read | Admin write | Verdict |
|------------|----------------|-----------------|------------|-------------|---------|
| `adminUsers` | ❌ Denied (own doc only if signed in) | ❌ Denied | Own uid read | ❌ Denied | **PASS** |
| `registrations` | ❌ Denied | ❌ Denied (`create: false`) | ✅ `isAdminUser()` | ❌ Denied | **PASS** |
| `registrationCounters` | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | **PASS** |
| `paymentRecords` | ❌ Denied | ❌ Denied | ✅ Admin | ❌ Denied | **PASS** |
| `audit_logs` | ❌ Denied | ❌ Denied | ✅ Admin | ❌ Denied | **PASS** |
| `accommodationRequests` | ❌ Denied | ❌ Denied | ✅ Admin | ❌ Denied | **PASS** |
| Catch-all `{collection}` | ❌ Denied | ❌ Denied | ✅ Admin read | ❌ Denied | **PASS** |

### `isAdminUser()` requires

- Firebase Auth signed in
- Document in `adminUsers/{uid}`
- Role in allowed list: `admin`, `superadmin`, `coordinator`, `reviewer`, `Super Admin`, `Admin`, `Data Entry`

---

## Firestore rules — backup (`firestore.rules.production-backup`) — DO NOT DEPLOY

| Collection | Anonymous read | Anonymous write | Verdict |
|------------|----------------|-----------------|---------|
| `registrations` | ❌ | ✅ **`create: if validRegistrationCreate()`** | **FAIL** |
| Catch-all `{collection}` | ❌ | ✅ **Admin read/write** | **FAIL** |
| `audit_logs` | ❌ | ✅ **Anonymous create allowed** | **FAIL** |

If this file is deployed to production, client-side `addDoc` registration paths may be exploitable.

---

## Storage rules (`storage.rules`)

| Path | Anonymous read | Anonymous write | Admin read | Verdict |
|------|----------------|-----------------|------------|---------|
| `registrations/{type}/**` | ❌ | ❌ | ✅ `isAdmin()` | **PASS** |
| Catch-all `**` | ❌ | ❌ | ✅ Admin | **PASS** |

All client writes denied — uploads must go through server API.

---

## Production verification steps (manual)

```bash
# 1. Deploy strict rules only
firebase deploy --only firestore:rules,storage

# 2. In Firebase Console → Firestore → Rules, confirm:
#    match /registrations/{docId} { allow create: if false; }

# 3. Test anonymous client SDK (should fail):
#    - Read registrations → permission-denied
#    - Create registration → permission-denied
```

---

## Overall verdict

| Layer | Repo state | Production state |
|-------|------------|------------------|
| Firestore strict rules | **PASS** | ⚠️ **UNVERIFIED** — must confirm in Console |
| Firestore backup rules | **FAIL** (must not deploy) | ⚠️ Unknown |
| Storage rules | **PASS** | ⚠️ **UNVERIFIED** |

**Blocker status:** Code/repo **PASS**. Production Firebase project deploy **must be confirmed** before production launch.
