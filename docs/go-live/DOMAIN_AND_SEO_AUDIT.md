# G4 — Domain & SEO Audit

**Audit date:** 2026-06-12  
**Expected canonical:** `https://www.shikshamahakumbh.com`  
**Method:** Source review + live HTTP read-only probes

---

## Canonical domain configuration

| Source | Value | Aligns with expected? |
|--------|-------|----------------------|
| `src/config/site.ts` fallback | `https://www.rase.co.in` | ❌ |
| `src/app/layout.tsx` `metadataBase` fallback | `https://www.rase.co.in` | ❌ |
| `.env.example` | `https://www.rase.co.in` | ❌ |
| Vercel `NEXT_PUBLIC_SITE_URL` | Encrypted (Production + Dev) — value **not read** | ⚠️ Unknown |
| Prior audit (`DOMAIN_MISMATCH_AUDIT.md`) | `.org` vs `.com` split | ❌ |

**Code default is wrong brand domain.** Production behavior depends entirely on `NEXT_PUBLIC_SITE_URL` env var.

---

## Live probes (read-only)

Target: `https://www.shikshamahakumbh.com`

| Resource | Finding |
|----------|---------|
| Homepage | HTTP 200 — site serves |
| `/robots.txt` | `Sitemap: https://www.rase.co.in/sitemap.xml` | ❌ **Wrong domain** |
| `/sitemap.xml` | All `<loc>` URLs use `https://www.rase.co.in/...` | ❌ **Wrong domain** |
| Sitemap lastmod | `2026-06-09` — stale deploy artifact | ⚠️ |

**Conclusion:** Live traffic domain is `www.shikshamahakumbh.com` but SEO artifacts point at `www.rase.co.in`. This is a **P0 SEO defect**.

---

## Sitemap (source)

- `src/app/sitemap.ts` builds URLs from `SITE_URL` (`NEXT_PUBLIC_SITE_URL`)
- Merges CMS entries via `generateSitemapIndex()`
- Static paths comprehensive (~100+ routes)

**When env is correct:** sitemap will be correct after redeploy.

---

## Robots (source)

- `src/app/robots.ts` — DB-driven via `getRobotsConfig()` with fallback
- Fallback disallows admin, `*datadekh`, `/api/`
- Sitemap pointer: `${SITE_URL}/sitemap.xml`

Live robots match **fallback** pattern (not CMS-driven) — suggests DB SEO config empty or error path.

---

## Canonical & metadata

| Mechanism | File | Status |
|-----------|------|--------|
| `metadataBase` | `layout.tsx` | Env-dependent |
| Per-page canonical | `lib/seo/metadata.ts`, `cms-metadata.ts` | Uses `SITE_URL` |
| hreflang | `lib/seo/hreflang.ts` | Uses `SITE_URL` |
| JSON-LD | `SiteJsonLd.tsx`, `HomeJsonLd.tsx`, `seo.service.ts` | Uses `SITE_URL` / hardcoded `.com` in places |

**Split-brain risk:** Some hardcoded `shikshamahakumbh.com` strings in press/legal pages while `SITE_URL` may differ.

---

## Open Graph

- Default OG image: `${SITE_URL}/sLogo.png` (`site.ts`)
- CMS entities can set `ogImageUrl`
- Wrong `SITE_URL` → wrong OG URLs on social shares

---

## Domain alignment actions (pre-go-live)

1. Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` on **Production, Preview, Development**
2. Add Vercel redirect: apex + `rase.co.in` → canonical www (301)
3. Update `.env.example` and `site.ts` fallback to canonical domain
4. Redeploy and re-fetch robots/sitemap
5. Submit sitemap in Google Search Console for `.com` property

---

## SEO score

| Dimension | Score /100 |
|-----------|------------|
| Sitemap structure (code) | 90 |
| Robots (code) | 85 |
| Live canonical alignment | **20** |
| JSON-LD completeness | 75 |
| Domain consistency | **25** |

**G4 verdict:** **FAIL** — live SEO points at wrong domain; canonical env not confirmed.
