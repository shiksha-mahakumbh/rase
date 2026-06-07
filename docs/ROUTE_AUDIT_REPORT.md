# Route Audit Report — `src/app`

**Date:** 29 May 2026  
**Total `page.tsx` files:** 117

---

## Verified user-facing routes (exist in repo)

| Path | File | Under `[locale]`? |
|------|------|-------------------|
| `/` | `src/app/page.tsx` | Also `[locale]/page.tsx` |
| `/registration` | `src/app/registration/page.tsx` | Also `[locale]/registration/page.tsx` |
| `/introduction` | `src/app/introduction/page.tsx` | Also `[locale]/introduction/page.tsx` |
| `/ContactUs` | `src/app/ContactUs/page.tsx` | Also `[locale]/ContactUs/page.tsx` |
| `/gallery` | `src/app/gallery/page.tsx` | **No** |
| `/knowledge` | `src/app/knowledge/page.tsx` | **No** |
| `/pastevent` | `src/app/pastevent/page.tsx` | **No** |
| `/committeepage` | `src/app/committeepage/page.tsx` | **No** |
| `/media` | `src/app/media/page.tsx` | **No** |
| `/VibhagRoute/AcademicCouncil24` | `src/app/VibhagRoute/AcademicCouncil24/page.tsx` | **No** |

---

## `[locale]` segment (5 files only)

```
src/app/[locale]/layout.tsx
src/app/[locale]/page.tsx
src/app/[locale]/registration/page.tsx
src/app/[locale]/introduction/page.tsx
src/app/[locale]/ContactUs/page.tsx
```

**Implication:** Only these paths can be served under `/hi/`, `/fr/`, etc. All other URLs must resolve via **root-level** `src/app/*/page.tsx`.

---

## Architecture conflict (root cause)

| Pattern | Count |
|---------|------:|
| Root-level pages | 113+ |
| Localized duplicates | 4 |

`next-intl` middleware was applied to **every** non-API path and internally rewrote URLs to `/{locale}/…` (e.g. `/en/gallery`). Those files **do not exist** under `[locale]/`, producing **soft 404** (HTTP 200 + Next.js “404: This page could not be found” in RSC payload).

---

## Dynamic routes

| Pattern | Example |
|---------|---------|
| `[locale]` | `/hi`, `/hi/registration` |
| `[id]` | `/admin/registrations/[id]` |

---

## Missing / special cases

| Path | Status |
|------|--------|
| `/ContactUs` | Root + locale copies exist ✓ |
| `/conclave` vs `/committeepage` | Both exist; nav may link to one |

---

## Conflicting routes

| Conflict | Detail |
|----------|--------|
| `/` + `[locale]` home | Duplicate home implementations |
| `/introduction` + `[locale]/introduction` | Duplicate |
| `/registration` + `[locale]/registration` | Duplicate; registration appeared to “work” when nested 404 did not block shell |
| **Intl rewrite vs root pages** | **Primary production blocker** |

---

## Layouts

| Layout | Scope |
|--------|--------|
| `src/app/layout.tsx` | Root (all pages) |
| `src/app/[locale]/layout.tsx` | Locale-prefixed pages only |
| Various route `layout.tsx` | Press, knowledge, admin, etc. |

No `src/app/not-found.tsx` audit required for this incident; default Next 404 embedded in responses.
