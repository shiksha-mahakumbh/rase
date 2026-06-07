# Build Route Report

**Source:** `.next/server/app-paths-manifest.json` (partial production build, May 2026)  
**Total routes in manifest:** 127

---

## Critical routes — generated ✓

| Route | Manifest entry |
|-------|----------------|
| `/` | `/page` |
| `/introduction` | `/introduction/page` |
| `/registration` | `/registration/page` |
| `/registration/success` | `/registration/success/page` |
| `/ContactUs` | `/ContactUs/page` |
| `/gallery` | `/gallery/page` |
| `/knowledge` | `/knowledge/page` |
| `/pastevent` | `/pastevent/page` |
| `/committeepage` | `/committeepage/page` |
| `/media` | `/media/page` |
| `/VibhagRoute/AcademicCouncil24` | `/VibhagRoute/AcademicCouncil24/page` |

---

## Locale routes — generated ✓

| Route | Manifest entry |
|-------|----------------|
| `/[locale]` | `/[locale]/page` |
| `/[locale]/registration` | `/[locale]/registration/page` |
| `/[locale]/introduction` | `/[locale]/introduction/page` |
| `/[locale]/ContactUs` | `/[locale]/ContactUs/page` |

**Not generated (expected):** `/[locale]/gallery`, `/[locale]/knowledge`, etc. — do not exist in source.

---

## API / metadata routes — generated ✓

| Route | Manifest entry |
|-------|----------------|
| `/api/health` | `/api/health/route` |
| `/sitemap.xml` | `/sitemap.xml/route` |
| `/robots.txt` | `/robots.txt/route` |

---

## Routes “missing” from `[locale]` (by design)

All paths in manifest under root `app/` (e.g. `/admin/page`, `/proceedings/page`) are **root-only**. They must **not** be rewritten by intl middleware.

---

## Dynamic routes

- `/admin/registrations/[id]`
- `/[locale]` (segment)

---

## Build note

Full `npm run build` may OOM on low-memory machines; manifest above confirms Next **does** emit expected routes when compile completes.

---

## Conclusion

Build output is correct. Production 404s were **runtime middleware rewrites**, not missing build entries.
