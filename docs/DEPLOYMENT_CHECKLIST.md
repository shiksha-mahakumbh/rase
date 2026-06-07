# Production Deployment Checklist — Shiksha Mahakumbh Web

## Pre-deploy

- [ ] `vercel.json` has **no** catch-all `"dest": "/"` routes (see `docs/PRODUCTION_DEPLOYMENT_AUDIT.md`)
- [ ] `npm run build` passes locally
- [ ] Environment variables set (see below)
- [ ] Firebase Firestore + Storage rules deployed
- [ ] reCAPTCHA keys for production domain
- [ ] `NEXT_PUBLIC_SITE_URL` matches canonical host

## Environment variables

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SITE_URL` | Yes |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Production registration |
| `RECAPTCHA_SECRET_KEY` | Server |
| `REGISTRATION_EMAIL_SECRET` | Email API |
| `RAZORPAY_WEBHOOK_SECRET` | Payments |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Admin bootstrap |
| `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA_ID` | Analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional monitoring |
| `SMTP_*` | Email delivery |

## Post-deploy verification

- [ ] `node scripts/production-smoke-test.mjs` → 10/10 pass
- [ ] `node scripts/validate-go-live.mjs` → 3/3 pass
- [ ] `GET /api/health` returns `{ status: "ok" }`
- [ ] Registration end-to-end (test record)
- [ ] Admin login + pagination
- [ ] `/knowledge` hub loads
- [ ] `/hi/registration` locale route
- [ ] Cookie consent → analytics loads
- [ ] datadekh routes return noindex / require admin cookie
- [ ] Lighthouse on `/`, `/registration`, `/introduction` (target 95+)

## Rollback

- Redeploy previous Vercel/hosting build artifact
- Firestore rules: revert in Firebase Console if registration breaks

## Backups

- Firestore: enable scheduled exports in Firebase Console
- Registration exports: admin CSV/Excel weekly
- Document backup policy: `docs/MONITORING_ARCHITECTURE.md`
