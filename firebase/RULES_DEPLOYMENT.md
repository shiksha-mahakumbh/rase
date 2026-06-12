# Firebase Rules — Deployment Guide

**CRITICAL:** Deploy only `firestore.rules` and `storage.rules` from this directory.

**DO NOT deploy** `firestore.rules.production-backup` — that file allows unauthenticated registration `create` and catch-all admin read/write.

```bash
firebase deploy --only firestore:rules,storage
```

Verify in Firebase Console → Firestore → Rules that:
- `registrations` → `allow create: if false`
- Anonymous read/write denied on all collections
