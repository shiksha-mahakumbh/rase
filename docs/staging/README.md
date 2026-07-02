# Staging documentation archive

**Status:** Historical — superseded by production go-live (July 2026)

The reports in this folder (`STAGING_QA_REPORT.md`, `STAGING_GO_NO_GO_FINAL.md`, `VERCEL_DEPLOYMENT_REPORT.md`, etc.) were written when:

- Local Supabase CLI was not running
- Staging Vercel was not deployed
- Firebase was still referenced in ops runbooks

**Do not use these files for current production status.**

For current state, use:

| Document | Purpose |
|----------|---------|
| `docs/security/LAUNCH_BLOCKERS_STATUS.md` | Production blocker matrix |
| `docs/audit/production-checklist.md` | Build, CI, smoke, env |
| `docs/go-live/GO_LIVE_SIGN_OFF.md` | Launch sign-off checklist |
| `docs/go-live/VERIFICATION_REPORT.json` | Latest automated probe output |

Live verification:

```bash
npm run certify:go-live:live
npm run verify:production-ops
```
