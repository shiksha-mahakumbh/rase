# Large File Refactor Plan (Phase 1 — Planning Only)

**Threshold:** >300 lines (TypeScript/TSX under `src/`)  
**Date:** 2026-05-29  
**No code splitting performed in Phase 1.**

## Priority matrix

| Risk | Definition |
|------|------------|
| **Critical** | Registration, payment, or Firestore write paths |
| **High** | Public routes + SEO landing; admin auth |
| **Medium** | Legacy content pages; internal datadekh |
| **Low** | Static data blobs; one-off admin tools |

---

## Files >300 lines

| Lines | Path | Risk | Refactor recommendation |
|------:|------|------|-------------------------|
| 792 | `src/app/academiccouncil/page.tsx` | High | Extract section components + move copy to `content/academic-council.ts`; keep route file <150 lines |
| 681 | `src/app/proceeding1/page.tsx` | Medium | Move paper metadata array to JSON/MDX; render list component |
| 624 | `src/app/proceeding2/page.tsx` | Medium | Same as proceeding1 |
| 490 | `src/app/component/Registration/DelegateForm.tsx` | **Critical** | **Protected** — extract sub-steps only with registration QA; no logic changes in Phase 1 |
| 465 | `src/app/component/RegistrationForm.tsx` | High | Legacy duplicate of hub flows — deprecate after hub parity audit |
| 427 | `src/app/component/Vibhag/academic/academic-content-data.ts` | Low | Already data-only; split by pillar (Olympiads, Awards, etc.) |
| 424 | `src/app/component/NavBar.tsx` | High | Split desktop/mobile nav; lazy-load mega-menu data |
| 419 | `src/app/component/Registration/HeiProjectForm.tsx` | Critical | Protected — extract field groups + Zod schema file |
| 418 | `src/app/component/Registration/SchoolProjectForm.tsx` | Critical | Protected |
| 379 | `src/app/admin/page.tsx` | High | Already partial dynamic imports — split dashboards per tab |
| 367 | `src/app/noticeboarddata/page.tsx` | Medium | Admin-only; extract table + filters |
| 363 | `src/app/component/Registration/AccomodationReg.tsx` | Critical | Protected |
| 343 | `src/app/component/Footer.tsx` | High | Split: `FooterLinks`, `FooterNewsletter` (Firebase), `FooterLogos` |
| 333 | `src/app/component/AbstractSubmission.tsx` | Medium | Align with `components/forms` patterns |
| 322 | `src/app/component/Registration/AbstractSubmission.tsx` | Critical | Protected — dedupe with non-Registration copy |
| 302 | `src/app/component/Fulllengthpaper.tsx` | Medium | Content + form split |

---

## Suggested phases

### Phase 2A — Safe content extractions
- `proceeding1/2/page.tsx` → data files
- `academic-content-data.ts` → per-domain modules

### Phase 2B — Shell performance
- `NavBar.tsx`, `Footer.tsx` (no registration logic)

### Phase 3 — Registration (gated)
- One form at a time with `saveRegistration.ts` contract tests
- Requires explicit approval per form

---

## Success metrics (future)

- No file in `src/app/**/page.tsx` >400 lines except generated listings
- Registration forms: shared `useRegistrationForm` hook + schema co-location
- Lighthouse TBT improvement on mobile after Footer/Nav split
