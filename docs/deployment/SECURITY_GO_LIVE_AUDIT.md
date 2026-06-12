# Security Go-Live Audit

**Date:** June 2026  
**Automated:** `staging-security-check.mjs` → **9/9 PASS**  
**Local env:** **21/21 PASS**

---

## P0 — Must pass before production

| # | Control | Status | Evidence |
|---|---------|--------|----------|
| 1 | Registration GET requires token/email | **PASS** | Route returns 401 without auth |
| 2 | Public registration strips PII | **PASS** | `toPublicRegistrationSummary()` |
| 3 | HMAC lookup tokens | **PASS** | Crypto tests 3/3 |
| 4 | Admin signed HttpOnly session | **PASS** | `admin-session.ts` |
| 5 | Legacy cookie `=1` rejected | **PASS** | Middleware |
| 6 | `ADMIN_OPS_SECRET` configured | **PASS** | Local + Vercel Production |
| 7 | `ADMIN_SESSION_SECRET` configured | **PASS** | Local + Vercel Production |
| 8 | `REGISTRATION_LOOKUP_SECRET` configured | **PASS** | Local + Vercel Production |
| 9 | v2 admin routes protected | **PASS** | 52+ routes via `requireAdminSecret` |
| 10 | Firestore rules deny client create | **PASS** | `registrations create: false` |
| 11 | Firestore rules deployed to production | **BLOCKER** | Repo only — manual deploy |
| 12 | Domain/canonical alignment | **BLOCKER** | `.org` vs `.com` mismatch |

**P0 blockers: 2** (Firebase rules deploy, domain alignment)

---

## P1 — Required before sign-off

| # | Control | Status | Notes |
|---|---------|--------|-------|
| 13 | `RAZORPAY_WEBHOOK_SECRET` on all envs | **WARNING** | Preview missing on Vercel |
| 14 | Rate limiting distributed | **WARNING** | In-memory only on Vercel |
| 15 | `/api/v2/registration/upload` open | **WARNING** | No auth — 30 req/min only |
| 16 | Supabase RLS applied | **WARNING** | SQL files not deployed |
| 17 | Preview env secrets | **WARNING** | 5 vars missing on Preview |
| 18 | Secrets exposed in chat | **WARNING** | Rotate DB password, webhook secret, API keys |
| 19 | Storage rules deny client write | **PASS** | `storage.rules` |
| 20 | `x-ops-secret` server-only | **PASS** | Not in client bundle |

---

## P2 — Post-launch hardening

| # | Control | Status |
|---|---------|--------|
| 21 | CSP header | Not configured |
| 22 | Distributed rate limit (Upstash/KV) | Not implemented |
| 23 | Upload route authentication | Open |
| 24 | Security smoke tests on live URL | Not executed |
| 25 | 48h staging soak | Not started |

---

## Middleware protection

Protected prefixes (`PROTECTED_DATA_ROUTE_PREFIXES`):
- `/AllData`, `/noticeboarddata`, `/participantregistrationdatadekh`, etc.
- Requires valid signed `smk_admin_session` cookie
- `/admin` routes pass through (Firebase client auth + API gateway)

---

## Public API exposure

| Endpoint | Auth | Rate limit |
|----------|------|------------|
| `GET /api/registration/[id]` | Token/email | 10/min |
| `POST /api/v2/analytics/track` | None | 120/min |
| `POST /api/v2/registration/upload` | **None** | 30/min |
| `POST /api/payments/razorpay-webhook` | HMAC signature | 100/min |
| v2 admin `/*` | `x-ops-secret` | Per-route |

---

## Classification summary

| Level | Pass | Warning | Blocker |
|-------|-----:|--------:|--------:|
| P0 | 10 | 0 | 2 |
| P1 | 2 | 6 | 0 |
| P2 | 0 | 5 | 0 |

---

## Pre-launch security commands

```bash
# Code verification
node scripts/staging-security-check.mjs

# Firebase rules (production project)
firebase deploy --only firestore:rules,storage

# Live smoke tests (after deploy)
curl -s -o /dev/null -w "%{http_code}" https://<domain>/api/registration/SMK2026-000001
# Expect: 401
```
