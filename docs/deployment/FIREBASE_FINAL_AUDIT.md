# Firebase Final Audit

**Date:** 2026-06-10  
**Project:** `shiksha-mahakumbh-abhiyan` (from service account)  
**Registration backend:** `firebase` (`REGISTRATION_BACKEND=firebase`)

---

## Summary

| Layer | Source code | Deployed to production | Verdict |
|-------|-------------|------------------------|---------|
| Firestore rules | ✅ Strict | **Unverified** | **BLOCKER** |
| Storage rules | ✅ Strict | **Unverified** | **BLOCKER** |
| Admin SDK usage | ✅ Correct | ✅ On Vercel | PASS |
| Registration collections | ✅ Server-only writes | Live data exists | CONDITIONAL |
| Backup rules file | ⚠️ Dangerous | Must NOT deploy | DOCUMENTED |

**Rules deployment still required before production GO.**

---

## Firestore rules (`firebase/firestore.rules`)

| Collection | Client create | Client read | Client update/delete | Verdict |
|------------|:-------------:|:-----------:|:--------------------:|:-------:|
| `adminUsers/{userId}` | ❌ | Self only | ❌ | ✅ |
| `registrations/{docId}` | **❌ false** | Admin | Admin | ✅ P0 |
| `registrationCounters` | ❌ | ❌ | ❌ | ✅ |
| `paymentRecords` | ❌ | Admin | ❌ | ✅ |
| `audit_logs` | ❌ | Admin | ❌ | ✅ |
| `accommodationRequests` | ❌ | Admin | ❌ | ✅ |
| Catch-all | ❌ | Admin | ❌ | ✅ |

**Automated test:** `node scripts/staging-security-check.mjs` → `firestore_rules_deny_create` **PASS**

---

## Storage rules (`firebase/storage.rules`)

| Path | Client read | Client write |
|------|:-----------:|:------------:|
| `registrations/{type}/**` | Admin | **❌ false** |
| Catch-all `/**` | Admin | **❌ false** |

Client uploads must route through server APIs.

---

## Dangerous backup (must NOT deploy)

`firebase/firestore.rules.production-backup` contains:

```
allow create: if validRegistrationCreate();
```

This permits **client-side registration creation** — opposite of P0 security posture.

---

## Deployment configuration

**`firebase.json`:**

```json
{
  "firestore": { "rules": "firebase/firestore.rules", "indexes": "firestore.indexes.json" },
  "storage": { "rules": "firebase/storage.rules" }
}
```

| Check | Status |
|-------|--------|
| Rules paths | ✅ Correct |
| Hosting | ❌ Not used (Vercel hosts app) |
| Indexes file referenced | ✅ |

**Deploy command:**

```bash
firebase use shiksha-mahakumbh-abhiyan
firebase deploy --only firestore:rules,storage
```

---

## Admin SDK usage

| Consumer | File | Purpose |
|----------|------|---------|
| Registration submit | `src/lib/firebase-admin` | Server writes |
| Razorpay webhook | `src/lib/firestore/payments.server.ts` | Payment status updates |
| Registration lookup | `src/app/api/registration/[registrationId]/route.ts` | Read with email verify |
| Email status | Various server routes | Firestore updates |

**Vercel:** `FIREBASE_SERVICE_ACCOUNT_JSON` on Production, Preview, Development ✅

---

## Registration collections

| Collection | Write path | Client access |
|------------|------------|---------------|
| `registrations` | Server API only | Read blocked (rules) |
| `paymentRecords` | Webhook (Admin SDK) | Read admin-only |
| `registrationCounters` | Server only | Blocked |

**Live probe note:** Production returned registration data via API without auth — this is an **API-layer** issue (stale deploy), not Firestore rules. Firestore rules still must be verified deployed.

---

## Security posture

| Control | Status |
|---------|--------|
| Client registration create denied | ✅ In source rules |
| Client storage write denied | ✅ In source rules |
| Admin SDK bypasses rules (expected) | ✅ Server-only |
| Rules deployed to Firebase Console | ❌ **Not verified** |
| Backup rules excluded from deploy | ⚠️ Manual discipline required |

---

## Post-deploy verification

1. Firebase Console → Firestore → Rules → confirm `allow create: if false` on `registrations`
2. Firebase Console → Storage → Rules → confirm `allow write: if false`
3. Rules simulator: anonymous create on `registrations` → **denied**

---

## Firebase readiness score

| Category | Score |
|----------|------:|
| Rules source quality | 95 |
| Rules deployed | 0 (unverified) |
| Admin SDK config | 90 |
| Architecture safety | 90 |
| **Overall Firebase** | **55/100** (blocked on deploy verification) |
