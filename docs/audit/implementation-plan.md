# Implementation Plan — Audit Remediation

**Project:** rase.co.in / Shiksha Mahakumbh  
**Plan version:** 1.0  
**Date:** 29 May 2026

---

## 1. Scope

Implement findings from the enterprise audit in priority order. **Phase 2 of this plan (current sprint) implements P0 only.** P1–P3 follow the roadmap in subsequent sprints.

---

## 2. P0 Implementation Detail

### 2.1 v2 Registration Submit Security (Issues 6.1, 7.1, 11.1)

**Problem:** `/api/v2/registration/submit` accepts client `paymentStatus` without fee/PAN/payment verification.

**Approach:**
1. Extract shared validation into `src/server/lib/registration-submit-guard.ts`
2. Mirror legacy checks: name, email, phone, fee match, PAN, payment proof, `assertVerifiedPaymentForSubmit`
3. Wire v2 route through guard before `saveRegistration`
4. Add source-level security test in `scripts/test-v2-registration-security.mjs`
5. Extend `staging-security-check.mjs` with file presence assertions

**Files touched:**
- `src/server/lib/registration-submit-guard.ts` (new)
- `src/app/api/v2/registration/submit/route.ts`
- `scripts/test-v2-registration-security.mjs` (new)
- `scripts/staging-security-check.mjs`
- `package.json` (`test:security` script)

**Rollback:** Revert v2 route only; legacy `/api/registration/submit` unchanged.

**Tests:** Security script asserts guard imports in v2 route; manual POST without payment returns 400.

---

### 2.2 v2 Registration Upload Bucket (Issue 6.2)

**Problem:** Client can select `media`, `committee`, `downloads` buckets.

**Approach:**
1. Extract `TYPE_BUCKET_MAP` + `resolveUploadBucket(registrationType)` to `src/server/lib/registration-upload-bucket.ts`
2. v2 route requires `registrationType` form field; ignore client `bucket`
3. Reuse v1 validation (`isSupportedType`, field name required)

**Files touched:**
- `src/server/lib/registration-upload-bucket.ts` (new)
- `src/app/api/v2/registration/upload/route.ts`
- `src/app/api/registration/upload/route.ts` (import shared map)

**Rollback:** Revert v2 upload route.

---

### 2.3 CSP + HTML Sanitization (Issue 6.3)

**Problem:** No Content-Security-Policy; CMS HTML rendered unsanitized.

**Approach:**
1. Install `isomorphic-dompurify`
2. Create `src/lib/security/sanitize-html.ts` with allowlist tags/attributes
3. Create `src/components/common/SafeHtml.tsx` wrapper component
4. Replace `dangerouslySetInnerHTML` in CMS content components (legal, department, event, speaker, press)
5. Add CSP header in `next.config.js` allowing known third parties (GTM, GA, Razorpay, Clarity, Meta, AdSense, Supabase, Vercel)

**Files touched:**
- `package.json`
- `src/lib/security/sanitize-html.ts` (new)
- `src/components/common/SafeHtml.tsx` (new)
- `src/components/layouts/CmsLegalPage.tsx`
- `src/components/departments/CmsDepartmentPage.tsx`
- `src/components/events/CmsEventView.tsx`
- `src/components/speakers/CmsSpeakerView.tsx`
- `src/components/press/CmsPressArticleView.tsx`
- `src/components/press/PressArticleBody.tsx`
- `next.config.js`

**Rollback:** Remove CSP header entry; revert SafeHtml usage.

**Note:** JSON-LD `dangerouslySetInnerHTML` with `JSON.stringify` remains (safe).

---

### 2.4 Performance — P0 Baseline (Issue 5.1)

**Problem:** LCP 9–12s; Performance score 32–38.

**Approach (non-breaking, incremental):**
1. Document that full LCP recovery requires P1 performance sprint (Phase 5/6 deploy, image migration)
2. No registration-path changes in P0
3. Validate post-P0 with Lighthouse; expect improvement only after dedicated performance sprint

**Deferred to P1:** OptimizedImage migration, Botpress deferral, homepage cache tuning.

---

## 3. Validation Protocol (Per Fix)

After each atomic change:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Commit message format: `fix(security): <description>` or `fix(perf): <description>`

---

## 4. Dependency Graph

```
registration-submit-guard.ts
    ├── v2/submit/route.ts
    └── (future) legacy submit refactor

registration-upload-bucket.ts
    ├── v1/upload/route.ts
    └── v2/upload/route.ts

sanitize-html.ts + SafeHtml.tsx
    ├── CmsLegalPage
    ├── CmsDepartmentPage
    ├── CmsEventView
    ├── CmsSpeakerView
    └── Press components

CSP (next.config.js)
    └── independent; test after all P0 merges
```

**Blockers:**
- CSP must be last P0 commit (highest regression risk)
- DOMPurify install requires `npm install` before build

---

## 5. P1 Preview (Not in Current Sprint)

| Item | Implementation sketch |
|------|----------------------|
| Hreflang | Add `withHreflang()` to locale page metadata exports |
| `html lang` | Set in `[locale]/layout.tsx` and `hi/layout.tsx` |
| CI workflow | `.github/workflows/ci.yml` |
| Analytics consent | Gate `VisitorPageTracker` behind cookie consent |
| Sentry | `@sentry/nextjs` + `instrumentation.ts` |
| Newsletter unsubscribe | `/newsletter/unsubscribe` + API route |

---

## 6. Documentation Updates (P0)

- `docs/audit/security-review.md` (Phase 4)
- `docs/audit/production-checklist.md` (Phase 5)
- Update `docs/go-live/SECURITY_REVIEW_REPORT.md` cross-reference

---

## 7. Acceptance Criteria — P0 Sprint

- [ ] v2 submit rejects paid registration without verified Razorpay payment
- [ ] v2 upload rejects client `bucket` param; uses server-side type map
- [ ] CMS HTML passes through DOMPurify
- [ ] CSP header present on production responses
- [ ] `npm run lint && npm run typecheck && npm run test && npm run build` pass
- [ ] `npm run smoke:prod` 14/14 (post-deploy)

---

*Last updated: 29 May 2026*
