# GCP Console Walkthrough — Export & Decommission

**Project ID:** `shiksha-mahakumbh-abhiyan`  
**Vercel cleanup:** Done (`FIREBASE_SERVICE_ACCOUNT_JSON` removed)  
**App backend:** Supabase only — safe to archive/delete GCP after export

Use this guide in order. Each section matches one console screen.

---

## Phase 0 — Before you start

```powershell
cd c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase
npm run audit:firebase-removal          # must PASS
npm run check:legacy-urls               # 0 legacy URLs in Postgres
```

Confirm production: https://www.shikshamahakumbh.com/api/v2/health → `"backend":"supabase"`.

---

## Phase 1 — Create a one-time service account key

You removed the Vercel secret; create a **new temporary key** for export only.

### Screen 1: Google Cloud Console — project picker

1. Open https://console.cloud.google.com/
2. Top bar → **Select a project**
3. Choose **`shiksha-mahakumbh-abhiyan`**
4. Confirm the project ID in the dashboard header

### Screen 2: IAM → Service Accounts

1. Left menu ☰ → **IAM & Admin** → **Service accounts**
   - Direct link: https://console.cloud.google.com/iam-admin/serviceaccounts?project=shiksha-mahakumbh-abhiyan
2. Find **`firebase-adminsdk-fbsvc@shiksha-mahakumbh-abhiyan.iam.gserviceaccount.com`**
3. Click the email → **Keys** tab → **Add key** → **Create new key** → **JSON**
4. Save the downloaded file securely (e.g. `C:\secure\smk-firebase-export-key.json`)
5. **Do not commit** this file to git

### Screen 3: Set local env for scripts

```powershell
$env:FIREBASE_SA_PATH = "C:\secure\smk-firebase-export-key.json"
# or single-line JSON:
# $env:FIREBASE_SERVICE_ACCOUNT_JSON = Get-Content C:\secure\smk-firebase-export-key.json -Raw
```

---

## Phase 2 — Export Firestore (choose A or B)

### Option A — Script export (JSON on your machine) — recommended

```powershell
npm i -D firebase-admin
npm run export:gcp-firestore
```

Output: `./exports/gcp-firestore/*.json` + `manifest.json`

Verify:

```powershell
Get-ChildItem exports/gcp-firestore/*.json | Select-Object Name, Length
Get-Content exports/gcp-firestore/manifest.json
```

Collections exported (20): registrations, registrationCounters, conclave_registrations, delegate_registrations, legacy SM24 collections, paymentRecords, audit_logs, events, etc.

### Option B — GCP Console export (to Cloud Storage bucket)

Use this if you prefer Google-managed archive in a bucket.

#### Screen 4: Create a backup bucket (if none exists)

1. Cloud Console → **Cloud Storage** → **Buckets**
   - https://console.cloud.google.com/storage/browser?project=shiksha-mahakumbh-abhiyan
2. **Create bucket**
   - Name: e.g. `smk-firestore-archive-2026`
   - Location: same region as Firestore (check Firestore → Settings)
   - Storage class: **Archive** or **Nearline**
   - Access: **Uniform**, no public access
3. **Create**

#### Screen 5: Firestore → Export

1. Cloud Console → **Firestore** → **Import/Export**
   - https://console.cloud.google.com/firestore/databases/-default-/import-export?project=shiksha-mahakumbh-abhiyan
2. Tab **Export**
3. **Export entire database** (or select collections)
4. **Browse** → select bucket `gs://smk-firestore-archive-2026/exports/2026-06-20/`
5. **Export** → wait for operation to complete (Operations tab)

---

## Phase 3 — Export Firebase Storage (optional)

Registration PDFs/receipts may still live in Storage even if Postgres uses Supabase.

### Option A — Script

```powershell
# Manifest only (fast)
npm run export:gcp-storage

# Download all files (can be large)
npm run export:gcp-storage -- --download
```

Output: `./exports/gcp-storage/storage-manifest.json` (+ `files/` if `--download`)

### Option B — Firebase Console

1. https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan/storage
2. **Files** tab → browse `registrations/` and other prefixes
3. Select folders → **Download** (manual, fine for small volumes)

---

## Phase 4 — Lock down Authentication

### Screen 6: Firebase → Authentication → Sign-in method

1. Open https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan/authentication/providers
2. Left nav: **Build** → **Authentication**
3. Tab: **Sign-in method**
4. For each **Enabled** provider (Google, Email/Password, Anonymous, etc.):
   - Click provider name
   - Toggle **Enable** → **OFF**
   - **Save**
5. Tab: **Users** — optional: note user count (should be legacy admin accounts only)

---

## Phase 5 — Verify Firestore & Storage are idle

### Screen 7: Firebase → Usage

1. https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan/usage
2. Confirm **Firestore** reads/writes ≈ 0 (except your export)
3. Confirm **Storage** bandwidth ≈ 0

### Screen 8: Firestore → Data (spot check)

1. https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan/firestore/databases/-default-/data
2. Open `registrations` → confirm doc count matches export manifest
3. No new documents with today's timestamp (proves app is not writing)

### Screen 9: Storage → Rules

1. https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan/storage/rules
2. Confirm writes are denied for clients (server used Admin SDK historically)

---

## Phase 6 — Revoke export key

### Screen 10: Delete temporary service account key

1. Return to **IAM & Admin** → **Service accounts** → `firebase-adminsdk-fbsvc@...`
2. **Keys** tab
3. Delete the key you created in Phase 1 (shows recent creation date)
4. Delete local JSON file from disk after export verified

If the old key was ever exposed (`.env.local`, chat): delete **all** old keys listed.

---

## Phase 7 — Stop billing

### Screen 11: Billing account

1. https://console.cloud.google.com/billing/linkedaccount?project=shiksha-mahakumbh-abhiyan
2. **Manage billing accounts**
3. For project `shiksha-mahakumbh-abhiyan`:
   - **Disable billing** or **Unlink project**
4. Confirm no other services depend on this project

---

## Phase 8 — Delete the project

### Screen 12: Shut down project

1. https://console.cloud.google.com/iam-admin/settings?project=shiksha-mahakumbh-abhiyan
2. Tab **Settings**
3. **Shut down** (or **Delete project**)
4. Type project ID `shiksha-mahakumbh-abhiyan` to confirm
5. **Shut down**

Google keeps the project in a **30-day pending deletion** state; you can restore during that window.

### Screen 13: Firebase console (after shutdown)

1. Revisit https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan
2. Should show project unavailable / scheduled for deletion

---

## Phase 9 — Final verification (your repo + production)

```powershell
npm run audit:firebase-removal
npm run cleanup:vercel-firebase          # dry-run — should show 0 Firebase vars
```

Production checks:

```powershell
(Invoke-RestMethod https://www.shikshamahakumbh.com/api/v2/health).backend
# → supabase
```

| Checklist item | Done |
|----------------|------|
| Firestore exported (JSON or GCS) | ☐ |
| Storage manifest/download | ☐ |
| Auth providers disabled | ☐ |
| Export service account key deleted | ☐ |
| Billing disabled | ☐ |
| GCP project shut down | ☐ |
| Export files stored offline (OneDrive/USB) | ☐ |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing firebase-admin` | `npm i -D firebase-admin` then re-run export |
| `PERMISSION_DENIED` on export | Service account needs **Cloud Datastore User** + **Storage Object Viewer** |
| `FIREBASE_SERVICE_ACCOUNT_JSON` unset | Use `FIREBASE_SA_PATH` pointing to JSON key file |
| Export shows 0 docs but console has data | Database ID must be `(default)` — script uses named DB `default` |
| Bucket export fails | Enable Firestore in Native mode; check bucket IAM for Firestore service agent |

---

## Quick links

| Screen | URL |
|--------|-----|
| GCP dashboard | https://console.cloud.google.com/home/dashboard?project=shiksha-mahakumbh-abhiyan |
| Service accounts | https://console.cloud.google.com/iam-admin/serviceaccounts?project=shiksha-mahakumbh-abhiyan |
| Firestore export | https://console.cloud.google.com/firestore/databases/-default-/import-export?project=shiksha-mahakumbh-abhiyan |
| Firebase Auth | https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan/authentication/providers |
| Firebase Storage | https://console.firebase.google.com/project/shiksha-mahakumbh-abhiyan/storage |
| Billing | https://console.cloud.google.com/billing/linkedaccount?project=shiksha-mahakumbh-abhiyan |
| Delete project | https://console.cloud.google.com/iam-admin/settings?project=shiksha-mahakumbh-abhiyan |
