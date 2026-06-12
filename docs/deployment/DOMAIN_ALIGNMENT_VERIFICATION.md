# Domain Alignment Verification

**Date:** 2026-06-10  
**Method:** Repository grep + `.env` read + `npx vercel env ls` + live HTTP probes  
**Recommended canonical:** `https://www.shikshamahakumbh.com`  
**Policy:** No fixes applied

---

## Answers to required questions

| # | Question | Verified answer | Evidence |
|---|----------|-----------------|----------|
| 1 | Actual production domain | **`www.shikshamahakumbh.com`** | HTTP 200 on homepage; apex `shikshamahakumbh.com` → 308 |
| 2 | Canonical domain used in code | **`SITE_URL` from env**, fallback `https://www.rase.co.in` | `src/config/site.ts:1-2` |
| 3 | Canonical domain in live SEO output | **`https://www.rase.co.in`** | Live probe canonical tag |
| 4 | Razorpay webhook domain | **Not in repo**; stakeholder docs reference `shikshamahakumbh.com` apex | Code is host-agnostic |
| 5 | Sitemap domain (live) | **`https://www.rase.co.in`** | Live sitemap first `<loc>` |
| 6 | Robots.txt domain (live) | **`https://www.rase.co.in/sitemap.xml`** | Live `robots.txt` |

---

## Live HTTP evidence (2026-06-10)

```
GET https://shikshamahakumbh.com/     → 308 Permanent Redirect
GET https://shikshamahakumbh.org/     → DNS resolution failure
GET https://www.shikshamahakumbh.com/ → 200 OK

Homepage canonical:     https://www.rase.co.in
Sitemap first <loc>:    https://www.rase.co.in
robots.txt Sitemap:     https://www.rase.co.in/sitemap.xml
```

**Conclusion:** Traffic host (`.com`) ≠ SEO canonical (`rase.co.in`).

---

## Environment configuration

| Source | `NEXT_PUBLIC_SITE_URL` value |
|--------|------------------------------|
| `.env` L37 | `https://shikshamahakumbh.org` |
| `.env.local` L21 | `https://shikshamahakumbh.org` |
| `.env.example` L5 | `https://www.rase.co.in` |
| Vercel Production | Key listed (`vercel env ls`); live output = `rase.co.in` fallback |
| Vercel Preview | **Key missing** |
| Vercel Development | Key listed |

**Code fallback when env unset/empty:**

```1:2:rase/src/config/site.ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in";
```

---

## SEO output chain (all use `SITE_URL`)

| Mechanism | File | Line(s) | Recommended value |
|-----------|------|---------|-------------------|
| `SITE_URL` constant | `src/config/site.ts` | 1-2 | `https://www.shikshamahakumbh.com` |
| `metadataBase` | `src/app/layout.tsx` | 27-28 | Same |
| Canonical + OG | `src/lib/seo/metadata.ts` | 15, 24, 33 | `${SITE_URL}` |
| Sitemap `<loc>` | `src/app/sitemap.ts` | 2, 133 | `${SITE_URL}` |
| Robots sitemap | `src/app/robots.ts` | 41 | `${SITE_URL}/sitemap.xml` |
| Robots (CMS path) | `src/server/services/seo.service.ts` | 321 | `${SITE_URL}/sitemap.xml` |
| JSON-LD org | `src/config/site.ts` | 15 | `SITE_URL` |
| JSON-LD website | `src/components/seo/SiteJsonLd.tsx` | 8 | `SITE_URL` |
| Noticeboard JSON-LD | `src/app/noticeboard/page.tsx` | 52 | `${SITE_URL}/noticeboard` |

---

## Mismatches — exact files and fixes required

### P0 — Runtime SEO (fix via env + redeploy)

| File | Line | Current behavior | Fix required |
|------|------|------------------|--------------|
| Vercel `NEXT_PUBLIC_SITE_URL` | — | Empty/unset → `rase.co.in` on live | Set `https://www.shikshamahakumbh.com` on Prod/Preview/Dev |
| `.env` | 37 | `shikshamahakumbh.org` | Set `https://www.shikshamahakumbh.com` |
| `.env.local` | 21 | `shikshamahakumbh.org` | Set `https://www.shikshamahakumbh.com` |

### P1 — Code fallbacks (manual code change — not applied)

| File | Line | Current | Recommended |
|------|------|---------|-------------|
| `src/config/site.ts` | 2 | Fallback `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| `src/app/layout.tsx` | 28 | Fallback `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |

### P2 — Hardcoded `rase.co.in` in `src/`

| File | Line | Fix |
|------|------|-----|
| `src/components/admin/cms/SeoPreview.tsx` | 14, 33 | Use `SITE_URL` |
| `src/components/home/TrustStrip.tsx` | 10-11 | Use `SITE_URL` or keep as ecosystem link |
| `src/data/committee-editions.ts` | 18, 28, 38, 48, 58 | `SITE_URL` |
| `src/app/component/Registration/NGOForm.tsx` | 247 | `${SITE_URL}/accommodation` |
| `src/data/authority.ts` | 36 | Update copy |

### P2 — Hardcoded `.com` without `www`

| File | Line | Fix |
|------|------|-----|
| `src/app/component/donate.tsx` | 88, 111, 115 | `https://www.shikshamahakumbh.com` |
| `src/config/organization.ts` | 30 | Already `www` — OK |

### Informational — `.org` (email/UID, not URL canonical)

| File | Line | Notes |
|------|------|-------|
| `src/server/services/email.service.ts` | 80 | `noreply@shikshamahakumbh.org` fallback |
| `src/app/api/registration/send-email/route.ts` | 71 | Same |
| `src/components/registration/SuccessExperience.tsx` | 16 | UID suffix `@shikshamahakumbh.org` |

### Informational — ecosystem subdomains (keep)

`pub.rase.co.in`, `sk23.rase.co.in`, `sm24.rase.co.in`, `ac.rase.co.in`, `vi.rase.co.in` — historical/sub-brand links.

---

## Razorpay webhook domain

| Source | URL |
|--------|-----|
| Code route | `/api/payments/razorpay-webhook` (host-agnostic) |
| Live probe | `GET` → **405** (route exists on `www.shikshamahakumbh.com`) |
| Recommended | `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook` |

---

## Verdict

**DOMAIN ALIGNMENT: FAIL** — three domains active (`www.shikshamahakumbh.com` traffic, `rase.co.in` SEO, `shikshamahakumbh.org` local env).

**No automatic fixes applied.**
