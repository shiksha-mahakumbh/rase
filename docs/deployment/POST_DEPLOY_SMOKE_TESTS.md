# Post-Deploy Smoke Tests

**Date:** 2026-06-11  
**Target:** `https://www.shikshamahakumbh.com`  
**Run after:** `npx vercel --prod` + Firebase rules deploy + env alignment  
**Constraint:** Test definitions only — **not executed against post-fix deploy** (production still stale)

---

## Gate summary

| Gate | Endpoint / check | Expected | Current (pre-fix) | Pass? |
|------|------------------|----------|-------------------|:-----:|
| **P0 Security** | Registration lookup | **401** | **200** | ❌ |
| **Health** | `/api/v2/health` | **200** | **404** | ❌ |
| **SEO Sitemap** | `/sitemap.xml` | `.com` only | `rase.co.in` | ❌ |
| **SEO Canonical** | Homepage | `.com` | `rase.co.in` | ❌ |
| **SEO Robots** | `/robots.txt` | `.com` sitemap | `rase.co.in` | ❌ |
| **Payments** | Razorpay webhook POST | **401** (no sig) | **401** | ✅ |
| **CMS Notices** | `/noticeboard` | Content visible | Unverified live | ⚠️ |
| **CMS Downloads** | `/downloads` | Content visible | Unverified live | ⚠️ |
| **Homepage** | `/` | CMS sections | Loads 200 | ⚠️ |

**Overall pre-fix: FAIL** — run again after remediation deploy.

---

## 1. Security gates (P0 — mandatory)

### 1.1 Anonymous registration lookup → MUST 401

```powershell
curl.exe --max-time 30 -s -o NUL -w "STATUS:%{http_code}`n" `
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
```

| Result | Verdict |
|--------|---------|
| `STATUS:401` | **PASS** |
| `STATUS:200` | **FAIL — ROLLBACK IMMEDIATELY** |
| `STATUS:404` | **WARN** — test ID missing; use known registration |
| `STATUS:429` | **WARN** — rate limited; retry after 60s |

### 1.2 Response must NOT contain PII

```powershell
curl.exe --max-time 30 -s `
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001" `
  | Select-String -Pattern "email|contactNumber"
```

| Result | Verdict |
|--------|---------|
| No match | **PASS** |
| Match found | **FAIL** |

### 1.3 Authenticated lookup (with token)

```powershell
# Replace <TOKEN> with HMAC token from registration success flow
curl.exe --max-time 30 -s `
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001?token=<TOKEN>"
```

| Result | Verdict |
|--------|---------|
| HTTP 200, summary fields only (no email/phone) | **PASS** |
| HTTP 200 with email/phone | **FAIL** |
| HTTP 401 with valid token | **FAIL** |

### 1.4 v2 registration route exists

```powershell
curl.exe --max-time 30 -s -o NUL -w "V2:%{http_code}`n" `
  "https://www.shikshamahakumbh.com/api/v2/registration/SMK2026-000001"
```

| Result | Verdict |
|--------|---------|
| `V2:401` | **PASS** (route deployed, auth enforced) |
| `V2:404` | **FAIL** (stale deploy) |

---

## 2. Health gate

```powershell
curl.exe --max-time 30 -s `
  "https://www.shikshamahakumbh.com/api/v2/health"
```

**Expected:**

```json
{
  "status": "ok",
  "service": "rase-web",
  "backend": "firebase",
  "supabase": { "database": "connected", "configured": true },
  "timestamp": "..."
}
```

| HTTP | Body | Verdict |
|------|------|---------|
| 200 | JSON with `"status":"ok"` | **PASS** |
| 404 | HTML | **FAIL** (stale deploy) |
| 200 | `"database":"not_configured"` | **WARN** — fix `DATABASE_URL` |

---

## 3. SEO gates

### 3.1 Sitemap domain

```powershell
curl.exe --max-time 30 -s "https://www.shikshamahakumbh.com/sitemap.xml" `
  | Select-String "<loc>" | Select-Object -First 5
```

| Check | Verdict |
|-------|---------|
| All `<loc>` use `shikshamahakumbh.com` | **PASS** |
| Any `rase.co.in` present | **FAIL** |
| Any `shikshamahakumbh.org` present | **FAIL** |

### 3.2 Robots.txt

```powershell
curl.exe --max-time 30 -s "https://www.shikshamahakumbh.com/robots.txt"
```

**Expected line:**

```
Sitemap: https://www.shikshamahakumbh.com/sitemap.xml
```

| Result | Verdict |
|--------|---------|
| Sitemap line uses `.com` | **PASS** |
| Sitemap line uses `rase.co.in` | **FAIL** |

### 3.3 Canonical + OpenGraph

```powershell
curl.exe --max-time 30 -s "https://www.shikshamahakumbh.com/" `
  | Select-String -Pattern "canonical|og:url|og:image"
```

| Check | Verdict |
|-------|---------|
| `canonical` href = `https://www.shikshamahakumbh.com` | **PASS** |
| `og:url` = `https://www.shikshamahakumbh.com` | **PASS** |
| Any `rase.co.in` in meta tags | **FAIL** |

### 3.4 JSON-LD Organization url

```powershell
curl.exe --max-time 30 -s "https://www.shikshamahakumbh.com/" `
  | Select-String -Pattern '"url":"https://www'
```

| Check | Verdict |
|-------|---------|
| JSON-LD uses `shikshamahakumbh.com` | **PASS** |
| JSON-LD uses `rase.co.in` | **FAIL** |

---

## 4. Payments gate

### 4.1 Webhook route exists

```powershell
curl.exe --max-time 30 -s -o NUL -w "GET:%{http_code}`n" `
  "https://www.shikshamahakumbh.com/api/payments/razorpay-webhook"
```

| Result | Verdict |
|--------|---------|
| `GET:405` | **PASS** (route exists, method not allowed) |
| `GET:404` | **FAIL** |

### 4.2 Webhook rejects unsigned POST

```powershell
curl.exe --max-time 30 -s -o NUL -w "POST:%{http_code}`n" -X POST `
  "https://www.shikshamahakumbh.com/api/payments/razorpay-webhook"
```

| Result | Verdict |
|--------|---------|
| `POST:401` | **PASS** |
| `POST:404` | **FAIL** |
| `POST:200` | **FAIL** (security regression) |

### 4.3 Razorpay Dashboard (manual)

- [ ] Webhook URL = `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook`
- [ ] Send test event → delivery success
- [ ] Verify `paymentRecords` / registration status update in Firestore

---

## 5. CMS gates

### 5.1 Notices visible

```powershell
curl.exe --max-time 30 -s -o NUL -w "NOTICES:%{http_code}`n" `
  "https://www.shikshamahakumbh.com/noticeboard"
```

Manual check:
- [ ] Page loads (HTTP 200)
- [ ] At least one notice card rendered (requires `seed:cms` with notices > 0)

### 5.2 Downloads visible

```powershell
curl.exe --max-time 30 -s -o NUL -w "DOWNLOADS:%{http_code}`n" `
  "https://www.shikshamahakumbh.com/downloads"
```

Manual check:
- [ ] Page loads (HTTP 200)
- [ ] Download items listed (requires seeds with downloads > 0)

### 5.3 Homepage content

```powershell
curl.exe --max-time 30 -s -o NUL -w "HOME:%{http_code}`n" `
  "https://www.shikshamahakumbh.com/"
```

Manual check:
- [ ] Hero section renders
- [ ] CMS-driven sections present (not empty shell)

### 5.4 DB seed verification (pre-deploy baseline)

```powershell
node scripts/staging-db-check.mjs
# Gate: seedCounts.notices > 0, seedCounts.downloads > 0
```

---

## 6. Admin gate (manual)

- [ ] `GET /admin` → login page loads
- [ ] Login with valid admin credentials → dashboard
- [ ] Legacy cookie `smk_admin_session=1` → **rejected** (redirect to login)

---

## 7. Firebase gate (manual — post rules deploy)

- [ ] Console: Firestore rules `registrations` create = `false`
- [ ] Console: anonymous read on `registrations` → denied
- [ ] Console: Storage `registrations/**` write → denied

---

## Pass / fail criteria

**GO requires ALL of:**

| # | Gate | Mandatory |
|---|------|:---------:|
| 1 | Registration lookup → 401 | ✅ |
| 2 | No PII in anonymous response | ✅ |
| 3 | `/api/v2/health` → 200 | ✅ |
| 4 | Sitemap/robots/canonical → `.com` | ✅ |
| 5 | Razorpay webhook POST → 401 (unsigned) | ✅ |
| 6 | Firebase rules Console-verified | ✅ |
| 7 | Notices + downloads visible | ✅ |

**Any P0 security failure → immediate rollback.**

---

## Current baseline (pre-remediation, 2026-06-11)

```
REG:200          (expected 401)
V2_REG:404       (expected 401)
HEALTH:404       (expected 200)
WEBHOOK_GET:405  (PASS)
WEBHOOK_POST:401 (PASS)
Sitemap: rase.co.in (FAIL)
Canonical: rase.co.in (FAIL)
```

**Re-run entire suite after `PRODUCTION_EXECUTION_CHECKLIST.md` Steps 1–6.**

**No smoke tests executed against a post-fix deployment in this audit.**
