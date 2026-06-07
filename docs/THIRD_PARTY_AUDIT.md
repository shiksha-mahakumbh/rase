# Third-Party Script Audit — Phase 8

**Files:** `RootClientShell.tsx`, `AnalyticsLoader.tsx`, `RecaptchaProvider`, `layout.tsx`

---

## Inventory

| Service | Loaded when | Script strategy | Blocking? |
|---------|-------------|-----------------|-----------|
| **Google Tag Manager** | Cookie accepted + `NEXT_PUBLIC_GTM_ID` | ~~afterInteractive~~ → **lazyOnload** (P8) | Was main-thread early |
| **GA4 (gtag)** | Cookie accepted, no GTM + `NEXT_PUBLIC_GA_ID` | **lazyOnload** (P8) | Same |
| **Microsoft Clarity** | Cookie + `NEXT_PUBLIC_CLARITY_ID` | **lazyOnload** (P8) | Session replay |
| **Meta Pixel** | Cookie + `NEXT_PUBLIC_META_PIXEL_ID` | **lazyOnload** (P8) | Facebook |
| **Google AdSense** | `NEXT_PUBLIC_ADSENSE_ENABLED=true` | `lazyOnload` | Off by default ✓ |
| **Botpress** | ~~Always~~ → `NEXT_PUBLIC_BOTPRESS_ENABLED=true` | `lazyOnload` | **Off by default** (P8) |
| **reCAPTCHA** | Registration routes only | `RecaptchaScript` | Required for submit |
| **react-hot-toast** | Bundled | — | Negligible |

---

## Duplicate / unused

| Issue | Status |
|-------|--------|
| GTM + GA4 both firing | **Prevented** — GA only if `!gtmId && gaId` |
| AdSense in layout + shell | Gated in shell only when enabled |
| Botpress duplicate inject | Two scripts (inject + config) — both needed; gated by env |
| Unused `react-router-dom` | Dependency may exist — **not loaded** in App Router pages |

---

## Estimated milliseconds saved (lab, first load)

Assumptions: mobile 4× CPU, post-consent analytics still load but later.

| Change | Est. TBT / LCP improvement |
|--------|---------------------------|
| Analytics `afterInteractive` → `lazyOnload` | **400–700 ms** |
| Botpress disabled by default | **300–600 ms** |
| AdSense already off | **0** (already) |
| **Combined Phase 8** | **~700–1300 ms** toward LCP/TBT |

*Re-measure with Lighthouse after deploy; values are estimates from script timing audits, not field data.*

---

## Consent & compliance

- Analytics: **no load** until `localStorage smk_cookie_consent === accepted` ✓
- AdSense: must follow same gate when enabled (documented in AdSense checklist)
- Botpress: recommend enabling only after privacy policy mentions chat vendor

---

## Env reference

| Variable | Default behavior |
|----------|------------------|
| `NEXT_PUBLIC_GTM_ID` | Load after consent, lazy |
| `NEXT_PUBLIC_GA_ID` | Fallback if no GTM |
| `NEXT_PUBLIC_CLARITY_ID` | Optional |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | Must be `true` to load ads |
| `NEXT_PUBLIC_BOTPRESS_ENABLED` | Must be `true` to load chat (P8) |

---

## Registration / SEO guardrails

- Do **not** load GTM/Clarity on `/api/*`
- reCAPTCHA only on registration — **keep**
- Do not move analytics to `beforeInteractive`

---

## Related

- `docs/LIGHTHOUSE_RECOVERY_PLAN.md`
- `src/components/analytics/AnalyticsLoader.tsx`
- `src/app/RootClientShell.tsx`
