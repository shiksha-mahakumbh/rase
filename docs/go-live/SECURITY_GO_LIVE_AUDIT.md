# G3 — Auth & Security Go-Live Audit

**Audit date:** 2026-06-12  
**Method:** Code review + `scripts/staging-security-check.mjs` + middleware review

---

## Automated security checks

```bash
node scripts/staging-security-check.mjs
# Result: 9/9 PASS
```

| Test | Result |
|------|--------|
| Registration lookup HMAC (valid / wrong ID / tampered) | PASS |
| Admin session HMAC (valid / legacy `=1` rejected) | PASS |
| GET `/api/registration/[id]` requires auth | PASS |
| Middleware rejects legacy admin cookie | PASS |
| Registration backend supabase-only | PASS |
| No Firebase runtime imports in `src/` | PASS |

---

## Supabase Auth (admin)

| Component | Implementation | Status |
|-----------|----------------|--------|
| Login | `POST /api/admin/login` → Supabase email/password | ✅ |
| Role resolution | Prisma RBAC `users` + `user_roles` | ✅ |
| Session | HMAC signed cookie (`ADMIN_SESSION_COOKIE`) | ✅ |
| Bootstrap | `GET /api/admin/session/bootstrap` | ✅ |
| CMS gate | Email/password form in `AdminGate.tsx` | ✅ |
| Gateway | `/api/admin/gateway/*` → v2 admin with `x-ops-secret` | ✅ |

**Not verified live:** Supabase Auth users created for all admins; password reset flow; MFA (not implemented).

---

## Registration public security

| Control | Location | Status |
|---------|----------|--------|
| reCAPTCHA on submit | `/api/registration/submit` | ✅ Code |
| Rate limit submit (15/min/IP) | `rateLimit` | ✅ In-memory |
| Rate limit upload (30/min/IP) | upload route | ✅ In-memory |
| Lookup token (HMAC + expiry) | `registration-lookup.ts` | ✅ Tested |
| GET registration requires email or token | route handler | ✅ Tested |
| PII in public responses | Summary-only via lookup | ✅ |

**Gap:** Rate limiting is **process-local** — not distributed across Vercel instances (P2).

---

## Admin authorization

| Path | Protection |
|------|------------|
| `/admin/*` data export pages | Middleware → HMAC session |
| `/api/v2/admin/*` | `requireAdmin` + ops secret |
| Legacy `*datadekh` pages | Middleware protected |

**Gap:** `/admin` page itself does not require auth in middleware (login UI only) — acceptable.

---

## Local environment security audit

`node scripts/staging-env-check.mjs` (local `.env`):

| Result | Detail |
|--------|--------|
| 20/21 pass | **`REGISTRATION_BACKEND` fail** — likely set to legacy value (`firebase`) in local env; code ignores and uses supabase |

Secrets present locally: admin, DB, Supabase, SMTP, Razorpay, reCAPTCHA — **good for dev**.

---

## Stale security surface

| Item | Risk |
|------|------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` on Vercel | Unnecessary secret exposure post-exit |
| `verify-env.mjs` requires Firebase JSON | False FAIL for new stack |
| Privacy policy cites Firebase infrastructure | Legal/accuracy |
| Live production (pre-deploy) may still run **old Firebase build** | **P0** — stale deployment risk from prior audit |

---

## Security score

| Dimension | Score /100 | Notes |
|-----------|------------|-------|
| Auth design | 85 | Supabase + HMAC solid |
| Authorization | 80 | RBAC wired; live admin users unverified |
| Registration privacy | 88 | Lookup token + rate limits |
| Ops secrets | 70 | Firebase secret still on Vercel |
| Live production parity | 40 | New code not deployed |

**G3 verdict:** **CONDITIONAL PASS** on source code; **FAIL** on live production until redeploy + secret cleanup.
