# Vercel Cutover Guide

**Date:** 2026-05-29  
**Project:** `dhe-projects/rase-co-in`  
**Role:** Production Release Commander  
**Constraint:** Do not change Vercel during documentation — operator executes at cutover

---

## Required Production Variables

| Variable | Current status | Action |
|----------|:--------------:|--------|
| `DATABASE_URL` | ❌ Missing | **Add** — copy from `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | ❌ Missing | **Add** — copy from `POSTGRES_URL_NON_POOLING` |
| `NEXT_PUBLIC_SITE_URL` | ✅ Present | **Update** → `https://www.shikshamahakumbh.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Present | Verify value matches Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Present | Verify matches Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Present | No change |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ Present | No change |

### Also present (supporting — no action unless broken)

| Variable | Status |
|----------|--------|
| `ADMIN_OPS_SECRET` | ✅ Present |
| `ADMIN_SESSION_SECRET` | ✅ Present |
| `REGISTRATION_LOOKUP_SECRET` | ✅ Present |
| `POSTGRES_PRISMA_URL` | ✅ Present (source for DATABASE_URL) |
| `POSTGRES_URL_NON_POOLING` | ✅ Present (source for DIRECT_URL) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | ✅ Present |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ Present |
| `RECAPTCHA_*` | ✅ Present |

### Legacy — remove after migration verified

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

---

## Exact Mappings

Prisma reads `DATABASE_URL` and `DIRECT_URL` from `prisma/schema.prisma`. Vercel Supabase integration provides Postgres aliases under different names.

| Required var | Copy value from | Connection type |
|--------------|-----------------|-----------------|
| `DATABASE_URL` | `POSTGRES_PRISMA_URL` | Pooled (port 6543, PgBouncer) — app runtime |
| `DIRECT_URL` | `POSTGRES_URL_NON_POOLING` | Direct (port 5432) — migrations, SQL deploy |
| `NEXT_PUBLIC_SITE_URL` | *(set explicitly)* | `https://www.shikshamahakumbh.com` |

**How to copy values:**

1. Vercel Dashboard → Project `rase-co-in` → Settings → Environment Variables
2. Reveal `POSTGRES_PRISMA_URL` → copy full connection string
3. Add new variable `DATABASE_URL` (Production) with identical value
4. Repeat for `POSTGRES_URL_NON_POOLING` → `DIRECT_URL`

---

## CLI Commands (operator)

```bash
# List current production vars
npx vercel env ls production

# Add DATABASE_URL (paste POSTGRES_PRISMA_URL value when prompted)
vercel env add DATABASE_URL production

# Add DIRECT_URL (paste POSTGRES_URL_NON_POOLING value when prompted)
vercel env add DIRECT_URL production

# Update SITE_URL — remove old, add new
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://www.shikshamahakumbh.com
```

**Important:** Env changes require a **production redeploy** to take effect in the running app.

---

## Validation Commands

### Step 1 — Verify vars exist by name

```bash
npx vercel env ls production
```

**Expected:** Each of these appears in the list:

```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_WEBHOOK_SECRET
```

### Step 2 — Pull to local for sanity check (optional)

```bash
npx vercel env pull .env.vercel.production --environment=production
```

**Expected:** File created with all vars (values redacted in output). Verify keys exist:

```bash
# PowerShell
Select-String -Path .env.vercel.production -Pattern "DATABASE_URL|DIRECT_URL|SITE_URL"
```

**Expected matches:**

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://www.shikshamahakumbh.com"
```

Delete pulled file after verification — do not commit.

### Step 3 — Post-deploy live validation

After `npx vercel --prod`:

```bash
# Sitemap must use .com domain
curl -s https://www.shikshamahakumbh.com/sitemap.xml | head -8
```

**Expected output:**

```xml
<loc>https://www.shikshamahakumbh.com</loc>
```

```bash
# Robots sitemap directive
curl -s https://www.shikshamahakumbh.com/robots.txt | findstr Sitemap
```

**Expected output:**

```
Sitemap: https://www.shikshamahakumbh.com/sitemap.xml
```

### Step 4 — Database connectivity (post-deploy)

Check Vercel deployment logs for:

```
✓ Ready
```

No errors containing `Can't reach database` or `P1001`.

---

## Expected Outcomes

| Check | Before cutover | After cutover |
|-------|----------------|---------------|
| `DATABASE_URL` in env list | ❌ | ✅ |
| `DIRECT_URL` in env list | ❌ | ✅ |
| Live sitemap domain | `www.rase.co.in` | `www.shikshamahakumbh.com` |
| Live robots Sitemap | `www.rase.co.in` | `www.shikshamahakumbh.com` |
| Prisma runtime errors | Possible (missing var) | None |
| Registration API | 200 + PII (stale) | 401 without auth |

---

## Preview Environment Parity (recommended before prod)

Preview currently has only Postgres + Firebase legacy vars. After production cutover, sync all Production secrets to Preview for staging smoke tests:

```bash
# Repeat vercel env add for each secret with environment=preview
vercel env add DATABASE_URL preview
vercel env add DIRECT_URL preview
vercel env add NEXT_PUBLIC_SITE_URL preview
# ... all app secrets
```

---

## Signoff Checklist

- [ ] `DATABASE_URL` added (value = `POSTGRES_PRISMA_URL`)
- [ ] `DIRECT_URL` added (value = `POSTGRES_URL_NON_POOLING`)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.shikshamahakumbh.com`
- [ ] All 8 required vars present in `npx vercel env ls production`
- [ ] Production redeploy triggered after env changes

---

*Evidence: `npx vercel env ls production` — 2026-05-29. No Vercel changes made.*
