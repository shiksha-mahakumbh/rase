# S2 Migration Plan — Content Migration & Admin Completion

**Date:** May 2026  
**Approved:** G1 ✅ · G2 ✅ · G3 ❌  
**Constraints:** No Firebase · No registration · No Razorpay · No deploy · No Phase C

---

## Success criteria

| Metric | Current | S2 target |
|--------|--------:|----------:|
| Admin manageability | 85 | ≥ 90 |
| Global reach | 80 | ≥ 88 |
| SEO | 93 | ≥ 94 |
| Production readiness | 90 | ≥ 92 |

---

## Implementation phases

### S2.1 — Foundation (week 1)

| Task | Deliverable |
|------|-------------|
| Prisma migration (FAQ, MediaAlbum, PageType) | Schema applied locally |
| FAQ service + admin/public APIs | CRUD |
| Contact/feedback PATCH APIs | Status + reply |
| Admin: Contact inbox | `/admin/cms/contact` |
| Admin: Feedback inbox | `/admin/cms/feedback` |
| Admin: Pages create | `/admin/cms/pages/new` |
| Admin: FAQ module | `/admin/cms/faq` |

**Validation:** tsc pass · admin CRUD smoke test · no public route breaks

### S2.2 — Articles & Legal (week 2)

| Task | Deliverable |
|------|-------------|
| `seed-s2-content.mjs` — legal 5 pages | CMS pages published |
| `seed-s2-content.mjs` — press 9 articles | CMS pages type=article |
| Dynamic `/press/[slug]` CMS loader | RSC with fallback |
| Press hub from CMS article list | `Press.tsx` CMS-driven |
| Legal pages CMS loader + fallback | 5 routes |
| Admin: Articles filter | pages?pageType=article |
| Route SEO for articles | generateMetadata from CMS |

**Validation:** All 9 press URLs render · legal editable in admin

### S2.3 — Gallery & Departments (week 3)

| Task | Deliverable |
|------|-------------|
| MediaAlbum service + APIs | Admin + public |
| Admin: Gallery manager | `/admin/cms/gallery` |
| Public `/gallery` from albums | Replace TreeComponent primary |
| Homepage gallery section CMS | `gallery` section in homepage admin |
| `GallerySection` reads CMS | MediaAlbum or section JSON |
| Department pages CMS loader | 5 routes with fallback |
| `seed-s2` department pages | 5 CMS pages |

**Validation:** Gallery editable · homepage slides from admin

### S2.4 — Hindi & Media Public (week 4)

| Task | Deliverable |
|------|-------------|
| `seed-s2-hi.mjs` | Homepage + settings + 5 notices |
| Public media API | GET /api/v2/media-albums |
| FAQ → homepage wire | Featured FAQs from module |
| Press hub Hindi cards | From CMS locale=hi where exists |
| `S2_COMPLETION_AUDIT.md` | Fresh platform audit |

**Validation:** `/hi` shows Hindi settings · scores recalculated

---

## Content migration mapping

### Press → CMS Page (pageType: article)

| Legacy slug | CMS slug | Locale |
|-------------|----------|--------|
| education-summit-coverage | education-summit-coverage | en |
| baton-ceremony-smk-4 | baton-ceremony-smk-4 | en |
| summit-highlights | summit-highlights | en |
| shiksha-mahakumbh-4-0 | shiksha-mahakumbh-4-0 | hi |
| residential-camp-success | residential-camp-success | hi |
| residential-camp-hindi | residential-camp-hindi | hi |
| mahakumbh-programme-update | mahakumbh-programme-update | hi |
| national-coverage | national-coverage | hi |
| education-movement | education-movement | hi |

**Section JSON schema:**
```json
{
  "heroImage": "/2024M/press5.jpg",
  "excerpt": "...",
  "sections": [{ "title": "...", "body": "...", "type": "text" }]
}
```

### Legal → CMS Page (pageType: policy)

| Route | CMS slug |
|-------|----------|
| /privacy-policy | privacy-policy |
| /terms-and-conditions | terms-and-conditions |
| /cookie-policy | cookie-policy |
| /disclaimer | disclaimer |
| /refund-policy | refund-policy |

### Departments → CMS Page (pageType: department)

| Route | CMS slug |
|-------|----------|
| /departments/academic-council | academic-council |
| /departments/prabandhan | prabandhan |
| /departments/prachar | prachar |
| /departments/sampark | sampark |
| /departments/vitt | vitt |

---

## Fallback strategy

Every migrated public route:

1. Try `loadCmsPageBySlug(slug, locale)`
2. If published → render CMS
3. Else → render existing hardcoded component (zero downtime)

Legacy static press `page.tsx` files remain as fallback until CMS verified.

---

## Rollback per phase

| Phase | Rollback |
|-------|----------|
| S2.1 | Remove admin routes; migration reverse |
| S2.2 | CMS pages draft; public uses fallback |
| S2.3 | Gallery falls back to TreeComponent |
| S2.4 | Hindi seed optional; en unaffected |

---

## Out of scope (G3 not approved)

- Committees admin UI
- Speakers admin UI
- Events catalog admin
- Partners standalone module
- Media center press mentions module
- Firebase/Supabase registration cutover
