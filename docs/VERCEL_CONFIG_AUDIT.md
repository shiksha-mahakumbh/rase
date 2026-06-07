# Vercel Configuration Audit

**Files:** `vercel.json`, `next.config.js`

---

## `vercel.json` (current)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

| Check | Status |
|-------|--------|
| Legacy `routes` catch-all `dest: "/"` | **Removed** (Phase 8) — was breaking `/api/health`, sitemap, robots |
| `builds` override | **Removed** — Vercel uses default Next.js build |
| Rewrites / redirects | **None** |
| Conflicts with App Router | **None** (current file) |

**This file is not the cause of route 404s** after the catch-all was removed.

---

## `next.config.js`

| Setting | Effect on routing |
|---------|-------------------|
| `withNextIntl(plugin)` | Loads i18n request config — does not block routes |
| `serverExternalPackages` (firebase) | Bundling only |
| `headers()` | Security headers only |
| `output: "export"` | **Not set** — server mode ✓ |
| `rewrites` / `redirects` | **None** |

---

## Deployment behavior

- App Router + middleware run on Vercel Node runtime ✓
- No static export that would drop dynamic routes ✓

---

## Related production issues (historical)

| Issue | Cause | Fixed |
|-------|-------|-------|
| Health/sitemap/robots return HTML | `vercel.json` catch-all | Yes |
| Pages show 404 content | next-intl middleware scope | Yes (`middleware.ts`) |

---

## Post-deploy

Redeploy after `middleware.ts` change; no `vercel.json` change required for routing fix.
