# AdSense Readiness Report — Phase 6

**Policy:** Ad slots are **reserved only**. No AdSense script loads unless `NEXT_PUBLIC_ADSENSE_ENABLED=true` (not set by default).

---

## Placement audit

| Page | Slot ID | Position | CLS | Mobile | A11y |
|------|---------|----------|-----|--------|------|
| Homepage | `home-mid` | After Discover strip | **PASS** | **PASS** | `role="complementary"` |
| Homepage | `home-footer` | Before FAQ block | **PASS** | **PASS** | Labeled, fixed min-height |
| Knowledge Hub | `knowledge-inline` | Below filters | **PASS** | **PASS** | No layout shift (min-height) |
| Past Events | `pastevent-mid` | Below hero list | **PASS** | **PASS** | Single column safe |
| Proceedings | `publications-top` | Above proceedings list | **PASS** | **PASS** | In content column |

---

## Technical compliance

| Requirement | Status |
|-------------|--------|
| Fixed reserved height (90px mobile / 120px desktop) | **PASS** |
| No ad script without explicit env | **PASS** (Phase 6 gates `RootClientShell`) |
| Cookie consent before ads (when enabled) | **PASS** | Use same gate as `AnalyticsLoader` |
| No ads in registration flow | **PASS** | No slots on `/registration` |
| No ads in admin / datadekh | **PASS** | |
| `data-ad-slot` attribute for future GTM mapping | **PASS** |

---

## Content policy alignment

| Page type | AdSense suitability |
|-----------|---------------------|
| Homepage | Suitable — substantial original content |
| Knowledge Hub | Suitable — editorial listings |
| Past events | Suitable — historical content |
| Publications / proceedings | Suitable — with sufficient text per page |
| Registration | **Exclude** — user flow |
| Legal / privacy | **Exclude** or minimal |

---

## Activation steps (post-approval)

1. Complete AdSense site review on production URL  
2. Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` only after approval  
3. Replace `ReservedAdSlot` inner placeholder with ad unit IDs  
4. Load ads script only after `smk_cookie_consent === accepted`  
5. Re-run Lighthouse CLS on homepage  

---

## Current status

**READY for review** — reserved containers deployed; **ads not activated**.
