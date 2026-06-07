# Dependency Removal Log (Phase 2)

**Date:** 2026-06-04  
**Verified:** `npm run lint` (pass), `npm run build` (pass) after removals.

## Summary

| Metric | Before | After |
|--------|--------|-------|
| Packages removed (npm install) | — | **782** |
| Top-level dependencies (approx.) | ~57 | ~45 |
| `node_modules` audit size | larger | reduced |

## Removed packages

| Package | Reason | Risk |
|---------|--------|------|
| `@types/next` | Deprecated; Next 15 ships types | None |
| `latest` | Meta-package, no usage | None |
| `path` (npm) | Duplicates Node built-in | None |
| `buffer` | No imports in `src/` | Low — verify polyfill not required |
| `express` | No App Router usage | None |
| `cors` | Paired with express | None |
| `next-connect` | Legacy API pattern | None |
| `bcrypt` | No `src/` imports | None (Firebase admin auth) |
| `jsonwebtoken` | No `src/` imports | None |
| `sequelize` | No `src/` imports | None |
| `react-router-dom` | Next.js file routing | None |
| `react-share-social` | No active imports | None |
| `swiper` | No `src/` imports | None |

## DevDependencies removed

| Package | Reason |
|---------|--------|
| `@types/cors` | cors removed |
| `@types/express` | express removed |
| `@types/sequelize` | sequelize removed |
| `mysql2` | Only used by legacy `lib/db.ts` (stubbed) |

## Legacy stub

| File | Action |
|------|--------|
| `lib/db.ts` | Replaced with throw stub; excluded from app via `tsconfig` `include` scoped to `src/` |

## Kept (still used)

- `firebase`, `antd`, `react-slick`, `slick-carousel`, `react-responsive-carousel` (SlideShow), `axios` (datadekh pages), `recharts` (admin), `multer`, `formidable`, etc.

## Not removed (Phase 3 candidates)

- `antd` — registration legacy forms + noticeboard + admin
- `react-responsive-carousel` — home SlideShow
- `axios` — internal datadekh pages
- `ts-node` — may be used by scripts

## Rollback

```bash
git checkout package.json package-lock.json
npm install
```
