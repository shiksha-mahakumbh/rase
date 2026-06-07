# i18n Route Audit — next-intl

**Files:** `src/i18n/config.ts`, `routing.ts`, `request.ts`, `src/middleware.ts`, `next.config.js` (plugin)

---

## Configuration

| Setting | Value |
|---------|--------|
| Locales | `en`, `hi`, `fr`, `es`, `ar` |
| Default | `en` |
| `localePrefix` | `as-needed` |
| Plugin | `createNextIntlPlugin("./src/i18n/request.ts")` |

---

## `[locale]` segment coverage

Only **4** user routes exist under `src/app/[locale]/`:

- `/` (home)
- `/registration`
- `/introduction`
- `/ContactUs`

All **other** public URLs live at **root** `src/app/<route>/page.tsx` (110+ pages).

---

## What `createIntlMiddleware` did (before fix)

For **every** matched path, middleware rewrote the request to include a locale segment (e.g. internal path like `/en/gallery`).

| URL requested | Internal target | Result |
|---------------|-----------------|--------|
| `/gallery` | `/en/gallery` (no file) | **404** in RSC |
| `/knowledge` | `/en/knowledge` (no file) | **404** |
| `/registration` | `/en/registration` OR `[locale]/registration` | Partial render / user saw “working” |
| `/hi/registration` | `[locale]/registration` | OK |

Production symptom: **HTTP 200** with embedded `"404: This page could not be found"` (soft 404).

---

## Redirect loops

**None observed.** Issue was rewrite to non-existent `[locale]/…` pages, not infinite redirects.

---

## Route masking

The dynamic segment `[locale]` **masked** root routes: middleware sent traffic to locale-prefixed paths that were never implemented for 95% of the site.

---

## Fix (Phase 8 routing recovery)

Run `intlMiddleware` **only** when pathname starts with `/hi`, `/fr`, `/es`, or `/ar`.

Default English URLs (`/`, `/gallery`, `/introduction`, etc.) use **`NextResponse.next()`** and resolve to root `src/app/**` pages.

**File changed:** `src/middleware.ts` — `shouldRunIntlMiddleware()` + early `NextResponse.next()`.

---

## Localized routes after fix

| URL | Handler |
|-----|---------|
| `/hi`, `/hi/registration`, … | `intlMiddleware` → `[locale]/*` |
| `/`, `/gallery`, `/admin`, … | Root app routes (no intl rewrite) |

---

## hreflang / pathnames

`pathnames` not configured in `routing.ts` — acceptable for current hybrid model.
