# GitHub Actions → Vercel deploy secrets

The workflow `.github/workflows/vercel-production.yml` deploys `main` to production when pushes land on GitHub (backup if the Vercel Git integration webhook misses an event).

## One-time setup

1. Create a Vercel token: [vercel.com/account/tokens](https://vercel.com/account/tokens) (scope: deploy for **DHE Projects** / `rase-co-in`).
2. In GitHub → **shiksha-mahakumbh/rase** → Settings → Secrets and variables → Actions → **New repository secret**:
   - `VERCEL_TOKEN` — the token from step 1

`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are already set in the workflow file (not sensitive).

## Verify

After adding `VERCEL_TOKEN`, push to `main` or run **Actions → Vercel Production Deploy → Run workflow**. A new production deployment should appear on [vercel.com/dhe-projects/rase-co-in](https://vercel.com/dhe-projects/rase-co-in) within ~3 minutes.

If both the Vercel Git hook and this workflow fire on the same push, you may get two builds for one commit. That is harmless but wasteful; once webhooks are reliable again, you can disable either the Git integration auto-deploy or this workflow.
