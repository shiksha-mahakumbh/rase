# Firebase Deployment Audit

**Date:** 2026-06-10  
**Project:** `shiksha-mahakumbh-abhiyan`  
**Method:** Rules source review + `firebase.json` + `staging-security-check.mjs`

---

## Summary

| Check | Source repo | Deployed to production | Verdict |
|-------|:-----------:|:----------------------:|---------|
| `firestore.rules` strict | ✅ | **Unverified** | **BLOCKER** |
| `storage.rules` strict | ✅ | **Unverified** | **BLOCKER** |
| Backup rules not referenced | ✅ | N/A | PASS |
| Admin SDK on Vercel | ✅ | ✅ | PASS |

---

## Firestore rules (`firebase/firestore.rules`)

| Collection | Anonymous read | Anonymous write | Verdict |
|------------|:----------------:|:---------------:|:-------:|
| `registrations/{docId}` | ❌ (admin only) | **❌ `create: false`** | ✅ |
| `registrationCounters` | ❌ | ❌ | ✅ |
| `paymentRecords` | ❌ (admin read) | ❌ | ✅ |
| `audit_logs` | ❌ (admin read) | ❌ | ✅ |
| `accommodationRequests` | ❌ (admin read) | ❌ | ✅ |
| Catch-all `{collection}/{docId}` | ❌ (admin read) | ❌ | ✅ |

**Key rule (L23–26):**
```
match /registrations/{docId} {
  allow create: if false;
  allow read, update, delete: if isAdminUser();
}
```

**Automated test:** `firestore_rules_deny_create` — **PASS**

---

## Storage rules (`firebase/storage.rules`)

| Path | Anonymous read | Anonymous write |
|------|:--------------:|:---------------:|
| `registrations/{type}/**` | ❌ (admin) | **❌ `write: false`** |
| Catch-all `/**` | ❌ (admin) | **❌ `write: false`** |

---

## Backup rules — not referenced ✅

| File | Referenced in deploy? | Risk |
|------|:---------------------:|------|
| `firebase/firestore.rules` | ✅ `firebase.json` L3 | Safe |
| `firebase/storage.rules` | ✅ `firebase.json` L7 | Safe |
| `firebase/firestore.rules.production-backup` | ❌ **Not in `firebase.json`** | Dangerous if manually deployed |

**Backup contains:** `allow create: if validRegistrationCreate()` — permits client registration writes.

**Automated test:** `backup_rules_documented_danger` — **PASS**

---

## Deployment configuration

**`firebase.json`:**
```json
{
  "firestore": { "rules": "firebase/firestore.rules", "indexes": "firestore.indexes.json" },
  "storage": { "rules": "firebase/storage.rules" }
}
```

| Check | Result |
|-------|--------|
| Correct rules paths | ✅ |
| Backup excluded | ✅ |
| Indexes referenced | ✅ |

---

## Admin SDK usage (unchanged — audit only)

| Consumer | Write path |
|----------|------------|
| Registration submit API | Server Admin SDK |
| Razorpay webhook | `processRazorpayWebhookEvent()` |
| Registration lookup | `getAdminFirestore()` read |

**Vercel:** `FIREBASE_SERVICE_ACCOUNT_JSON` on Production, Preview, Development ✅

---

## Production deployment status

| Question | Answer |
|----------|--------|
| Are strict rules in repo? | **YES** |
| Are rules deployed to Firebase Console? | **UNKNOWN — not verified** |
| Is deployment still required? | **YES — mandatory before GO** |

---

## Post-deploy verification

```bash
firebase use shiksha-mahakumbh-abhiyan
firebase deploy --only firestore:rules,storage
```

**Console checks:**
1. Firestore → Rules → `registrations` → `allow create: if false`
2. Storage → Rules → all paths → `allow write: if false`
3. Rules simulator: anonymous create on `registrations` → **denied**

---

## Verdict

| Item | Ready? |
|------|:------:|
| Rules source safe | ✅ |
| Rules deployed | ❌ |
| Backup excluded | ✅ |
| **Firebase GO** | ❌ |

**No Firebase changes applied.**
