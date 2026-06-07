# Monitoring & Reliability Architecture

## Layers

```
Browser → ErrorBoundary → reportError() → POST /api/client-error
                ↓
         Next.js app → GET /api/health (uptime probes)
                ↓
         Firebase (Firestore writes, rules)
                ↓
         External: GTM/GA4, optional Sentry DSN
```

## Implemented (Phase 5)

| Component | Path |
|-----------|------|
| Error boundary | `src/components/errors/ErrorBoundary.tsx` |
| Error reporting | `src/lib/monitoring/reportError.ts` |
| Client error API | `src/app/api/client-error/route.ts` (rate limited) |
| Health check | `src/app/api/health/route.ts` |

## Sentry (optional)

1. `npm install @sentry/nextjs --legacy-peer-deps`
2. Run Sentry Next.js wizard or add `sentry.client.config.ts` / `instrumentation.ts`
3. Set `NEXT_PUBLIC_SENTRY_DSN` and server DSN in hosting env

Until installed, errors are logged in development and accepted by `/api/client-error` for forwarding hooks.

## Uptime monitoring

- Ping `https://www.rase.co.in/api/health` every 1–5 min (UptimeRobot, Better Stack, etc.)
- Alert on non-200 or `status !== "ok"`

## Analytics intelligence

- Client: `captureAttribution()` → sessionStorage
- Persisted on registration documents (`utmSource`, `deviceType`, `browserLanguage`, …)
- Admin: `AdminAnalyticsIntelligence` dashboards

## Backup documentation

| Data | Method |
|------|--------|
| Firestore `registrations` | Firebase scheduled export → GCS |
| Admin CSV export | Manual weekly from `/admin` |
| Static site | Git repository |

## Incident response

1. Check `/api/health`
2. Review hosting logs + `client-error` payloads
3. Verify Firebase rules not blocking `create` on registrations
4. Rollback deploy if needed (`DEPLOYMENT_CHECKLIST.md`)
