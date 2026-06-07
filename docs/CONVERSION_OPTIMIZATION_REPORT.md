# Conversion Optimization Report — Registration Funnel

**Audit date:** 29 May 2026  
**Constraint:** No homepage or registration wizard redesign.

---

## Funnel map

| Stage | Route / UI | Analytics event | Friction observed |
|-------|------------|-----------------|-------------------|
| Landing | `/` | Page view (GTM/GA4 post-consent) | Heavy JS delays CTA readiness |
| CTA click | Hero, sticky bar, marquee | Implicit navigation | Many CTAs — good |
| Registration start | `/registration` step 1 | `registration_started` | Category choice clear ✓ |
| Details | Step 2 | — | Long forms per type |
| Payment | Step 3 | — | Payment confusion for some types |
| Completion | Submit + Firestore | `registration_completed` | — |
| Success | `/registration/success` | — | QR/PDF ✓ |

---

## Friction points (prioritized)

| # | Issue | Severity | Mitigation (Phase 8) |
|---|-------|----------|---------------------|
| 1 | No trust signals above fold on registration | Medium | **`RegistrationTrustBar`** added |
| 2 | Deadline not visible on registration | Medium | Trust bar shows **31 Aug 2026** |
| 3 | Scale / social proof absent | Medium | Display count + institutions from `authority.ts` |
| 4 | Performance slows step 1 interaction | High | Deploy + script defer (Lighthouse plan) |
| 5 | reCAPTCHA latency on step 3 | Low | Required — keep |
| 6 | Email failure invisible to user | Low | Toast on success page (existing) |

---

## Phase 8 additions (implemented)

**Component:** `src/components/registration/RegistrationTrustBar.tsx`

Placed below `RegistrationProgress` in `RegistrationHub.tsx`:

- Official event + venue (SMK 6.0, NIT Hamirpur)
- Registration deadline urgency
- National participation scale (`NEXT_PUBLIC_DISPLAY_REGISTRATION_COUNT` or default `10,000+`)
- Institutions engaged (from `impactStatistics`)

**No changes to:** step flow, forms, Firestore schema, reCAPTCHA, or `CategoryStep` UI.

---

## Analytics alignment

Ensure GTM maps:

| Event | When |
|-------|------|
| `registration_started` | Step 1 → 2 |
| `registration_completed` | Successful submit |
| UTM fields | Firestore + GA4 custom dimensions |

---

## Recommended follow-ups (no redesign)

| Item | Effort |
|------|--------|
| Live registration count from Firestore (admin API) | Medium |
| Single testimonial line on step 1 | Low |
| “Secure · Official DHE event” badge near submit | Low |
| A/B test CTA copy on sticky bar | Ops |

---

## Success metrics

| KPI | Target (90 days post-launch) |
|-----|------------------------------|
| Registration start rate (sessions → step 2) | +15% vs baseline |
| Completion rate (step 2 → success) | +10% |
| Drop-off on step 3 | −10% |

Measure in GA4 funnel + admin registration exports.

---

## Related

- `src/app/registration/RegistrationHub.tsx`
- `src/lib/analytics/events.ts`
- `src/components/home/TrustStrip.tsx` (homepage trust — unchanged)
