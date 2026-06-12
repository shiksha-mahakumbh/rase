# Domain & Canonical Audit

**Date:** 2026-05-29  
**Required canonical:** `https://www.shikshamahakumbh.com`

---

## Source Code (post-remediation) — ✅ ALIGNED

| Asset | Location | Value |
|-------|----------|-------|
| Site URL fallback | `src/config/site.ts` | `https://www.shikshamahakumbh.com` |
| `metadataBase` | `src/app/layout.tsx` | Same fallback |
| Canonical URLs | `src/lib/seo/metadata.ts` | `${SITE_URL}${path}` |
| OG URLs | `createPageMetadata()` | `openGraph.url` = canonical |
| JSON-LD | `src/config/site.ts` | `ORGANIZATION_SCHEMA.url`, `EVENT_SCHEMA` |
| Sitemap | `src/app/sitemap.ts` | Uses `SITE_URL` from config |
| Robots fallback | `src/app/robots.ts` | `sitemap: ${SITE_URL}/sitemap.xml` |

All SEO surfaces derive from `NEXT_PUBLIC_SITE_URL` with correct fallback.

---

## Live Production — ❌ STALE (pre-remediation deploy)

Probes against live endpoints (2026-05-29):

### Sitemap (`https://www.rase.co.in/sitemap.xml`)

```xml
<loc>https://www.rase.co.in</loc>
<lastmod>2026-06-09T11:46:24.850Z</lastmod>
```

All URLs use **`www.rase.co.in`**, not `www.shikshamahakumbh.com`.

### Robots (`https://www.shikshamahakumbh.com/robots.txt`)

```
Sitemap: https://www.rase.co.in/sitemap.xml
```

Sitemap directive points to **wrong domain**.

### Root cause

Live production deploy predates Phase 5 domain alignment and uses `NEXT_PUBLIC_SITE_URL` (or build-time fallback) set to `rase.co.in`.

---

## Post-Deploy Expected State

After Vercel env update + redeploy:

| Check | Expected |
|-------|----------|
| `curl https://www.shikshamahakumbh.com/sitemap.xml` | `<loc>https://www.shikshamahakumbh.com/...` |
| `curl https://www.shikshamahakumbh.com/robots.txt` | `Sitemap: https://www.shikshamahakumbh.com/sitemap.xml` |
| Homepage `<link rel="canonical">` | `https://www.shikshamahakumbh.com/` |
| OG `og:url` | Same canonical |

---

## Required Operator Actions

1. Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` on Vercel Production
2. Redeploy production (env changes require rebuild)
3. Verify DNS: `www.shikshamahakumbh.com` → Vercel project
4. Optional: 301 redirect `www.rase.co.in` → canonical (DNS/hosting config, out of scope)

---

## Verdict

| Layer | Status |
|-------|--------|
| Source code | ✅ Ready |
| Live production | ❌ **BLOCKER** — wrong canonical domain |

---

*Live probes: PowerShell `Invoke-WebRequest` — 2026-05-29.*
