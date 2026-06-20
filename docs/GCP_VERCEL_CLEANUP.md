# GCP & Vercel Cleanup — Post-Firebase Exit

**Project:** `shiksha-mahakumbh-abhiyan` (Firebase/GCP)  
**Vercel team:** `dhe-projects` · **Project:** `rase-co-in`  
**Production:** https://www.shikshamahakumbh.com

Firebase is removed from the codebase. Complete operator cleanup below.

---

## Part 1 — Vercel — ✅ COMPLETE

`FIREBASE_SERVICE_ACCOUNT_JSON` removed from Production (verified dry-run: 0 Firebase vars on all envs).

<details>
<summary>Reference commands (already run)</summary>


```powershell
cd c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase
npx vercel login
npx vercel link   # select dhe-projects / rase-co-in if prompted
```

### Option A — Automated script (recommended)

```powershell
# Dry-run: lists what would be removed
node scripts/cleanup-vercel-firebase-env.mjs

# Apply removals on production, preview, development
node scripts/cleanup-vercel-firebase-env.mjs --apply
```

Removes:

| Variable | Why |
|----------|-----|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Legacy Admin SDK secret — no longer used |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client SDK removed |
| `FIREBASE_PROJECT_ID` | Unused |
| `FIREBASE_SA_PATH` | Unused |
| `VISITOR_COUNTER_USE_FIRESTORE` | Dead flag |
| `REGISTRATION_BACKEND=firebase` | Replaced with `supabase` if found |

### Option B — Manual (Vercel Dashboard)

1. Open [Vercel → dhe-projects → rase-co-in → Settings → Environment Variables](https://vercel.com/dhe-projects/rase-co-in/settings/environment-variables)
2. Delete `FIREBASE_SERVICE_ACCOUNT_JSON` from **Production**, **Preview**, and **Development**
3. Delete any other `FIREBASE_*` or `NEXT_PUBLIC_FIREBASE_*` keys
4. Ensure `REGISTRATION_BACKEND` is **`supabase`** or **unset** (not `firebase`)

### Option C — CLI one-liners

```powershell
foreach ($env in @("production","preview","development")) {
  npx vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON $env --yes
  npx vercel env rm NEXT_PUBLIC_FIREBASE_API_KEY $env --yes
  npx vercel env rm FIREBASE_PROJECT_ID $env --yes
}
```

### Verify after Vercel cleanup

```powershell
npx vercel env ls production
npm run audit:firebase-removal
curl https://www.shikshamahakumbh.com/api/v2/health
```

Expected health response includes `"backend":"supabase"` and `"database":"connected"`.

No redeploy is required for **removing** env vars; existing deployments simply stop receiving the removed secrets.

</details>

---

## Part 2 — GCP / Firebase — screen-by-screen guide

**Full walkthrough:** [GCP_CONSOLE_WALKTHROUGH.md](./GCP_CONSOLE_WALKTHROUGH.md) (13 screens: key → export → lock → delete)

### Quick export (after creating a service account key)

```powershell
npm i -D firebase-admin
$env:FIREBASE_SA_PATH = "C:\path\to\export-key.json"
npm run export:gcp-firestore
npm run export:gcp-storage              # manifest
npm run export:gcp-storage -- --download  # files
```

---

## Part 2 (summary) — GCP / Firebase (≈30–60 minutes)

Only proceed after:

- [x] `npm run check:legacy-urls` → 0 legacy Firebase storage URLs in Postgres
- [x] `npm run audit:firebase-removal` → PASS
- [ ] Production stable on Supabase for 48+ hours (your call)
- [ ] Final export of any Firestore/Storage data you want to keep

### 2.1 Final export (optional archive)

If you still have live data in GCP and want a cold backup:

1. Install Firebase CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. From a machine with the service account JSON (one-time):

```powershell
$env:FIREBASE_SERVICE_ACCOUNT_JSON = '<paste or load from secure vault>'
# Use archived export script from git history, or Firebase Console → Firestore → Export
```

Or use **Firebase Console → Firestore → Import/Export** to Cloud Storage bucket.

### 2.2 Lock down before delete

In [Firebase Console](https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan):

1. **Authentication** → disable all sign-in providers (Google, Anonymous, etc.)
2. **Firestore** → confirm rules deny all client writes (project can be deleted regardless)
3. **Storage** → confirm no public write rules
4. **Usage** → confirm no production traffic (Billing → no active reads/writes)

### 2.3 Disable billing & delete project

1. [Google Cloud Console](https://console.cloud.google.com/) → select `shiksha-mahakumbh-abhiyan`
2. **IAM & Admin → Settings** → note project number
3. **Billing** → unlink billing account (stops charges)
4. **IAM & Admin → Settings → Shut down** (or delete project)

```text
Project ID: shiksha-mahakumbh-abhiyan
```

Deletion is irreversible after the 30-day grace period.

### 2.4 Rotate compromised credentials

If `FIREBASE_SERVICE_ACCOUNT_JSON` was ever in `.env.local`, git, or chat:

1. GCP → **IAM → Service Accounts** → `firebase-adminsdk-fbsvc@...` → **Keys** → delete old key
2. Even after project delete, rotate if the JSON was exposed publicly

---

## Part 3 — Post-cleanup checklist

| Step | Command / action | Done |
|------|------------------|------|
| Vercel Firebase env removed | `node scripts/cleanup-vercel-firebase-env.mjs --apply` | ☐ |
| `npx vercel env ls production` shows no `FIREBASE_*` | | ☐ |
| Production health OK | `GET /api/v2/health` | ☐ |
| GCP Auth providers disabled | Firebase Console | ☐ |
| GCP project deleted or billing removed | Cloud Console | ☐ |
| Service account key rotated if exposed | GCP IAM | ☐ |

---

## Quick reference

| Resource | URL |
|----------|-----|
| Vercel env settings | https://vercel.com/dhe-projects/rase-co-in/settings/environment-variables |
| Firebase console | https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan |
| GCP console | https://console.cloud.google.com/home/dashboard?project=shiksha-mahakumbh-abhiyan |
| Backend docs | [docs/BACKEND.md](./BACKEND.md) |
