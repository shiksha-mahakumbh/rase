# Performance Optimization — Phase 2 Plan (Re-Audit)

**Date:** 2026-05-29  
**Phase 1:** Documentation only — no runtime optimizations applied beyond prior Phase 5/8 work.

**Baseline reference:** `docs/FINAL_LIGHTHOUSE_REPORT.md` (production mobile Performance ~32–38).

---

## 1. RootClientShell (`src/app/RootClientShell.tsx`)

| Finding | Impact | Phase 2 action |
|---------|--------|----------------|
| `"use client"` wraps **all** pages via root `layout.tsx` | Forces client boundary for entire tree hydration | Split: move `Toaster`, `CookieConsent`, analytics to leaf providers; keep children server-first |
| Announcement `Modal` on first visit | Main-thread + layout shift risk | Keep sessionStorage gate; consider CSS-only dismiss or SSR `defaultOpen={false}` |
| `NextIntlClientProvider` loads full `en.json` | Bundle on every page | Load messages per locale route only (`[locale]` paths) |
| AdSense `Script` gated by env | Good | Keep `lazyOnload` |
| Botpress (if enabled) | Third-party TBT | Keep env gate `NEXT_PUBLIC_BOTPRESS_ENABLED` |

**Risk if changed:** Modal/registration toast timing — test `/registration` after any shell split.

---

## 2. Footer (`src/app/component/Footer.tsx`, ~343 lines)

| Finding | Impact | Phase 2 action |
|---------|--------|----------------|
| Client component with **Firebase** `onSnapshot` / `increment` | Network + hydration on every page using Footer | Extract counter to `FooterVisitorCounter` dynamic `ssr: false` or API route |
| `antd` `Spin` + `framer-motion` | Extra JS | Replace Spin with CSS skeleton |
| Large static logo/link arrays inline | Parse cost | Move to `footer-content.ts` (server-importable) |

**Protected:** Do not remove Firebase write paths used for analytics without product sign-off.

---

## 3. Analytics (`src/components/analytics/AnalyticsLoader.tsx`)

| Finding | Impact | Phase 2 action |
|---------|--------|----------------|
| `strategy="lazyOnload"` (Phase 5) | Improved vs `afterInteractive` | Keep |
| `TrafficSourceCapture` in shell | Small client JS | Defer until consent |
| UTM/session capture | Useful for growth | Document in `SEO_MONITORING_PLAYBOOK` |

**Phase 2:** Consent-gated GA4 only after `CookieConsent` accept (single event listener).

---

## 4. Firebase calls

| Surface | Pattern | Concern |
|---------|---------|---------|
| `saveRegistration.ts` | Write on submit | **Protected** — do not batch/defer |
| Footer visitor count | Realtime listener | Runs on most public pages |
| `noticeboard/page.tsx` | Firestore read | Client fetch — consider ISR/server read |
| Admin pages | Heavy queries | Already behind auth; keep dynamic |

**Phase 2:** Server Components for read-only public lists (noticeboard preview) with `revalidate: 300`.

---

## 5. Ant Design (`antd`)

| Usage | Files (sample) |
|-------|----------------|
| Tables, Spin, Form widgets | `admin/page.tsx`, `noticeboarddata`, registration legacy forms |

**Impact:** Large shared chunk on routes importing antd even for `Spin` only (Footer).

**Phase 2 actions:**
- Replace Footer `Spin` → Tailwind
- `next/dynamic` for admin table with `ssr: false`
- Audit registration forms still importing antd — migrate to Tailwind + RHF only where safe

---

## 6. Slick Carousel (`react-slick` + `slick-carousel`)

| Usage | Location |
|-------|----------|
| Workshop pages | `Teacher_Development_Program`, `Spoken_English`, `Innovation` components |
| `EventImageSlider` | Media components |

**Impact:** jQuery-era CSS + JS; main-thread cost on workshop routes.

**Phase 2 actions:**
- CSS `scroll-snap` carousel for <10 images
- Or `swiper` only if removing slick entirely (see dependency plan — pick one lib)
- Ensure `WorkshopSlideImage` / `priority` only on first slide (done Phase 8)

---

## 7. Recommended Phase 2 execution order

1. Footer Firebase isolation (highest reach, medium effort)
2. RootClientShell provider split (high effort, high reward)
3. antd footprint reduction (Footer + one admin dynamic)
4. Noticeboard ISR read path
5. Carousel consolidation

---

## 8. Verification checklist (Phase 2)

- [ ] Lighthouse mobile on `/`, `/registration`, `/introduction` (3 runs median)
- [ ] `npm run build` + `npm run smoke:prod`
- [ ] Registration E2E: submit test delegate → SMK2026 ID
- [ ] No new client boundaries on `/registration` page shell
