# Launch Blockers Status

**Date:** May 2026  
**Last updated:** Post P0 security remediation

---

## Blocker status matrix

| # | Blocker | Severity | Code | Staging ops | Production |
|---|---------|----------|------|-------------|------------|
| 1 | Registration PII enumeration | P0 Critical | ✅ Fixed | ⚠️ Test | ⚠️ Deploy + test |
| 2 | Forgeable admin session cookie | P0 Critical | ✅ Fixed | ⚠️ Test | ⚠️ Deploy + test |
| 3 | Firebase rules uncertainty | P0 Critical | ✅ Repo PASS | ⚠️ Deploy rules | ⚠️ Verify Console |
| 4 | DB migration not applied | P0 High | ✅ Migration exists | ⚠️ `migrate deploy` | ⚠️ `migrate deploy` |
| 5 | CMS content not published | P1 High | ✅ Seeds exist | ⚠️ Run seeds | ⚠️ Run seeds |
| 6 | Env vars incomplete | P1 High | ✅ `.env.example` updated | ⚠️ Configure | ⚠️ Configure |
| 7 | Upload route unauthenticated | P1 High | ❌ Open | — | — |
| 8 | Supabase RLS not deployed | P1 High | ❌ Open | — | — |
| 9 | In-memory rate limits | P2 Medium | ❌ Open | — | — |

---

## Can Shiksha Mahakumbh safely enter staging?

# YES (with conditions)

**Conditions before staging traffic:**
1. Deploy P0 remediation code to staging Vercel project
2. Set `ADMIN_SESSION_SECRET`, `REGISTRATION_LOOKUP_SECRET`, `ADMIN_OPS_SECRET`
3. Run `npx prisma migrate deploy` on staging Supabase
4. Run seed scripts with `--publish`
5. Deploy strict Firebase rules to **staging** Firebase project
6. Execute security smoke tests in `STAGING_READINESS_VERIFICATION.md`

Code is ready. Ops steps are not yet executed in this session (deploy prohibited by mandate).

---

## Can Shiksha Mahakumbh safely enter production?

# NO

### Remaining production blockers

| Blocker | Action required |
|---------|-----------------|
| P0 code not deployed to production | Deploy after staging validation |
| Firebase rules production state unknown | `firebase deploy --only firestore:rules,storage` + Console verify |
| Production DB migration pending | `prisma migrate deploy` on production |
| CMS seeds not published | Run seeds with `--publish` |
| Production env vars | Full checklist in `FINAL_DEPLOYMENT_AUDIT.md` |
| P1: Upload route open | Lock down before high-traffic launch |
| P1: Supabase RLS | Apply policies in Supabase dashboard |
| Staging smoke test not completed | Full registration + admin + security test pass |

### Estimated time to production-ready

| Phase | Duration |
|-------|----------|
| Staging deploy + P0 smoke tests | 1–2 days |
| P1 hardening (upload, RLS) | 3–5 days |
| Content publish + QA | 2–3 days |
| **Total** | **~1–2 weeks** |

---

## Recommended sequence

```
1. Deploy to staging
2. Configure env vars (including new secrets)
3. prisma migrate deploy (staging)
4. Run CMS seeds --publish
5. Deploy Firebase strict rules (staging project)
6. Security smoke tests (P0 checklist)
7. Full registration E2E test
8. Admin CMS CRUD test
9. → Production deploy (after sign-off)
10. P1 hardening sprint (parallel or pre-prod)
```

---

## STOP

P0 code remediation complete. Awaiting approval for staging deployment.
