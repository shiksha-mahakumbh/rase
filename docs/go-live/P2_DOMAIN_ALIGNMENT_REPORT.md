# P2 — Domain Alignment Report

**Audit date:** 2026-05-29  
**Prior reports:** H4, `docs/deployment/DOMAIN_ALIGNMENT_REMEDIATION.md`  
**Target canonical:** `https://www.shikshamahakumbh.com`

---

## 1. Recommended Single Canonical Domain

# `https://www.shikshamahakumbh.com`

| Domain | Role | Evidence |
|--------|------|----------|
| `www.shikshamahakumbh.com` | **Canonical** | Live 200; Vercel alias; footer/contact copy |
| `shikshamahakumbh.com` | Apex → www | 308 redirect verified |
| `www.rase.co.in` | Legacy alias | Live SEO + Vercel alias — duplicate content risk |
| `shikshamahakumbh.org` | Non-canonical | Unreachable in probe; used in email defaults |

---

## 2. Source Code Occurrences

**grep counts in `src/` (2026-05-29):**

| Pattern | File matches | Notes |
|---------|--------------|-------|
| `rase.co.in` (incl subdomains) | **~27 files** | SEO fallbacks, links, legacy editions |
| `shikshamahakumbh.com` | **~24 files** | Contact emails, press articles, org config |
| `shikshamahakumbh.org` | **3 files** | SMTP defaults only |

### Critical SEO sources

| File | Current value | Issue |
|------|---------------|-------|
| `src/config/site.ts` | Fallback `https://www.rase.co.in` | ❌ Wrong default |
| `src/app/layout.tsx` | Same fallback line 28 | ❌ Metadata root |
| `src/app/sitemap.ts` | Uses `SITE_URL` | ⚠️ OK if env set |
| `src/app/robots.ts` | Uses `SITE_URL` | ⚠️ OK if env set |
| `.env.example` | `NEXT_PUBLIC_SITE_URL=https://www.rase.co.in` | ❌ Wrong example |
| Local `.env` (prior audit) | `https://shikshamahakumbh.org` | ❌ Wrong domain |

### Non-SEO references (acceptable as external links)

- `ac.rase.co.in`, `pub.rase.co.in`, `sk23.rase.co.in` — registration/accommodation subdomains
- `vi.rase.co.in` — partner link in footer

---

## 3. Live Production SEO Assets

| Asset | Live value | Target |
|-------|------------|--------|
| `robots.txt` Sitemap | `https://www.rase.co.in/sitemap.xml` | `https://www.shikshamahakumbh.com/sitemap.xml` |
| `sitemap.xml` locs | `https://www.rase.co.in/...` | `https://www.shikshamahakumbh.com/...` |
| `<link rel="canonical">` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| `og:url` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| `og:image` | `https://www.rase.co.in/sLogo.png` | `https://www.shikshamahakumbh.com/sLogo.png` |
| JSON-LD `url` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |

---

## 4. JSON-LD & Open Graph

Generated from `SITE_URL` in `src/config/site.ts`:
- `ORGANIZATION_SCHEMA.url`
- `DEFAULT_OG_IMAGE`
- `EVENT_SCHEMA` location references

Live output confirms deploy uses **`rase.co.in`**, not env target.

---

## 5. SEO Services

`src/server/services/seo.service.ts` — used by `robots.ts` and sitemap when DB config exists; falls back to `SITE_URL` constant on error.

---

## 6. Remediation Checklist

### Environment (manual)

- [ ] Set Vercel Production `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com`
- [ ] Set Vercel Preview + Development to same value
- [ ] Update local `.env` and `.env.example`

### Deploy

- [ ] Redeploy production after env change
- [ ] Verify live canonical, sitemap, robots, OG, JSON-LD

### DNS / Vercel aliases

- [ ] Keep `www.shikshamahakumbh.com` as primary alias
- [ ] Add 301 redirect `www.rase.co.in` → canonical (Vercel redirect rules)
- [ ] Add 301 redirect `rase.co.in` → canonical

### Source (post-GO hygiene — not blockers if env correct)

- [ ] Update `src/config/site.ts` fallback to `https://www.shikshamahakumbh.com`
- [ ] Update `SeoPreview.tsx` placeholder domain
- [ ] Update `TrustStrip.tsx` RASE hrefs if brand requires
- [ ] Change SMTP default from `@shikshamahakumbh.org` to `@shikshamahakumbh.com` (optional P1)

### Verification commands

```bash
curl.exe -s "https://www.shikshamahakumbh.com/robots.txt" | findstr Sitemap
curl.exe -s "https://www.shikshamahakumbh.com/sitemap.xml" | findstr shikshamahakumbh.com
curl.exe -s "https://www.shikshamahakumbh.com/" | findstr canonical
```

---

## P2 Summary

| Layer | Aligned to canonical? |
|-------|----------------------|
| HTTP host | ✅ |
| Live SEO metadata | ❌ |
| Source SEO fallbacks | ❌ (default `rase.co.in`) |
| Email defaults | ⚠️ `.org` suffix |

**P0:** Fix `NEXT_PUBLIC_SITE_URL` + redeploy before GO.

---

*Evidence: grep, live curl, `src/config/site.ts`, H4 report. No changes made.*
