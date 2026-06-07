# Phase 5 — Final SEO Audit Report

**Scope:** 116 `page.tsx` routes · 56 `layout.tsx` with metadata · Middleware noIndex

---

## Coverage summary

| Status | Approx. routes |
|--------|----------------|
| Metadata via layout/registry | ~45 |
| Page-level `metadata` export | ~10 (home, registration, legal, locale pages) |
| **No dedicated metadata** | ~60 (legacy one-offs, redirects, duplicates) |

---

## Strengths

- `createPageMetadata` + specialized builders (`metadataBuilders.ts`)
- Press 1–9, committee years, proceedings, datadekh noIndex layouts
- `sitemap.ts` — core public paths
- `robots.ts` present
- JSON-LD: home (`HomeJsonLd`), Academic Council, breadcrumbs on introduction/committee
- Canonical URLs via `alternates.canonical` in metadata helper

---

## Issues found

### Critical

1. **Duplicate global meta** — Client `app/layout.tsx` injects `<title>`, description, OG tags that conflict with per-route `metadata` → hurts SEO score and snippet consistency.

2. **cache-control no-cache** in layout `<head>` — Discourages caching; bad for Best Practices / crawl efficiency.

### High

3. **~60 routes without layouts** — Examples: `/videos`, `/keynotespeakers`, `/conclave`, `/paper`, `/merchandise`, `/past_event/*`, `/VibhagRoute/Prabandhan24`, digital media pages, `/Wishes_Received`.

4. **Structured data gaps** — No `Event` JSON-LD on `/upcomingevent`; no `Article` on press pages; committee pages lack `Organization` schema.

### Medium

5. **Alt text** — Press WhatsApp icons have alt; some legacy `<img>` use generic or missing alt (audit sample: noticeboard, datadekh).

6. **Canonical case sensitivity** — `/ContactUs` vs `/contact` — only one canonical path registered.

7. **Indexability** — datadekh/admin protected + `X-Robots-Tag` ✓; verify no internal links to datadekh from public footer.

### Low

8. **hreflang** — `[locale]` routes exist but `alternates.languages` not in metadata yet.

9. **Sitemap** — Does not include localized URLs (`/hi`, `/fr`, …).

---

## Broken links

- Not fully crawled in CI; manual spot-check: Academic Council CTA links valid; registration success query params OK.
- Recommend: run `linkinator` or Screaming Frog post-deploy.

---

## Recommended actions (Phase 5)

| Action | Priority |
|--------|----------|
| Server root layout + single metadata source | P0 |
| Generate layouts for `past_event/*`, Vibhag, keynotes | P1 |
| Article JSON-LD on Press pages | P2 |
| `alternates.languages` for locales | P2 |
| Expand sitemap with locale + knowledge hub | P3 |

---

*Generated before Phase 5 SEO fixes. Tracker in `PHASE_5_FINDINGS.md`.*
