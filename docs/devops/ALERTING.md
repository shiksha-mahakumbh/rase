# Alerting

Alert channels and thresholds for **rase.co.in** (Vercel + Supabase + Razorpay).

## 1. Uptime / availability

| Signal | Source | Threshold | Action |
|--------|--------|-----------|--------|
| Health probe | `GET /api/v2/health` | Non-200 or `status !== "ok"` for 3 checks | Page on-call; run [`MONITORING_RUNBOOK.md`](../MONITORING_RUNBOOK.md) |
| Status probe | `GET /api/v2/status` | `checks.database === "error"` | Check Supabase status + `DATABASE_URL` pool |
| Public status page | `/status` | Manual comms if degraded > 30 min | Homepage banner (comms team) |

Recommended external monitor: Better Stack, UptimeRobot, or Vercel Observability — 1–5 minute interval.

## 2. Error rate (Sentry)

| Alert | Condition | Route |
|-------|-----------|-------|
| New issue spike | >10 events / 5 min on `production` | Sentry → Alerts → Slack/email |
| Registration API failures | Issue tag `registration` or URL `/api/v2/registration/submit` | Sentry alert rule |
| Admin gateway 5xx | URL prefix `/api/v2/admin` | Sentry alert rule |

Setup: Vercel Sentry integration or `npm run setup:sentry`. DSN: `NEXT_PUBLIC_SENTRY_DSN`.

Sample rates: `tracesSampleRate: 0.1` in `sentry.*.config.ts`.

## 3. CI / deploy failures

| Signal | Where | Action |
|--------|-------|--------|
| `quality` job failed | GitHub Actions → CI workflow | Fix lint/typecheck/security/build before merge |
| Vercel deploy error | Vercel dashboard / `check-vercel-deploy.mjs` | Roll back or redeploy previous promotion |
| Post-deploy smoke failed | CI step `Production smoke test` | Treat as S1/S2 per runbook |

Enable GitHub notifications: **Watch** repository → Actions failures.

## 4. Payments & webhooks

| Signal | Where | Action |
|--------|-------|--------|
| Razorpay webhook failures | Razorpay Dashboard → Webhooks | Verify `RAZORPAY_WEBHOOK_SECRET`; check `/api/payments/razorpay-webhook` logs |
| Captured payment, stale registration | Admin registrations list | Use orphan reconciliation tools; see Phase 4 payment runbook |

## 5. Database & cron

| Signal | Where | Action |
|--------|-------|--------|
| Supabase outage | [status.supabase.com](https://status.supabase.com) | Pause writes; communicate degradation |
| Cron 401/503 | Vercel cron logs for `/api/cron/*` | Verify `CRON_SECRET` bearer matches Vercel env |
| Retention job errors | Sentry / Vercel function logs | Re-run manually with authorized bearer |

## 6. Escalation

See severity table in [`MONITORING_RUNBOOK.md`](../MONITORING_RUNBOOK.md).

| Level | Example | Target response |
|-------|---------|-----------------|
| S1 | Registration submit down nationally | < 15 min |
| S2 | Email or payments broken | < 1 h |
| S3 | Analytics/monitoring degraded | < 24 h |

## Related

- [`MONITORING_ARCHITECTURE.md`](../MONITORING_ARCHITECTURE.md)
- [`docs/devops/RUNBOOKS.md`](./RUNBOOKS.md)
