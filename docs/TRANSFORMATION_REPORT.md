# Transformation Report — Shiksha Mahakumbh (rase.co.in)

**Date:** May 2026  
**Scope:** Security, SEO, admin, registration hub, legal compliance (incremental)

---

## 1. Folder Structure (key paths)

```txt
rase/
├── docs/
│   ├── AUDIT_REPORT.md
│   └── TRANSFORMATION_REPORT.md
├── firebase/
│   ├── firestore.rules      # template — deploy via Firebase Console
│   └── storage.rules
├── src/
│   ├── app/
│   │   ├── registration/     # canonical hub
│   │   ├── admin/
│   │   ├── api/registration/send-email/
│   │   ├── privacy-policy|terms-and-conditions|disclaimer|refund-policy/
│   │   ├── robots.ts, sitemap.ts
│   │   └── middleware.ts
│   ├── components/common/CookieConsent.tsx
│   ├── config/site.ts
│   ├── constants/routes.ts, auth.ts
│   └── lib/
│       ├── services/firestore/registrations.ts
│       ├── seo/metadata.ts
│       └── saveRegistration.ts
```

Full enterprise restructure (`src/modules/…`) deferred to avoid breaking 100+ legacy routes.

---

## 2. Issues Found (summary)

| Area | Issue | Status |
|------|--------|--------|
| Security | 20+ `*datadekh*` routes exposed PII | Middleware + admin cookie (partial) |
| Security | No Firestore rules in repo | Template added — **must deploy** |
| Security | Hardcoded Firebase keys | Still in `firebase.ts` — move to env |
| API | 12 pages call missing `/api/sendMail` | Not fixed (legacy) |
| Admin | Full collection `getDocs` | Paginated (50/page) + full fetch on export |
| Email | Unauthenticated send-email | Optional secret + require flag |
| Code | `firebase1.ts` duplicate | Removed |
| Layout | Microphone permission dead code | Removed |
| AdSense | Missing legal links in footer | Added |
| SEO | Per-page metadata incomplete | Infrastructure added; pages incremental |

---

## 3. Improvements Applied

- **Admin:** Pagination, load more, approved/verified/revenue stats, export loads full dataset
- **Auth:** `smk_admin_session` cookie on admin login for middleware access to datadekh routes
- **Legal:** Privacy, Terms, Disclaimer, Refund pages + footer links
- **Cookie consent** wired in root layout
- **Security headers** in `next.config.js`
- **SEO:** `robots.ts`, `sitemap.ts`, `createPageMetadata()` helper
- **Registration:** Single hub `/registration`; legacy routes redirect
- **Email API:** Optional `REGISTRATION_EMAIL_SECRET` / `REGISTRATION_EMAIL_REQUIRE_SECRET`

---

## 4. Security Report

| Fix | Notes |
|-----|-------|
| Middleware | Redirects unauthenticated users from PII export routes to `/admin` |
| Admin cookie | Set on successful role resolution |
| Headers | X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy |
| Firestore rules | Template — tighten `allow create` on registrations before prod |
| reCAPTCHA | Not implemented — recommended on all registration forms |
| Rate limiting | Not implemented — use Vercel/Cloudflare or API middleware |

**Production readiness:** ~55/100 (up from ~47) after this pass.

---

## 5. SEO Report

- Global metadata remains in `layout.tsx` (client component limits App Router metadata API on root)
- `sitemap.ts` and `robots.ts` generated
- Per-route `metadata` export: apply via `createPageMetadata()` on server pages over time
- JSON-LD: helpers in `src/config/site.ts` — wire on home/event pages next

---

## 6. Mobile Report

- Registration forms use responsive Tailwind grids (existing)
- Admin table: horizontal scroll on small screens (existing)
- Full UI redesign (Phase 6) not completed in this pass

---

## 7. Performance Report (estimates)

| Metric | Before | Target | Notes |
|--------|--------|--------|-------|
| Performance | ~60 | 95 | Remove unused deps (express, sequelize); lazy-load gallery |
| SEO | ~70 | 100 | Per-page metadata + schema |
| Accessibility | ~75 | 100 | ARIA on forms incrementally |
| Admin load | O(n) all docs | O(50) pages | Done |

---

## 8. Deployment Checklist

- [ ] Deploy `firebase/firestore.rules` and `storage.rules`
- [ ] Set `NEXT_PUBLIC_FIREBASE_*` and remove hardcoded keys
- [ ] Set `REGISTRATION_EMAIL_SECRET` (optional); `REGISTRATION_EMAIL_REQUIRE_SECRET=true` only if using server-only email
- [ ] Verify SMTP app password in production env
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS` for bootstrap admins
- [ ] Create Firestore index: `registrations` → `createdAt` desc
- [ ] Test `/admin` login + datadekh route with cookie
- [ ] Test registration → success → email
- [ ] Fix or remove legacy `/api/sendMail` callers

---

## 9. Future Roadmap

### 3 months
- reCAPTCHA v3 on registration
- Firebase env migration + Admin SDK for server writes
- Paginated admin with server-side aggregates
- Fix legacy sendMail or migrate datadekh to admin-only export API

### 6 months
- `next-intl` (EN/HI/FR/ES/AR)
- Razorpay webhooks + payment verification
- Audit log collections (`audit_logs`, admin activity)
- Split `AcademicCouncil24.tsx`

### 12 months
- Full folder migration under `src/modules`
- Certificate/QR system for participants
- Lighthouse 95+ with image/font optimization pass

---

## 10. Errors Fixed (this pass)

```txt
Errors Found          Root Cause                    Fix Applied
─────────────────────────────────────────────────────────────────
Admin infinite load   Firestore hang / no finally   Timeouts + bootstrap email
firebase1 unused      Duplicate init                Deleted
Mic permission code   Legacy experiment             Removed from layout
PII routes public     No middleware               Cookie + middleware
Admin O(n) fetch      getDocs all                 Pagination service
Export incomplete     Only loaded page              fetchAllRegistrations on export
```

Run `npm run build` after env changes to verify.
