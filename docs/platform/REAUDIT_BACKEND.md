# Re-Audit — Backend Architecture (Phase S)

**Date:** May 2026  
**Stack:** Next.js Route Handlers · Prisma · Supabase PostgreSQL · Firebase (registration)  
**Status:** Documentation only — no implementation

---

## Executive summary

| Metric | Value |
|--------|-------|
| Prisma models | 58 |
| Enums | 40+ |
| Public v2 API routes | 22 |
| Admin v2 API routes | 42 |
| RLS policy files | 6 |
| Auth paths | 3 (Firebase UI, ops-secret API, Supabase RLS) |

The backend is **architecturally sound** for CMS and analytics. Gaps are **missing APIs** for speakers/partners, **APIs without admin UI**, and **dual-stack duplication** (Firebase + Supabase registrations, three media models, three announcement patterns).

---

## Prisma model inventory (58 models)

### CMS & content (14)

| Model | Admin UI | Public API | Notes |
|-------|----------|------------|-------|
| `Page` | ✅ | ✅ | Generic pages |
| `PageSection` | ✅ | ✅ | JSON content blocks |
| `PageRevision` | ⚠️ API only | — | Version history |
| `Notice` | ✅ | ✅ | Full lifecycle |
| `NoticeCategory` | ⚠️ partial | ✅ | No edit/delete |
| `NoticeAttachment` | ✅ | ✅ | File URLs |
| `Download` | ✅ | ✅ | Versioning via `replacedById` |
| `MediaFolder` | ✅ | — | Folder tree |
| `MediaAsset` | ✅ | ✅ usage | Versioning, tags |
| `SeoMetadata` | ✅ | ✅ | Polymorphic |
| `SiteSetting` | ✅ | ✅ | Per-locale |
| `Menu` / `MenuItem` | ✅ | ✅ | Nested items |
| `AnnouncementBar` | ✅ | ✅ | Ticker/modal |
| `Announcement` | ❌ | — | Legacy, unused |

### People & organizations (5)

| Model | Admin UI | API | Notes |
|-------|----------|-----|-------|
| `Committee` | ❌ | ✅ admin | Phase C |
| `CommitteeMember` | ❌ | ✅ admin | Phase C |
| `SpeakerProfile` | ❌ | ❌ | Schema only |
| `Sponsor` | ❌ | ❌ | Schema only |
| `Partner` | ❌ | ❌ | Schema only |

### Events & media (2)

| Model | Admin UI | API | Notes |
|-------|----------|-----|-------|
| `Event` | ❌ | ✅ admin | Phase C |
| `EventMedia` | ❌ | ✅ admin | Legacy, separate from MediaAsset |

### Registration engine (14)

| Model | Active backend | Notes |
|-------|----------------|-------|
| `Registration` + 10 type tables | Firebase primary | Supabase mirror for migration |
| `RegistrationStatusHistory` | Supabase | Audit trail |
| `AccommodationRequest` | Both | API GET only |
| `RegistrationCounter` | Supabase | Sequence IDs |
| `PaymentRecord` | Both | Dual payment APIs |
| `WebhookEvent` | Supabase | Razorpay events |
| `UploadedFile` | Both | Registration uploads |

### Visitor analytics (7)

| Model | Purpose |
|-------|---------|
| `VisitorSession` | Session tracking |
| `VisitorPageView` | Per-page views |
| `VisitorEvent` | Custom events |
| `VisitorDevice` | UA parsing |
| `VisitorLocation` | Geo from headers |
| `TrafficSource` | UTM + referrer |
| `VisitorAnalytics` | Daily rollup |

### Comms & ops (8)

| Model | Admin UI | API |
|-------|----------|-----|
| `ContactMessage` | ❌ | GET admin |
| `Feedback` | ❌ | GET admin |
| `NewsletterSubscription` | ❌ | GET admin |
| `Notification` | ❌ | ❌ |
| `AuditLog` | ❌ | GET admin |
| `EmailLog` | ❌ | — |
| `SystemSetting` | ❌ | ❌ |

### Auth/RBAC (5)

| Model | Used by runtime |
|-------|-----------------|
| `User`, `Role`, `Permission`, `UserRole`, `RolePermission` | RLS policies only — **not CMS admin UI** |

---

## API surface map

### Public `/api/v2/*` (22 routes)

| Domain | Routes | Rate limited |
|--------|--------|--------------|
| Homepage | `GET /homepage` | ✅ 60/min |
| Pages | `GET /pages`, `GET /pages/[slug]` | ✅ |
| Notices | `GET /notices`, `GET /notices/[slug]`, categories | ✅ |
| Downloads | `GET /downloads`, `GET /downloads/[slug]`, track | ✅ |
| Settings | `GET /settings` | ✅ 120/min |
| Menus | `GET /menus` | ✅ |
| Announcement bars | `GET /announcement-bars` | ✅ |
| SEO | `GET /seo/[entityType]/[entityId]`, sitemap, robots | ✅ |
| Media | `GET /media/[id]/usage` | ✅ |
| Analytics | `POST /track`, `GET /stats` | ✅ 120/min |
| Contact | `POST /contact` | ✅ + captcha |
| Feedback | `POST /feedback` | ✅ 5/min |
| Registration | submit, upload, lookup, email | ✅ + captcha |
| Newsletter | `POST /subscribe` | ✅ 5/min |
| Health | `GET /health` | — |

### Admin `/api/v2/admin/*` (42 routes)

**With UI:** homepage, pages, notices, downloads, media-library, menus, settings, announcement-bars, seo, analytics

**Without UI:** committees (4), events (2), event media, contact, feedback, newsletter, accommodation, registrations, audit-logs, dashboard

### Gateway

`/api/admin/gateway/[...path]` — Firebase token → `x-ops-secret` → v2 admin

### Legacy (unchanged)

- `/api/registration/*` (v1)
- `/api/create-order`, `/api/verify-payment`
- `/api/visitors` (public counter)
- Firebase client SDK paths

---

## Missing entities for 90% admin goal

| Entity needed | Schema status | API | UI | Priority |
|---------------|---------------|-----|-----|----------|
| Article / PressRelease | Use `Page` type or new model | Partial (pages) | ❌ | Critical |
| GalleryAlbum | Extend `MediaAsset` + album type | Partial | ❌ | Critical |
| FAQ | New model or PageSection type | ❌ | ❌ | High |
| Testimonial | Extract from JSON or new model | ❌ | ❌ | Medium |
| Department | Use `Page` with department type | Partial | ❌ | High |
| Video | `MediaAsset` type=video | Partial | ❌ | High |
| SpeakerSession mapping | Junction table | ❌ | ❌ | Phase C |
| PartnerTier | Enum on Partner model | ❌ | ❌ | Phase C |
| ContentWorkflow | Draft/review states | Partial (PageStatus) | ❌ | Medium |
| i18n content binding | `ContentLocale` exists | ✅ per-entity | ⚠️ Hindi seed missing | High |

---

## RBAC & RLS review

### Policy files (`supabase/policies/`)

| File | Tables | Pattern |
|------|--------|---------|
| `cms.sql` | pages, sections, revisions, seo, media | Public read published; admin ALL |
| `phase_b.sql` | notices, settings, menus, bars | Public read active; admin ALL |
| `analytics.sql` | visitor_* | Admin SELECT/ALL |
| `admin.sql` | RBAC, committees, events, contact, feedback | Admin policies |
| `registrations.sql` | registration tables | `is_admin_user()` helper |
| `storage.sql` | buckets | Template only — not fully applied |

### Runtime auth reality

| Path | Auth mechanism |
|------|----------------|
| CMS admin UI | Firebase ID token → gateway → ops-secret |
| v2 admin API direct | `x-ops-secret` header |
| Public v2 API | Rate limit only |
| Prisma writes | Service role / direct `DATABASE_URL` |
| RLS `is_admin_user()` | Supabase Auth uid — **not used by CMS admin** |

**Gap:** Full RBAC schema seeded but API uses single shared secret. No per-resource permissions enforced in route handlers.

---

## Normalization issues

| Issue | Details | Risk |
|-------|---------|------|
| `Registration.metadata` JSON | Type-specific fields escape child tables | Query/reporting |
| Three media models | `MediaAsset`, `EventMedia`, `UploadedFile` | Orphan assets |
| Three announcement patterns | `Announcement`, `AnnouncementBar`, homepage JSON | Content drift |
| Dual partner storage | JSON in homepage vs `Sponsor`/`Partner` tables | Unused schema |
| Polymorphic SEO | `entityType`/`entityId` without FK | Orphan SEO rows |
| Duplicate publish flags | `Event.status` + `isPublished` | Logic confusion |
| Notice attachment URLs | `fileUrl` string + optional `mediaAssetId` | Broken links |

---

## Scalability concerns

| Area | Concern | Mitigation plan |
|------|---------|-----------------|
| Visitor analytics tables | Unbounded growth | Retention policy + archival |
| Registration child tables | 10 tables per type | Acceptable; indexed |
| Homepage sections JSON | Large JSON blobs | Split to typed sections |
| proceeding2-scale pages | 600+ line client bundles | CMS pages with sections |
| Rate limiting | In-memory, resets on cold start | Upstash Redis at scale |
| Connection pooling | Serverless Prisma | PgBouncer / Prisma Accelerate |
| Media storage | No CDN invalidation on replace | Version URLs |
| Search | No full-text search API | Postgres FTS or Algolia |

---

## Future bottlenecks (multi-conference vision)

| Need | Current state | Required |
|------|---------------|----------|
| Multiple editions (SMK, SK, DHE) | Single homepage Page | Edition-scoped pages or sites |
| Conference-specific events | `Event` model exists | Events admin + edition filter |
| International delegates | `ContentLocale.en/hi` | Full i18n content per entity |
| School/university portals | Knowledge graph static | Entity CMS with relationships |
| Government/NGO registration types | 10 registration types | Extensible type registry |
| Global partners | Homepage JSON partners | Partner module with tiers |
| Research publications | HC proceedings | ScholarlyArticle schema + CMS |

**Verdict:** Schema is **80% future-ready**. Missing APIs and admin UI are the primary blockers, not schema redesign.

---

## Backend health score

| Area | Score |
|------|------:|
| Schema completeness | 85 |
| API coverage | 70 |
| Normalization | 72 |
| Security (API layer) | 88 |
| Scalability readiness | 75 |
| Multi-conference readiness | 65 |
| **Backend average** | **76** |
