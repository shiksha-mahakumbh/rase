# SEO Monitoring Playbook — rase.co.in

Ongoing operations for Search Console, indexing, structured data, and Core Web Vitals. Complements `docs/PHASE_5_SEO_REPORT.md`.

---

## 1. Google Search Console setup

1. Add property: **URL prefix** `https://www.rase.co.in` (prefer www if canonical).
2. Verify ownership: DNS TXT (recommended) or HTML file via hosting.
3. Add users: tech lead, content lead (Restricted or Full as appropriate).
4. Link to GA4 property (Admin → Product links).

---

## 2. Sitemap submission

| Step | Action |
|------|--------|
| 1 | Confirm live XML: `https://www.rase.co.in/sitemap.xml` |
| 2 | Search Console → **Sitemaps** → submit `sitemap.xml` |
| 3 | After locale SEO priority: extend `src/app/sitemap.ts` with `/hi/`, `/fr/`, etc. and resubmit |
| 4 | Monitor **Last read** and **Discovered URLs** weekly |

**Automated check:** `node scripts/validate-go-live.mjs`

---

## 3. Index coverage review (weekly)

Search Console → **Pages** (Indexing):

| Status | Action |
|--------|--------|
| Indexed | Spot-check top URLs (home, registration, introduction, knowledge) |
| Not indexed (noindex) | Expected for `/admin`, `/datadekh/*` |
| Crawled – currently not indexed | Improve internal links + content depth |
| Soft 404 | Fix empty or redirect-only pages |
| Duplicate | Canonical tags via `metadata` / `alternates.canonical` |

**Internal linking priorities:** Homepage → Registration, Knowledge Hub, Introduction, Academic Council, Proceedings.

---

## 4. Structured data validation

| Type | Where | Tool |
|------|-------|------|
| Organization / WebSite | Root layout metadata | [Rich Results Test](https://search.google.com/test/rich-results) |
| BreadcrumbList | `metadataBuilders` JSON-LD | Rich Results Test |
| Event (SMK 6.0) | Add when stable dates/venue confirmed | Manual schema on registration or home |

**Monthly:** Run Rich Results Test on 5 URLs: `/`, `/registration`, `/introduction`, `/knowledge`, `/VibhagRoute/AcademicCouncil24`.

---

## 5. Broken link audits (monthly)

1. **Screaming Frog** or **Sitebulb** crawl (≤ 500 URLs on free tier).
2. Fix 404s in nav/footer first (`Footer.tsx`, `NavBar.tsx`).
3. Press pages: verify `shareUrl` matches actual path (known issue: some Press pages point to wrong Press URL).
4. External microsites (`sk24.rase.co.in`, etc.): confirm still live or update marquee links.

---

## 6. Core Web Vitals monitoring

| Source | Frequency | Threshold |
|--------|-----------|-----------|
| Search Console → **Experience → Core Web Vitals** | Weekly | LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1 |
| PageSpeed Insights (production URLs) | After each deploy | Same thresholds |
| `docs/FINAL_LIGHTHOUSE_REPORT.md` | Per major release | Performance ≥ 90 target |

**Key URLs:** `/`, `/registration`, `/knowledge`, `/introduction`, `/VibhagRoute/AcademicCouncil24`

**Regression triggers:** new hero images without `OptimizedImage`, ungated third-party scripts, modal without reserved height.

---

## 7. UTM & campaign tracking (SEO + analytics)

- National campaigns: consistent `utm_source`, `utm_medium`, `utm_campaign` on registration CTAs.
- Verify persistence: Firestore registration docs + GA4 events (`lib/analytics/events.ts`).
- Search Console **Performance** report: branded vs non-branded queries quarterly.

---

## 8. International SEO (when ready)

- `hreflang` for `[locale]` routes once sitemap includes locales.
- Hindi (`/hi/`) first — align with `i18n/messages/hi.json` marketing copy.
- Avoid duplicate English content at `/` and `/en/` without canonical strategy.

---

## 9. Reporting cadence

| Report | Owner | Cadence |
|--------|-------|---------|
| Index coverage snapshot | SEO / tech | Weekly |
| CWV field data | Tech | Weekly |
| Top queries + CTR | Content | Monthly |
| Lighthouse regression | Tech | Per deploy |

---

## Related files

- `src/app/sitemap.ts`, `src/app/robots.ts`
- `src/lib/seo/metadataBuilders.ts`, `publicPages.ts`
- `docs/GO_LIVE_VALIDATION_REPORT.md`
- `docs/FINAL_LIGHTHOUSE_REPORT.md`
