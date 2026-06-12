# 8. Deployment Plan

## Environments

| Env | Supabase | Vercel | Purpose |
|-----|----------|--------|---------|
| `local` | Supabase CLI (`supabase start`) | `next dev` | Development |
| `staging` | Supabase staging project | Preview deploys | QA + migration test |
| `production` | Supabase prod project | `www.rase.co.in` | Live |

## Environment variables (new)

See `.env.supabase.example`. Add to Vercel **without removing** existing Firebase vars during parallel phase.

## Deployment sequence

### Step 1 — Supabase project setup
```bash
# Create project at supabase.com
# Enable Google OAuth provider
# Create storage buckets (9 buckets)
# Copy connection strings
```

### Step 2 — Database migration
```bash
npx prisma migrate deploy
npx prisma db seed  # RBAC + counter
```

### Step 3 — RLS policies
```bash
supabase db push --include-all
# Or apply supabase/policies/*.sql manually
```

### Step 4 — Vercel env vars
Add all `SUPABASE_*`, `DATABASE_URL`, `DIRECT_URL`, `BREVO_*` to production + preview.

### Step 5 — Deploy `/api/v2/*` routes
```bash
git push origin main
# Vercel auto-deploys
# Verify GET /api/v2/health
```

### Step 6 — Run migration scripts (staging first)
```bash
node scripts/supabase/migrate-firestore.mjs --dry-run
node scripts/supabase/migrate-firestore.mjs
node scripts/supabase/migrate-storage.mjs
node scripts/supabase/verify-migration.mjs
```

### Step 7 — Enable dual-write (production)
```
REGISTRATION_BACKEND=dual
```

### Step 8 — Cutover
```
REGISTRATION_BACKEND=supabase
```

## Backup strategy

| Asset | Frequency | Retention |
|-------|-----------|-----------|
| Supabase PG | Daily auto (Supabase Pro) | 30 days |
| Pre-cutover Firestore export | Once before M5 | Permanent archive |
| Pre-cutover Firebase Storage | Once before M5 | Permanent archive |
| `uploaded_files` metadata | Weekly CSV export | 90 days |

## Monitoring

| Check | Endpoint / Tool |
|-------|-----------------|
| API health | `GET /api/v2/health` |
| DB connectivity | `GET /api/v2/health/supabase` |
| Error tracking | Sentry (existing) |
| Uptime | Vercel Analytics |
| Email delivery | `email_logs` status dashboard |

## Health endpoints

| Route | Auth | Purpose |
|-------|------|---------|
| `/api/health` | None | Existing (keep) |
| `/api/v2/health` | None | Supabase backend status |
| `/api/v2/health/supabase` | `ADMIN_OPS_SECRET` | Full diagnostics |
