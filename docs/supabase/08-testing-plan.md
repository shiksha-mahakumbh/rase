# 9. Testing Plan

## Test pyramid

```
        ┌─────────┐
        │  E2E    │  Playwright (browser registration)
        ├─────────┤
        │  API    │  Integration tests per /api/v2 route
        ├─────────┤
        │  Unit   │  Engine, counter, RBAC, Zod schemas
        └─────────┘
```

## Unit tests

| Module | Tests |
|--------|-------|
| `registration/counter.ts` | Sequential IDs, padding, concurrency |
| `registration/engine.ts` | Each type creates master + extension row |
| `registration/schemas/*` | Zod validation per type |
| `auth/rbac.ts` | Permission checks per role |
| `payments/webhook.ts` | Signature verify, duplicate detection |
| `email/brevo.ts` | Template rendering, retry logic |
| `audit/logger.ts` | Payload shape, action enum |

**Tool:** Vitest

## Integration tests

| Suite | Coverage |
|-------|----------|
| `POST /api/v2/registration/submit` | Conclave, Delegate, Best Practices |
| `GET /api/v2/registration/[id]` | 200 known, 404 unknown, 400 invalid |
| `POST /api/v2/registration/upload` | PDF upload, MIME reject, size limit |
| `POST /api/v2/payments/webhook` | Valid sig, invalid sig, duplicate |
| `POST /api/v2/registration/send-email` | Sent, skipped, failed |
| Admin CRUD | Committees, media, contact reply |

**Tool:** Vitest + test Supabase instance (or `supabase start` in CI)

## Migration tests

| Test | Assertion |
|------|-----------|
| Firestore → PG count | Equal |
| Field mapping | 50 random records match |
| Counter value | ≥ Firebase |
| Storage file count | Equal per bucket |
| FK integrity | No orphans |
| Re-run idempotency | Second import skips existing |

## Security tests

| Test | Expected |
|------|----------|
| Anonymous PG read via anon key | Denied |
| Admin route without JWT | 401 |
| Admin route wrong role | 403 |
| SQL injection in search | Sanitized |
| Oversized file upload | 400 |
| Rate limit exceeded | 429 |
| CSRF on admin POST without token | 403 |

## Load tests

| Scenario | Target |
|----------|--------|
| Registration submit | 50 concurrent, p95 < 2s |
| Admin list (10k records) | p95 < 1s with pagination |
| Webhook burst | 100 events/min, 0 duplicates |

**Tool:** k6 or Artillery

## Admin tests (Playwright)

- Google login flow
- Registration list loads
- Search by ID/email
- Filter by type/status
- Detail page view
- CSV export downloads
- Excel export downloads
- Committee CRUD
- Media upload

## CI pipeline

```yaml
# .github/workflows/supabase-ci.yml (future)
- prisma validate
- prisma migrate diff (no drift)
- vitest unit
- vitest integration (supabase local)
- playwright admin (staging)
```

## Acceptance criteria (cutover gate)

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Migration verification PASS
- [ ] Security tests PASS
- [ ] 1 browser Conclave E2E on staging
- [ ] 1 paid Delegate E2E on staging
- [ ] Admin dashboard E2E on staging
- [ ] Load test meets targets
