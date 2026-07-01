# Monitoring & Reliability Architecture

## Layers

```
Browser → ErrorBoundary → reportError() → POST /api/client-error
                ↓
         Next.js app → GET /api/v2/health (minimal uptime)
                      GET /api/v2/status (detailed public probe)
                      GET /status (human-readable status page)
                ↓
         Supabase Postgres (Prisma) + Supabase Storage
                ↓
         External: Sentry DSN, GTM/GA4, Upstash Redis (rate limits)
```

## Implemented components

| Component | Path |
|-----------|------|
| Error boundary | `src/components/errors/ErrorBoundary.tsx` |
| Error reporting | `src/lib/monitoring/reportError.ts` |
| Client error API | `src/app/api/client-error/route.ts` (rate limited) |
| Health check (minimal prod) | `src/app/api/v2/health/route.ts` |
| Status probe (shared) | `src/lib/monitoring/service-status.ts` |
| Status JSON | `src/app/api/v2/status/route.ts` |
| Status page | `src/app/status/page.tsx` |
| Sentry | `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` |

## Sentry

Configured via `@sentry/nextjs`. Set `NEXT_PUBLIC_SENTRY_DSN` (or Vercel Sentry integration `SENTRY_DSN`).

Install helper: `npm run setup:sentry`

## Uptime monitoring

- Ping `https://www.rase.co.in/api/v2/health` every 1–5 min (expect `{ "status": "ok" }`).
- Optional deeper probe: `https://www.rase.co.in/api/v2/status` (database + ops flags, no secrets).
- Public page: `https://www.rase.co.in/status`

Alert rules: [`docs/devops/ALERTING.md`](devops/ALERTING.md)

## Analytics intelligence

- Client: attribution capture → sessionStorage
- Persisted on registration documents (UTM, device, language, …)
- Admin analytics dashboards under `/admin`

## Backup documentation

| Data | Method |
|------|--------|
| Postgres registrations | Supabase backups + PITR (project settings) |
| Admin exports | CSV/Excel from `/admin` |
| Storage uploads | Supabase Storage buckets |
| Static site | Git repository |

Drill: `npm run backup:drill`

## Incident response

1. Check `/api/v2/health` and `/status`
2. Review Vercel function logs + Sentry issues
3. Verify Supabase connectivity (`DATABASE_URL` pool vs `DIRECT_URL` for migrations)
4. Rollback deploy if needed — [`docs/devops/RUNBOOKS.md`](devops/RUNBOOKS.md)
