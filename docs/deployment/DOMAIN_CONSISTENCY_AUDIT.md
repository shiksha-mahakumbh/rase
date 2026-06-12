# Domain Consistency Audit

**Date:** 2026-06-10  
**Method:** Repository grep + live HTTP probes on `www.shikshamahakumbh.com`  
**Recommended canonical:** `https://www.shikshamahakumbh.com`  
**Policy:** Audit only — no code or env changes applied

---

## Executive summary

| Domain | Role today | Should be |
|--------|------------|-----------|
| `www.shikshamahakumbh.com` | **Serves HTTP traffic** | **Canonical** |
| `shikshamahakumbh.com` | 308 → `www` | Apex redirect only |
| `shikshamahakumbh.org` | Local env only; **DNS fails** | Email TLD only (not canonical) |
| `www.rase.co.in` | **Live SEO/sitemap/robots** (fallback) | Secondary / redirect target |

**Verdict:** **INCONSISTENT — P0 blocker**

---

## Live production state (2026-06-10)

| Asset | URL emitted | Recommended |
|-------|-------------|-------------|
| Sitemap first `<loc>` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| `robots.txt` Sitemap | `https://www.rase.co.in/sitemap.xml` | `https://www.shikshamahakumbh.com/sitemap.xml` |
| Homepage canonical | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| JSON-LD Organization `url` | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |

**Cause:** `NEXT_PUBLIC_SITE_URL` empty or unset on Vercel Production → `src/config/site.ts` fallback to `rase.co.in`. Last sitemap `lastmod`: **2026-06-09** (stale deploy).

---

## Runtime SEO chain (all driven by `SITE_URL`)

| File | Role | Recommended value source |
|------|------|--------------------------|
| `src/config/site.ts` | `SITE_URL`, `DEFAULT_OG_IMAGE`, `ORGANIZATION_SCHEMA.url` | `NEXT_PUBLIC_SITE_URL` |
| `src/app/layout.tsx` | `metadataBase` | `NEXT_PUBLIC_SITE_URL` |
| `src/app/sitemap.ts` | All `<loc>` entries | `SITE_URL` |
| `src/app/robots.ts` | `Sitemap:` directive | `SITE_URL` |
| `src/lib/seo/metadata.ts` | `canonical`, `openGraph.url`, `og:image` | `SITE_URL` |
| `src/server/services/seo.service.ts` | CMS sitemap, schema builders | `SITE_URL` |
| `src/components/seo/SiteJsonLd.tsx` | WebSite JSON-LD | `SITE_URL` |

**With local `.env` (`NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.org`), a new build would emit `.org` URLs — still wrong.**

---

## Environment configuration

| File | Current value | Recommended |
|------|---------------|-------------|
| `.env` | `NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.org` | `https://www.shikshamahakumbh.com` |
| `.env.local` | `NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.org` | `https://www.shikshamahakumbh.com` |
| `.env.example` | `NEXT_PUBLIC_SITE_URL=https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| Vercel Production | Key exists; live site shows `rase.co.in` fallback | `https://www.shikshamahakumbh.com` |
| Vercel Development | Key exists | `https://www.shikshamahakumbh.com` |
| Vercel Preview | **Missing** | `https://www.shikshamahakumbh.com` |

---

## `shikshamahakumbh.com` — `src/` occurrences (24 files)

| File | Line / usage | Recommended |
|------|--------------|-------------|
| `src/config/organization.ts` | Emails + `www.shikshamahakumbh.com` href | Keep (correct brand) |
| `src/app/refund-policy/page.tsx` | `academics@shikshamahakumbh.com` | Keep (email) |
| `src/app/cookie-policy/page.tsx` | `academics@shikshamahakumbh.com` | Keep |
| `src/app/privacy-policy/page.tsx` | `academics@shikshamahakumbh.com` | Keep |
| `src/app/error.tsx` | Contact email | Keep |
| `src/components/errors/ErrorBoundary.tsx` | Contact email | Keep |
| `src/components/registration/SuccessExperience.tsx` | Contact email `.com` | Keep |
| `src/app/component/donate.tsx` | `https://shikshamahakumbh.com` links | → `https://www.shikshamahakumbh.com` |
| `src/app/component/Vibhag/academic/AcademicCouncilUI.tsx` | Website display | → `www.shikshamahakumbh.com` |
| `src/app/component/Vibhag/academic/pages/CulturalPage.tsx` | Website display | → `www.` prefix |
| `src/app/component/Vibhag/academic/pages/PatrikaPage.tsx` | Website display | → `www.` prefix |
| `src/app/component/Vibhag/academic/pages/ProjectsPage.tsx` | Website display | → `www.` prefix |
| `src/app/component/Vibhag/academic/pages/ExhibitionPage.tsx` | Website display | → `www.` prefix |
| `src/app/component/Vibhag/academic/pages/BestPracticesPage.tsx` | Website display | → `www.` prefix |
| `src/app/component/Vibhag/academic/pages/AwardsPage.tsx` | Website display | → `www.` prefix |
| `src/app/component/Vibhag/academic/pages/OlympiadPage.tsx` | Website display | → `www.` prefix |
| `src/app/component/Vibhag/academic/pages/ConferencePage.tsx` | Website display | → `www.` prefix |
| `src/app/press/education-summit-coverage/LegacyArticle.tsx` | Footer contact | Keep |
| `src/app/press/summit-highlights/LegacyArticle.tsx` | Footer contact | Keep |
| `src/app/press/residential-camp-hindi/LegacyArticle.tsx` | Footer contact | Keep |
| `src/app/press/national-coverage/LegacyArticle.tsx` | Footer contact | Keep |
| `src/app/press/mahakumbh-programme-update/LegacyArticle.tsx` | Footer contact | Keep |
| `src/app/press/education-movement/LegacyArticle.tsx` | Footer contact | Keep |
| `src/app/component/ShikshaMahaKumbh2024DigitalMedia.tsx` | Mixed `.com` + `rase.co.in` | → canonical `.com` only |

---

## `shikshamahakumbh.org` — occurrences

| File | Usage | Recommended |
|------|-------|-------------|
| `.env` | `NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.org` | → `https://www.shikshamahakumbh.com` |
| `.env.local` | Same | → `https://www.shikshamahakumbh.com` |
| `.env.example` | `SMTP_FROM=noreply@shikshamahakumbh.org` | Keep as email domain |
| `.env.supabase.example` | `BREVO_SMTP_FROM=noreply@...org` | Keep as email domain |
| `src/server/services/email.service.ts` | SMTP fallback `noreply@` | Keep (email, not URL) |
| `src/app/api/registration/send-email/route.ts` | SMTP fallback | Keep |
| `src/components/registration/SuccessExperience.tsx` | UID suffix `@shikshamahakumbh.org` | Keep (identifier, not URL) |

---

## `rase.co.in` — `src/` occurrences (should use `SITE_URL` or stay as ecosystem links)

| File | Usage | Recommended |
|------|-------|-------------|
| `src/config/site.ts` | Fallback when env unset | → Change fallback to `https://www.shikshamahakumbh.com` |
| `src/app/layout.tsx` | `metadataBase` fallback | → Same as `SITE_URL` |
| `src/components/admin/cms/SeoPreview.tsx` | Preview placeholder URL | → `SITE_URL/example` |
| `src/components/home/TrustStrip.tsx` | Logo links hardcoded | → `SITE_URL` or keep as ecosystem |
| `src/app/component/footer-content.ts` | Logo hrefs | Ecosystem — optional redirect |
| `src/data/authority.ts` | Text reference | Update copy |
| `src/data/committee-editions.ts` | 5× `link: "https://rase.co.in"` | → `SITE_URL` |
| `src/config/organization.ts` | `www.rase.co.in` partner link uses `SITE_URL` | Correct pattern |
| `src/app/component/Registration/NGOForm.tsx` | Accommodation link | → `SITE_URL/accommodation` |
| `src/app/component/Registration/PaperSubmission.tsx` | `pub.rase.co.in` | Keep (separate publication subdomain) |
| `src/app/component/ShikshaKumbhTree.tsx` | `sk23/sk24.rase.co.in` | Keep (historical editions) |
| `src/app/component/ShikshaMahaKumbhTree.tsx` | `sm23/sm24.rase.co.in` | Keep |
| `src/app/component/MarqueeUpcomingEvent.tsx` | `sk24.rase.co.in` | Keep |
| `src/app/component/Registration/ConclaveForm.tsx` | `ac.rase.co.in` | Keep (subdomain) |
| `src/app/component/Registration/Best_Practices.tsx` | `ac.rase.co.in` | Keep |
| `src/app/component/Registration/VolunteerForm.tsx` | `ac.rase.co.in` | Keep |
| `src/app/component/Journals.tsx` | `pub.rase.co.in` redirect | Keep |

---

## SEO-specific URL generation map

| Mechanism | File | Domain when env correct | Domain live today |
|-----------|------|-------------------------|-------------------|
| Canonical | `src/lib/seo/metadata.ts` | `SITE_URL` | `rase.co.in` |
| Open Graph | `src/lib/seo/metadata.ts` | `SITE_URL` | `rase.co.in` |
| Sitemap | `src/app/sitemap.ts` | `SITE_URL` | `rase.co.in` |
| Robots | `src/app/robots.ts` | `SITE_URL` | `rase.co.in` |
| JSON-LD org | `src/config/site.ts` | `SITE_URL` | `rase.co.in` |
| JSON-LD website | `src/components/seo/SiteJsonLd.tsx` | `SITE_URL` | `rase.co.in` |
| Noticeboard JSON-LD | `src/app/noticeboard/page.tsx` | `SITE_URL` (uses import) | `rase.co.in` on prod |

---

## Razorpay webhook domain reference

| Source | URL | Recommended |
|--------|-----|-------------|
| Stakeholder config (documented) | `https://shikshamahakumbh.com/api/payments/razorpay-webhook` | `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook` |
| Code route | Host-agnostic `/api/payments/razorpay-webhook` | N/A |

---

## Required remediation (manual)

1. Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` on Vercel Production, Preview, Development
2. Update local `.env` / `.env.local` to match
3. Redeploy: `npx vercel --prod`
4. Verify live sitemap, robots, canonical all use `shikshamahakumbh.com`
5. Update Razorpay webhook to `www` subdomain
6. Optional: add Vercel redirect `rase.co.in` → `shikshamahakumbh.com`

**No automatic changes were applied.**
