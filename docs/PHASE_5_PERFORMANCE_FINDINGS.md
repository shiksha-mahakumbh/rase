# Phase 5 — Performance Findings Report

**Date:** June 2026 · **Build:** Passing · **Method:** Static codebase audit + production build route sizes (no live Lighthouse run in CI)

---

## Executive summary

| Category | Score risk | Primary cause |
|----------|------------|---------------|
| Performance | **62–78** (est.) | Client root layout, third-party scripts, legacy `<img>`, large admin/registration JS |
| Accessibility | **85–92** (est.) | Modal focus, touch targets on legacy pages, emoji-only headings in places |
| SEO | **88–95** (est.) | Duplicate `<title>`/meta in client `layout.tsx` overriding page metadata |
| Best Practices | **80–90** (est.) | `no-cache` meta, mixed HTTP headers, external scripts without consent delay |

**Targets:** Performance > 95, Accessibility > 95, SEO > 100, Best Practices > 95 — achievable after layout/metadata split, image pass, and script deferral.

---

## 1. Remaining `<img>` tags (55 instances / 28 files)

| Area | Files | Count | LCP impact |
|------|------:|------:|------------|
| Press 1–9 (WhatsApp icons) | 9 | 27 | Low per icon; fix via shared component |
| Registration forms (receipt previews) | 6 | 12 | Medium (blob URLs — keep `<img>` or unoptimized Image) |
| Past events (sm23/sm24/sk23/sk24) | 4 | 4 | **High** on `/past_event/*` |
| Workshops / marquee / noticeboard | 8 | 10 | Medium |
| Internal datadekh | 4 | 4 | noIndex — low priority |

**Already migrated:** `TrustStrip`, `CommitteePage`, `ContactUs`, `Press1` hero via `next/image` in component.

**Recommendation:** `OptimizedImage` for static paths; `WhatsAppIcon` for press; retain `<img>` only for `blob:` preview URLs.

---

## 2. Largest JavaScript bundles (from build)

| Route | First Load JS | Notes |
|-------|---------------|-------|
| `/admin` | ~117 kB page + 101 kB shared | **recharts** full import |
| `/registration` | ~41 kB page | Forms + firebase client |
| `/organiserdatadekh` | ~76 kB | Legacy data UI |
| `/noticeboard` | ~22 kB | Heavy client |
| `/VibhagRoute/AcademicCouncil24` | ~17 kB | Post Phase 3 split ✓ |
| Shared chunks | 101 kB | `1517-*`, `4bd1b696-*` |

**Recommendation:** `next/dynamic` for `AnalyticsCharts`, `AdminGrowthAnalytics`, admin recharts; avoid new barrel imports.

---

## 3. Dynamic imports (existing)

| File | Usage | Assessment |
|------|--------|------------|
| `GalleryPage`, `MediaPage`, `VideoPage`, `Shiksha*Page` | Tree components | ✓ Good pattern |
| Homepage / Academic Council | None (removed after ChunkLoadError) | ✓ Correct |

**Risk:** Low — do not re-add homepage dynamic imports without stable chunk strategy.

---

## 4. Unused / heavy JavaScript

| Package | Used on | Issue |
|---------|---------|-------|
| `recharts` | Admin only | Entire library if not tree-shaken |
| `framer-motion` | NavBar, donate | Acceptable if single chunk |
| `antd` / `@nextui-org` | Legacy forms | Possible duplicate UI libs |
| `react-router-dom` | ? | May be unused in App Router |
| Botpress (layout `<script>`) | All pages | **Blocks main thread** — defer until consent/interaction |
| Google AdSense (layout) | Production | Third-party — defer |

---

## 5. Layout shift (CLS)

| Source | Severity |
|--------|----------|
| Announcement modal on first paint | **High** — full-screen overlay on load |
| Font swap (Inter via `next/font`) | Low if `display: swap` set |
| SlideShow / carousel without dimensions | Medium on home gallery |
| Images without width/height in legacy pages | Medium |

**Recommendation:** Modal closed by default on mobile or after `sessionStorage`; explicit `width`/`height` on all `Image`/`OptimizedImage`.

---

## 6. Image optimization

- `next.config.js`: Firebase + flaticon `remotePatterns` ✓
- Missing: `img.icons8.com` for WhatsApp icons (27 uses)
- Press heroes: `next/image` in `Press1.tsx` component ✓
- No global `priority` on LCP hero — verify `HeroSection` uses `priority`

---

## 7. Font loading

```ts
const inter = Inter({ subsets: ["latin"] });
```

- Missing: `display: "swap"` → causes invisible text / layout shift
- Root layout is **`"use client"`** → prevents Next.js metadata API from owning `<head>` cleanly

---

## 8. Root layout architecture (critical SEO + Performance)

`src/app/layout.tsx` is a **client component** with:

- Hardcoded `<title>`, description, OG, Twitter (duplicates page-level metadata)
- `cache-control: no-cache` meta (hurts CDN / Best Practices)
- Botpress + AdSense in `<head>` synchronously
- Full-screen modal default `isModalOpen = true`

**Impact:** SEO capped below 100; LCP delayed; TBT increased.

**Fix (Phase 5):** Server `layout.tsx` + `metadata` export + `RootClientShell.tsx` for interactive chrome.

---

## 9. Middleware

- Size: **47.6 kB** (next-intl + admin guards)
- Acceptable for locale routing

---

## 10. Recommended implementation order

1. Server/client layout split + font `display: swap`  
2. Defer Botpress / modal CLS fix  
3. `WhatsAppIcon` + past-event `OptimizedImage` pass  
4. Dynamic import admin charts  
5. Extend UTM capture (analytics intelligence)  
6. Production Lighthouse run on Vercel/hosting URL  

---

*This report documents state **before** Phase 5 code changes. See git diff for applied fixes.*
