# Lighthouse Recovery Plan

**Audit date:** 29 May 2026  
**Baseline (production lab):** Performance **32–38**, Accessibility **92–95**, Best Practices **75**, SEO **83–92**  
**Target:** Performance **≥90**, Accessibility **≥95**, Best Practices **≥90**, SEO **≥95**  
**Method:** Code trace + Phase 5 build data + live Lighthouse JSON (Phase 7)

Measure first → implement in priority order below.

---

## Executive diagnosis

| Gap | Primary cause | Est. impact |
|-----|---------------|-------------|
| Performance 32–38 | LCP **9–12s**, main-thread JS, third-party scripts | **Critical** |
| SEO 83 on home | **Invalid robots.txt** (HTML via `vercel.json`) | **Critical** until deploy fix |
| Best Practices 75 | Third-party cookies/scripts, console noise | Medium |
| Accessibility 92–95 | Modal, legacy forms, emoji headings on some routes | Low–medium |

Architecture (Phase 5/6) already includes layout split, consent-gated analytics, `OptimizedImage`, lazy ads — **benefits are not visible on production** until deploy + script deferrals.

---

## 1. Largest JS bundles (from Phase 5 build)

| Route | First Load JS | Notes |
|-------|---------------|-------|
| `/admin` | ~117 kB page + ~101 kB shared | recharts — keep dynamic import |
| `/registration` | ~41 kB page + shared | Firebase client + forms |
| `/organiserdatadekh` | ~76 kB | Legacy — noindex |
| Shared chunks | ~101 kB | Webpack split |

**Actions:**

- No new barrel imports; keep admin charts behind `dynamic()`.
- Avoid loading admin/recharts on public routes (already isolated).

**Est. savings on public routes:** 0 ms (admin not loaded) — focus elsewhere.

---

## 2. Third-party script cost (see `THIRD_PARTY_AUDIT.md`)

| Script | Strategy (before P8) | Est. main-thread cost |
|--------|----------------------|------------------------|
| GTM / GA4 / Clarity / Meta | `afterInteractive` post-consent | **400–800 ms** |
| Botpress (2 scripts) | `lazyOnload`, always on | **300–600 ms** |
| AdSense | `lazyOnload`, env-gated off | 0 when disabled |

**Phase 8 changes:**

- Analytics → `lazyOnload` after consent.
- Botpress → only if `NEXT_PUBLIC_BOTPRESS_ENABLED=true`.

**Est. savings:** **700–1400 ms** TBT on first load (lab).

---

## 3. Hydration cost

| Source | Impact |
|--------|--------|
| `RootClientShell` wraps all pages | Full-tree client boundary |
| `next-intl` provider in shell | Required for client islands |
| Homepage sections | Many `"use client"` sections |
| Registration wizard | Entire hub client — **required** |

**Actions (no homepage redesign):**

- Do not add new global client providers.
- Keep homepage sections as-is; defer scripts instead of splitting hero.

---

## 4. LCP element (production trace)

| Page | Likely LCP | Notes |
|------|------------|-------|
| Homepage | Hero `next/image` `/shiksha.png` **or** modal overlay | `priority` set on hero image ✓ |
| Registration | Form shell / heading | No hero image |
| Knowledge | Header text / first card | |
| Inner pages | Large text or first image | |

**Lab LCP 9–12s** indicates **render delay + JS**, not image bytes alone.

**Actions:**

1. Fix production routing (reduces erroneous HTML payloads).
2. Defer third-party scripts (above).
3. Session modal: already session-gated; consider `requestAnimationFrame` delay before open (optional, small win).

**Workshop sliders:** Phase 8 converts workshop `<img>` → `OptimizedImage` (15 slides total).

---

## 5. CLS sources

| Source | Status |
|--------|--------|
| Announcement modal | Session storage gate ✓ |
| Reserved ad slots | `min-height` ✓ — CLS **0.023** lab |
| Fonts | `next/font` Inter `display: swap` ✓ |
| slick-carousel | Workshop pages — fixed height `h-80` |

**Target:** maintain CLS **&lt; 0.1** while improving LCP.

---

## 6. Font loading

- `Inter` via `next/font/google` in `layout.tsx` — **good**.
- No additional blocking `@font-face` in globals.

---

## 7. Image loading

- Hero: `next/image` + `priority` ✓
- Past events: `EventImageSlider` + `OptimizedImage` ✓
- Workshops: **converted in Phase 8**
- Remaining `<img>`: blob previews, fee icons, datadekh — see `IMAGE_OPTIMIZATION_REPORT.md`

---

## 8. Analytics impact

- Loads only after `smk_cookie_consent === accepted` ✓
- Phase 8: `lazyOnload` instead of `afterInteractive` — reduces contention with LCP

---

## 9. Botpress impact

- Two external scripts on every page (before P8).
- Phase 8: env-gated off by default.

---

## 10. AdSense impact

- Disabled unless `NEXT_PUBLIC_ADSENSE_ENABLED=true` — **negligible** today.

---

## Implementation priority

| P | Item | Effort | Impact |
|---|------|--------|--------|
| **P0** | Deploy `vercel.json` fix | Low | Fixes robots/sitemap/health + SEO audits |
| **P1** | Third-party defer + Botpress gate | Low | High TBT/LCP |
| **P2** | Workshop `OptimizedImage` | Low | Medium on workshop routes |
| **P3** | Press WhatsApp icons → `WhatsAppIcon` | Medium | Low global |
| **P4** | Re-run Lighthouse post-deploy | — | Validate |

---

## Success criteria

Re-run Lighthouse on: `/`, `/registration`, `/knowledge`, `/introduction`, `/VibhagRoute/AcademicCouncil24`.

| Metric | Minimum post-recovery |
|--------|----------------------|
| Performance | **≥ 70** (stretch 90+) |
| SEO | **≥ 92** (home), **≥ 95** inner |
| CLS | **&lt; 0.1** |
| robots.txt audit | **Pass** |

Update `docs/FINAL_LIGHTHOUSE_REPORT.md` after deploy.
