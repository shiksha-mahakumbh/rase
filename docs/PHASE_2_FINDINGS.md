# Phase 2 — Deep Product Findings (Pre-Implementation)

**Date:** June 2026 · **Prerequisite:** Phase 1 complete (117 routes, new homepage, design tokens)

---

## 1. UX Findings

| Finding | Impact | Phase 2 action |
|---------|--------|----------------|
| Registration is one long form per type | Cognitive overload | 3-step wizard (category → details → payment) |
| Success page is confirmation-only | Missed trust/share moment | Booking-style success with QR, calendar, share |
| Edition modal on every visit | Friction | Defer to Phase 3 (session dismiss) |
| Academic Council = 2500+ lines text | Bounce, poor mobile | Card/accordion shell (Phase 2 stub, Phase 3 full) |
| No editorial “discover” feed on home | Weak Discover eligibility | News/insights strip (Phase 2 component) |

**North star:** User feels they joined a **national movement**, not a form database.

---

## 2. Registration Findings

| Current | Gap | Solution |
|---------|-----|----------|
| Dropdown type selector | Low discovery | Visual category cards |
| No draft recovery | Lost leads | `localStorage` draft per type |
| Single-page submit | No progress signal | Stepper + section visibility |
| Payment mixed with details | Overwhelm | Step 2 details, Step 3 payment |
| Success: PDF only | No mobile wallet pattern | QR + .ics + Web Share API |

**Constraint:** Firestore `saveRegistration` and Zod schemas unchanged.

---

## 3. Navigation Findings

| Issue | Action |
|-------|--------|
| 12+ top-level items | Group into 6 mega sections + popular links |
| Legacy brown gradients in CTA | Migrate to `brand-navy` / `brand-saffron` |
| No i18n entry | Language switcher placeholder (disabled) |
| No search | Search placeholder button → `/introduction` |
| Sticky header exists | Enhance shadow/contrast on scroll |

---

## 4. SEO Findings

| State | Action |
|-------|--------|
| Home has server metadata + JSON-LD | ✓ Phase 1 |
| Registration uses inline `metadata` object | Migrate to `createPageMetadata()` |
| 90+ routes lack unique meta | `publicPageSeo` registry + incremental layouts |
| Thin/duplicate routes (datadekh copies) | `noIndex` on admin/export routes (robots done) |
| Missing Article schema on proceedings | Phase 3 |

---

## 5. Accessibility Findings

| Area | Issue | Action |
|------|-------|--------|
| Forms | Labels present | `aria-invalid`, `aria-describedby` on errors |
| Nav | `aria-expanded` on menus | ✓ exists; improve focus ring |
| Cookie banner | `role="dialog"` | Add focus trap Phase 3 |
| Charts (admin) | Recharts low contrast | Document; fix Phase 3 |
| Touch targets | Some nav items small | min 44px on mobile CTAs |

**Target:** WCAG AA on registration + success + nav.

---

## 6. Mobile Findings

| Page | Issue | Action |
|------|-------|--------|
| Registration | Sidebar hidden on mobile | Trust chips above form |
| Success | Narrow OK | Full-width action cards |
| Vibhag | Wide tables | `DepartmentMemberTable` card mode Phase 3 |
| Home | Phase 1 OK | Maintain |

---

## 7. AdSense Findings

| Requirement | Status |
|-------------|--------|
| Legal pages | ✓ 4 pages |
| Cookie Policy | **Add Phase 2** |
| Cookie consent | ✓ needs analytics gating |
| Editorial depth | Weak on some routes |
| Ad slots | **Empty containers** Phase 2 (no script) |
| Thin pages | `commingsoon`, duplicates → noIndex |

---

## 8. Analytics Plan

```
User lands → CookieConsent
  ├─ Essential only → no third-party scripts
  └─ Accept all → dispatch smk-cookie-accepted
        → AnalyticsLoader mounts
              ├─ GTM (NEXT_PUBLIC_GTM_ID)
              ├─ GA4 via GTM or NEXT_PUBLIC_GA_ID
              ├─ Clarity (NEXT_PUBLIC_CLARITY_ID)
              └─ Meta Pixel (NEXT_PUBLIC_META_PIXEL_ID)
```

All IDs from env; **zero scripts** until consent.

---

## 9. Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Wizard at hub level, CSS section visibility | Avoid rewriting 6 forms’ submit logic |
| Draft in `localStorage` keyed by type | No server change; GDPR note in policy |
| i18n: `src/i18n/config.ts` only | Routes stay `/` until Phase 4 `[locale]` |
| SEO registry file | One place to audit public meta |
| Shared `SiteLayout` for public pages | Phase 2: registration + success |
| QR on success via `qrcode` | Already in dependencies |
| Nav config externalized | `src/constants/navigation.ts` |

---

## Implementation order (this pass)

1. Findings doc ✓  
2. Registration wizard + autosave + form classes brand update  
3. Success experience redesign  
4. Analytics + cookie policy  
5. Navigation refresh + i18n placeholder  
6. SEO registry + key page metadata  
7. Registration trust strip + ad slot placeholders  
8. Discover strip on homepage (lightweight)  
9. Build verify  
