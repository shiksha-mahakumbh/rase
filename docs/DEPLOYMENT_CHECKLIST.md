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
| `RAZORPAY_KEY_ID` | Server — order creation |
| `RAZORPAY_KEY_SECRET` | Server — signature verify (never expose to client) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client — checkout modal (same as KEY_ID) |
| `RAZORPAY_WEBHOOK_SECRET` | Payments — async webhook |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Admin bootstrap |
| `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA_ID` | Analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional monitoring |
| `SMTP_*` | Email delivery |

## Vercel production cutover (FULL GO)

1. Deploy certified commit (`3380ce9` or latest certified `main`) with **build cache disabled**
2. Set Production environment variables (see table above + reCAPTCHA + webhook secret)
3. Redeploy after env changes
4. Run: `node scripts/production-go-live.mjs https://www.rase.co.in` → **9/9 PASS**
5. Run: `node scripts/launch-lighthouse.mjs https://www.rase.co.in` → Performance **≥ 90**

See `docs/FULL_GO_LAUNCH_CERTIFICATION.md` for full report.

## Post-deploy verification

- [ ] `node scripts/production-smoke-test.mjs` → 10/10 pass
- [ ] `node scripts/validate-go-live.mjs` → 3/3 pass
- [ ] `GET /api/health` returns `{ status: "ok" }`
- [ ] Registration end-to-end (test record)
- [ ] Razorpay checkout on `/registration` (paid category → Pay button → verify)

## Razorpay test mode (local / staging)

Use **test keys** (`rzp_test_*`) in `.env`. Standard Checkout test instruments:

| Method | Value |
|--------|-------|
| Card | `4111 1111 1111 1111` |
| CVV | `123` |
| Expiry | `12/26` (any future date) |
| UPI | `test@razorpay` |

**Flow:** `/registration` → paid category (e.g. Delegate Teacher ₹1000) → step 3 → **Pay** → complete modal → UTR auto-fills → submit.

**API check:** `POST /api/payments/create-order` with `{"amount":100000,"currency":"INR"}` should return `order_id`.
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
