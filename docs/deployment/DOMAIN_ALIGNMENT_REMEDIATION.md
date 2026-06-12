# Domain Alignment Remediation

**Date:** 2026-06-11  
**Method:** Repository grep + live HTTP probes on `www.shikshamahakumbh.com`  
**Recommended canonical:** `https://www.shikshamahakumbh.com`  
**Constraint:** Audit only — **no automatic replacements performed**

---

## Live production verification (2026-06-11)

| Surface | Expected (`.com`) | Live actual | Status |
|---------|-------------------|-------------|:------:|
| Sitemap first `<loc>` | `https://www.shikshamahakumbh.com` | `https://www.rase.co.in` | ❌ |
| `robots.txt` Sitemap line | `...shikshamahakumbh.com/sitemap.xml` | `https://www.rase.co.in/sitemap.xml` | ❌ |
| Homepage `<link rel="canonical">` | `https://www.shikshamahakumbh.com` | `https://www.rase.co.in` | ❌ |
| `og:url` | `https://www.shikshamahakumbh.com` | `https://www.rase.co.in` | ❌ |
| `og:image` | `https://www.shikshamahakumbh.com/sLogo.png` | `https://www.rase.co.in/sLogo.png` | ❌ |
| JSON-LD Organization `url` | `https://www.shikshamahakumbh.com` | `https://www.rase.co.in` | ❌ |
| JSON-LD WebSite `url` | `https://www.shikshamahakumbh.com` | `https://www.rase.co.in` | ❌ |
| HTTP traffic host | `www.shikshamahakumbh.com` | `www.shikshamahakumbh.com` | ✅ |

**Root cause:** `NEXT_PUBLIC_SITE_URL` not baked into live build → code fallbacks emit `rase.co.in`.

---

## SEO pipeline — source files (all use `SITE_URL`)

These files are **correct by design** once `NEXT_PUBLIC_SITE_URL` is set and redeployed:

| File | Lines | Mechanism |
|------|-------|-----------|
| `src/config/site.ts` | 1-2, 9, 15 | `SITE_URL` constant; `DEFAULT_OG_IMAGE`, `ORGANIZATION_SCHEMA.url` |
| `src/app/layout.tsx` | 14-29 | `createPageMetadata()` + `metadataBase` |
| `src/lib/seo/metadata.ts` | 2, 15, 24, 33 | `canonical`, `openGraph.url`, `openGraph.images` |
| `src/app/sitemap.ts` | 2, 133 | `${SITE_URL}/...` for all `<loc>` |
| `src/app/robots.ts` | 2, 41 | `sitemap: ${SITE_URL}/sitemap.xml` |
| `src/server/services/seo.service.ts` | 3, 36-39 | `buildOrganizationSchema()` url + sameAs |
| `src/components/seo/SiteJsonLd.tsx` | 1, 8 | WebSite schema `url: SITE_URL` |
| `src/app/noticeboard/page.tsx` | 8, 52 | JSON-LD CollectionPage `url: ${SITE_URL}/noticeboard` |
| `src/config/organization.ts` | 30, 32 | `.com` link correct; `www.rase.co.in` uses `SITE_URL` |

### SEO fallbacks requiring remediation (P1)

| File | Line | Current fallback | Remediation |
|------|------|------------------|-------------|
| `src/config/site.ts` | 2 | `"https://www.rase.co.in"` | Change to `https://www.shikshamahakumbh.com` |
| `src/app/layout.tsx` | 28 | `"https://www.rase.co.in"` | Change to `https://www.shikshamahakumbh.com` |
| `.env.example` | 5 | `https://www.rase.co.in` | Change to `https://www.shikshamahakumbh.com` |

### Env files (gitignored — align before next local build)

| File | Line | Current | Remediation |
|------|------|---------|-------------|
| `.env` | 37 | `https://shikshamahakumbh.org` | `https://www.shikshamahakumbh.com` |
| `.env.local` | 21 | `https://shikshamahakumbh.org` | `https://www.shikshamahakumbh.com` |

### Vercel (no code change)

Set on **Production, Preview, Development**:

```
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com
```

Then `npx vercel --prod` to bake into output.

---

## `rase.co.in` — full inventory (`src/`)

### P0/P1 — canonical or brand links (remediate)

| File | Line(s) | Reference | Action |
|------|---------|-----------|--------|
| `src/config/site.ts` | 2 | Fallback URL | Replace fallback |
| `src/app/layout.tsx` | 28 | `metadataBase` fallback | Replace fallback |
| `src/components/home/TrustStrip.tsx` | 10-11 | `https://www.rase.co.in/` | Use `SITE_URL` or `.com` |
| `src/app/component/footer-content.ts` | 14 | `https://www.rase.co.in/` | Use `SITE_URL` |
| `src/data/committee-editions.ts` | 18, 28, 38, 48, 58 | `https://rase.co.in` | Use `SITE_URL` |
| `src/app/component/Registration/NGOForm.tsx` | 247 | `https://rase.co.in/accommodation` | Use `${SITE_URL}/accommodation` |
| `src/config/organization.ts` | 32 | Label `www.rase.co.in` | Review — uses `SITE_URL` href |
| `src/components/admin/cms/SeoPreview.tsx` | 14, 33 | Preview placeholder | Use `SITE_URL` |
| `src/app/component/ShikshaMahaKumbh2024DigitalMedia.tsx` | 78 | Mixed `.com` + `rase.co.in` text | Canonical only in copy |
| `src/data/authority.ts` | 36 | Prose reference `rase.co.in` | Update copy to `.com` |

### P3 — ecosystem subdomains (keep as-is)

| File | Line(s) | Reference | Keep? |
|------|---------|-----------|:-----:|
| `src/app/component/Registration/PaperSubmission.tsx` | 111 | `pub.rase.co.in` | ✅ |
| `src/app/component/ShikshaKumbhTree.tsx` | 37, 49 | `sk23/sk24.rase.co.in` | ✅ |
| `src/app/component/ShikshaMahaKumbhTree.tsx` | 37, 49 | `sm23/sm24.rase.co.in` | ✅ |
| `src/app/component/MarqueeUpcomingEvent.tsx` | 14-15 | `sk24.rase.co.in` | ✅ |
| `src/app/component/Registration/ConclaveForm.tsx` | 248 | `ac.rase.co.in` | ✅ |
| `src/app/component/Registration/Best_Practices.tsx` | 217 | `ac.rase.co.in` | ✅ |
| `src/app/component/Registration/VolunteerForm.tsx` | 210 | `ac.rase.co.in` | ✅ |
| `src/app/component/footer-content.ts` | 23 | `vi.rase.co.in` | ✅ |
| `src/app/component/Journals.tsx` | 28 | `pub.rase.co.in` | ✅ |

---

## `shikshamahakumbh.org` — inventory

**DNS:** Does not resolve (prior probe). **Not a URL canonical candidate.**

| File | Line | Reference | Remediate? |
|------|------|-----------|:------------:|
| `.env` | 37 | `NEXT_PUBLIC_SITE_URL` | **YES** → `.com` |
| `.env.local` | 21 | `NEXT_PUBLIC_SITE_URL` | **YES** → `.com` |
| `.env.example` | 22 | `SMTP_FROM=noreply@shikshamahakumbh.org` | NO (email domain) |
| `.env.supabase.example` | 26 | `BREVO_SMTP_FROM=noreply@...` | NO (email domain) |
| `src/server/services/email.service.ts` | 80 | SMTP from fallback | NO (email) |
| `src/app/api/registration/send-email/route.ts` | 71 | SMTP from fallback | NO (email) |
| `src/components/registration/SuccessExperience.tsx` | 16 | UID suffix `@shikshamahakumbh.org` | NO (identifier) |

---

## `shikshamahakumbh.com` — inventory

### Correct references (no change)

| File | Line(s) | Reference |
|------|---------|-----------|
| `src/config/organization.ts` | 24, 26, 30 | emails + `www.shikshamahakumbh.com` href |
| `src/app/refund-policy/page.tsx` | 27 | `academics@shikshamahakumbh.com` |
| `src/app/cookie-policy/page.tsx` | 50 | `academics@shikshamahakumbh.com` |
| `src/app/privacy-policy/page.tsx` | 42 | `academics@shikshamahakumbh.com` |
| `src/app/error.tsx` | 30, 33 | `academics@shikshamahakumbh.com` |
| `src/components/errors/ErrorBoundary.tsx` | 39 | `academics@shikshamahakumbh.com` |
| `src/components/registration/SuccessExperience.tsx` | 210, 213 | `.com` email |
| `src/app/component/Vibhag/academic/AcademicCouncilUI.tsx` | 190, 192 | `.com` contact |
| `src/app/component/Vibhag/academic/pages/*.tsx` | various | `www.shikshamahakumbh.com` display |
| `src/app/press/*/LegacyArticle.tsx` | 100-119 | `.com` in press footers |

### Align to `www` (apex → www)

| File | Line(s) | Current | Remediation |
|------|---------|---------|-------------|
| `src/app/component/donate.tsx` | 88, 111, 115 | `https://shikshamahakumbh.com` (apex) | Use `https://www.shikshamahakumbh.com` |

---

## Remediation priority

| Priority | Action | Owner | Blocks GO? |
|----------|--------|-------|:----------:|
| **P0** | Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` on Vercel (all envs) | Ops | ✅ |
| **P0** | `npx vercel --prod` after env fix | Ops | ✅ |
| **P1** | Change `site.ts` + `layout.tsx` fallbacks | Dev | Recommended |
| **P1** | Align local `.env` / `.env.local` | Dev | Recommended |
| **P2** | TrustStrip, footer, committee-editions hardcoded links | Dev | SEO hygiene |
| **P3** | Vercel redirect `rase.co.in` → `www.shikshamahakumbh.com` | Ops | Post-launch |
| **P3** | Keep ecosystem subdomains (`pub.`, `sk24.`, etc.) | — | N/A |

---

## Post-remediation verification commands

```powershell
curl.exe --max-time 30 -s "https://www.shikshamahakumbh.com/sitemap.xml" | Select-String "<loc>" | Select-Object -First 3
# Expect: https://www.shikshamahakumbh.com

curl.exe --max-time 30 -s "https://www.shikshamahakumbh.com/robots.txt"
# Expect: Sitemap: https://www.shikshamahakumbh.com/sitemap.xml

curl.exe --max-time 30 -s "https://www.shikshamahakumbh.com/" | Select-String "canonical|og:url"
# Expect: www.shikshamahakumbh.com only — zero rase.co.in
```

---

**DOMAIN ALIGNMENT: FAIL** (live). **Source: CONDITIONAL PASS** (pending env + redeploy + fallback updates).

**No file changes made in this audit.**
