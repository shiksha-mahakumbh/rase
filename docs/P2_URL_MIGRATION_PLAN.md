# P2 URL Migration Plan — Recommendations Only

**Status:** Prepared — **not implemented**  
**Date:** 29 May 2026  
**Prerequisite:** P0 and P1 complete

---

## 1. Migration Table

| Current Route | Recommended Route | Reason | SEO Benefit | Redirect Required |
|---------------|-------------------|--------|-------------|-------------------|
| `/pastevent` | `/past-events` | kebab-case convention | Improved readability, shareability | 301 permanent |
| `/upcomingevent` | `/upcoming-events` | Same | Same | 301 permanent |
| `/ContactUs` | `/contact` | Standard English slug | Better CTR in search | 301 permanent |
| `/Best_Wishes` | `/best-wishes` | Case/normalization | Consistent URL cluster | 301 permanent |
| `/Wishes_Received` | `/wishes-received` | Underscore removal | Cleaner canonical | 301 permanent |
| `/committeepage` | `/committee` | Shorter hub URL | Committee topic cluster | 301 permanent |
| `/VibhagRoute/AcademicCouncil24` | `/departments/academic-council` | Public-facing structure | Department silo for SMK 6.0 | 301 permanent |
| `/VibhagRoute/Prabandhan24` | `/departments/prabandhan` | Hindi dept. naming | Topical authority | 301 permanent |
| `/VibhagRoute/Prachar24` | `/departments/prachar` | Same | Same | 301 permanent |
| `/VibhagRoute/Sampark24` | `/departments/sampark` | Same | Same | 301 permanent |
| `/VibhagRoute/Vitt24` | `/departments/vitt` | Same | Same | 301 permanent |
| `/Press_Release` | `/press` | Hub naming | Press release cluster | 301 permanent |
| `/Press1` | `/press/baton-ceremony-smk-4` | Descriptive slug | Rich snippets, social sharing | 301 permanent |
| `/Press2`–`/Press9` | `/press/{descriptive-slug}` | Per-article slugs | Long-tail search | 301 each |
| `/commingsoon` | `/coming-soon` | Spelling correction | Avoid thin duplicate | 301 or deprecate |
| `/Accomodation` | `/accommodation` | Spelling | Trust signal | 301 permanent |
| `/registration/Single_Registration` | `/registration/single` | Simplify funnel | Cleaner analytics | 301 permanent |
| `/shikshamahakumbh2024digitalmedia` | `/media/shiksha-mahakumbh/2024/digital` | Hierarchical archives | Internal linking depth | 301 permanent |
| All 7 other media archives | `/media/{edition}/{year}/{type}` | Same pattern | Archive discoverability | 301 each |

---

## 2. Redirect Map (next.config.js draft)

```js
// Phase 2A — Event slugs
{ source: "/pastevent", destination: "/past-events", permanent: true },
{ source: "/upcomingevent", destination: "/upcoming-events", permanent: true },

// Phase 2B — Contact & community
{ source: "/ContactUs", destination: "/contact", permanent: true },
{ source: "/Best_Wishes", destination: "/best-wishes", permanent: true },
{ source: "/Wishes_Received", destination: "/wishes-received", permanent: true },
{ source: "/committeepage", destination: "/committee", permanent: true },

// Phase 2C — Vibhag namespace (preserve all VibhagRoute/* indefinitely)
{ source: "/VibhagRoute/AcademicCouncil24", destination: "/departments/academic-council", permanent: true },
{ source: "/VibhagRoute/Prabandhan24", destination: "/departments/prabandhan", permanent: true },
{ source: "/VibhagRoute/Prachar24", destination: "/departments/prachar", permanent: true },
{ source: "/VibhagRoute/Sampark24", destination: "/departments/sampark", permanent: true },
{ source: "/VibhagRoute/Vitt24", destination: "/departments/vitt", permanent: true },

// Phase 2D — Press cluster
{ source: "/Press_Release", destination: "/press", permanent: true },
{ source: "/Press1", destination: "/press/baton-ceremony-smk-4", permanent: true },
// ... Press2–9

// Phase 2E — Media archives
{ source: "/shikshamahakumbh2024digitalmedia", destination: "/media/shiksha-mahakumbh/2024/digital", permanent: true },
// ... remaining archives
```

**Never redirect:** `/registration/*`, `*datadekh`, `/admin/*`, payment webhooks, Firebase-linked forms.

---

## 3. SEO Impact Assessment

| Change | Risk | Benefit | Mitigation |
|--------|------|---------|------------|
| Event slug renames | Low | Medium — cleaner URLs indexed | 301 + sitemap update + Search Console |
| Vibhag → departments | Medium | High — topic clusters for SMK 6.0 | Keep all 5 old URLs as 301s; update printed collateral gradually |
| Press slug renames | Low | Medium — article-level SEO | Hub at `/press` with internal links |
| Media hierarchy | Medium | High — reduces orphan archives | Breadcrumbs from `/media` hub |
| Registration paths | **Do not change** | N/A | External links, email templates, Razorpay callbacks |

**Estimated indexable URL increase after P2:** +0 (same content, new aliases). **Link equity:** preserved via 301 chains (max 1 hop).

---

## 4. Internal Link Update List

| File / area | Updates needed |
|-------------|----------------|
| `src/constants/navigation.ts` | All renamed paths in NAV_MENUS |
| `src/constants/routes.ts` | ROUTES object |
| `src/app/component/footer-content.ts` | quickLinks, programLinks |
| `src/data/media-archives.ts` | Archive `link:` paths |
| `src/data/committee-editions.ts` | If `/committee` hub rename |
| `src/data/vibhag-pages.ts` | Department paths |
| `src/lib/knowledge-graph/content-map.ts` | All path entries |
| `src/lib/knowledge-graph/authority-map.ts` | Authority paths |
| `src/lib/seo/publicPages.ts` | Canonical `path` fields |
| `src/app/sitemap.ts` | New canonical paths only (drop old after 6 months) |
| `src/components/home/DiscoverStrip.tsx` | CTA hrefs |
| `src/components/vibhag/VibhagPageShell.tsx` | Breadcrumb department link |
| `src/lib/ecosystem/registries.ts` | Registry hrefs |
| Email templates / Firebase (external) | Manual audit required |

---

## 5. File Modification List

### New files (P2)

| Path | Purpose |
|------|---------|
| `src/app/past-events/page.tsx` | Canonical past events (or rename folder) |
| `src/app/upcoming-events/page.tsx` | Canonical upcoming events |
| `src/app/contact/page.tsx` | Canonical contact |
| `src/app/departments/academic-council/page.tsx` | Vibhag successor |
| `src/app/departments/prabandhan/page.tsx` | etc. |
| `src/app/press/page.tsx` | Press hub |
| `src/app/press/[slug]/page.tsx` | Dynamic press articles (optional consolidation) |
| `src/app/media/[edition]/[year]/[type]/page.tsx` | Optional dynamic archives |

### Modified files (P2)

- `next.config.js` — full redirect matrix
- All files in Section 4
- `docs/ROUTE_AUDIT_REPORT.md` — post-migration status

### Deprecated after P2 (keep redirects 12+ months)

- `src/app/pastevent/` (redirect only)
- `src/app/VibhagRoute/*/` (redirect only)
- `src/app/commingsoon/` (remove or redirect)

---

## 6. Recommended Rollout Order

1. **2A** — Event slugs (`pastevent`, `upcomingevent`) — lowest risk  
2. **2B** — Contact, wishes, committee hub  
3. **2C** — Department namespace (highest visibility — coordinate with SMK 6.0 launch)  
4. **2D** — Press cluster  
5. **2E** — Media archive hierarchy  

Each phase: deploy redirects → update internal links → update sitemap → `npm run build` → monitor 404s for 7 days.

---

*This document is recommendations only. No P2 URL changes have been applied.*
