# GitHub Actions → Vercel production deploy

Backup deploy when Vercel Git integration is disconnected or webhooks miss pushes.

## Required: `VERCEL_TOKEN` **or** `VERCEL_DEPLOY_HOOK`

### Option A — `VERCEL_TOKEN` (current setup)

1. Create a token: [vercel.com/account/tokens](https://vercel.com/account/tokens) (scope: **DHE Projects** / `rase-co-in`).
2. GitHub → **shiksha-mahakumbh/rase** → Settings → Secrets → Actions → **`VERCEL_TOKEN`**

Or from a machine with Vercel CLI + GitHub CLI:

```bash
gh auth login
npx tsx scripts/setup-github-vercel-secret.mjs
```

This creates/uses deploy hook `github-actions-fallback`, sets `VERCEL_DEPLOY_HOOK` (+ `VERCEL_TOKEN`), and triggers a test workflow run.

`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are in the workflow file.

### Option B — deploy hook (after Git is reconnected in Vercel)

```bash
npx vercel deploy-hook create github-actions-fallback --ref main
```

Add the hook URL as GitHub secret **`VERCEL_DEPLOY_HOOK`** (preferred when set).

## What the workflow does

- **Hook path:** POST to Vercel → build runs on Vercel infrastructure.
- **Token path:** `checkout` + `vercel deploy --prod` → uploads source; **build runs on Vercel** (not on GitHub).

You may see harmless log noise during the Vercel build:

- `npm warn deprecated glob@7…`, `eslint@8…` — transitive dev deps; not deploy failures.
- `prisma generate` in `postinstall` — expected.
- `package.json#prisma is deprecated` — Prisma 7 migration notice; non-blocking.

Only treat the workflow as failed if the GitHub job exits non‑zero or the Vercel deployment shows **Error**.

## Fix Vercel Git auto-deploy (recommended)

GitHub App on your account ≠ project linked in Vercel.

1. [github.com/apps/vercel](https://github.com/apps/vercel) → access to **shiksha-mahakumbh/rase**
2. [Vercel → rase-co-in → Settings → Git](https://vercel.com/dhe-projects/rase-co-in/settings/git) → **Connect** → production branch **`main`**
3. `npx tsx scripts/verify-vercel-git.mjs` → should print ✓

## Re-run failed workflow

[Actions → Vercel Production Deploy](https://github.com/shiksha-mahakumbh/rase/actions/workflows/vercel-production.yml) → **Run workflow**

## Production env (audit P1)

Set in Vercel → **rase-co-in** → Settings → Environment Variables:

| Variable | Purpose |
|----------|---------|
| `UPSTASH_REDIS_REST_URL` | Distributed rate limits (P1-10) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST auth |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring (P1-12) |
| `CRON_SECRET` | Bearer for `/api/cron/*` (analytics retention, warm-cache purge) |

See `docs/security/ADMIN_OPS_SECRET_ROTATION.md` for ops secret rotation.

## Production env (audit P1)

Set in Vercel → **rase-co-in** → Settings → Environment Variables:

| Variable | Purpose |
|----------|---------|
| `UPSTASH_REDIS_REST_URL` | Distributed rate limits (P1-10) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST auth |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring (P1-12) |
| `CRON_SECRET` | Bearer for `/api/cron/*` (analytics retention, warm-cache purge) |

Rotate `ADMIN_OPS_SECRET` per `docs/security/ADMIN_OPS_SECRET_ROTATION.md`.
