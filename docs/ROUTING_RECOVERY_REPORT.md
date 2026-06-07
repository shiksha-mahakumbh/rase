# Routing Recovery Report

**Incident:** Most routes show “404: This page could not be found” while HTTP status may be 200.  
**Root cause:** `next-intl` middleware rewrote all URLs to `/{locale}/…` but only 4 routes exist under `src/app/[locale]/`.

---

## Root cause (exact)

| Item | Detail |
|------|--------|
| **File** | `src/middleware.ts` |
| **Behavior** | `intlMiddleware(request)` ran on every non-API path |
| **Effect** | Internal rewrite to locale-prefixed paths (e.g. `/en/gallery`) |
| **Failure** | No `src/app/[locale]/gallery/page.tsx` → Next.js `notFound` in response |
| **Why `/registration` seemed OK** | `src/app/[locale]/registration/page.tsx` exists + root `registration/page.tsx` |

---

## Fix applied (minimal)

**File changed:** `src/middleware.ts` only

```ts
const NON_DEFAULT_LOCALE_PREFIX = /^\/(hi|fr|es|ar)(\/|$)/;

function shouldRunIntlMiddleware(pathname: string): boolean {
  return NON_DEFAULT_LOCALE_PREFIX.test(pathname);
}

// …
if (!shouldRunIntlMiddleware(pathname)) {
  return NextResponse.next();
}
return intlMiddleware(request);
```

- **English/default URLs** → root `src/app/**` routes  
- **`/hi`, `/fr`, `/es`, `/ar` URLs** → `[locale]` segment + translations  

No UI, folder moves, or renames.

---

## Pre-fix production probe (evidence)

| Path | HTTP | Body |
|------|------|------|
| `/` | 200 | Contained `404: This page could not be found` |
| `/gallery` | 200 | Soft 404 |
| `/registration` | 200 | Soft 404 in RSC (shell sometimes visible) |

---

## Verification checklist (post-deploy)

Run after deploying `middleware.ts` fix:

| Check | Command / action | Expected |
|-------|------------------|----------|
| Home loads | Open `/` | Hero / शिक्षा महाकुंभ content, **no** 404 text |
| Introduction | `/introduction` | Authority / intro content |
| Contact | `/ContactUs` | Contact form |
| Gallery | `/gallery` | Gallery UI |
| Knowledge | `/knowledge` | Hub listing |
| Academic Council | `/VibhagRoute/AcademicCouncil24` | Council overview |
| Registration | `/registration` | Wizard step 1 |
| Localized | `/hi/registration` | Hindi registration |
| Sitemap | `npm run validate:go-live` | XML pass |
| Robots | `npm run validate:go-live` | Text pass |
| API health | `npm run validate:go-live` | JSON pass |
| Smoke suite | `npm run smoke:prod` | 10/10 |

### Automated body check (optional)

```powershell
$body = curl.exe -sS "https://www.rase.co.in/gallery"
$body -notmatch '404: This page could not be found'
```

---

## Related audits

- `docs/ROUTE_AUDIT_REPORT.md`
- `docs/I18N_ROUTE_AUDIT.md`
- `docs/MIDDLEWARE_AUDIT.md`
- `docs/VERCEL_CONFIG_AUDIT.md`
- `docs/BUILD_ROUTE_REPORT.md`
- `docs/PRODUCTION_DEPLOYMENT_AUDIT.md` (separate vercel catch-all issue)

---

## Deploy instruction

1. Commit `src/middleware.ts`
2. Push → Vercel production deploy
3. Run verification checklist above
