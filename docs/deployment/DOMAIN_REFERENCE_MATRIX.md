# Domain Reference Matrix

**Date:** 2026-06-11  
**Method:** `rg` across repository + `.env` read + live HTTP probes  
**Recommended canonical:** `https://www.shikshamahakumbh.com`  
**Policy:** Remediation list only — no replacements applied

---

## Live production vs code (verified 2026-06-11)

| Output | Live domain | Local build domain (if env unchanged) |
|--------|-------------|--------------------------------------|
| HTTP traffic host | `www.shikshamahakumbh.com` | — |
| Sitemap first `<loc>` | `https://www.rase.co.in` | Would be `shikshamahakumbh.org` |
| Homepage canonical | `https://www.rase.co.in` | Would be `.org` |
| Razorpay webhook (documented) | `shikshamahakumbh.com` apex | — |

---

## Environment files

| File | Line | Domain found | Replace? | Recommended |
|------|------|--------------|:--------:|-------------|
| `.env` | 37 | `shikshamahakumbh.org` | **YES** | `https://www.shikshamahakumbh.com` |
| `.env.local` | 21 | `shikshamahakumbh.org` | **YES** | `https://www.shikshamahakumbh.com` |
| `.env.example` | 5 | `www.rase.co.in` | **YES** | `https://www.shikshamahakumbh.com` |
| Vercel Production | — | Key exists; live = `rase.co.in` fallback | **YES** | `https://www.shikshamahakumbh.com` |
| Vercel Preview | — | Missing | **YES** | Same |

---

## SEO runtime chain (uses `SITE_URL` — replace via env)

| File | Line(s) | Mechanism | Replace? |
|------|---------|-----------|:--------:|
| `src/config/site.ts` | 1-2 | `SITE_URL` + fallback | Fallback **YES** → `www.shikshamahakumbh.com` |
| `src/app/layout.tsx` | 27-28 | `metadataBase` | Fallback **YES** |
| `src/lib/seo/metadata.ts` | 15, 24, 33 | canonical, OG url | Via `SITE_URL` env |
| `src/app/sitemap.ts` | 2, 133 | sitemap `<loc>` | Via `SITE_URL` env |
| `src/app/robots.ts` | 41 | `Sitemap:` directive | Via `SITE_URL` env |
| `src/server/services/seo.service.ts` | 321 | CMS robots sitemap | Via `SITE_URL` env |
| `src/components/seo/SiteJsonLd.tsx` | 8 | WebSite JSON-LD | Via `SITE_URL` env |
| `src/config/site.ts` | 15 | Organization JSON-LD `url` | Via `SITE_URL` env |
| `src/app/noticeboard/page.tsx` | 52 | CollectionPage JSON-LD | Via `SITE_URL` env |

---

## `src/` hardcoded references

### `rase.co.in` — replace with `SITE_URL` or canonical

| File | Line | Domain / usage | Replace? |
|------|------|----------------|:--------:|
| `src/config/site.ts` | 2 | Fallback URL | **YES** |
| `src/app/layout.tsx` | 28 | Fallback `metadataBase` | **YES** |
| `src/components/admin/cms/SeoPreview.tsx` | 14 | Preview placeholder | **YES** |
| `src/components/admin/cms/SeoPreview.tsx` | 33 | Label text | Optional |
| `src/components/home/TrustStrip.tsx` | 10-11 | Logo hrefs | **YES** or ecosystem |
| `src/app/component/footer-content.ts` | 14 | Logo href | Optional |
| `src/data/committee-editions.ts` | 18, 28, 38, 48, 58 | Committee links | **YES** |
| `src/app/component/Registration/NGOForm.tsx` | 247 | Accommodation link | **YES** |
| `src/data/authority.ts` | 36 | Copy text | **YES** |

### `rase.co.in` subdomains — keep (ecosystem)

| File | Line | Domain | Replace? |
|------|------|--------|:--------:|
| `src/app/component/Registration/PaperSubmission.tsx` | 111 | `pub.rase.co.in` | NO |
| `src/app/component/ShikshaKumbhTree.tsx` | 37, 49 | `sk23/sk24.rase.co.in` | NO |
| `src/app/component/ShikshaMahaKumbhTree.tsx` | 37, 49 | `sm23/sm24.rase.co.in` | NO |
| `src/app/component/MarqueeUpcomingEvent.tsx` | 14-15 | `sk24.rase.co.in` | NO |
| `src/app/component/Registration/ConclaveForm.tsx` | 248 | `ac.rase.co.in` | NO |
| `src/app/component/Registration/Best_Practices.tsx` | 217 | `ac.rase.co.in` | NO |
| `src/app/component/Registration/VolunteerForm.tsx` | 210 | `ac.rase.co.in` | NO |
| `src/app/component/footer-content.ts` | 23 | `vi.rase.co.in` | NO |
| `src/app/component/Journals.tsx` | 28 | `pub.rase.co.in` | NO |

### `shikshamahakumbh.com` — align to `www` where URL

| File | Line | Usage | Replace? |
|------|------|-------|:--------:|
| `src/config/organization.ts` | 30 | `https://www.shikshamahakumbh.com` | NO (correct) |
| `src/app/component/donate.tsx` | 88, 111, 115 | apex `.com` | **YES** → `www` |
| Academic Vibhag pages (9 files) | various | display `www.shikshamahakumbh.com` | NO |
| Press LegacyArticles (6 files) | ~100-107 | contact footer | NO |
| Legal/error pages | various | email `@.com` | NO (email) |

### `shikshamahakumbh.org` — not URL canonical

| File | Line | Usage | Replace? |
|------|------|-------|:--------:|
| `src/server/services/email.service.ts` | 80 | SMTP fallback | NO (email TLD) |
| `src/app/api/registration/send-email/route.ts` | 71 | SMTP fallback | NO |
| `src/components/registration/SuccessExperience.tsx` | 16 | UID suffix | NO (identifier) |

### Mixed reference

| File | Line | Usage | Replace? |
|------|------|-------|:--------:|
| `src/app/component/ShikshaMahaKumbh2024DigitalMedia.tsx` | 78 | `.com` + `rase.co.in` | **YES** → canonical only |
| `src/config/organization.ts` | 32 | `www.rase.co.in` uses `SITE_URL` | Correct pattern |

---

## Razorpay webhook

| Source | URL | Replace? |
|--------|-----|:--------:|
| Code | `/api/payments/razorpay-webhook` (host-agnostic) | N/A |
| Recommended dashboard URL | `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook` | **YES** if apex today |

---

## Remediation priority

| Priority | Action |
|----------|--------|
| **P0** | Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` on Vercel Prod/Preview/Dev + redeploy |
| **P1** | Change `site.ts` + `layout.tsx` fallbacks from `rase.co.in` |
| **P2** | Replace hardcoded `rase.co.in` in TrustStrip, committee-editions, NGOForm |
| **P3** | Add Vercel redirect `rase.co.in` → `www.shikshamahakumbh.com` |

**No automatic replacements performed.**
