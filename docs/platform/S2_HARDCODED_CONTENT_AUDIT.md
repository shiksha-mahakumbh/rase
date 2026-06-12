# S2 Hardcoded Content Audit

**Date:** May 2026  
**Scope:** 10 Priority-1 S2 items · **No code changes in this document**

---

## Summary

| # | Area | Routes/Files | HC % | CMS today | Migration complexity |
|---|------|-------------|-----:|-----------|-------------------|
| 1 | Press articles | 9 + hub | 100% | 0% | High (Hindi prose, images) |
| 2 | Legal pages | 5 | 100% | 0% | Low (HTML prose) |
| 3 | Gallery | 1 + homepage | 100% | 0% | Medium (albums + static tree) |
| 4 | Contact inbox | 0 public | N/A | API only | Low (admin UI) |
| 5 | Feedback inbox | 0 public | N/A | API only | Low (admin UI) |
| 6 | FAQ | homepage JSON | 70% embedded | Partial | Medium (new module) |
| 7 | Departments | 5 | 100% | 0% | Medium (vibhag data) |
| 8 | Homepage gallery | 1 section | 100% | 0% | Low (section JSON) |
| 9 | Hindi CMS | 0 rows | 100% | Loader ready | Low (seed) |
| 10 | Public media | media library | 0% public | Admin only | Medium (public API) |

---

## 1. Press Articles

| Slug | File | Lines | Language | Images |
|------|------|------:|----------|--------|
| `education-summit-coverage` | press/.../page.tsx | ~120 | EN | 1 |
| `baton-ceremony-smk-4` | press/.../page.tsx | ~100 | EN | 1 |
| `summit-highlights` | press/.../page.tsx | ~80 | EN | 1 |
| `shiksha-mahakumbh-4-0` | press/.../page.tsx | ~90 | HI | 1 |
| `residential-camp-success` | press/.../page.tsx | ~85 | HI | 1 |
| `residential-camp-hindi` | press/.../page.tsx | ~90 | HI | 1 |
| `mahakumbh-programme-update` | press/.../page.tsx | ~75 | HI | 1 |
| `national-coverage` | press/.../page.tsx | ~100 | HI | 1 |
| `education-movement` | press/.../page.tsx | ~126 | HI | 1 |

**Hub:** `Press.tsx` — 6 hardcoded cards with images and links  
**Pattern:** `"use client"` + inline `data.sections[]` + legacy Press1–9 components  
**SEO:** `pressArticleMeta()` static registry in `publicPages.ts`

---

## 2. Legal Pages

| Route | File | Words est. |
|-------|------|----------|
| `/privacy-policy` | privacy-policy/page.tsx | ~400 |
| `/terms-and-conditions` | terms-and-conditions/page.tsx | ~350 |
| `/cookie-policy` | cookie-policy/page.tsx | ~200 |
| `/disclaimer` | disclaimer/page.tsx | ~150 |
| `/refund-policy` | refund-policy/page.tsx | ~200 |

**Pattern:** `LegalPageShell` + inline HTML paragraphs  
**PageType target:** `policy`

---

## 3. Gallery

| Location | Source | Items |
|----------|--------|------:|
| `/gallery` | `GalleryPage.tsx` → `TreeComponent` | Edition tree (client) |
| Homepage | `slides-data.ts` | 8 slides hardcoded |
| Homepage | `GallerySection.tsx` | Uses slides-data |

**No connection to MediaAsset table on public site.**

---

## 4–5. Contact / Feedback

| Item | Public | Admin API | Admin UI |
|------|--------|-----------|----------|
| Contact form | ✅ POST /api/v2/contact | ✅ GET admin | ❌ |
| Feedback form | ✅ POST /api/v2/feedback | ✅ GET admin | ❌ |

**Schema:** `adminReply`, `status`, `repliedAt` exist — PATCH API missing.

---

## 6. FAQ

| Location | Source |
|----------|--------|
| Homepage | `homepage.stats.faqs` JSON (3 items in seed) |
| `HomeJsonLd` | `extractHomepageFaqs()` from CMS |
| Standalone page | None |

---

## 7. Department Pages

| Route | Data source | Slug |
|-------|-------------|------|
| `/departments/academic-council` | `vibhag-pages.ts` + inline TSX | AcademicCouncil24 |
| `/departments/prabandhan` | same | Prabandhan24 |
| `/departments/prachar` | same | Prachar24 |
| `/departments/sampark` | same | Sampark24 |
| `/departments/vitt` | same | Vitt24 |

**Content:** Large inline schedule/program arrays per department page file.

---

## 8. Homepage Gallery Manager

**Section key:** Not in CMS homepage sections (uses separate `GallerySection` component)  
**Data:** `homeSlides` in `slides-data.ts` — 8 entries with src, alt, legend

---

## 9. Hindi CMS

| Entity | en seeded | hi seeded |
|--------|-----------|-----------|
| Homepage sections | ✅ | ❌ |
| Site settings | ✅ | ❌ |
| Notices | partial | ❌ |
| Menus | ✅ | ❌ |

**Locale loader:** `loadCmsPageData(locale)` implemented Phase S.

---

## 10. Public Media Library

| Capability | Admin | Public |
|------------|-------|--------|
| Upload/list assets | ✅ `/admin/cms/media` | ❌ |
| Public album API | ❌ | ❌ |
| Media picker in editors | partial | — |

---

## Duplication risks

| Duplication | Resolution |
|-------------|------------|
| Press hub cards + article pages | Single CMS article list |
| FAQ homepage JSON + FAQ module | FAQ module feeds homepage |
| slides-data + gallery albums | MediaAlbum type=homepage |
| Legal inline + CMS pages | CMS with fallback |

**Audit complete — ready for migration planning.**
