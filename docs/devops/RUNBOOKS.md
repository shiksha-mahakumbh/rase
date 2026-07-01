# DevOps runbooks index

Operational documents for deploy, incidents, and recovery.

| Runbook | Purpose |
|---------|---------|
| [MONITORING_RUNBOOK.md](../MONITORING_RUNBOOK.md) | Incident response (registration, email, payments, rollback) |
| [MONITORING_ARCHITECTURE.md](../MONITORING_ARCHITECTURE.md) | Observability layers and probes |
| [ALERTING.md](./ALERTING.md) | Alert thresholds and Sentry/uptime rules |
| [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) | Env vars, rotation, leak response |
| [DOCKER.md](./DOCKER.md) | Container build/run for local parity |
| [VERCEL_PRODUCTION_RELEASE_RUNBOOK.md](../VERCEL_PRODUCTION_RELEASE_RUNBOOK.md) | Production release gate |
| [platform/FINAL_DEPLOYMENT_PLAYBOOK.md](../platform/FINAL_DEPLOYMENT_PLAYBOOK.md) | Rollback and deployment strategy |
| [SMOKE_TEST_PLAYBOOK.md](../SMOKE_TEST_PLAYBOOK.md) | HTTP smoke probes after deploy |
| [.github/DEPLOY_SECRETS.md](../../.github/DEPLOY_SECRETS.md) | GitHub Actions ↔ Vercel secrets |

## Quick commands

```bash
npm run verify:env          # required env presence (no values printed)
npm run audit:secrets       # static secret leak scan
npm run test:smoke          # production HTTP smoke (pass base URL optional)
npm run validate:go-live    # go-live validation bundle
npm run backup:drill        # backup/restore drill script
```

## Status endpoints

- Human: `/status`
- JSON: `/api/v2/status`
- Minimal health: `/api/v2/health`
