# H3 — Production Deployment Drift Audit

**Audit date:** 2026-05-29  
**Live domain:** `https://www.shikshamahakumbh.com`  
**Verdict:** ❌ **SEVERE DRIFT** — production serves stale Firebase-era deployment; Supabase exit exists only in uncommitted working tree

---

## 1. Deployment Metadata

**Command:** `npx vercel inspect rase-co-nzketx6v4-dhe-projects.vercel.app`

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` |
| Target | **production** |
| Status | Ready |
| Created | **2026-06-09 17:14:46 IST** (~3 days before audit) |
| Aliases | `www.shikshamahakumbh.com`, `www.rase.co.in`, `rase.co.in`, others |

**Sitemap lastmod on live:** `2026-06-09T11:46:24.850Z` — aligns with deployment date.

---

## 2. Repository vs Deployed Commit

**Latest git commit (HEAD):**
```
5eea41b 2026-06-10 01:06:06 +0530 Updated notice board
```

**Uncommitted working tree:**
```
151 files changed, 3123 insertions(+), 9886 deletions(-)
```

Includes Firebase exit work:
- `D firebase.ts`
- `D src/app/api/health/firebase-admin/route.ts`
- `M src/app/api/registration/[registrationId]/route.ts` (401 auth)
- `M src/middleware.ts` (HMAC admin session)
- `M package.json` (Firebase packages removed)

**Conclusion:** Production deploy (Jun 9) predates and **does not include** uncommitted Supabase/Firebase-exit changes. Even HEAD commit is still Firebase-era (`51672b0 fix(firestore)...`).

---

## 3. Registration Lookup Security

| Layer | Behavior | Evidence |
|-------|----------|----------|
| **Source (working tree)** | 401 without token/email | `src/app/api/registration/[registrationId]/route.ts` lines 48–53 |
| **Source (working tree)** | Email must match; no `contactNumber` in public summary | `registration.service.ts` + `toPublicRegistrationSummary()` |
| **Live production** | **200** without credentials | `curl` 2026-05-29 |
| **Live production** | **200** with wrong email | `curl ...?email=wrong@example.com` → 200 |
| **Live response body** | Includes `contactNumber` | Field **not** in current source public summary |

**Live response (excerpt):**
```json
{
  "registrationId": "SMK2026-000001",
  "fullName": "Release Verify",
  "email": "release-verify+20260609@rase.co.in",
  "contactNumber": "9999999999",
  "createdAt": "2026-06-09T12:31:07.278Z"
}
```

❌ **Critical drift:** PII exposed on live; security fix exists in source only.

---

## 4. Admin Authentication

| Check | Source | Live |
|-------|--------|------|
| Legacy cookie `admin_session=1` rejected | ✅ `middleware.ts` line 43 | ⚠️ `/admin` returns **200** (login page — expected) |
| Protected datadekh without session | Redirect to `/admin` | ✅ **307** redirect |
| Protected datadekh with legacy cookie | Rejected | ✅ **307** redirect (same as no cookie) |
| HMAC session required for datadekh | ✅ Source middleware | ✅ Live redirects (307) |

**Note:** Middleware matcher excludes `/admin` from session gate (lines 56–61) — admin login page is intentionally public. API admin routes not fully probed (404 on `/api/admin/registrations`).

---

## 5. Sitemap Output

| | Source (with `SITE_URL`) | Live |
|--|--------------------------|------|
| Base URL | `${SITE_URL}` from `src/app/sitemap.ts` | `https://www.rase.co.in` |
| lastmod | Would update on deploy | `2026-06-09` (stale) |

**Live sample:**
```xml
<loc>https://www.rase.co.in</loc>
<lastmod>2026-06-09T11:46:24.850Z</lastmod>
```

❌ Drift: wrong domain, stale timestamp.

---

## 6. Robots Output

| | Source fallback (`src/app/robots.ts`) | Live |
|--|---------------------------------------|------|
| Sitemap | `${SITE_URL}/sitemap.xml` | `https://www.rase.co.in/sitemap.xml` |
| Disallow `/api/` | ✅ In source fallback | ❌ **Not** in live robots |

**Live:**
```
Sitemap: https://www.rase.co.in/sitemap.xml
```

❌ Drift on domain; live robots differs from current source fallback rules.

---

## 7. Canonical Tags

**Live homepage (`curl` 2026-05-29):**
```
canonical: https://www.rase.co.in
og:url: https://www.rase.co.in
og:image: https://www.rase.co.in/sLogo.png
jsonld-url: https://www.rase.co.in
```

**Source:** `src/config/site.ts` — `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in"`

❌ Live matches old fallback/env, not required `https://www.shikshamahakumbh.com`.

---

## 8. JSON-LD URLs

Live Organization/Event schema uses `https://www.rase.co.in` throughout (verified in homepage HTML).

Source generates JSON-LD from `SITE_URL` constant — would fix on redeploy with correct env.

---

## 9. Additional Route Drift

| Route | Source (working tree) | Live |
|-------|----------------------|------|
| `/api/v2/health` | Exists | **404** (HTML not-found page) |
| `/api/v2/registration/upload` | Exists | **404** |
| `/api/registration/upload` | Supabase storage | **500** |
| `/api/payments/razorpay-webhook` | HMAC verify | **401** on empty POST ✅ (partial parity) |

---

## 10. Version Drift Summary

| Indicator | Finding |
|-----------|---------|
| Last production deploy | 2026-06-09 |
| Uncommitted Supabase exit | 151 files, not deployed |
| Live API security | Pre-fix (PII leak) |
| Live SEO domain | `rase.co.in` not `shikshamahakumbh.com` |
| Supabase backend on prod | **No** — live registration from Firebase/legacy |
| Supabase DB rows | 0 — confirms prod not on Supabase data |

---

## H3 Verdict

**Stale deployment confirmed.** Production is **not** running Firebase-exit source. A production deploy from current working tree (after commit) plus env remediation is required before GO.

---

*Evidence: `npx vercel inspect`, `git status`, `git diff --stat`, live `curl` probes. No deployment.*
