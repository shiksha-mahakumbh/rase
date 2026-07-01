# Secrets management

How production secrets are stored, verified, and rotated for **rase.co.in**.

## Storage model

| Surface | Where secrets live | Never commit |
|---------|-------------------|--------------|
| Production runtime | Vercel → Project → Environment Variables | `.env`, `.env.local` |
| CI / migrations | GitHub Actions secrets (`DATABASE_URL`, `DIRECT_URL`, deploy tokens) | workflow logs |
| Local development | `.env.local` (gitignored) | repository |

Template only: [`.env.example`](../../.env.example). Verify locally:

```bash
npm run verify:env
npm run audit:secrets
```

## Secret groups

| Group | Keys | Rotation owner |
|-------|------|----------------|
| Admin ops | `ADMIN_OPS_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_GATEWAY_SIGNING_SECRET` | Platform admin |
| Registration | `REGISTRATION_LOOKUP_SECRET`, `REGISTRATION_UPLOAD_SECRET`, `NEWSLETTER_TOKEN_SECRET` | Platform admin |
| Payments | `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Finance + DevOps |
| Email | `SMTP_PASS` / `BREVO_SMTP_PASS`, `REGISTRATION_EMAIL_SECRET` | Comms admin |
| Cron | `CRON_SECRET` | DevOps |
| Observability | `NEXT_PUBLIC_SENTRY_DSN`, Sentry auth token (Vercel integration) | DevOps |
| Rate limits | `UPSTASH_REDIS_REST_TOKEN` | DevOps |

## Rotation procedure

1. Generate a new random value (32+ bytes, base64url or hex).
2. Update **Preview** env first → deploy preview → smoke test.
3. Update **Production** → redeploy → run `npm run test:smoke`.
4. Revoke old webhook secrets (Razorpay) or invalidate old cron bearer where applicable.

Detailed admin ops rotation: [`docs/security/ADMIN_OPS_SECRET_ROTATION.md`](../security/ADMIN_OPS_SECRET_ROTATION.md).

## Client exposure rules

- Only `NEXT_PUBLIC_*` variables may appear in browser bundles.
- Server secrets (`ADMIN_*`, `RAZORPAY_KEY_SECRET`, SMTP passwords) must stay in server routes and `process.env` on the server only.
- Health and status endpoints expose **boolean configured flags**, never secret values.

## GitHub / Vercel references

- [`.github/DEPLOY_SECRETS.md`](../../.github/DEPLOY_SECRETS.md) — deploy tokens and production env checklist
- [`docs/prisma/DATABASE_OPS.md`](../prisma/DATABASE_OPS.md) — `DATABASE_URL` / `DIRECT_URL` for migrations

## Incident: suspected leak

1. Rotate affected secret immediately (see group above).
2. Run `npm run audit:secrets` and review CI `test:security` output.
3. Check Sentry / Vercel logs for abnormal admin or payment activity.
4. Document timeline in [`MONITORING_RUNBOOK.md`](../MONITORING_RUNBOOK.md).
