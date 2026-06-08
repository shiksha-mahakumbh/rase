# Vercel Production Release Runbook — FULL GO

**Target:** https://www.rase.co.in  
**Release gate script:** `node scripts/production-go-live.mjs`  
**Lighthouse script:** `node scripts/launch-lighthouse.mjs https://www.rase.co.in`

---

## CRITICAL: Commit vs certified build

| Item | `3380ce9` (HEAD / origin/main) | Working tree (certified locally) |
|------|----------------------------------|----------------------------------|
| `/glimpses` page | **Does not exist** | `src/app/glimpses/page.tsx` |
| Sitemap +3 URLs | **No** (`glimpses`, `accommodation`, `coming-soon`) | **Yes** (107 URLs) |
| PublicPageShell migrations | Partial | Complete |
| Razorpay / registration updates | Partial | Complete |

**Deploying only `3380ce9` from Git will NOT fix `/glimpses` 404 or sitemap 107.**

### Required before Vercel Git deploy

```bash
# 1. Review uncommitted certification work
git status
git diff --stat

# 2. Stage certification changes (exclude .env)
git add -A
git reset HEAD .env   # never commit secrets

# 3. Commit (you approve message)
git commit -m "Promote production certification: glimpses, shell, sitemap, payments, registration"

# 4. Push to origin/main (triggers Vercel if connected)
git push origin main

# 5. Confirm remote HEAD
git log origin/main -1 --oneline
```

Alternative: **Vercel CLI deploy from local folder** after `npm run build` (deploys working tree, not Git SHA).

---

## Phase 1 — Local verification

```bash
cd rase
git rev-parse HEAD          # was 3380ce9 — update after commit
git log -3 --oneline
git status --short

npm ci
npm run build               # expect: 206 static pages
npx tsc --noEmit            # expect: pass
```

---

## Phase 2 — Vercel production deployment

### Dashboard procedure

1. **Vercel** → Project `rase` (or linked repo)
2. **Settings → Git** → confirm Production Branch = `main`
3. **Deployments** → latest → **⋯** → **Redeploy**
4. **Uncheck** “Use existing Build Cache”
5. Watch build log for:
   - `Compiled successfully`
   - `Generating static pages (206/206)` (or current count)
6. Promote to **Production** when build succeeds

### CLI procedure (after `npx vercel login`)

```bash
cd rase
npm run build
npx vercel --prod --force   # --force skips cache
```

### Build success criteria

| Metric | Expected |
|--------|----------|
| Static pages | **206** |
| Build exit code | **0** |
| `/glimpses` in output | Route listed |

---

## Phase 3 — Environment variables (Production)

**Vercel → Settings → Environment Variables → Production**

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.rase.co.in` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Yes | Server secret |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook signing secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | If checkout live | Client key only |
| `RAZORPAY_KEY_ID` | If checkout live | Server |
| `RAZORPAY_KEY_SECRET` | If checkout live | Server — never `NEXT_PUBLIC_` |

**After any env change → Redeploy production** (env is baked at build/runtime per variable type).

---

## Phase 4 — Post-deploy validation

```bash
node scripts/production-go-live.mjs https://www.rase.co.in
# Target: 9/9 PASS

node scripts/validate-go-live.mjs https://www.rase.co.in
node scripts/production-smoke-test.mjs https://www.rase.co.in
```

| Check | Pass criteria |
|-------|---------------|
| `/glimpses` | HTTP **200** |
| `/accommodation` | HTTP **200** |
| `/coming-soon` | HTTP **200** |
| `sitemap.xml` | **≥ 107** `<loc>` entries |
| `robots.txt` | 200 + `Sitemap:` reference |

---

## Phase 5 — Captcha validation

```bash
# Must NOT return "reCAPTCHA not configured"
curl -s -X POST https://www.rase.co.in/api/registration/verify-captcha \
  -H "Content-Type: application/json" \
  -d '{"token":"test"}'
```

Browser: `/registration` → reCAPTCHA script present → submit form → success.

---

## Phase 6 — Payment validation

```bash
# Must NOT return "Webhook not configured" (expect 401 invalid signature)
curl -s -X POST https://www.rase.co.in/api/payments/razorpay-webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: invalid" \
  -d '{"event":"payment.captured"}'
```

Razorpay Dashboard → Webhook URL: `https://www.rase.co.in/api/payments/razorpay-webhook` → send test event → verify Firestore `audit_logs`.

---

## Phase 7 — Lighthouse (post-deploy)

```bash
node scripts/launch-lighthouse.mjs https://www.rase.co.in
```

| Page | Current prod | Target |
|------|--------------|--------|
| `/` | 35 | **≥ 90** |
| `/press` | 45 | **≥ 90** |
| `/media-center` | 48 | **≥ 90** |
| `/registration` | 45 | **≥ 90** |

If &lt; 90 after deploy, see Phase 8 in `docs/FULL_GO_LAUNCH_CERTIFICATION.md` (bundle offenders).

---

## Phase 9 — FULL GO gate

All must pass:

- [ ] Production commit includes certification changes (not bare `3380ce9` only)
- [ ] Sitemap = **107** URLs
- [ ] `/glimpses` = **200**
- [ ] Env vars configured (4 required)
- [ ] Captcha E2E pass
- [ ] Webhook E2E pass
- [ ] Lighthouse Performance **≥ 90** (all 4 pages)
- [ ] `production-go-live.mjs` → **9/9**

---

## Current production probe (2026-06-08)

**2/9 checks PASS** — FULL GO **not** achieved.

See `docs/production-go-live-results.json` for latest automated output.
