# Database Expansion Plan — Schema V2

**Date:** June 2026  
**Current schema:** 39 Prisma models (Phase 2–3)  
**Target:** ~65 models for full CMS platform  
**Migration:** Paused until audit approval

---

## Principles

1. **Polymorphic SEO** — one `seo_metadata` table for all entities
2. **Translation-ready** — `content_translations` for en/hi (+ future locales)
3. **Soft deletes** — `deleted_at` on all public content
4. **Audit trail** — extend existing `audit_logs`
5. **File metadata** — extend `uploaded_files` with entity linkage
6. **No breaking changes** — existing Phase 3 tables preserved

---

## New tables (26)

### CMS core

| Table | Purpose | Replaces |
|-------|---------|----------|
| `seo_metadata` | Universal SEO per entity + locale | Hardcoded meta |
| `content_translations` | i18n strings (title, body, slug) | Inline text |
| `content_blocks` | Rich text sections (MDX/HTML) | TSX paragraphs |
| `homepage_sections` | Ordered homepage modules | 15 section components |
| `homepage_stats` | Impact counters | `design/tokens.ts` impactStats |
| `faqs` | FAQ items with reorder | `HomeFaqSection.tsx` |
| `legal_pages` | Privacy, terms, etc. | Static legal pages |

### Notice board (expanded)

| Table | Purpose | Replaces |
|-------|---------|----------|
| `notices` | Full notice system | Firestore `events` + static widget |
| `notice_categories` | Circular, Office Order, Announcement, etc. | — |
| `notice_attachments` | PDF/circular files | Firebase Storage |

**Fields:** title, slug, category_id, description, priority, publish_date, expiry_date, is_pinned, status, view_count.

### Events (expanded)

| Table | Purpose |
|-------|---------|
| `event_types` | Mahakumbh, Conclave, Workshop, Webinar, etc. |
| `event_content_blocks` | Rich detail sections per event |
| `event_galleries` | M:N event ↔ media_items |
| `event_registration_links` | External/internal registration URLs |

Extend existing `events` table: `start_date`, `end_date`, `registration_link`, `brochure_file_id`, `banner_file_id`, `event_type_id`.

### Media center (expanded)

| Table | Purpose |
|-------|---------|
| `media_items` | Unified news/press/video/interview/podcast |
| `media_albums` | Gallery groupings |
| `media_album_items` | M:N album ↔ items |
| `press_articles` | Long-form press content |

Extend `event_media` → migrate to `media_items` or keep parallel.

### Downloads (expanded)

| Table | Purpose |
|-------|---------|
| `download_versions` | File versioning per download |
| `download_categories` | Brochure, Report, Guideline, Circular, etc. |

Extend `downloads`: `expires_at`, `current_version_id`, `file_type`.

### People & organizations

| Table | Purpose | Replaces |
|-------|---------|----------|
| `testimonials` | Approved testimonials + wishes | `TestimonialsSection`, Firebase wishes |
| `team_members` | Core/office/technical/volunteer leads | Vibhag rosters |
| `team_groups` | Team categorization | — |
| `speaker_sessions` | M:N speaker ↔ event/session | — |

Extend `speaker_profiles`: `social_links` JSONB, `speaker_type`, `is_approved`.  
Extend `partners`: `description`, `priority`, `partner_category`.  
Extend `sponsors`: merge with partners or keep separate with `tier`.

### Contact & locations

| Table | Purpose |
|-------|---------|
| `contact_offices` | Multiple office locations |
| `contact_office_hours` | Operating hours per office |

Replaces `config/organization.ts` single source.

### Committees (expanded)

| Table | Purpose |
|-------|---------|
| `committee_editions` | Edition-scoped committees (SMK 1.0–6.0) |

Extend `committee_members`: `social_links` JSONB (already has photo, bio, is_active).

### Homepage CMS

| Table | Purpose |
|-------|---------|
| `cta_sections` | Call-to-action blocks |
| `featured_programs` | Homepage featured cards |
| `featured_events` | M:N homepage ↔ events |

### Analytics (expanded)

| Table | Purpose |
|-------|---------|
| `content_views` | Per-entity view tracking |
| `notice_views` | Notice-specific views |
| `download_events` | Granular download analytics |

Extend `visitor_analytics` (exists).

---

## Modified tables (12)

| Table | Changes |
|-------|---------|
| `events` | +start_date, end_date, event_type_id, registration_link, brochure_id, banner_id |
| `announcements` | Deprecate → merge into `notices` |
| `committee_members` | +social_links JSONB |
| `speaker_profiles` | +social_links, speaker_type, session_count |
| `partners` | +description, priority, category enum expansion |
| `downloads` | +expires_at, version tracking |
| `uploaded_files` | +entity_type, entity_id (polymorphic link) |
| `registration_counters` | No change (year field exists) |
| `audit_logs` | +content_entity actions in enum |
| `system_settings` | +homepage_config JSONB |
| `StorageBucket` enum | +notices, testimonials, speakers, partners, galleries |
| `CommitteeCategory` enum | +International_Advisory, Sponsorship, Exhibition |

---

## Storage buckets (expanded)

| Bucket | Contents |
|--------|----------|
| `registrations` | Registration uploads (exists) |
| `notices` | PDFs, circulars, office orders |
| `brochures` | Event brochures (exists) |
| `downloads` | Download center files (exists) |
| `media` | News, press, gallery (exists as gallery) |
| `committee` | Member photos (exists) |
| `speakers` | Speaker headshots |
| `testimonials` | Testimonial photos |
| `partners` | Partner/sponsor logos |
| `galleries` | Album images |

---

## Migration phases (post-approval)

| Phase | Tables | Data source |
|-------|--------|-------------|
| M1 | `seo_metadata`, `content_translations` | Empty scaffold |
| M2 | `notices`, `notice_categories` | Firestore `events` + static homepage |
| M3 | `events` expansion, `event_types` | `past-editions.ts`, `conference-catalog.ts` |
| M4 | `press_articles`, `media_items` | 9 press pages + media archives |
| M5 | `committees` expansion | 5 committee edition pages |
| M6 | `testimonials`, `speaker_profiles` | Firebase + hardcoded |
| M7 | `partners`, `sponsors` | Homepage components |
| M8 | `faqs`, `homepage_sections`, `homepage_stats` | Homepage TSX |
| M9 | `contact_offices` | `organization.ts` |
| M10 | `team_members` | Vibhag pages |
| M11 | `downloads` expansion | Proceedings, books, reports |
| M12 | Static file → Supabase Storage | `/public/*` assets |

---

## Entity count projection

| Category | Current models | V2 models |
|----------|---------------|-----------|
| Auth & RBAC | 5 | 5 |
| Registration | 15 | 15 |
| Payments & audit | 4 | 4 |
| Content CMS | 8 | 28 |
| People & orgs | 4 | 8 |
| Analytics | 1 | 4 |
| System | 2 | 3 |
| **Total** | **39** | **~67** |

---

## Index strategy (new)

| Table | Index | Reason |
|-------|-------|--------|
| `notices` | `(status, is_pinned, publish_date)` | Public feed |
| `notices` | `(category_id, expiry_date)` | Filtered views |
| `seo_metadata` | `(entity_type, entity_id, locale)` UNIQUE | Lookup |
| `content_translations` | `(entity_type, entity_id, locale)` UNIQUE | i18n |
| `media_items` | `(media_type, is_featured, created_at)` | Media center |
| `press_articles` | `(slug)` UNIQUE | URL routing |
| `testimonials` | `(is_approved, sort_order)` | Homepage feed |
| `content_views` | `(entity_type, entity_id, date)` | Analytics |

---

## What NOT to migrate

| Module | Reason |
|--------|--------|
| MultiTrack Conference backend | User directive — leave untouched |
| Abstract Submission backend | External CMT |
| Paper Submission backend | External CMT |
| Journal workflow | Out of scope |
| `registrations` Firebase data | Phase 4 separate track |

---

## Approval checklist

- [ ] Schema V2 reviewed (`SUPABASE_SCHEMA_V2.md`)
- [ ] API expansion reviewed (`API_V2_EXPANSION.md`)
- [ ] Admin panel plan reviewed (`ADMIN_PANEL_EXPANSION_PLAN.md`)
- [ ] Content audit approved (`ADMIN_CONTENT_AUDIT.md`)
- [ ] SEO/Mobile/A11y audits acknowledged

**Only then:** Apply `20250620_schema_v2` migration + resume Phase 4.
