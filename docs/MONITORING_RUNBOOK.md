# Monitoring & Incident Response Runbook

Operational guide for production incidents. Architecture detail: `docs/MONITORING_ARCHITECTURE.md`.

**On-call first step:** `GET https://www.rase.co.in/api/health` → expect JSON `{ "status": "ok" }`.

---

## Severity levels

| Level | Definition | Response time |
|-------|------------|---------------|
| S1 | Registration down nationally | &lt; 15 min |
| S2 | Email or payments broken | &lt; 1 h |
| S3 | Analytics/SEO/monitoring degraded | &lt; 24 h |
| S4 | Cosmetic / non-critical | Next business day |

---

## 1. Registration failure response (S1)

### Symptoms

- Users cannot submit step 3
- Firestore permission errors in browser console
- Spike in `/api/client-error` or support tickets

### Diagnosis

1. Health check + hosting status (Vercel/host panel).
2. Browser DevTools → Network on `saveRegistration` / Firestore writes.
3. Firebase Console → Firestore → **Usage** and **Rules** simulator.
4. Test one registration with admin account observing new doc in `registrations`.

### Common causes & fixes

| Cause | Fix |
|-------|-----|
| Rules not deployed or too strict | Republish `firebase/firestore.rules`; test `validRegistrationCreate()` |
| `registrationCounters` write blocked | Use documented counter path; temporary admin-only increment if emergency |
| reCAPTCHA misconfigured | Verify production domain keys |
| Client bundle error | Rollback deploy; check `client-error` payloads |

### Communication

- Status: internal WhatsApp/email to DHE coordinators
- User-facing: homepage banner only if outage &gt; 30 min

### Do not

- Disable reCAPTCHA in production without approval
- Open Firestore rules to public read on registrations

---

## 2. Email outage response (S2)

### Symptoms

- Registrations succeed but no confirmation email
- `/api/registration/send-email` returns 5xx/429

### Diagnosis

1. Hosting logs for send-email route.
2. Verify `SMTP_*` and `REGISTRATION_EMAIL_SECRET`.
3. Send test via admin or staging registration.

### Fix

| Issue | Action |
|-------|--------|
| SMTP credentials expired | Rotate password; update env; redeploy |
| Rate limit tripped | Wait window; investigate abuse IP |
| Secret mismatch | Align `REGISTRATION_EMAIL_SECRET` header between client and server |

**Note:** Registration **by design** still completes if email fails — export CSV from admin and send manual confirmations if prolonged outage.

---

## 3. Razorpay webhook failure response (S2)

### Symptoms

- Razorpay dashboard shows webhook failures
- Payments captured but admin status stale

### Diagnosis

1. Razorpay → Webhooks → logs for `https://www.rase.co.in/api/payments/razorpay-webhook`
2. Verify `RAZORPAY_WEBHOOK_SECRET` matches dashboard
3. Check response code (401 = signature, 503 = secret missing, 429 = rate limit)

### Fix

| Issue | Action |
|-------|--------|
| Wrong secret | Update env; redeploy |
| URL not reachable | Fix DNS/hosting |
| 200 but no Firestore update | **Known gap** — reconcile payments manually in admin until sync is implemented |

---

## 4. Firebase quota monitoring

### Watch (Firebase Console → Usage)

| Metric | Warning sign |
|--------|----------------|
| Firestore reads/writes | Spike during campaign |
| Storage bandwidth | Large registration uploads |
| Auth | Admin login failures |

### Actions

- Enable billing alerts
- Admin: paginated queries only (already implemented)
- Archive old test registrations to separate collection (policy decision)

---

## 5. Backup procedures

| Data | Method | Frequency |
|------|--------|-----------|
| Firestore `registrations` | Scheduled export → GCS | Daily (configure in Console) |
| Admin exports | CSV/Excel from `/admin` | Weekly minimum |
| Rules & code | Git `rase` repository | Continuous |
| Static assets | `public/` in repo + CDN cache | On release |

**Restore test:** Quarterly restore drill from GCS export to staging project.

---

## 6. Rollback procedures

1. **Hosting:** Redeploy previous production build (Vercel → Deployments → Promote).
2. **Firestore rules:** Console → Rules → **Revert** to last known good version if registration broke after rules change.
3. **Env:** Roll back only changed variables; never delete `NEXT_PUBLIC_SITE_URL` mid-incident.
4. **Verify:** `node scripts/validate-go-live.mjs` + one test registration.

**Post-incident:** Log timeline in internal doc; update this runbook if new failure mode found.

---

## 7. Client errors & optional Sentry

| Path | Purpose |
|------|---------|
| `ErrorBoundary` | UI catch |
| `POST /api/client-error` | Rate-limited beacon |
| Sentry (optional) | Install `@sentry/nextjs` + `NEXT_PUBLIC_SENTRY_DSN` |

**Triage:** Group by `message` + `url` in logs; prioritize registration and admin paths.

---

## 8. Admin dashboard health

- `/admin` → System Health panel (`AdminSystemHealth`)
- Growth/analytics panels for attribution anomalies

---

## Contacts (fill in)

| Role | Contact |
|------|---------|
| Hosting admin | |
| Firebase owner | |
| DHE communications | |
| Razorpay account owner | |

---

## Related

- `docs/GO_LIVE_VALIDATION_REPORT.md`
- `docs/DEPLOYMENT_CHECKLIST.md`
- `scripts/validate-go-live.mjs`
