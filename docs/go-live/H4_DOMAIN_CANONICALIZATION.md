# H4 — Domain Canonicalization Audit

**Audit date:** 2026-05-29  
**Required canonical:** `https://www.shikshamahakumbh.com`  
**Verdict:** ❌ **FAIL** — live traffic on correct host; all SEO signals point to `www.rase.co.in`

---

## 1. Canonical Domain Decision

**Single production canonical domain:**

# `https://www.shikshamahakumbh.com`

| Domain | HTTP probe | Role |
|--------|------------|------|
| `https://www.shikshamahakumbh.com` | **200 OK** | ✅ Primary live site |
| `https://shikshamahakumbh.com` | **308** → `www.shikshamahakumbh.com` | ✅ Apex redirect (correct) |
| `https://shikshamahakumbh.org` | No response | ❌ Not serving |
| `https://www.rase.co.in` | 200 (Vercel alias) | ⚠️ Legacy alias — should redirect or noindex |

---

## 2. Sitemap

**URL:** `https://www.shikshamahakumbh.com/sitemap.xml`

| Check | Expected | Live | Pass |
|-------|----------|------|------|
| Host serves sitemap | `shikshamahakumbh.com` | ✅ 200 | ✅ |
| `<loc>` URLs | `https://www.shikshamahakumbh.com/...` | `https://www.rase.co.in/...` | ❌ |
| Freshness | Post-deploy | `lastmod: 2026-06-09` | ❌ Stale |

**Source:** `src/app/sitemap.ts` uses `SITE_URL` — will emit correct URLs when `NEXT_PUBLIC_SITE_URL` is set and redeployed.

---

## 3. Robots.txt

**URL:** `https://www.shikshamahakumbh.com/robots.txt`

| Check | Expected | Live | Pass |
|-------|----------|------|------|
| Sitemap directive | `https://www.shikshamahakumbh.com/sitemap.xml` | `https://www.rase.co.in/sitemap.xml` | ❌ |
| Admin disallows | Present | `/admin/` etc. present | ✅ |

**Source:** `src/app/robots.ts` line 41 — `sitemap: \`${SITE_URL}/sitemap.xml\``

---

## 4. Metadata (Homepage)

**Live extracted values (2026-05-29):**

| Tag | Live value | Expected |
|-----|------------|----------|
| `<link rel="canonical">` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| `og:url` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| `og:image` | `https://www.rase.co.in/sLogo.png` | `https://www.shikshamahakumbh.com/sLogo.png` |
| `twitter:image` | `https://www.rase.co.in/sLogo.png` | `https://www.shikshamahakumbh.com/sLogo.png` |

---

## 5. Open Graph & Twitter Cards

Live homepage serves consistent OG/Twitter tags — all rooted at `www.rase.co.in`.

**Source default:** `src/config/site.ts`:
```typescript
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/sLogo.png`;
```

---

## 6. JSON-LD Structured Data

**Live homepage:**
```json
"url": "https://www.rase.co.in"
"logo": "https://www.rase.co.in/sLogo.png"
```

Breadcrumb ItemList entries use `https://www.rase.co.in/...` paths throughout.

**Source:** `ORGANIZATION_SCHEMA`, `EVENT_SCHEMA` in `src/config/site.ts` bind to `SITE_URL`.

---

## 7. Redirects

| From | To | Status |
|------|-----|--------|
| `shikshamahakumbh.com` | `www.shikshamahakumbh.com` | ✅ 308 |
| `www.rase.co.in` | Serves content (alias) | ⚠️ Duplicate content risk |
| `rase.co.in` | Vercel alias | ⚠️ Duplicate content risk |

**Vercel deployment aliases** (from `vercel inspect`):
- `www.shikshamahakumbh.com` ✅
- `www.rase.co.in` ⚠️
- `rase.co.in` ⚠️

---

## 8. Environment Misconfiguration

| Env source | `NEXT_PUBLIC_SITE_URL` | Issue |
|------------|------------------------|-------|
| Vercel Production | Encrypted — **UNKNOWN** | Live behavior → likely `rase.co.in` |
| Local `.env` | `https://shikshamahakumbh.org` | Wrong domain (unreachable) |
| Code fallback | `https://www.rase.co.in` | Wrong for brand canonical |

---

## 9. Remediation (Manual — Not Executed)

1. Set Vercel Production `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com`
2. Fix local `.env` to same value
3. Redeploy production
4. Verify live: canonical, sitemap, robots, JSON-LD all use `www.shikshamahakumbh.com`
5. Configure `rase.co.in` → 301 to canonical (Vercel redirect rules or DNS)
6. Update Google Search Console primary property

**Verification commands post-fix:**
```bash
curl.exe -s "https://www.shikshamahakumbh.com/robots.txt" | findstr Sitemap
curl.exe -s "https://www.shikshamahakumbh.com/sitemap.xml" | findstr loc
curl.exe -s "https://www.shikshamahakumbh.com/" | findstr canonical
```

---

## H4 Summary

| Asset | Canonicalized? |
|-------|----------------|
| HTTP host | ✅ |
| Sitemap locs | ❌ |
| Robots sitemap | ❌ |
| Canonical link | ❌ |
| Open Graph | ❌ |
| Twitter cards | ❌ |
| JSON-LD | ❌ |
| Apex redirect | ✅ |

**P0:** Fix `NEXT_PUBLIC_SITE_URL` + redeploy before go-live.

---

*Evidence: live curl probes, `src/config/site.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, Vercel alias list.*
