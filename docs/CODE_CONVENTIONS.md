# Code Conventions — Shiksha Mahakumbh (rase)

Conventions for contributors and automated audit checks (Phase 10 items 110–119).

## Files and folders (110)

| Area | Convention |
|------|------------|
| App routes | `src/app/` — App Router, kebab-case segments for new pages (`contact-us`, `past-events`) |
| Legacy routes | `past_event/`, `proceeding1/` kept for SEO; canonical URLs use redirects in `src/config/legacy-redirects.js` |
| Components | `src/components/{domain}/` — grouped by feature (`home`, `admin`, `layout`, `analytics`) |
| Server logic | `src/server/services/` + `src/server/lib/` — no Prisma in route handlers |
| Shared lib | `src/lib/` — pure helpers, schemas (`lib/schemas/`), security, SEO |
| Scripts | `scripts/` — audits, seeds, CI helpers; prefix `test-security-phaseN.mjs` for audit gates |
| Docs | `docs/` — platform, deployment, go-live; keep README pointers updated |

## Route names (111)

- **New public routes:** lowercase kebab-case (`/media-center`, `/cookie-policy`).
- **Legacy aliases:** add 301 redirects in `legacy-redirects.js`, not duplicate page implementations.
- **Admin:** under `/admin` and `/admin/cms/*` with `noindex` layouts.
- **API:** canonical surface is `/api/v2/*`.

## APIs (112)

- Public and admin mutations use `createApiHandler` from `src/server/lib/api-handler.ts`.
- Validation via Zod schemas in `src/lib/schemas/` + `parseBody()` where applicable.
- Legacy shims under `/api/registration/*` and `/api/health` must carry `@deprecated` and proxy to v2.
- Rate limits, CSRF (`assertSameOrigin`), and captcha on public POST routes.

## Components (113)

- Prefer server components; add `"use client"` only for interactivity.
- Colocate feature-specific UI under `components/{feature}/`.
- Reusable primitives live in `components/ui/`.
- Admin CMS shared chrome in `components/admin/cms/AdminUi.tsx`.

## TypeScript (114)

- `strict: true` in `tsconfig.json` — no `any` without justification.
- Run `npm run typecheck` before push (also enforced in CI).
- Path alias `@/*` → `src/*` for all imports.

## ESLint (115)

- Config: `.eslintrc.json` extends `next/core-web-vitals`.
- Run `npm run lint` locally; CI runs on every push to `main`.
- Intentional native `<img>` for LCP/branding is allowed only in whitelisted files (see ESLint overrides).

## Dead code (116)

- Remove unused exports when refactoring; do not leave deprecated aliases without callers.
- Phase scripts flag misplaced helpers (e.g. SEO utilities belong in `lib/seo/`, not cookie modules).

## Duplicate routes (117)

- Do not create a new page if a redirect suffices.
- Legacy API paths remain as thin shims until clients migrate; document successor in JSDoc.

## Imports (118)

- Use `@/…` alias — avoid deep relative paths (`../../../`).
- Import types with `import type` when possible.

## Documentation (119)

- Root `README.md` — setup, scripts, architecture overview.
- `docs/platform/` — deep audits and runbooks.
- Update `.env.example` when adding env vars.
