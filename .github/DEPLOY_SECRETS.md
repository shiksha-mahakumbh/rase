# GitHub Actions → Vercel production deploy

Backup deploy path when Vercel Git integration is disconnected or webhooks miss pushes.

## Required: `VERCEL_TOKEN`

1. Create a token: [vercel.com/account/tokens](https://vercel.com/account/tokens) (scope: **DHE Projects** / `rase-co-in`).
2. GitHub → **shiksha-mahakumbh/rase** → Settings → Secrets and variables → Actions → **New repository secret**:
   - Name: `VERCEL_TOKEN`
   - Value: your token

`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are already in the workflow file.

## Fix Vercel Git auto-deploy (root cause)

Symptoms: pushes to `main` create no Vercel deployment; `vercel deploy-hook create --ref main` returns **Branch "main" not found** or **not connected to a Git repository**.

The CLI `vercel git connect` may fail without GitHub org admin. Use the dashboard:

1. Open [Vercel → rase-co-in → Settings → Git](https://vercel.com/dhe-projects/rase-co-in/settings/git).
2. **Connect** → GitHub → authorize **shiksha-mahakumbh/rase**.
3. Set **Production Branch** to `main`.
4. On GitHub: **Settings → Applications → Vercel** → ensure `shiksha-mahakumbh/rase` has access.

Verify locally:

```bash
npx tsx scripts/verify-vercel-git.mjs
```

Then push to `main` — a deployment should appear within ~2 minutes.

## Optional: deploy hook (after Git is reconnected)

```bash
npx vercel deploy-hook create github-actions-fallback --ref main
```

Add the hook URL as GitHub secret `VERCEL_DEPLOY_HOOK` (workflow prefers hook over token when both are set).

## Re-run failed workflow

[Actions → Vercel Production Deploy](https://github.com/shiksha-mahakumbh/rase/actions/workflows/vercel-production.yml) → **Run workflow** (after adding `VERCEL_TOKEN`).
