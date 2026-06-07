# Smoke Test Playbook — Production

**Script:** `node scripts/production-smoke-test.mjs [baseUrl]`  
**Quick infra check:** `node scripts/validate-go-live.mjs [baseUrl]`

Default base URL: `https://www.rase.co.in`

---

## When to run

| Trigger | Scripts |
|---------|---------|
| Every production deploy | Both |
| Pre-national campaign | Both + manual registration E2E |
| Post-incident rollback | Both |
| Weekly ops | `production-smoke-test.mjs` |

---

## Automated coverage

| Test | Path | Pass criteria |
|------|------|---------------|
| health-json | `/api/health` | JSON `status: "ok"` |
| robots-txt | `/robots.txt` | Contains `User-agent` |
| sitemap-xml | `/sitemap.xml` | XML `urlset` |
| homepage | `/` | 200 + “Shiksha” in body |
| registration | `/registration` | 200 + registration content |
| registration-success | `/registration/success` | 200 |
| knowledge-hub | `/knowledge` | 200 + knowledge content |
| introduction | `/introduction` | 200 |
| locale-hi-registration | `/hi/registration` | 200, non-empty |
| admin-page | `/admin` | 200 + admin/sign-in cues |

Exit code **0** = all passed.

---

## Manual tests (not fully automatable)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Registration E2E | Complete delegate test with reCAPTCHA | `SMK2026-XXXXXX` in Firestore |
| 2 | Admin export | Login → paginate → CSV | Data matches test reg |
| 3 | Analytics consent | Reject → no GTM network; Accept → GTM loads | Consent gate works |
| 4 | Cookie + GA4 DebugView | Accept cookies → register | Events visible |
| 5 | Global search | Navbar search “proceedings” | Knowledge/results |
| 6 | datadekh blocked | Visit `/participantregistrationdatadekh` without cookie | Redirect to `/admin` |
| 7 | Email API | Optional staging send | 200 or documented skip |

---

## Failure triage

| Failed test | Likely cause | Doc |
|-------------|--------------|-----|
| health-json, robots, sitemap | Hosting rewrite | `PRODUCTION_DEPLOYMENT_AUDIT.md` |
| registration | Firestore rules / JS error | `MONITORING_RUNBOOK.md` |
| locale-hi | i18n routing | `i18n/routing.ts` |
| admin-page | Auth config | `NEXT_PUBLIC_ADMIN_EMAILS` |

---

## CI integration (optional)

```yaml
- run: node scripts/production-smoke-test.mjs https://www.rase.co.in
```

Run on schedule or post-deploy webhook — not on every PR (rate limit production).

---

## Related

- `scripts/validate-go-live.mjs`
- `docs/GO_LIVE_VALIDATION_REPORT.md`
- `docs/MONITORING_RUNBOOK.md`
