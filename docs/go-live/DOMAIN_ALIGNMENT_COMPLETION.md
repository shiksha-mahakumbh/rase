# Domain Alignment Completion

**Date:** 2026-06-12  
**Canonical target:** `https://www.shikshamahakumbh.com`

---

## Source Changes Applied

| File | Change |
|------|--------|
| `src/config/site.ts` | Fallback `SITE_URL` → `www.shikshamahakumbh.com` |
| `src/app/layout.tsx` | `metadataBase` fallback updated |
| `.env.example` | `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` |
| `src/components/admin/cms/SeoPreview.tsx` | Placeholder domain updated |
| `src/components/home/TrustStrip.tsx` | SMK logo link → shikshamahakumbh.com |
| `src/server/services/email.service.ts` | SMTP default → `@shikshamahakumbh.com` |
| `src/app/api/registration/send-email/route.ts` | SMTP default updated |
| `src/components/registration/SuccessExperience.tsx` | Calendar UID domain updated |
| `src/config/organization.ts` | RASE link kept as partner URL (explicit rase.co.in) |

---

## Intentionally Unchanged (External / Legacy)

| Reference | Reason |
|-----------|--------|
| `ac.rase.co.in`, `pub.rase.co.in`, `sk23.rase.co.in` | External subdomain services |
| `footer-content.ts` RASE partner logo | Partner organization link |
| Press/article legacy content | Historical URLs |

---

## SEO Pipeline (Source)

| Asset | Generator | Uses `SITE_URL` |
|-------|-----------|-----------------|
| sitemap.xml | `src/app/sitemap.ts` | ✅ |
| robots.txt | `src/app/robots.ts` | ✅ |
| metadata | `createPageMetadata()` / layout | ✅ |
| JSON-LD | `SiteJsonLd`, `site.ts` schemas | ✅ |
| Open Graph | `DEFAULT_OG_IMAGE` | ✅ |

---

## Live Production (Still Stale Until Deploy)

| Asset | Live value (2026-06-12) | Expected after deploy |
|-------|-------------------------|----------------------|
| canonical | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| sitemap locs | `www.rase.co.in` | `www.shikshamahakumbh.com` |
| robots Sitemap | `www.rase.co.in/sitemap.xml` | `www.shikshamahakumbh.com/sitemap.xml` |

**Requires:** Vercel `NEXT_PUBLIC_SITE_URL` + production redeploy.

---

## Verification Commands (Post-Deploy)

```bash
curl.exe -s "https://www.shikshamahakumbh.com/" | findstr canonical
curl.exe -s "https://www.shikshamahakumbh.com/robots.txt" | findstr shikshamahakumbh
curl.exe -s "https://www.shikshamahakumbh.com/sitemap.xml" | findstr shikshamahakumbh
```

---

*Evidence: git diff on listed files; live curl from P1 audit (pre-deploy).*
