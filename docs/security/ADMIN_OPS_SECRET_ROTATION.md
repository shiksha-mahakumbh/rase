# ADMIN_OPS_SECRET rotation policy

**Scope:** `ADMIN_OPS_SECRET` — bearer token for `/api/v2/admin/*` and admin gateway proxy.

## When to rotate

- Before every major go-live or after any suspected leak
- At least every **90 days** in production
- Immediately if the secret appeared in logs, tickets, or chat

## Rotation procedure

1. Generate a new secret: `openssl rand -base64 32`
2. In Vercel → Project → Settings → Environment Variables:
   - Add `ADMIN_OPS_SECRET_NEW` with the new value (Preview first)
3. Deploy Preview; verify admin gateway login + one CMS write
4. Replace `ADMIN_OPS_SECRET` with the new value on Production
5. Redeploy Production; smoke-test `/admin` and a v2 admin API via gateway
6. Remove `ADMIN_OPS_SECRET_NEW` if used
7. Rotate `ADMIN_SESSION_SECRET` on the same schedule (invalidates admin cookies)

## Dual-key window (optional)

For zero-downtime rotation, temporarily accept both secrets in `admin-guard.ts` during a 24h window. Not enabled by default — enable only for scheduled maintenance.

## Session-only admin API (target state)

Browser clients must use Firebase session → `/api/admin/gateway/*` (server injects ops secret). Direct `x-ops-secret` / Bearer calls are for CI and emergency scripts only.

## Audit

Log admin gateway auth failures in Vercel logs. Review after each rotation.
