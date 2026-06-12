# API V2 Expansion Plan

**Date:** June 2026  
**Baseline:** Phase 3 APIs (25+ routes)  
**Target:** ~80 routes for full CMS platform  
**Auth:** Public (rate-limited) · Admin (`x-ops-secret` → Supabase JWT)

---

## Existing APIs (Phase 3 — intact)

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v2/health` | ✅ |
| POST | `/api/v2/registration/submit` | ✅ |
| GET | `/api/v2/registration/[id]` | ✅ |
| POST | `/api/v2/registration/upload` | ✅ |
| POST | `/api/v2/registration/send-email` | ✅ |
| POST | `/api/v2/contact` | ✅ |
| POST | `/api/v2/feedback` | ✅ |
| POST | `/api/v2/newsletter/subscribe` | ✅ |
| GET | `/api/v2/downloads` | ✅ |
| POST | `/api/v2/downloads/[id]/track` | ✅ |
| GET | `/api/v2/admin/registrations` | ✅ |
| GET | `/api/v2/admin/dashboard` | ✅ |
| GET | `/api/v2/admin/audit-logs` | ✅ |
| GET | `/api/v2/admin/contact` | ✅ |
| GET | `/api/v2/admin/feedback` | ✅ |
| GET | `/api/v2/admin/newsletter` | ✅ |
| GET/POST | `/api/v2/admin/committees` | ✅ |
| PATCH/DELETE | `/api/v2/admin/committees/[id]` | ✅ |
| POST/PUT | `/api/v2/admin/committees/[id]/members` | ✅ |
| PATCH/DELETE | `/api/v2/admin/committees/members/[memberId]` | ✅ |
| GET/POST | `/api/v2/admin/events` | ✅ |
| PATCH/DELETE | `/api/v2/admin/events/[id]` | ✅ |
| GET/POST | `/api/v2/admin/media` | ✅ |
| GET/POST | `/api/v2/admin/downloads` | ✅ |
| GET | `/api/v2/admin/accommodation` | ✅ |

---

## New public APIs

### Notice Board (P0)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/notices` | List published notices. Query: `?pinned`, `?category`, `?search`, `?limit` |
| GET | `/api/v2/notices/[slug]` | Single notice + attachment signed URL |
| GET | `/api/v2/notices/important` | Pinned + high priority |
| GET | `/api/v2/notices/archived` | Expired notices |
| POST | `/api/v2/notices/[id]/view` | Increment view count |

### Events (P0)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/events` | Published events. Query: `?type`, `?upcoming`, `?featured` |
| GET | `/api/v2/events/[slug]` | Event detail + gallery + brochure URL |
| GET | `/api/v2/events/upcoming` | Next N upcoming |
| GET | `/api/v2/events/types` | Event type list |

### Media & Press (P1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/press` | Press article list |
| GET | `/api/v2/press/[slug]` | Full article |
| GET | `/api/v2/media` | Media items. Query: `?type`, `?featured`, `?category` |
| GET | `/api/v2/media/gallery` | Gallery albums |
| GET | `/api/v2/media/gallery/[slug]` | Album with items |

### CMS public reads (P0)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/cms/homepage` | All visible homepage sections + stats |
| GET | `/api/v2/faqs` | Published FAQs. Query: `?category` |
| GET | `/api/v2/testimonials` | Approved testimonials |
| GET | `/api/v2/speakers` | Published speakers. Query: `?type`, `?featured` |
| GET | `/api/v2/speakers/[slug]` | Speaker profile |
| GET | `/api/v2/partners` | Partners by category |
| GET | `/api/v2/team` | Active team members (no phone) |
| GET | `/api/v2/contact-offices` | Office locations |

### SEO (P0)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/seo/[entityType]/[entityId]` | SEO metadata for SSR |
| GET | `/api/v2/sitemap-data` | Dynamic sitemap entries (internal) |

### i18n (P2)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/i18n/[locale]/[entityType]/[entityId]` | Translated content |

---

## New admin APIs

### Notice Board (P0)

| Method | Path |
|--------|------|
| GET | `/api/v2/admin/notices` |
| POST | `/api/v2/admin/notices` |
| PATCH | `/api/v2/admin/notices/[id]` |
| DELETE | `/api/v2/admin/notices/[id]` |
| POST | `/api/v2/admin/notices/[id]/pin` |
| POST | `/api/v2/admin/notices/[id]/attachment` |
| GET/POST | `/api/v2/admin/notice-categories` |

### Press & Media (P1)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/press` |
| PATCH/DELETE | `/api/v2/admin/press/[id]` |
| GET/POST | `/api/v2/admin/media-items` |
| PATCH/DELETE | `/api/v2/admin/media-items/[id]` |
| GET/POST | `/api/v2/admin/media-albums` |
| PUT | `/api/v2/admin/media-albums/[id]/items` (reorder) |
| POST | `/api/v2/admin/media/bulk-upload` |

### Downloads (P1)

| Method | Path |
|--------|------|
| PATCH/DELETE | `/api/v2/admin/downloads/[id]` |
| POST | `/api/v2/admin/downloads/[id]/versions` |
| PUT | `/api/v2/admin/downloads/[id]/version/[versionId]/activate` |

### Speakers (P1)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/speakers` |
| PATCH/DELETE | `/api/v2/admin/speakers/[id]` |
| POST | `/api/v2/admin/speakers/[id]/photo` |
| PUT | `/api/v2/admin/speakers/[id]/sessions` |

### Testimonials (P1)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/testimonials` |
| PATCH/DELETE | `/api/v2/admin/testimonials/[id]` |
| POST | `/api/v2/admin/testimonials/[id]/approve` |
| PUT | `/api/v2/admin/testimonials/reorder` |

### Partners (P1)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/partners` |
| PATCH/DELETE | `/api/v2/admin/partners/[id]` |
| POST | `/api/v2/admin/partners/[id]/logo` |
| GET/POST | `/api/v2/admin/sponsors` |

### Team (P2)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/team` |
| PATCH/DELETE | `/api/v2/admin/team/[id]` |
| PUT | `/api/v2/admin/team/reorder` |

### FAQ (P1)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/faqs` |
| PATCH/DELETE | `/api/v2/admin/faqs/[id]` |
| PUT | `/api/v2/admin/faqs/reorder` |

### Homepage CMS (P0)

| Method | Path |
|--------|------|
| GET | `/api/v2/admin/homepage/sections` |
| PUT | `/api/v2/admin/homepage/sections` (bulk update) |
| PATCH | `/api/v2/admin/homepage/sections/[type]` |
| GET/POST | `/api/v2/admin/homepage/stats` |
| PUT | `/api/v2/admin/homepage/featured-events` |
| PUT | `/api/v2/admin/homepage/featured-testimonials` |

### Contact offices (P1)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/contact-offices` |
| PATCH/DELETE | `/api/v2/admin/contact-offices/[id]` |
| PATCH | `/api/v2/admin/contact/[id]/reply` |

### SEO manager (P0)

| Method | Path |
|--------|------|
| GET | `/api/v2/admin/seo/[entityType]/[entityId]` |
| PUT | `/api/v2/admin/seo/[entityType]/[entityId]` |
| GET | `/api/v2/admin/seo/sitemap-preview` |

### Translations (P2)

| Method | Path |
|--------|------|
| GET | `/api/v2/admin/translations/[entityType]/[entityId]` |
| PUT | `/api/v2/admin/translations/[entityType]/[entityId]/[locale]` |

### Analytics (P1)

| Method | Path |
|--------|------|
| GET | `/api/v2/admin/analytics/registrations` |
| GET | `/api/v2/admin/analytics/revenue` |
| GET | `/api/v2/admin/analytics/visitors` |
| GET | `/api/v2/admin/analytics/content-views` |
| GET | `/api/v2/admin/analytics/downloads` |
| GET | `/api/v2/admin/analytics/feedback-trends` |

### Users & settings (P2)

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/users` |
| PATCH | `/api/v2/admin/users/[id]/roles` |
| GET/PUT | `/api/v2/admin/settings` |
| GET | `/api/v2/admin/storage/browse` |

---

## API conventions (all new routes)

### Request

- Content-Type: `application/json` (or `multipart/form-data` for uploads)
- Admin auth: `x-ops-secret: <ADMIN_OPS_SECRET>` (interim) → Supabase JWT (target)
- Locale header: `Accept-Language: en|hi` (optional)

### Response (success)

```json
{ "success": true, "data": { ... }, "meta": { "total": 100, "limit": 25, "offset": 0 } }
```

### Response (error)

```json
{ "error": "Human message", "code": "ERROR_CODE" }
```

### Rate limits

| Endpoint group | Limit |
|----------------|-------|
| Public reads | 60/min/IP |
| Public writes (contact, feedback) | 5/min/IP |
| Registration | 15/min/IP (unchanged) |
| Admin | 120/min/IP |
| File upload | 30/min/IP |

### Audit

Every admin mutation writes to `audit_logs` with:
- `action`, `entity_type`, `entity_id`, `actor_user_id`, `ip_address`, `payload`

---

## Service layer mapping

| API group | Service file |
|-----------|-------------|
| Notices | `notice.service.ts` (new) |
| Events | `event.service.ts` (extend) |
| Press | `press.service.ts` (new) |
| Media | `media.service.ts` (extend) |
| Downloads | `download.service.ts` (extend) |
| Speakers | `speaker.service.ts` (new) |
| Testimonials | `testimonial.service.ts` (new) |
| Partners | `partner.service.ts` (new) |
| Team | `team.service.ts` (new) |
| FAQ | `faq.service.ts` (new) |
| Homepage CMS | `homepage.service.ts` (new) |
| SEO | `seo.service.ts` (new) |
| i18n | `translation.service.ts` (new) |
| Analytics | `dashboard.service.ts` (extend) |
| Contact offices | `contact.service.ts` (extend) |

---

## Implementation priority

| Sprint | APIs | Count |
|--------|------|------:|
| S1 | Notices public + admin, Homepage CMS | ~12 |
| S2 | Events public expand, SEO admin | ~8 |
| S3 | Press + Media expand | ~14 |
| S4 | Speakers, Testimonials, Partners, FAQ | ~20 |
| S5 | Downloads versions, Team, Analytics | ~12 |
| S6 | i18n, Users, Settings, Storage browse | ~10 |

**Total new routes:** ~55 (plus 25 existing = ~80)

---

## What NOT to build

| API | Reason |
|-----|--------|
| `/api/v2/conference/multitrack/*` | User directive |
| `/api/v2/abstract/*` | External CMT |
| `/api/v2/paper/*` | External CMT |
| Changes to `/api/registration/*` | Firebase production path |

---

## Firebase coexistence

During audit/enhancement phase:

```
Public site → Firebase (registrations, partial content)
/api/v2/*   → Supabase (new CMS, inactive until frontend wired)
REGISTRATION_BACKEND=firebase (unchanged)
```

Frontend wiring to `/api/v2/cms/*` happens in **Phase 15** (post-migration approval), not during this audit.

---

## Approval gate

API implementation begins after:
1. `SUPABASE_SCHEMA_V2.md` approved
2. Schema V2 migration on staging
3. `ADMIN_PANEL_EXPANSION_PLAN.md` approved

Then resume Phase 4 migration with expanded schema.
