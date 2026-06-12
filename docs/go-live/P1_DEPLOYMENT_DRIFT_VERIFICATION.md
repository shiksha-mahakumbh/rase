# P1 — Deployment Drift Verification

**Audit date:** 2026-05-29  
**Prior reports:** H3, `docs/deployment/STALE_DEPLOYMENT_INVESTIGATION.md`  
**Verdict:** ❌ **CONFIRMED — production runs stale code, not repository working tree**

---

## 1. Is Production Running Stale Code?

**Yes.** Evidence chain:

| Evidence | Value |
|----------|-------|
| Vercel production deploy | `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` |
| Deploy created | **2026-06-09 17:14:46 IST** |
| Git HEAD | `5eea41b` — 2026-06-10 01:06:06 IST — "Updated notice board" |
| Uncommitted working tree | **151 files changed** (+3123 / −9886 lines) |
| Live sitemap `lastmod` | `2026-06-09T11:46:24.850Z` — matches deploy date |

Firebase-exit / Supabase cutover exists in **local working tree only**, not in deployed commit.

---

## 2. Repository Routes vs Live Routes

**Repository API routes:** 105 files under `src/app/api/**/route.ts` (glob count 2026-05-29).

| Route | Repository | Live HTTP | Drift |
|-------|------------|-----------|-------|
| `GET /api/registration/[id]` | 401 without token/email | **200 + PII** | ❌ |
| `POST /api/payments/razorpay-webhook` | HMAC verify | **401** unsigned | ✅ Partial |
| `GET /api/v2/health` | Exists (`src/app/api/v2/health/route.ts`) | **404** | ❌ |
| `POST /api/v2/registration/upload` | Exists | **404** | ❌ |
| `POST /api/registration/upload` | Supabase storage path | **500** | ❌ |
| `GET /api/admin/registrations` | v2 admin routes exist | **404** | ⚠️ Path mismatch |

---

## 3. Registration Lookup Behavior

### Repository (working tree)

`src/app/api/registration/[registrationId]/route.ts` lines 48–53:
```typescript
if (!email) {
  return NextResponse.json(
    { error: "Email or confirmation token required" },
    { status: 401 }
  );
}
```

`getPublicRegistrationSummary()` does **not** include `contactNumber` in select.

### Live production (2026-05-29)

```bash
curl https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
# HTTP 200

curl https://www.shikshamahakumbh.com/api/registration/SMK2026-000001?email=x@y.com
# HTTP 200
```

**Response body:**
```json
{
  "registrationId": "SMK2026-000001",
  "fullName": "Release Verify",
  "email": "release-verify+20260609@rase.co.in",
  "contactNumber": "9999999999",
  "createdAt": "2026-06-09T12:31:07.278Z"
}
```

**Proof of drift:** `contactNumber` in live response is absent from current source public summary; auth gate returns 401 in source, 200 on live.

---

## 4. Sitemap

| | Repository | Live |
|--|------------|------|
| Generator | `src/app/sitemap.ts` → `SITE_URL` | Served from deploy |
| Sample `<loc>` | Would use `NEXT_PUBLIC_SITE_URL` | `https://www.rase.co.in` |
| `lastmod` | Updates on build | `2026-06-09` (stale) |

---

## 5. Robots

| | Repository fallback | Live |
|--|---------------------|------|
| Sitemap line | `${SITE_URL}/sitemap.xml` | `Sitemap: https://www.rase.co.in/sitemap.xml` |
| Disallow `/api/` | ✅ In source fallback | ❌ Not in live |

---

## 6. Canonical Tags

**Live homepage extract:**
```
canonical: https://www.rase.co.in
og:url: https://www.rase.co.in
```

**Repository:** `src/config/site.ts` — `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in"`

Live matches **old env/fallback**, not target `www.shikshamahakumbh.com`.

---

## 7. Health Routes

| Route | Live |
|-------|------|
| `/api/v2/health` | **404** (HTML not-found page) |
| `/api/health/firebase-admin` | Deleted in working tree; live status **UNKNOWN** |

Repository includes Supabase-aware health at `/api/v2/health` — **not deployed**.

---

## 8. API Response Shape Drift Summary

| Signal | Deployed behavior | Repository behavior |
|--------|-------------------|---------------------|
| Registration backend | Firebase/legacy (inferred from open lookup + contactNumber) | Prisma/Supabase |
| Security model | Open lookup | Token/email required |
| v2 API surface | Missing | 60+ v2 routes |
| SEO domain | `rase.co.in` | Configurable via `SITE_URL` |

---

## P1 Conclusion

Production **definitively differs** from repository working tree. Root cause: **no redeploy since 2026-06-09** + **151 uncommitted Supabase-exit files not in git pipeline**.

**Required before GO:** Commit authorized changes → env fix → deploy → re-run P1 probes.

---

*Evidence: `npx vercel inspect`, `git diff --stat HEAD`, live curl 2026-05-29. No deploy.*
