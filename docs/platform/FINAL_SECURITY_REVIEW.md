# Final Security Review — Enterprise Readiness

**Date:** May 2026  
**Current:** 88 · **Target:** 95 · **Registration:** Firebase isolated

---

## Architecture summary

```
Public → Rate-limited v2 APIs → Prisma (service role)
Admin CMS → Firebase OAuth → Gateway → x-ops-secret → v2 admin APIs
Firebase Registration → Firestore rules (unchanged)
RLS → Defense-in-depth (Prisma bypasses for server routes)
```

---

## Control matrix

| Control | Status | Score | Gap |
|---------|--------|------:|-----|
| Admin gateway auth | ✅ Firebase + ops-secret | 95 | Gateway audit log |
| Public API rate limits | ✅ 5–120/min | 90 | In-memory resets on cold start |
| reCAPTCHA (contact, reg v2) | ✅ | 85 | Feedback lacks captcha |
| Bot filtering (analytics) | ✅ | 90 | — |
| Admin path analytics exclusion | ✅ Phase S | 95 | — |
| Secrets server-only | ✅ | 95 | — |
| Upload MIME validation | ⚠️ Partial | 75 | Whitelist extension |
| RLS policies written | ✅ 6 files | 70 | Staging verify pending |
| RBAC schema | ✅ | 50 | Not wired to CMS UI |
| Audit logs | ✅ API | 60 | No admin UI |
| Storage RLS | ⚠️ Template | 65 | Not fully applied |

---

## RLS policy inventory

| File | Tables | Applied? |
|------|--------|----------|
| cms.sql | pages, sections, seo, media | Verify |
| phase_b.sql | notices, settings, menus, bars | Verify |
| analytics.sql | visitor_* | Verify |
| admin.sql | RBAC, committees, events, contact | Verify |
| registrations.sql | registration tables | Verify |
| storage.sql | buckets | Template only |

**Recommendation:** Run policy apply checklist before production deploy.

---

## Admin permissions (target state)

| Role | Permissions (future) |
|------|---------------------|
| Super Admin | All modules |
| Content Editor | Pages, notices, downloads, media |
| Communications | Notices, announcement bars, press |
| SEO Manager | SEO metadata only |
| Registration Ops | Firebase admin only |
| Analytics Viewer | Read-only analytics |

**Today:** All CMS admins have full access via shared ops-secret.

---

## Upload security

| Check | Status | Action |
|-------|--------|--------|
| Admin-only upload | ✅ | — |
| File size limits | ✅ | — |
| MIME whitelist | ⚠️ | pdf, jpg, png, webp only |
| Virus scan | ❌ | ClamAV or cloud scan at scale |
| Signed URLs for private | N/A | Public CDN URLs |

---

## API security

| Endpoint class | Protection |
|----------------|------------|
| Public read | Rate limit |
| Public write (contact, feedback) | Rate limit + captcha (partial) |
| Admin write | Gateway + ops-secret |
| Registration (Firebase) | Firebase rules (unchanged) |
| Payment webhooks | Signature verify |

---

## Enterprise checklist (target 95)

- [ ] RLS verified in production Supabase
- [ ] Gateway audit logging (email + path + method)
- [ ] Per-role CMS permissions (RBAC wire-up)
- [ ] Feedback reCAPTCHA
- [ ] Upload MIME hardening
- [ ] Redis rate limiting at scale
- [ ] Security headers (CSP, HSTS) review
- [ ] Penetration test before SMK 6.0 launch
- [ ] Secrets rotation procedure documented

---

## Excluded (permanent)

- Firebase registration rule changes (until approved migration)
- Razorpay webhook logic changes
- Abstract/paper submission backends

**Status: REVIEW ONLY — no code changes**
