# Database Connectivity Report

**Date:** June 2026  
**Audit script:** `node scripts/staging-db-url-audit.mjs`  
**Error observed:** `P1001: Can't reach database server at 127.0.0.1:54322`

---

## Root cause (confirmed)

Prisma is **not misconfigured**. It is correctly reading `DATABASE_URL` from `.env` / `.env.local`. Those files point to:

| Setting | Value | Meaning |
|---------|-------|---------|
| Host | `127.0.0.1` | Local machine |
| Port | `54322` | **Supabase local CLI** default DB port |
| Diagnosis | `LOCAL_SUPABASE_CLI_NOT_RUNNING` | Docker/Supabase local stack is stopped |

**Evidence:** `supabase/config.toml` line 14: `[db] port = 54322`

The project was initialized for **local Supabase development**, not a remote Supabase cloud project. Migrations and seeds fail because nothing is listening on port 54322.

This is **not** a Prisma bug. It is an **environment target mismatch**: local URLs configured, local Supabase not started.

---

## Configuration sources

| Source | Role | Current state |
|--------|------|---------------|
| `prisma/schema.prisma` | `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")` | ✅ Correct |
| `.env` | Active `DATABASE_URL` | Points to `127.0.0.1:54322` |
| `.env.local` | Overrides | Same local target |
| `.env.supabase.example` | Cloud template | **Not applied** to active env |
| Vercel | Staging/production | **Not configured** in this audit |
| `supabase/config.toml` | Local CLI port 54322 | Matches `.env` |

---

## URL pattern comparison

| Environment | DATABASE_URL host | Port | pgbouncer |
|-------------|-------------------|------|-----------|
| **Current local** | `127.0.0.1` | `54322` | `true` (ignored locally) |
| **Staging (required)** | `aws-0-*.pooler.supabase.com` | `6543` | `true` |
| **Direct (migrations)** | `aws-0-*.pooler.supabase.com` | `5432` | `false` |

**Note:** Both `DATABASE_URL` and `DIRECT_URL` currently use port `54322` locally. For cloud staging, `DIRECT_URL` must use port **5432** (not the pooler port).

---

## Required fixes (choose one path)

### Path A — Staging on Supabase Cloud (recommended)

1. Create or use existing Supabase **staging** project
2. Replace in Vercel Preview / staging `.env`:
   ```
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   ```
3. Also set `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY` from same project
4. Run `npm run db:migrate:deploy` against staging DB

### Path B — Local development only

1. Install Supabase CLI
2. Run `npx supabase start` in project root
3. Copy connection strings from `supabase status`
4. Keep `127.0.0.1:54322` URLs
5. Run migrations locally

**Staging approval requires Path A**, not Path B.

---

## Connectivity verification procedure

```bash
# After fixing URLs:
node scripts/staging-db-url-audit.mjs
# Expect: diagnosis = "REMOTE_SUPABASE_CONFIGURED"

npm run db:migrate:deploy
# Expect: exit 0, all migrations applied

node scripts/staging-db-check.mjs
# Expect: connected=true, tables.* = true
```

---

## Migration readiness

| Check | Status |
|-------|--------|
| `DATABASE_URL` present | ✅ |
| Points to reachable host | ❌ (local Supabase stopped) |
| `DIRECT_URL` present | ✅ |
| Cloud URLs configured | ❌ |
| `prisma validate` | ✅ |
| `migrate deploy` succeeded | ❌ |

---

## Impact if unfixed

| System | Impact |
|--------|--------|
| All CMS admin APIs | Fail on Prisma queries |
| All public CMS pages | Fall back to hardcoded content |
| Seeds | Cannot run |
| Analytics | Cannot write visitor data |
| Registration (Firebase) | **Unaffected** — uses Firestore |

---

## Verdict

**Root cause:** Local Supabase CLI not running; env files target `127.0.0.1:54322` instead of cloud staging project.

**Fix:** Point `DATABASE_URL` / `DIRECT_URL` to Supabase **staging** cloud project and run `migrate deploy`.

**Schema changes:** None required.
