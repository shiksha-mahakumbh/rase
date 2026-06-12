# G6 — Vercel Environment Audit

**Audit date:** 2026-06-12  
**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls` (names/scopes only — values encrypted)

---

## Summary by environment

| Environment | Verdict | Summary |
|-------------|---------|---------|
| **Production** | **CONDITIONAL** | Core secrets present; Prisma URL naming gap; stale Firebase secret |
| **Preview** | **FAIL** | Missing Supabase, admin secrets, site URL, Razorpay webhook |
| **Development** | **PARTIAL** | Admin + Razorpay present; missing Supabase public vars |

---

## Production — variables present

| Variable | Present | Notes |
|----------|:-------:|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Value encrypted — **must be `https://www.shikshamahakumbh.com`** |
| `DATABASE_URL` | ❌ | Use `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | ❌ | Use `POSTGRES_URL_NON_POOLING` |
| `POSTGRES_PRISMA_URL` | ✅ | Production + Preview |
| `POSTGRES_URL_NON_POOLING` | ✅ | Production + Preview |
| `ADMIN_OPS_SECRET` | ✅ | |
| `ADMIN_SESSION_SECRET` | ✅ | |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | ✅ | Duplicative naming |
| `RAZORPAY_*` (key, secret, webhook) | ✅ | |
| `RECAPTCHA_*` | ✅ | |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ | **Remove post-migration** |

---

## Preview — gaps

**Missing** (not in `vercel env ls` output for Preview scope):

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_OPS_SECRET`, `ADMIN_SESSION_SECRET`, `REGISTRATION_LOOKUP_SECRET`
- All `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_WEBHOOK_SECRET`
- Explicit `DATABASE_URL` / `DIRECT_URL`

**Present on Preview:** `POSTGRES_*` (3), `POSTGRES_PASSWORD`, `FIREBASE_SERVICE_ACCOUNT_JSON`

**Impact:** Preview deployments cannot test Supabase auth, admin login, or full registration flow.

---

## Development (Vercel)

Present: admin secrets, Razorpay webhook, `NEXT_PUBLIC_SITE_URL`, Postgres trio  
Missing: Supabase client vars (may rely on local `.env` only)

---

## Site URL

Cannot read encrypted value. Evidence from **live site** suggests Production `NEXT_PUBLIC_SITE_URL` is **`https://www.rase.co.in`** (sitemap/robots on `www.shikshamahakumbh.com`).

**Required change before GO:**

```bash
# Do NOT run without approval — documented for go-live plan only
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://www.shikshamahakumbh.com
```

Repeat for Preview and Development.

---

## Recommended Production env matrix (post Firebase exit)

| Variable | Required |
|----------|:--------:|
| `NEXT_PUBLIC_SITE_URL` | ✅ |
| `DATABASE_URL` | ✅ (or documented Prisma alias) |
| `DIRECT_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ |
| `ADMIN_OPS_SECRET` | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ |
| `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET` | ✅ |
| `RECAPTCHA_*` | ✅ |
| `SMTP_*` | ✅ |
| `REGISTRATION_BACKEND` | Optional (`supabase` or unset) |
| ~~`FIREBASE_SERVICE_ACCOUNT_JSON`~~ | **Remove** |

---

## G6 verdict

**CONDITIONAL FAIL** — Production mostly wired; Preview unusable for QA; canonical site URL likely wrong; Firebase secret should be removed.
