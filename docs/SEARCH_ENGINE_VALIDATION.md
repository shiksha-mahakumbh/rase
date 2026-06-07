# Search Engine Validation — rase.co.in

**Audit date:** 29 May 2026 (codebase + production probe)  
**Canonical:** `https://www.rase.co.in`

---

## 1. robots.txt

| Check | Codebase | Production (pre-fix) |
|-------|----------|----------------------|
| Implementation | `src/app/robots.ts` | HTML homepage (invalid) |
| Disallow admin/datadekh | ✓ | N/A until deploy |
| Sitemap reference | `${SITE_URL}/sitemap.xml` | ✓ after deploy |

**Blocker:** `vercel.json` catch-all — see `PRODUCTION_DEPLOYMENT_AUDIT.md`.

---

## 2. sitemap.xml

| Check | Status |
|-------|--------|
| `src/app/sitemap.ts` | ✓ 24+ static paths |
| Includes `/knowledge`, `/registration` | ✓ |
| Locale URLs (`/hi/...`) | **Not included** (WARN) |
| `lastModified` | Dynamic `new Date()` |

**Post-deploy:** Submit in Google Search Console + Bing Webmaster Tools.

---

## 3. Canonical tags

| Source | Status |
|--------|--------|
| `createPageMetadata()` | `alternates.canonical` per path ✓ |
| `metadataBuilders.ts` | Article/event layouts ✓ |
| Locale routes | Default locale at `/`; others at `/hi/...` — canonical should point to preferred URL (mostly `/` paths today) |

**Action:** When expanding i18n SEO, add `alternates.languages` per locale.

---

## 4. Open Graph

| Field | Status |
|-------|--------|
| `og:title`, `og:description`, `og:url` | Via `createPageMetadata` ✓ |
| `og:image` | `DEFAULT_OG_IMAGE` from site config ✓ |
| `og:type` | `website`; articles use `article` in builders ✓ |

---

## 5. Twitter Cards

| Field | Status |
|-------|--------|
| `twitter:card` | `summary_large_image` ✓ |
| Title / description / image | Mirrored from OG ✓ |

---

## 6. JSON-LD

| Type | Location |
|------|----------|
| Organization / WebSite / Event | `HomeJsonLd.tsx` |
| BreadcrumbList | `BreadcrumbJsonLd.tsx`, Academic Council layout |
| Article (Knowledge) | `knowledge/page.tsx` + `buildArticleJsonLd` |
| Legacy | `Info.tsx` (older pages) |

**Validate:** [Rich Results Test](https://search.google.com/test/rich-results) on `/`, `/knowledge`, `/introduction`.

---

## 7. hreflang / localized routes

| Locale | Route example | hreflang in metadata |
|--------|---------------|---------------------|
| en | `/registration` | Default (no prefix) |
| hi | `/hi/registration` | **Not yet** in metadata |
| fr, es, ar | `/fr/...`, etc. | **Not yet** |

**Config:** `localePrefix: "as-needed"` in `i18n/config.ts`.

**Readiness:** Functional routes ✓; **SEO hreflang** = pending (add when sitemap includes locales).

---

## Engine-specific readiness

### Google

| Requirement | Ready? |
|-------------|--------|
| Valid robots + sitemap | **After deploy fix** |
| Mobile-friendly | ✓ |
| HTTPS | ✓ |
| Structured data | ✓ (validate live) |
| Core Web Vitals | **Improve** (LCP) |

### Bing

| Requirement | Ready? |
|-------------|--------|
| Webmaster Tools verification | Manual |
| Sitemap submit | After robots fix |
| Same technical SEO as Google | ✓ |

### DuckDuckGo

| Note | Ready? |
|------|--------|
| Uses Bing/Yahoo index primarily | Inherits Bing submission |
| No special markup required | ✓ |

### Yandex

| Requirement | Ready? |
|-------------|--------|
| Yandex Webmaster verification | Manual |
| `robots.txt` + sitemap | After deploy fix |
| hreflang for RU audience | Optional (ar/hi more relevant today) |

---

## Post-deploy checklist

- [ ] `curl` robots.txt → valid directives
- [ ] `curl` sitemap.xml → XML
- [ ] GSC property verified
- [ ] Sitemap submitted (Google + Bing)
- [ ] Rich Results Test × 5 URLs
- [ ] Fix Press `shareUrl` mismatches (known duplicate URL issue)

---

## Related

- `docs/SEO_MONITORING_PLAYBOOK.md`
- `src/app/robots.ts`, `src/app/sitemap.ts`
- `src/lib/seo/metadata.ts`
