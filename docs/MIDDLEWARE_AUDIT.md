# Middleware Audit — `src/middleware.ts`

---

## Matcher

```ts
"/((?!api|_next|_vercel|.*\\..*).*)"
```

| Path type | Matched? |
|-----------|----------|
| `/api/health` | **No** (excluded `api`) ✓ |
| `/sitemap.xml`, `/robots.txt` | **No** (dot in path) ✓ |
| `/gallery`, `/introduction` | **Yes** |
| Static files `*.js`, `*.png` | **No** |

Additional explicit matchers for datadekh/admin paths.

---

## Execution order

1. **Protected datadekh paths** → session check or redirect to `/admin`
2. **`/admin`** → pass through + `X-Robots-Tag` if needed
3. **Intl** (after fix: only `/hi|fr|es|ar…`) → `createIntlMiddleware`
4. **All other paths** → `NextResponse.next()` (root App Router)

---

## Redirects

| Trigger | Destination |
|---------|-------------|
| Datadekh without `ADMIN_SESSION_COOKIE` | `/admin?redirect=…` |

No other redirects in middleware.

---

## Rewrites

**None defined in middleware.** Rewrites came from **next-intl** inside `intlMiddleware` (now scoped).

---

## Locale handling (after fix)

```ts
const NON_DEFAULT_LOCALE_PREFIX = /^\/(hi|fr|es|ar)(\/|$)/;
```

| Path | Intl middleware |
|------|-----------------|
| `/registration` | Skipped → `app/registration/page.tsx` |
| `/hi/registration` | Applied → `app/[locale]/registration/page.tsx` |

---

## Admin handling

Unchanged — admin and datadekh prefixes bypass intl when not locale-prefixed.

---

## Root cause contribution

**100% of public soft-404s** for root-only pages were caused by applying `intlMiddleware` globally before the Phase 8 guard.
