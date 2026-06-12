# Domain Signoff

**Date:** 2026-05-29  
**Required canonical:** `https://www.shikshamahakumbh.com`

---

## Source Code — ✅ APPROVED

| Surface | Implementation | Canonical |
|---------|----------------|-----------|
| Site URL fallback | `src/config/site.ts` | `https://www.shikshamahakumbh.com` |
| `metadataBase` | `src/app/layout.tsx` | Same fallback |
| Canonical tags | `src/lib/seo/metadata.ts` → `alternates.canonical` | `${SITE_URL}${path}` |
| OpenGraph URLs | `createPageMetadata()` → `openGraph.url` | Same as canonical |
| JSON-LD | `ORGANIZATION_SCHEMA`, `EVENT_SCHEMA` in `site.ts` | `url: SITE_URL` |
| Sitemap | `src/app/sitemap.ts` | All URLs via `SITE_URL` |
| Robots fallback | `src/app/robots.ts` | `sitemap: ${SITE_URL}/sitemap.xml` |

Post-deploy with correct `NEXT_PUBLIC_SITE_URL`, all surfaces align to `.com`.

---

## Live Production — ❌ NOT APPROVED

### Sitemap (`https://www.rase.co.in/sitemap.xml`)

```xml
<loc>https://www.rase.co.in</loc>
<lastmod>2026-06-09T11:46:24.850Z</lastmod>
```

### Robots (`https://www.shikshamahakumbh.com/robots.txt`)

```
Sitemap: https://www.rase.co.in/sitemap.xml
```

Live assets reflect stale deploy + incorrect `NEXT_PUBLIC_SITE_URL`.

---

## Post-Launch Verification Checklist

```bash
# Sitemap
curl -s https://www.shikshamahakumbh.com/sitemap.xml | head -20
# Expect: <loc>https://www.shikshamahakumbh.com/...

# Robots
curl -s https://www.shikshamahakumbh.com/robots.txt
# Expect: Sitemap: https://www.shikshamahakumbh.com/sitemap.xml

# Homepage canonical (view source)
curl -s https://www.shikshamahakumbh.com/ | grep -i canonical
```

---

## Signoff

| Layer | Status |
|-------|--------|
| Source | ✅ **APPROVED** |
| Live production | ❌ **NOT APPROVED** |

**Domain signoff: CONDITIONAL** — approved in source; live verification blocked until redeploy + env fix.

---

*Evidence: source review + live HTTP probes — 2026-05-29.*
