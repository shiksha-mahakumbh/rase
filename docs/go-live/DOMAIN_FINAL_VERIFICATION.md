# Domain Final Verification

**Date:** 2026-05-29  
**Auditor:** Principal Release Engineer  
**Required canonical:** `https://www.shikshamahakumbh.com`  
**Method:** Live HTTP probes (`Invoke-WebRequest`) + source inspection

---

## Executive Summary

| Layer | Status |
|-------|--------|
| Source code fallbacks | ✅ Aligned to `www.shikshamahakumbh.com` |
| Live production | ❌ **All surfaces emit `www.rase.co.in`** |

**Domain verification: FAIL on live production**

---

## Live Probes (2026-05-29)

### Homepage — `https://www.shikshamahakumbh.com/`

| Asset | Live value | Required |
|-------|------------|----------|
| HTTP status | 200 | 200 |
| `<link rel="canonical">` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| `og:url` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| JSON-LD Organization `url` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |

### Homepage — `https://www.rase.co.in/`

Same canonical, OG, and JSON-LD values as above — both hostnames serve identical stale SEO metadata.

### Sitemap — both hostnames

```
GET https://www.shikshamahakumbh.com/sitemap.xml → 200
GET https://www.rase.co.in/sitemap.xml           → 200
```

First entry (both):

```xml
<loc>https://www.rase.co.in</loc>
<lastmod>2026-06-09T11:46:24.850Z</lastmod>
```

All URLs in sitemap use **`www.rase.co.in`**.

### Robots — both hostnames

```
GET https://www.shikshamahakumbh.com/robots.txt → 200
GET https://www.rase.co.in/robots.txt           → 200
```

```
Sitemap: https://www.rase.co.in/sitemap.xml
```

---

## Source Code (current HEAD)

| File | Fallback / behavior |
|------|---------------------|
| `src/config/site.ts` | `SITE_URL` → `https://www.shikshamahakumbh.com` |
| `src/app/layout.tsx` | `metadataBase` same fallback |
| `src/lib/seo/metadata.ts` | `alternates.canonical` = `${SITE_URL}${path}` |
| `src/app/sitemap.ts` | Uses `SITE_URL` |
| `src/app/robots.ts` | `sitemap: ${SITE_URL}/sitemap.xml` |

Source is correct; live mismatch confirms **stale Vercel deploy** + **`NEXT_PUBLIC_SITE_URL` not set to `.com`**.

---

## Root Cause

1. Production deploy predates domain remediation (~2026-06-09 build timestamp in sitemap)
2. `NEXT_PUBLIC_SITE_URL` on Vercel still resolves to `rase.co.in` at build time

---

## Post-Cutover Verification Commands

```powershell
# Canonical
(Invoke-WebRequest "https://www.shikshamahakumbh.com/" -UseBasicParsing).Content -match 'canonical" href="([^"]+)"'

# Sitemap
(Invoke-WebRequest "https://www.shikshamahakumbh.com/sitemap.xml" -UseBasicParsing).Content.Substring(0,200)

# Robots
(Invoke-WebRequest "https://www.shikshamahakumbh.com/robots.txt" -UseBasicParsing).Content
```

**Pass criteria:** All URLs contain `www.shikshamahakumbh.com`.

---

## Signoff

| Gate | Result |
|------|--------|
| Live canonical | ❌ FAIL |
| Live sitemap | ❌ FAIL |
| Live robots | ❌ FAIL |
| Live OG / JSON-LD | ❌ FAIL |
| Source ready | ✅ PASS |

---

*Fresh live probes — 2026-05-29. No prior report trusted without re-verification.*
