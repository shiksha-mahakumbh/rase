# H1 — Vercel Environment Remediation

**Audit date:** 2026-05-29  
**Project:** `dhe-projects/rase-co-in`  
**Evidence:** `npx vercel env ls` (Vercel CLI 54.12.2)  
**Verdict:** ⚠️ Production **partial** | ❌ Preview **fail** | ⚠️ Development **partial**

---

## Required Variable Matrix

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `DATABASE_URL` | ❌ | ❌ | ❌ |
| `DIRECT_URL` | ❌ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ❌ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ |
| `ADMIN_OPS_SECRET` | ✅ | ❌ | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ | ❌ | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ❌ | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ❌ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | ✅* | ❌ | ✅* |

\*Present but **encrypted** — actual value not readable from CLI. Live production behavior indicates wrong domain (see H4).

---

## Production — Detail

### Present (verified by name)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_OPS_SECRET
ADMIN_SESSION_SECRET
REGISTRATION_LOOKUP_SECRET
RAZORPAY_WEBHOOK_SECRET
NEXT_PUBLIC_SITE_URL
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER / HOST / PASSWORD / DATABASE
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RECAPTCHA_SECRET_KEY
```

### Missing (exact Prisma names)

| Variable | Impact |
|----------|--------|
| `DATABASE_URL` | Prisma schema requires `env("DATABASE_URL")` — **runtime/build may not connect** unless aliased externally |
| `DIRECT_URL` | Prisma migrations and direct connections require `env("DIRECT_URL")` |

**Functional aliases present:** `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` (Supabase Vercel integration). Values likely equivalent but **names do not match** `prisma/schema.prisma`.

### Legacy Firebase variables

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **Production, Preview, Development** |

**Remediation:** Remove after data migration complete and Firebase scripts retired.

---

## Preview — Detail

### Present only

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_PASSWORD`
- `FIREBASE_SERVICE_ACCOUNT_JSON`

### Missing (all required H1 vars except Postgres aliases)

All Supabase client vars, all admin/lookup secrets, `NEXT_PUBLIC_SITE_URL`, `RAZORPAY_WEBHOOK_SECRET`, `DATABASE_URL`, `DIRECT_URL`.

❌ Preview deployments **cannot** validate Supabase cutover.

---

## Development (Vercel cloud)

### Present

Admin secrets, `REGISTRATION_LOOKUP_SECRET`, `NEXT_PUBLIC_SITE_URL`, `RAZORPAY_WEBHOOK_SECRET`, Postgres trio + password, `FIREBASE_SERVICE_ACCOUNT_JSON`.

### Missing on Vercel Development

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RECAPTCHA_SECRET_KEY`.

⚠️ Local `.env` may supply these for `next dev`; Vercel Development env is incomplete.

---

## Domain Value Analysis

| Source | `NEXT_PUBLIC_SITE_URL` value | Correct? |
|--------|------------------------------|----------|
| Local `.env` | `https://shikshamahakumbh.org` | ❌ Domain unreachable in probe |
| Live production HTML | Canonical/OG use `https://www.rase.co.in` | ❌ Wrong canonical |
| Required canonical | `https://www.shikshamahakumbh.com` | ✅ Target |

**Vercel Production encrypted value:** UNKNOWN — live output strongly suggests `https://www.rase.co.in` or fallback from `src/config/site.ts` line 2.

---

## Database Mapping Analysis

**Prisma schema** (`prisma/schema.prisma`):
```prisma
url       = env("DATABASE_URL")
directUrl = env("DIRECT_URL")
```

**Local `.env` (verified):**
- `DATABASE_URL` → Supabase pooler (`aws-1-ap-southeast-1.pooler.supabase.com:6543`)
- `DIRECT_URL` → Supabase direct (`db.rcpbfrauyyyorptckrlp.supabase.co:5432`)

**Vercel Production mapping:**

| Prisma expects | Vercel provides | Status |
|----------------|-----------------|--------|
| `DATABASE_URL` | `POSTGRES_PRISMA_URL` | ⚠️ Alias only — name mismatch |
| `DIRECT_URL` | `POSTGRES_URL_NON_POOLING` | ⚠️ Alias only — name mismatch |

No `vercel.json` env mapping exists (`vercel.json` contains only `"framework": "nextjs"`).

---

## H1 Remediation Actions (Manual — Not Executed)

```bash
# 1. Add Prisma-named vars (copy values from POSTGRES_* in Vercel dashboard)
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production

# 2. Fix canonical domain
vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://www.shikshamahakumbh.com

# 3. Sync Preview (minimum for smoke tests)
vercel env add DATABASE_URL preview
vercel env add DIRECT_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview
vercel env add ADMIN_SESSION_SECRET preview
vercel env add REGISTRATION_LOOKUP_SECRET preview
vercel env add NEXT_PUBLIC_SITE_URL preview
vercel env add RAZORPAY_WEBHOOK_SECRET preview

# 4. Post-migration cleanup
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON production
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON preview
vercel env rm FIREBASE_SERVICE_ACCOUNT_JSON development
```

---

## H1 Summary

| Finding | Severity |
|---------|----------|
| `DATABASE_URL` / `DIRECT_URL` missing by name on Production | **P0** |
| `NEXT_PUBLIC_SITE_URL` wrong or fallback to `rase.co.in` on live | **P0** |
| `FIREBASE_SERVICE_ACCOUNT_JSON` still on all envs | **P1** |
| Preview env nearly empty | **P1** |
| Local `.env` uses `shikshamahakumbh.org` (wrong) | **P1** (dev hygiene) |

---

*Evidence: `npx vercel env ls`, local `.env` key names, live HTML probes. No env modifications.*
