# Domain Mismatch Audit

**Date:** June 2026  
**Project:** `dhe-projects/rase-co-in`  
**Auditor role:** Pre-production deployment validation

---

## Executive finding

**DOMAIN MISMATCH EXISTS — P0 for production SEO and webhooks**

| Source | Domain |
|--------|--------|
| `NEXT_PUBLIC_SITE_URL` (local + Vercel Production) | `https://shikshamahakumbh.org` |
| Vercel registered domain | `shikshamahakumbh.com` (only `.com` listed) |
| Razorpay webhook (user-configured) | `https://shikshamahakumbh.com/api/payments/razorpay-webhook` |
| Hardcoded in codebase (majority) | `shikshamahakumbh.com` |
| Fallback in `src/config/site.ts` | `https://www.rase.co.in` |

**`shikshamahakumbh.org` is NOT registered on the Vercel team domain list.**

---

## Canonical domain determination

| Candidate | Evidence FOR | Evidence AGAIN |
|-----------|--------------|----------------|
| **shikshamahakumbh.com** | Vercel domain registered (648d); 28+ code references; `organization.ts` canonical link; SEO `sameAs`; Razorpay webhook URL; user-facing contact emails | Env var currently `.org` |
| **shikshamahakumbh.org** | `NEXT_PUBLIC_SITE_URL`; SMTP `noreply@`; registration UID suffix | Not on Vercel; minimal code references (5 files) |
| **rase.co.in** | `site.ts` fallback; legacy brand | Not primary Mahakumbh brand |

### Recommendation (do not auto-apply)

**Canonical production domain: `https://shikshamahakumbh.com`**

Rationale: Vercel hosts `.com`; codebase and Razorpay already target `.com`; `.org` env creates split canonicals.

---

## Occurrence inventory

### `shikshamahakumbh.com` (28 files)

| Category | Files |
|----------|-------|
| Organization config | `src/config/organization.ts` |
| SEO schema | `src/server/services/seo.service.ts` (`sameAs`) |
| Legal pages | `privacy-policy`, `cookie-policy`, `refund-policy` |
| Error UI | `src/app/error.tsx`, `src/components/errors/ErrorBoundary.tsx` |
| Registration success | `SuccessExperience.tsx` (contact email) |
| Academic dept pages | 8× `Vibhag/academic/pages/*.tsx`, `AcademicCouncilUI.tsx` |
| Press legacy | 6× `press/*/LegacyArticle.tsx` |
| Donate component | `src/app/component/donate.tsx` |
| Seeds | `seed-s2-content.mjs`, `seed-s2-hi.mjs` |
| Docs | `docs/P3_PRE_DEPLOYMENT_REPORT.md` |

### `shikshamahakumbh.org` (5 files)

| File | Usage |
|------|-------|
| `.env` / `.env.local` | `NEXT_PUBLIC_SITE_URL` |
| `.env.example`, `.env.supabase.example` | SMTP_FROM default |
| `src/server/services/email.service.ts` | `noreply@` fallback |
| `src/app/api/registration/send-email/route.ts` | `noreply@` fallback |
| `src/components/registration/SuccessExperience.tsx` | UID suffix `@shikshamahakumbh.org` |

### Runtime-derived URLs (use `SITE_URL` from env)

| System | File | Impact if env wrong |
|--------|------|---------------------|
| Sitemap | `src/app/sitemap.ts` | Wrong URLs in sitemap.xml |
| Robots | `src/app/robots.ts` | Wrong sitemap pointer |
| OG / metadata | `src/config/site.ts` | Wrong canonical, OG image |
| CMS SEO | `src/server/services/seo.service.ts` | Mixed with hardcoded `.com` in schema |
| Event/speaker schema | `src/app/events/page.tsx`, components | `${SITE_URL}` paths |

---

## Impact analysis

### SEO impact — **HIGH**

- Sitemap and robots use `SITE_URL` → currently emit **`.org`** URLs
- Organization schema `sameAs` hardcodes **`.com`**
- Google may index both domains if both resolve; duplicate canonical signals

### Webhook impact — **HIGH**

- Razorpay posts to **`shikshamahakumbh.com`**
- If production serves only `.org` (or vice versa), webhooks may hit wrong host or 404
- **Webhook domain must match live deployment domain**

### Auth / cookie impact — **LOW**

- Admin session cookie: `path=/`, `sameSite=lax` — no domain attribute
- Cookies work on whichever host serves the app
- No cross-subdomain SSO configured

### Email impact — **MEDIUM**

- Outbound: `noreply@shikshamahakumbh.org` (SMTP_FROM)
- Contact display: `academics@shikshamahakumbh.com`
- Mixed branding in user communications

---

## Exact remediation plan (manual — NOT auto-applied)

### Step 1 — Decide canonical (recommended: `.com`)

Stakeholder confirms: **`https://shikshamahakumbh.com`** as primary.

### Step 2 — Vercel domain wiring

1. Vercel → `rase-co-in` → Settings → Domains
2. Ensure `shikshamahakumbh.com` is assigned to **Production**
3. If `.org` is desired long-term: add `shikshamahakumbh.org` to Vercel and configure redirect `.org` → `.com` (or reverse)

### Step 3 — Environment variables (all environments)

```
NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.com
```

Update: Production, Preview (all branches), Development, local `.env` / `.env.local`.

### Step 4 — Razorpay webhook

Confirm webhook URL matches canonical:

```
https://shikshamahakumbh.com/api/payments/razorpay-webhook
```

### Step 5 — Code alignment (separate PR after domain decision)

| Priority | Action |
|----------|--------|
| P1 | Align `SuccessExperience.tsx` UID suffix with canonical TLD |
| P1 | Unify `seo.service.ts` `sameAs` to use `SITE_URL` not hardcoded `.com` |
| P2 | Align SMTP_FROM with chosen domain |
| P3 | Update legacy press/academic hardcoded strings (cosmetic) |

### Step 6 — Verify

```bash
curl -sI https://shikshamahakumbh.com/robots.txt
curl -s https://shikshamahakumbh.com/sitemap.xml | head
# Confirm <loc> URLs use single domain
```

---

## Verdict

| Item | Status |
|------|--------|
| Mismatch exists? | **YES** |
| Auto-fixed? | **NO** (per instructions) |
| Blocks production? | **YES** (SEO + webhook alignment) |
| Blocks staging? | **WARNING** only |
