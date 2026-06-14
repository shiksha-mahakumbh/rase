# Build Stability Report — Phase 6

**Date:** 2026-05-29  
**Project:** Shiksha Mahakumbh / RASE (`rase`)  
**Environment tested:** Local (Windows 11, OneDrive-synced workspace)

---

## Verdict: **PASS** (with OneDrive mitigation required)

Local production build completes successfully after clearing file locks. Root cause of prior hangs identified and mitigated.

---

## Issue Investigation — `npm run build` Hanging

### Symptoms

- Build stalled after `▲ Next.js 15.0.7` with no further output for 12+ minutes
- Or stalled at `Collecting build traces ...` indefinitely
- `node scripts/clean-next-cache.js` failed with `EPERM: operation not permitted, lstat '.next\trace'`
- `npx prisma generate` failed with `EPERM` renaming `query_engine-windows.dll.node`

### Root Cause

**OneDrive file sync + concurrent Node processes** lock artifacts under:

- `.next/trace` (Next.js build telemetry)
- `node_modules/.prisma/client/query_engine-windows.dll.node`

When `next dev` or a prior hung `next build` holds handles, OneDrive prevents deletion/rename → clean fails → subsequent builds hang waiting on locked cache.

### Contributing Factors

| Factor | Impact |
|--------|--------|
| Workspace on OneDrive (`Desktop\rase.co.in`) | High — sync locks during build |
| Background `next dev` / stale build PID | High — holds `.next/trace` |
| Multiple Node processes (8 observed) | Medium |
| Next.js 15 trace collection phase | Medium — writes `.next/trace` at end |

### Resolution Applied

1. Stop all Node processes: `Get-Process node | Stop-Process -Force`
2. Remove `.next`: `node scripts/clean-next-cache.js`
3. Set `NEXT_TELEMETRY_DISABLED=1`
4. Run `npx prisma generate && npm run build`

**Result:** Build completed in **~346 seconds**, exit code **0**.

---

## Verification Matrix

| Check | Command / Method | Result | Notes |
|-------|------------------|--------|-------|
| Clean cache | `node scripts/clean-next-cache.js` | PASS (after stopping Node) | Enhanced script with rename fallback |
| Prisma schema | `npx prisma validate` | PASS | Schema valid |
| Prisma client | `npx prisma generate` | PASS | v6.19.3, 1.46s |
| Production build | `npm run build` | PASS | 353 static pages generated |
| Build artifact | `.next/BUILD_ID` | PASS | `4i4SBlCD_00hBQg1e-Hjb` |
| Sitemap artifact | `.next/server/app/sitemap.xml` | PASS | Generated at build time |
| TypeScript + lint | Included in `next build` | PASS | No compile errors |
| Automated tests | `npm run test` | PASS | 32/32 security + analytics tests |
| Static export | N/A | **Not applicable** | App uses SSR/SSG on Vercel, not `output: 'export'` |
| Vercel build | Production smoke | PASS | 10/10 probes on live site (prior deploy) |

---

## Build Output Summary

```
✓ Compiled successfully
✓ Generating static pages (353/353)
✓ Finalizing page optimization
✓ Collecting build traces
exit_code: 0
```

Route types: `○` Static, `●` SSG, `ƒ` Dynamic (API + server routes)

---

## Mitigations Added (Phase 6)

### `scripts/clean-next-cache.js`

- Optional `--kill-node` flag to stop Windows Node processes before clean
- Rename-to-stale fallback when OneDrive blocks direct delete
- Increased retry count (8 × 300ms)

### `package.json`

```json
"build:clean": "node scripts/clean-next-cache.js && next build"
```

---

## Recommended Developer Workflow

### Before every production build (OneDrive machines)

```powershell
# 1. Stop dev server (Ctrl+C in terminal running next dev)
# 2. Or force-stop all Node:
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 3. Clean + build
cd c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase
$env:NEXT_TELEMETRY_DISABLED = "1"
npm run build:clean
```

### Long-term (recommended)

| Option | Benefit |
|--------|---------|
| Move repo outside OneDrive (e.g. `C:\dev\rase`) | Eliminates EPERM on `.next` |
| Exclude `.next/` and `node_modules/` from OneDrive sync | Reduces lock contention |
| Use Vercel remote builds as source of truth | Local build optional for dev |

---

## Vercel Build Notes

- `vercel.json` specifies `"framework": "nextjs"` — standard Next.js build on deploy
- `postinstall`: `prisma generate` runs automatically on Vercel (no OneDrive issue)
- Live production (`shikshamahakumbh.com`) passes health, sitemap, registration probes

**Action:** Deploy latest commit (Phase 5B paths: `/abhiyan`, edition-based media) to align production with local build.

---

## Blockers

| ID | Severity | Item | Action |
|----|----------|------|--------|
| B1 | Medium | OneDrive EPERM on local builds | Use workflow above or relocate repo |
| B2 | Low | Prisma `package.json#prisma` deprecation warning | Migrate to `prisma.config.ts` before Prisma 7 |

**No build blockers for Vercel deployment.**
