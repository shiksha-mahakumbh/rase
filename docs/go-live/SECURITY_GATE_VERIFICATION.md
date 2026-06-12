# Security Gate Verification

**Date:** 2026-05-29

---

## Automated Tests — ✅ 15/15 PASS

```bash
npm run test:security
```

| Suite | Pass | Fail |
|-------|------|------|
| `staging-security-check.mjs` | 9 | 0 |
| `test-registration-lookup-security.mjs` | 6 | 0 |

### Key assertions

- HMAC registration lookup token (valid / wrong ID / tampered)
- HMAC admin session (valid / legacy cookie rejected)
- Route requires token **or** email → **401** without credentials
- PII stripped from public summary (no email/phone keys)
- No Firebase runtime imports under `src/`
- Registration backend defaults to `supabase`

---

## Source Code Enforcement

### Registration lookup — token OR email required

```48:54:src/app/api/registration/[registrationId]/route.ts
  const email = await resolveVerifiedEmail(registrationId, request);
  if (!email) {
    return NextResponse.json(
      { error: "Email or confirmation token required" },
      { status: 401 }
    );
  }
```

### PII not exposed in public summary

`toPublicRegistrationSummary()` returns only: `registrationId`, `registrationType`, `fullName`, `institution`, `paymentStatus`, `accommodationRequired`, `accommodationStatus`, `createdAt`.

### HMAC admin sessions

- `src/lib/security/admin-session.ts` — Node HMAC-SHA256 signed cookies
- `src/lib/security/admin-session-edge.ts` — Edge middleware verification
- Legacy `=1` cookie rejected by middleware tests

### Rate limiting

Registration lookup: 10 req/min/IP (`rateLimit` in route handler).

---

## Live Production — ❌ FAIL (stale deploy)

```
GET https://www.rase.co.in/api/registration/SMK2026-000001
→ HTTP 200
→ Body includes email + contactNumber (PII)
```

Live behavior **does not match** remediated source. Confirms production deploy blocker.

---

## RLS Defense in Depth — ✅ Applied (public schema)

55 RLS policies on `public` tables including:

- `registrations_deny_anon_all`
- `registration_counters_deny_all`
- Admin-only SELECT/UPDATE via `is_admin_user()`

Service role (Next.js API) bypasses RLS by design; application-layer auth is primary gate.

---

## Verdict

| Gate | Source | Live |
|------|--------|------|
| 401 without credentials | ✅ | ❌ |
| No email exposure | ✅ | ❌ |
| No phone exposure | ✅ | ❌ |
| HMAC admin sessions | ✅ | Unverified live |
| Automated tests | ✅ 15/15 | N/A |

**Security gate: PASS in source; FAIL on live until redeploy.**

---

*Tests run locally 2026-05-29; live probe against production URL.*
