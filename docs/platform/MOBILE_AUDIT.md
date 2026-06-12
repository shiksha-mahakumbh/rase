# Mobile Audit — Shiksha Mahakumbh 6.0

**Date:** June 2026  
**Standard:** Mobile-first · Core Web Vitals targets  
**Reference:** `docs/PHASE_5_MOBILE_REPORT.md`, `docs/P3B_PRODUCTION_SIGNOFF_REPORT.md`

---

## Executive summary

| Metric | Current (prod) | Target | Status |
|--------|---------------|--------|--------|
| CLS | 0 | < 0.1 | ✅ Pass |
| LCP (homepage) | 2.4–7.8s (variance) | < 2.5s | ⚠️ Inconsistent |
| FID/INP | Not measured | < 200ms | ⚠️ Unknown |
| Mobile nav | Drawer pattern | 44px targets | ⚠️ Partial |
| Form usability | Registration OK | Full WCAG touch | ⚠️ Partial |
| Responsive coverage | Tailwind breakpoints | All pages | ⚠️ Legacy gaps |

---

## Architecture patterns (good)

| Pattern | Location | Notes |
|---------|----------|-------|
| Tailwind responsive | Site-wide | `sm:`, `md:`, `lg:` breakpoints |
| Public page shell | `PublicPageShell.tsx` | `max-w-7xl px-4 md:px-8`, `<main id="main-content">` |
| Overflow guard | `globals.css` | `overflow-x: hidden` on html/body |
| Touch targets (new) | Noticeboard, registration | `min-h-[44px]` |
| Modal gating | `ClientChrome.tsx` | `sessionStorage` announcement dismiss |
| Font swap | `layout.tsx` | Inter `display: swap` |
| Reduced motion | `globals.css` | `prefers-reduced-motion` respected |

---

## Page-by-page findings

### Homepage (`/`)

| Issue | Severity | Cause | Fix |
|-------|----------|-------|-----|
| Announcement modal CLS | Medium | First-visit modal | Already gated by sessionStorage; consider CSS-only on mobile |
| Hero image LCP | Medium | Large hero asset | `priority` + WebP + responsive `sizes` |
| Partner logo grid | Low | 23 images load at once | Lazy load below fold |
| Gallery carousel | Medium | JS carousel weight | Static grid on mobile |

### Navigation (`NavBar.tsx`)

| Issue | Severity | Fix |
|-------|----------|-----|
| 12+ menu items cognitive load | Medium | Grouped menus (partially done) |
| Mobile drawer | OK | `lg:hidden` hamburger |
| Tap targets on sub-items | Medium | Ensure 44px min-height |
| Hindi department names | Low | i18n from CMS |

### Registration (`/registration`)

| Issue | Severity | Fix |
|-------|----------|-----|
| Multi-step wizard | Good | Stepper implemented |
| Form fields | Good | `FormField` with mobile sizing |
| Payment section | Medium | Razorpay modal on small screens |
| File upload | Medium | Mobile camera capture support |

### Committee pages (`/committee/*`, `/committees`)

| Issue | Severity | Fix |
|-------|----------|-----|
| Large `text-3xl` headers | Low | Responsive typography |
| Member tables | Medium | `overflow-x-auto` (exists) |
| Long inline rosters | High | Accordion/card layout per member |

### Academic Council (`/departments/academic-council`)

| Issue | Severity | Fix |
|-------|----------|-----|
| Sidebar layout on mobile | Medium | Stack tabs vertically |
| Long accordions | Medium | Collapse by default |
| Skip link | Good | Local skip link exists |

### Past events (`/past-events`, `/past_event/*`)

| Issue | Severity | Fix |
|-------|----------|-----|
| Legacy `<img>` no dimensions | **High** | Width/height from CMS |
| LCP 7.8s (worst case) | **High** | Image optimization + priority |
| No responsive images | High | `next/image` + `sizes` |

### Press pages (`/press/*`)

| Issue | Severity | Fix |
|-------|----------|-----|
| 3-column `CompanyInfo` waste | Medium | Hide side columns on mobile |
| Share buttons < 44px | Medium | `PressShareButtons` — verify targets |
| Long article text | Low | Readable line length |

### Noticeboard (`/noticeboard`)

| Issue | Severity | Fix |
|-------|----------|-----|
| Tab pattern | Good | Full ARIA tablist |
| Image lightbox | Good | Touch-friendly |
| Refresh button | Good | 44px target |

### Contact (`/contact-us`)

| Issue | Severity | Fix |
|-------|----------|-----|
| Form layout | Good | Single column on mobile |
| Map embed | Medium | Responsive iframe |
| Phone tap-to-call | Good | `tel:` links |

### Media center / Gallery

| Issue | Severity | Fix |
|-------|----------|-----|
| Image grids | Medium | 2-col mobile, 4-col desktop |
| Video embeds | Medium | 16:9 aspect ratio container |
| Archive navigation | Medium | Simplify tree on mobile |

---

## Core Web Vitals remediation plan

### LCP (Largest Contentful Paint)

| Action | Pages | Priority |
|--------|-------|----------|
| Add `priority` to hero images | Home, event pages | P0 |
| Convert hero to WebP/AVIF | Home, press | P0 |
| Preload critical fonts | All (Inter partial) | P1 |
| Remove render-blocking scripts | Analytics already lazy | ✅ |
| Server-side image sizing | CMS media | P1 (post-CMS) |

### CLS (Cumulative Layout Shift)

| Action | Status |
|--------|--------|
| Modal sessionStorage gate | ✅ Done |
| Image width/height attributes | ⚠️ Legacy pages missing |
| Ad slot placeholders | ⚠️ `AdSlotRegion` needs min-height |
| Font fallback metrics | ⚠️ Review Inter fallback |

### INP (Interaction to Next Paint)

| Action | Priority |
|--------|----------|
| Reduce NavBar JS weight | P1 |
| Defer non-critical carousel JS | P1 |
| Virtualize long registration lists (admin) | P2 |

---

## Mobile menu improvements (planned)

```
[Logo]                    [☰]
─────────────────────────────────
▼ Register          (expanded)
  Conclave · Delegate · Olympiad
▼ Discover
  Events · Media · Committees
▼ About
  Introduction · Contact
[Register Now — full width CTA]
```

- Sticky bottom CTA on registration funnel
- Search placeholder (future CMS search)

---

## Image optimization standards (CMS-era)

| Rule | Value |
|------|-------|
| Hero max width | 1920px WebP |
| Thumbnail | 400px WebP |
| Gallery | 800px WebP + lazy |
| PDF previews | Generated server-side |
| `sizes` attribute | Per breakpoint in components |

---

## Testing checklist

| Test | Tool | Frequency |
|------|------|-----------|
| Lighthouse mobile | CI / manual | Per release |
| Real device (Android + iOS) | BrowserStack / physical | Monthly |
| 320px viewport | DevTools | Per new page |
| Slow 3G throttling | DevTools | Per major change |
| Touch target audit | axe / manual | Per sprint |

---

## Post-CMS mobile benefits

When content moves to database + Supabase Storage:
- Responsive images served via CDN transforms
- No redeploy for content changes affecting layout
- Admin can set mobile-specific hero/banner crops
- Notice board unified (homepage widget + `/noticeboard`)

**No code changes required during this audit phase.**
