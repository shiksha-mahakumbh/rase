# Monitoring & Incident Response Runbook

Operational guide for production incidents on **rase.co.in** (Vercel + Supabase + Razorpay).

Architecture: [`MONITORING_ARCHITECTURE.md`](MONITORING_ARCHITECTURE.md)  
Alerts: [`docs/devops/ALERTING.md`](devops/ALERTING.md)

**On-call first step:** `GET https://www.rase.co.in/api/v2/health` → expect `{ "status": "ok" }`.  
**Detailed probe:** `GET https://www.rase.co.in/api/v2/status` or open `/status`.

---

## Severity levels

| Level | Definition | Response time |
|-------|------------|---------------|
| S1 | Registration down nationally | < 15 min |
| S2 | Email or payments broken | < 1 h |
| S3 | Analytics/SEO/monitoring degraded | < 24 h |
| S4 | Cosmetic / non-critical | Next business day |

---

## 1. Registration failure response (S1)

### Symptoms

- Users cannot complete registration submit
- Spike in `/api/client-error` or Sentry on `/api/v2/registration/submit`
- Support tickets referencing payment or validation errors

### Diagnosis

1. `/api/v2/health` and `/status` (database row).
2. Browser DevTools → Network on `POST /api/v2/registration/submit`.
3. Supabase dashboard → Database health, connection pool saturation.
4. Admin test registration with observer on new Prisma row.

### Common causes & fixes

| Cause | Fix |
|-------|-----|
| Database unreachable | Verify `DATABASE_URL` on Vercel; check Supabase status |
| reCAPTCHA misconfigured | Verify production domain keys |
| Razorpay verify failure | Check keys + webhook secret; see payment section |
| Deploy regression | Roll back Vercel deployment; run `npm run test:smoke` |

### Communication

- Internal: coordinator WhatsApp/email
- User-facing: homepage banner only if outage > 30 min

---

## 2. Email outage response (S2)

### Symptoms

- Registrations succeed but no confirmation email
- `/api/v2/registration/send-email` or SMTP routes return 5xx/429

### Diagnosis

1. Vercel logs for email routes.
2. Verify `BREVO_SMTP_*` or `SMTP_*` credentials via `npm run verify:env`.
3. Staging send test.

### Fix

| Issue | Action |
|-------|--------|
| SMTP credentials expired | Rotate password; update Vercel env; redeploy |
| Rate limit tripped | Investigate abuse IP; Upstash counters |
| Template/runtime error | Check Sentry; rollback if recent deploy |

**Note:** Registration may still complete if email fails — export CSV from admin for manual follow-up during prolonged outage.

---

## 3. Razorpay webhook failure response (S2)

### Symptoms

- Razorpay dashboard shows webhook failures
- Payments captured but registration payment status stale

### Diagnosis

1. Razorpay → Webhooks → logs for `https://www.rase.co.in/api/payments/razorpay-webhook`
2. Verify `RAZORPAY_WEBHOOK_SECRET` matches dashboard
3. Check response code (401 = signature, 503 = secret missing, 429 = rate limit)

### Fix

| Issue | Action |
|-------|--------|
| Wrong secret | Update env; redeploy |
| URL not reachable | Fix DNS/Vercel deployment |
| Processing error | Check Sentry + admin orphan reconciliation tools |

---

## 4. Supabase / database monitoring

### Watch

| Metric | Warning sign |
|--------|----------------|
| Connection pool saturation | Timeouts on registration submit |
| Storage bandwidth | Large upload campaigns |
| Auth (admin) | Admin login failures |

### Actions

- Enable Supabase billing/usage alerts
- Use paginated admin queries only
- Run retention cron (`/api/cron/analytics-retention`) — requires `CRON_SECRET`

---

## 5. Backup procedures

| Data | Method | Frequency |
|------|--------|-----------|
| Postgres | Supabase backups / PITR | Continuous (plan-dependent) |
| Admin exports | CSV/Excel from `/admin` | Weekly minimum |
| Rules & code | Git `rase` repository | Continuous |
| Static assets | `public/` in repo + CDN cache | On release |

**Restore test:** `npm run backup:drill` quarterly.

---

## 6. Rollback procedures

1. **Hosting:** Vercel → Deployments → Promote previous production build.
2. **Database:** Avoid destructive rollback; use forward migrations only (`npm run db:migrate:deploy`).
3. **Env:** Roll back only changed variables; never delete `NEXT_PUBLIC_SITE_URL` mid-incident.
4. **Verify:** `npm run test:smoke` + one test registration.

**Post-incident:** Log timeline internally; update [`docs/devops/RUNBOOKS.md`](devops/RUNBOOKS.md) if new failure mode found.

---

## 7. Client errors & Sentry

| Path | Purpose |
|------|---------|
| `ErrorBoundary` | UI catch |
| `POST /api/client-error` | Rate-limited beacon |
| Sentry (`NEXT_PUBLIC_SENTRY_DSN`) | Production error grouping |

**Triage:** Group by `message` + `url` in Sentry; prioritize registration and admin paths.

---

## 8. Admin dashboard health

- `/admin` → System Health panel (`AdminSystemHealth`)
- Growth/analytics panels for attribution anomalies

---

## Contacts (fill in)

| Role | Contact |
|------|---------|
| Vercel admin | |
| Supabase owner | |
| DHE communications | |
| Razorpay account owner | |

---

## Related

- [`docs/devops/RUNBOOKS.md`](devops/RUNBOOKS.md)
- [`docs/VERCEL_PRODUCTION_RELEASE_RUNBOOK.md`](VERCEL_PRODUCTION_RELEASE_RUNBOOK.md)
- [`scripts/validate-go-live.mjs`](../scripts/validate-go-live.mjs)
