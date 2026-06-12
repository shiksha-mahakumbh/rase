# Supabase Production Audit

**Date:** 2026-06-10  
**Project:** `rcpbfrauyyyorptckrlp` (ap-southeast-1)  
**Method:** `node scripts/staging-db-check.mjs`, `npx prisma validate`, schema review

---

## Summary

| Area | Status | Verdict |
|------|--------|---------|
| Database connectivity | ✅ Connected | PASS |
| Migrations | ✅ 7/7 applied | PASS |
| Tables | ✅ 15/15 exist | PASS |
| Seeds | ⚠️ Partial | CONDITIONAL |
| RLS policies | ⚠️ SQL in repo, deploy unverified | CONDITIONAL |
| Service-role usage | ✅ Server-only paths | PASS |
| Prisma compatibility | ✅ Valid schema + client | PASS |

---

## Database connectivity

```
node scripts/staging-db-check.mjs → connected: true, exit 0
```

**Connection strings (local `.env`):**
- `DATABASE_URL` → Supabase pooler `:6543` with `pgbouncer=true`
- `DIRECT_URL` → Direct `:5432`

**Vercel Production:** Uses `POSTGRES_*` integration vars; explicit `DATABASE_URL`/`DIRECT_URL` **not mapped** (see `VERCEL_ENV_FINAL_AUDIT.md`).

---

## Migration status

| # | Migration | Applied |
|---|-----------|:-------:|
| 1 | `20250609_init` | ✅ |
| 2 | `20250610_phase3` | ✅ |
| 3 | `20250620_phase35_cms_foundation` | ✅ |
| 4 | `20250621_phase_b_cms` | ✅ |
| 5 | `20250622_phase_b5_analytics` | ✅ |
| 6 | `20250629_phase_s2_foundation` | ✅ |
| 7 | `20250701_phase_c_organizational_cms` | ✅ |

```bash
npm run db:migrate:deploy  # Expected: no pending migrations
```

---

## Tables verified

| Table | Exists |
|-------|:------:|
| `pages` | ✅ |
| `page_sections` | ✅ |
| `notices` | ✅ |
| `downloads` | ✅ |
| `media_assets` | ✅ |
| `media_albums` | ✅ |
| `seo_metadata` | ✅ |
| `visitor_analytics` | ✅ |
| `entity_revisions` | ✅ |
| `committees` | ✅ |
| `committee_members` | ✅ |
| `speaker_profiles` | ✅ |
| `partners` | ✅ |
| `events` | ✅ |
| `event_media` | ✅ |

---

## Seed status

| Script | Count / status | Action needed |
|--------|----------------|---------------|
| Homepage (`pages` slug=home) | **2** | ⚠️ Duplicate home pages |
| Notices | **0** | ❌ Run `npm run seed:cms` |
| Downloads | **0** | ❌ Run `npm run seed:cms` |
| Committees | 2 | ✅ |
| Speakers | 2 | ✅ |
| Partners | 3 | ✅ |
| Events | 2 | ✅ |
| Event media | 3 | ✅ |

```bash
npm run seed:cms
node scripts/seed-s2-hi.mjs --publish
node scripts/staging-db-check.mjs
```

---

## RLS status

**Policy files in repository:**

| File | Tables covered |
|------|----------------|
| `supabase/policies/cms.sql` | pages, sections, seo_metadata, media |
| `supabase/policies/phase_b.sql` | notices, downloads, menus |
| `supabase/policies/analytics.sql` | visitor tables |
| `supabase/policies/admin.sql` | admin RBAC |
| `supabase/policies/registrations.sql` | registration tables |
| `supabase/policies/storage.sql` | storage buckets |

**Live RLS verification:** Not executed in this audit (requires Supabase SQL editor or service-role query).

**Risk:** Policies may not be applied to cloud project — anon key exposure would be dangerous if RLS missing.

**Recommended verification:**

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

---

## Service-role usage

| Component | Key used | Correct? |
|-----------|----------|:----------:|
| Server API routes (`/api/v2/admin/*`) | Prisma + `DATABASE_URL` | ✅ |
| Supabase storage uploads | `SUPABASE_SERVICE_ROLE_KEY` | ✅ Server-only |
| Client components | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Public key only |
| Vercel Production | Service role present | ✅ |
| Vercel Preview | Service role **missing** | ❌ |

---

## Prisma compatibility

| Check | Result |
|-------|--------|
| `npx prisma validate` | ✅ Pass |
| `npx prisma generate` | ✅ Client generated |
| Provider | `postgresql` |
| `directUrl` | Configured |
| Build with cloud DB | ✅ 300 pages SSG |

### Known issue

`seo_metadata.entity_id` is `@db.Uuid` but route-level SEO uses string keys (`"noticeboard"`, `"downloads"`). Causes Prisma UUID parse errors — caught by try/catch, SEO overrides silently skipped.

---

## Supabase readiness score

| Category | Score |
|----------|------:|
| Connectivity | 100 |
| Migrations | 100 |
| Schema/tables | 100 |
| Seed completeness | 55 |
| RLS verification | 40 |
| Vercel env mapping | 65 |
| **Overall Supabase** | **77/100** |
