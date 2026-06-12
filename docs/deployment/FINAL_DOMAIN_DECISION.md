# Final Domain Decision

**Date:** June 2026  
**Role:** Principal Release Manager  
**Status:** Decision document — **no automatic domain changes applied**

---

## Decision summary

| Question | Answer |
|----------|--------|
| Canonical domain mismatch? | **YES** |
| Authoritative domain | **`https://shikshamahakumbh.com`** |
| `shikshamahakumbh.org` role | Secondary / email TLD only — **not on Vercel** |
| Auto-changed? | **NO** (per release policy) |

---

## Evidence matrix

| Evidence source | `.com` | `.org` | `rase.co.in` |
|-----------------|--------|--------|--------------|
| Vercel team domains (`vercel domains ls`) | ✅ Registered (648d) | ❌ Not listed | ✅ Registered |
| `NEXT_PUBLIC_SITE_URL` (`.env`, Vercel Prod+Dev) | ❌ | ✅ `https://shikshamahakumbh.org` | — |
| Razorpay webhook (user config) | ✅ `/api/payments/razorpay-webhook` | ❌ | — |
| Hardcoded in `src/` (grep) | **28 files** | **5 files** | Fallback in `site.ts` |
| `src/config/organization.ts` | ✅ Primary website link | — | Partner link |
| `seo.service.ts` `sameAs` | Was hardcoded (fixed → `SITE_URL`) | — | — |
| Sitemap (`sitemap.ts`) | Uses `SITE_URL` → **`.org` today** | Emits `.org` URLs | — |
| Robots (`robots.ts`) | Uses `SITE_URL` → **`.org` today** | — | — |
| SMTP / email defaults | Contact: `.com` | `noreply@`: `.org` | — |
| Middleware | Host-agnostic cookies | — | — |
| `legacy-redirects.js` | Path-only (no TLD) | — | — |
| `next.config.js` | No domain redirects | — | — |

**Weight of evidence: `.com` is the operational and brand-primary domain.**

---

## Why `shikshamahakumbh.com` (not `.org`)

1. **Vercel hosts `.com`** — production traffic resolves here; `.org` is not attached to the project.
2. **Razorpay webhook** already targets `.com` — changing canonical to `.org` would break payment confirmation unless webhook is re-registered.
3. **Codebase majority** — organization config, legal pages, press, academic departments, donate links all reference `.com`.
4. **Historical brand** — public-facing website strings use `www.shikshamahakumbh.com` for 648+ days on Vercel.

**Why not `.org` as canonical today:** not on Vercel, minimal code footprint, conflicts with webhook and 28 hardcoded `.com` references.

---

## Files affected (complete inventory)

### Runtime URLs (driven by `NEXT_PUBLIC_SITE_URL`)

| File | Impact when env = `.org` |
|------|--------------------------|
| `src/config/site.ts` | `SITE_URL`, OG image, org schema `url` |
| `src/app/sitemap.ts` | All `<loc>` entries |
| `src/app/robots.ts` | `sitemap:` pointer |
| `src/server/services/seo.service.ts` | CMS sitemap index, canonical builder |
| All pages using `SITE_URL` in metadata | Events, speakers, partners schema |

### Hardcoded `.com` (28 source files — unchanged)

| Category | Key files |
|----------|-----------|
| Config | `src/config/organization.ts` |
| Legal | `privacy-policy`, `cookie-policy`, `refund-policy` |
| UI | `error.tsx`, `ErrorBoundary.tsx`, `donate.tsx` |
| Academic | 9× `Vibhag/academic/**` |
| Press | 6× `press/*/LegacyArticle.tsx` |
| Seeds | `seed-s2-content.mjs`, `seed-s2-hi.mjs` |
| Registration UI | `SuccessExperience.tsx` (contact email `.com`) |

### Hardcoded `.org` (5 source files — unchanged)

| File | Usage |
|------|-------|
| `.env` / `.env.local` | `NEXT_PUBLIC_SITE_URL` |
| `email.service.ts` | `noreply@shikshamahakumbh.org` fallback |
| `send-email/route.ts` | Same |
| `SuccessExperience.tsx` | UID suffix `@shikshamahakumbh.org` |
| `.env.example` | SMTP_FROM default |

---

## Redirect strategy (manual implementation)

### Phase 1 — Canonical on `.com` (recommended)

```
1. Vercel → rase-co-in → Domains → assign shikshamahakumbh.com → Production
2. Set NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.com (all envs)
3. Redeploy Production
```

### Phase 2 — If `.org` is owned and should not 404

```
Option A (Vercel): Add shikshamahakumbh.org → redirect 308 → shikshamahakumbh.com
Option B (DNS): CNAME .org → Vercel + redirect rule in next.config.js (future PR)
```

**Do not implement Phase 2 until `.org` DNS is confirmed owned and pointed to Vercel.**

### Phase 3 — Legacy `rase.co.in`

```
Keep rase.co.in as secondary brand domain.
Add Vercel redirect: rase.co.in → shikshamahakumbh.com (optional, stakeholder decision)
```

### Path redirects (already implemented)

`src/config/legacy-redirects.js` — 30+ path-level 301s (no TLD changes needed).

---

## SEO impact

| Issue | Severity | Effect |
|-------|----------|--------|
| Sitemap emits `.org` URLs while site serves `.com` | **HIGH** | Split indexing, wrong canonicals in GSC |
| Organization schema `sameAs` was hardcoded `.com` vs env `.org` | **MEDIUM** | Fixed in Phase 8 — now uses `SITE_URL` |
| Duplicate TLD in content (emails, footers) | **LOW** | Brand confusion, not crawl-splitting |
| `rase.co.in` fallback in `site.ts` | **LOW** | Only when env unset |

**After canonical fix:** Re-submit sitemap in Google Search Console under `.com` property.

---

## Razorpay impact

| Item | Current | Required |
|------|---------|----------|
| Webhook URL | `https://shikshamahakumbh.com/api/payments/razorpay-webhook` | **Keep on `.com`** |
| Site URL env | `.org` | **Change to `.com`** for OG/email consistency |
| Payment logic | Unchanged | No code changes needed |

**Risk if canonical set to `.org` without webhook update:** Razorpay posts to `.com`, app generates links on `.org` — payment state updates work but user-facing URLs diverge.

---

## Safe fix applied (metadata only)

| File | Change |
|------|--------|
| `src/server/services/seo.service.ts` | `buildOrganizationSchema().sameAs[0]` → `SITE_URL` (was hardcoded `.com`) |

**Does not change `NEXT_PUBLIC_SITE_URL` or any domain configuration.**

---

## Stakeholder action required

```
[ ] Confirm canonical: shikshamahakumbh.com
[ ] Update NEXT_PUBLIC_SITE_URL on Vercel (Production, Preview, Development)
[ ] Update local .env / .env.local to match
[ ] Redeploy Production
[ ] Verify Razorpay webhook still points to .com
[ ] Re-submit sitemap to GSC
[ ] (Optional) Plan code PR to align .org email/UID strings — separate sprint
```
