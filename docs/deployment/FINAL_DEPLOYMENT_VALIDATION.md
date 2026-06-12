# Final Deployment Validation

**Date:** June 2026  
**Scope:** Read-only audit — no code, schema, or feature changes  
**Auditor scripts:** `staging-env-check.mjs`, `staging-db-url-audit.mjs`, `staging-db-check.mjs`, `staging-security-check.mjs`, `prisma validate`, `tsc --noEmit`, `db:migrate:deploy`, `seed:cms`, `next build`

---

## Executive summary

| Layer | Result |
|-------|--------|
| Application code (TypeScript, Prisma schema, security patterns) | **Mostly PASS** |
| Environment configuration | **FAIL** |
| Database connectivity & migrations | **FAIL** |
| Seed execution | **FAIL** |
| Vercel production build | **FAIL** |
| Runtime / production deploy | **Not executed** |

**Overall deployment readiness: NOT READY**

---

## Subsystem validation matrix

### 1. Environment variables

**Status: FAIL**

| Check | Result | Evidence |
|-------|--------|----------|
| Required vars present (21 checks) | **FAIL** — 13/21 | `node scripts/staging-env-check.mjs` exit 1 |
| Security secrets configured | **FAIL** — 0/3 | `ADMIN_OPS_SECRET`, `ADMIN_SESSION_SECRET`, `REGISTRATION_LOOKUP_SECRET` missing |
| Supabase client vars | **FAIL** — 0/3 | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` missing |
| Site URL | **FAIL** | `NEXT_PUBLIC_SITE_URL` missing |
| Razorpay webhook secret | **FAIL** | `RAZORPAY_WEBHOOK_SECRET` missing |
| Database URLs present | **PASS** | `DATABASE_URL`, `DIRECT_URL` set |
| Firebase service account | **PASS** | Valid JSON structure |
| SMTP (5 vars) | **PASS** | All present |
| Razorpay keys (non-webhook) | **PASS** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` present |
| Registration backend | **PASS** | `REGISTRATION_BACKEND=firebase` |
| reCAPTCHA | **PASS** | Site + secret keys present |

**Missing variables (exact list):**

1. `ADMIN_OPS_SECRET`
2. `ADMIN_SESSION_SECRET`
3. `REGISTRATION_LOOKUP_SECRET`
4. `NEXT_PUBLIC_SUPABASE_URL`
5. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. `SUPABASE_SERVICE_ROLE_KEY`
7. `RAZORPAY_WEBHOOK_SECRET`
8. `NEXT_PUBLIC_SITE_URL`

---

### 2. Database connectivity (Supabase cloud)

**Status: FAIL**

| Check | Result | Evidence |
|-------|--------|----------|
| `DATABASE_URL` points to Supabase cloud | **FAIL** | Host `127.0.0.1`, port `54322` |
| `DIRECT_URL` points to Supabase cloud | **FAIL** | Host `127.0.0.1`, port `54322` |
| Diagnosis | **FAIL** | `LOCAL_SUPABASE_CLI_NOT_RUNNING` |
| Prisma can connect | **FAIL** | P1001 — nothing listening on 54322 |
| Cloud URL pattern (pooler :6543 / direct :5432) | **FAIL** | `.env.supabase.example` exists but not applied |

**Root cause:** Active env targets Supabase **local CLI** (`supabase/config.toml` port 54322), not a remote Supabase project. Prisma is correctly reading env — the target is wrong and local stack is not running.

---

### 3. Prisma migrations

**Status: FAIL** (execution) / **PASS** (integrity)

| Check | Result | Evidence |
|-------|--------|----------|
| `prisma validate` | **PASS** | Schema valid |
| `prisma migrate deploy` | **FAIL** | P1001 — DB unreachable |
| Migration files on disk | **PASS** | 7 migrations, ordered |
| `migration_lock.toml` | **PASS** | `provider = postgresql` |
| Migrations applied to DB | **FAIL** | 0 — no connection |

**Required deploy order:**

1. `20250609_init`
2. `20250610_phase3`
3. `20250620_phase35_cms_foundation`
4. `20250621_phase_b_cms`
5. `20250622_phase_b5_analytics`
6. `20250629_phase_s2_foundation`
7. `20250701_phase_c_organizational_cms`

---

### 4. Seed scripts

**Status: FAIL**

| Script | Executed | Result |
|--------|----------|--------|
| `npm run seed:cms` | ✅ | **FAIL** — P1001 on `127.0.0.1:54322` |
| `seed-s2-content.mjs --publish` | ❌ | Blocked (same DB) |
| `seed-s2-hi.mjs --publish` | ❌ | Blocked |
| `seed-phase-c-content.mjs --publish` | ❌ | Blocked |

| Check | Result | Notes |
|-------|--------|-------|
| Script syntax / structure | **PASS** | Scripts load and attempt Prisma |
| Idempotency (code review) | **PASS** | Upsert patterns documented |
| Locale support (en + hi) | **PASS** | Separate seed scripts |
| Data present in DB | **FAIL** | No connection |

**Required execution order (after migrate deploy):**

```bash
npm run seed:cms
node scripts/seed-s2-content.mjs --publish
node scripts/seed-s2-hi.mjs --publish
node scripts/seed-phase-c-content.mjs --publish
```

---

### 5. Firebase rules (production safety)

**Status: PASS** (source) / **WARNING** (deployment)

| Check | Result | Evidence |
|-------|--------|----------|
| `firestore.rules` — registrations `create: false` | **PASS** | Line 24 |
| `firestore.rules` — counters/payments server-only | **PASS** | `create/update/delete: false` |
| `firestore.rules` — catch-all deny write | **PASS** | Line 47–50 |
| `storage.rules` — client write denied | **PASS** | `allow write: if false` |
| Dangerous backup rules not active | **PASS** | `production-backup` separate; automated test confirms |
| Rules deployed to production Firebase | **WARNING** | Not verified in this audit — manual `firebase deploy` required |
| Production rules match repo | **WARNING** | Console verification pending |

**Deploy command (documented):** `firebase deploy --only firestore:rules,storage`

---

### 6. Razorpay webhook configuration

**Status: FAIL** (env) / **PASS** (code)

| Check | Result | Evidence |
|-------|--------|----------|
| `RAZORPAY_WEBHOOK_SECRET` set | **FAIL** | Missing from env |
| Webhook route exists | **PASS** | `/api/payments/razorpay-webhook` |
| HMAC signature verification | **PASS** | `x-razorpay-signature` vs SHA-256 HMAC |
| Production 503 when secret missing | **PASS** | Returns 503 in `NODE_ENV=production` |
| Dev skip mode | **WARNING** | Returns `{ ok: true, mode: "dev-skip" }` without secret |
| Rate limiting | **PASS** | 100 req/min per IP |
| `RAZORPAY_KEY_ID` / `SECRET` | **PASS** | Present locally |

**Production impact:** Without `RAZORPAY_WEBHOOK_SECRET`, webhook returns **503** — payments will not be confirmed server-side.

---

### 7. Vercel build configuration

**Status: FAIL**

| Check | Result | Evidence |
|-------|--------|----------|
| `vercel.json` framework | **PASS** | `"framework": "nextjs"` |
| `postinstall` / `prisma generate` | **WARNING** | Not in `package.json` — may fail on clean Vercel install |
| `vercel-build` with migrate | **WARNING** | Not configured |
| `next build` succeeds | **FAIL** | Build error — route slug conflict |
| TypeScript compile (`tsc --noEmit`) | **PASS** | Exit 0 |
| Node version pinned | **WARNING** | No `engines` field |

**Build blocker (confirmed):**

```
Error: You cannot use different slug names for the same dynamic path ('id' !== 'slug').
```

**Conflicting routes:**

- `src/app/api/v2/downloads/[id]/`
- `src/app/api/v2/downloads/[slug]/`

Next.js App Router requires a single dynamic segment name at the same path level. **Vercel cannot deploy until this is resolved.**

---

### 8. Admin authentication

**Status: PASS** (code) / **FAIL** (runtime config)

| Check | Result | Evidence |
|-------|--------|----------|
| HMAC signed HttpOnly session | **PASS** | `admin-session.ts` |
| Legacy cookie `=1` rejected | **PASS** | `middleware.ts` line 43 |
| Middleware protects data routes | **PASS** | `PROTECTED_DATA_ROUTE_PREFIXES` |
| v2 admin API `requireAdminSecret` | **PASS** | 52+ routes use `requireAdmin` via `api-handler.ts` |
| `ADMIN_OPS_SECRET` configured | **FAIL** | Missing — gateway returns 503 |
| `ADMIN_SESSION_SECRET` configured | **FAIL** | Missing — session creation fails |
| Runtime login smoke test | **FAIL** | Not executed — secrets missing |

**Automated security tests:** 9/9 PASS (`staging-security-check.mjs`)

---

### 9. Registration lookup security

**Status: PASS** (code) / **FAIL** (runtime config)

| Check | Result | Evidence |
|-------|--------|----------|
| GET requires token or email | **PASS** | Returns 401 without auth |
| HMAC lookup tokens | **PASS** | `registration-lookup.ts` |
| Tampered / wrong-ID tokens rejected | **PASS** | Automated crypto tests |
| Public response strips PII | **PASS** | `toPublicRegistrationSummary()` |
| Rate limiting (10/min) | **PASS** | `rateLimit` on lookup route |
| `REGISTRATION_LOOKUP_SECRET` set | **FAIL** | Missing — runtime throws without fallback |
| `REGISTRATION_BACKEND=firebase` | **PASS** | Unchanged |
| E2E registration lookup test | **FAIL** | Not executed |

---

### 10. Visitor analytics

**Status: PASS** (code) / **FAIL** (runtime)

| Check | Result | Evidence |
|-------|--------|----------|
| Client tracker component | **PASS** | `VisitorPageTracker.tsx` → POST `/api/v2/analytics/track` |
| Footer counter with fallback | **PASS** | `FooterVisitorCounter.tsx` — degraded mode + legacy offset |
| Track API rate limiting | **PASS** | 120 req/min per IP |
| Bot filtering | **PASS** | `isBotUserAgent` in service |
| Geo headers (Vercel) | **PASS** | `x-vercel-ip-country` etc. |
| DB tables (`visitor_sessions`, `visitor_analytics`) | **FAIL** | Migration not applied — DB unreachable |
| `GET /api/v2/analytics/stats` | **FAIL** | Requires Prisma connection |
| Admin analytics dashboard | **FAIL** | Requires DB + admin secrets |
| Runtime tracking smoke test | **FAIL** | Not executed |

**Note:** Footer counter will operate in **degraded/fallback mode** (static offset) when DB is unavailable.

---

## Additional static checks

| Check | Status |
|-------|--------|
| Prisma schema valid | **PASS** |
| TypeScript compiles | **PASS** |
| No schema changes in this audit | **PASS** (audit only) |
| `REGISTRATION_BACKEND=firebase` preserved | **PASS** |
| Production deploy executed | **FAIL** — not attempted |
| Runtime smoke tests | **FAIL** — not executed |

---

## Summary by status

### PASS (12 subsystems / checks)

- Prisma schema validation
- TypeScript compilation
- Migration file integrity (7 files, correct order)
- Seed script structure & idempotency (code review)
- Firebase rules source (Firestore + Storage)
- Razorpay webhook code (HMAC, rate limit)
- Admin auth code (signed session, middleware, 52+ protected routes)
- Registration lookup code (HMAC, PII stripping, rate limit)
- Visitor analytics code (tracker, service, APIs)
- Firebase service account configured
- SMTP + Razorpay payment keys (non-webhook)
- reCAPTCHA keys

### WARNING (7 items)

- Firebase rules **not verified deployed** to production console
- `postinstall: prisma generate` missing from `package.json`
- No `vercel-build` script with migrate/generate
- Node version not pinned
- Razorpay webhook dev-skip mode active without secret
- Rate limiting is in-memory only (not distributed on Vercel)
- Visitor analytics degrades to fallback counter without DB

### FAIL (10 blockers)

- 8 missing environment variables
- `DATABASE_URL` / `DIRECT_URL` not pointing to Supabase cloud
- Database connection (P1001)
- `prisma migrate deploy` cannot run
- All seed scripts cannot execute
- `next build` fails (route slug conflict at `api/v2/downloads/`)
- Admin secrets missing — admin auth non-functional at runtime
- Registration lookup secret missing — tokens fail at runtime
- Visitor analytics DB tables not present
- No production/staging runtime validation performed

---

## Audit artifacts

| File | Purpose |
|------|---------|
| `docs/staging/env-check-result.json` | Env presence snapshot |
| `docs/staging/db-check-result.json` | DB connectivity snapshot |
| `docs/staging/security-check-result.json` | Security code tests |

**Audit completed. No modifications made.**
