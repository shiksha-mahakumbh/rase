# Launch Blockers Status

**Date:** July 2026  
**Last updated:** Post 150-item enterprise audit close-out  
**Production:** https://www.rase.co.in

---

## Blocker status matrix

| # | Blocker | Severity | Code | Production verified |
|---|---------|----------|------|---------------------|
| 1 | Registration PII enumeration | P0 Critical | ✅ Fixed | ✅ Token-based lookup; smoke + security tests |
| 2 | Forgeable admin session cookie | P0 Critical | ✅ Fixed | ✅ HMAC session + middleware |
| 3 | Firebase rules uncertainty | P0 Critical | ✅ N/A | ✅ Supabase migration complete; Firebase removed from runtime |
| 4 | DB migration not applied | P0 High | ✅ Migrations in repo | ✅ `npm run db:migrate:deploy` + production DB connected |
| 5 | CMS content not published | P1 High | ✅ Seeds exist | ✅ Public routes in smoke suite |
| 6 | Env vars incomplete | P1 High | ✅ `.env.example` + `verify:env` | ✅ Sentry, Upstash, Cron on `/api/v2/status` |
| 7 | Upload route unauthenticated | P1 High | ✅ Fixed | ✅ `verifyUploadToken` + server-side bucket map |
| 8 | Supabase RLS not deployed | P1 High | ✅ SQL + deploy scripts | ✅ Verified via `/api/v2/status` policy counts + anon probe |
| 9 | In-memory rate limits | P2 Medium | ✅ Upstash wired | ✅ `rateLimitMode: upstash` on production |

---

## Can Shiksha Mahakumbh safely enter production?

# YES (with ongoing ops)

### Automated verification

```bash
npm run certify:go-live:live
```

Includes: unit tests, integration contracts, go-live probes, monitoring, RLS ops checks, Lighthouse (PSI), production smoke (24+ routes).

### Remaining non-code items

| Item | Owner | Status |
|------|-------|--------|
| Human sign-off (item 150) | Engineering / DevOps / Product | ☐ `docs/go-live/GO_LIVE_SIGN_OFF.md` |
| Privacy policy legal review | DHE legal | ⚠️ Code fallback live; CMS legal review optional |
| Full Hindi body translation | Content team | ⚠️ Metadata localized; body English |
| Post-launch real payment E2E | Engineering | Recommended once per release |

---

## Ops runbook (if checks fail)

| Symptom | Fix |
|---------|-----|
| RLS policy count low | `npm run db:deploy-supabase -- --rls-only` |
| Anon can read `roles` | Re-apply `supabase/policies/rbac-tiered.sql` via deploy script |
| `rateLimitMode: in-memory` | Add Upstash integration on Vercel production |
| `sentryConfigured: false` | Set `NEXT_PUBLIC_SENTRY_DSN` on Vercel |
| Legacy `NEXT_PUBLIC_SITE_URL` | Set to `https://www.rase.co.in` (code rewrites legacy hosts) |

---

## Historical staging docs

Pre-production staging reports under `docs/staging/` are **archived** (May–June 2026). See `docs/staging/README.md`.

---

*Verified by `verify:production-ops`, `certify:go-live:live`, and CI post-deploy smoke.*
