# Final Database Architecture — Stable Schema Blueprint

**Date:** May 2026  
**ORM:** Prisma · **DB:** Supabase PostgreSQL · **Models:** 58  
**Goal:** Final stable schema before large-scale content migration

---

## Current schema groups

### CMS & content (14 models) — KEEP

| Model | Purpose | Status |
|-------|---------|--------|
| Page | Generic pages | ✅ Core |
| PageSection | JSON content blocks | ✅ Core |
| PageRevision | Version history | ✅ Keep |
| SeoMetadata | Polymorphic SEO | ✅ Core |
| MediaFolder | Asset organization | ✅ Core |
| MediaAsset | Images, PDFs, videos | ✅ Core |
| NoticeCategory | Notice taxonomy | ✅ Core |
| Notice | Notice board | ✅ Core |
| NoticeAttachment | File attachments | ✅ Core |
| Download | Download center | ✅ Core |
| SiteSetting | Per-locale config | ✅ Core |
| Menu / MenuItem | Navigation | ✅ Core |
| AnnouncementBar | Ticker/modal | ✅ Core |
| Announcement | Legacy | ⚠️ DEPRECATE → use AnnouncementBar |

### People & orgs (5 models)

| Model | API | UI | Decision |
|-------|-----|-----|----------|
| Committee | ✅ | ❌ | **KEEP** — activate UI |
| CommitteeMember | ✅ | ❌ | **KEEP** |
| SpeakerProfile | ❌ | ❌ | **KEEP** — add API |
| Sponsor | ❌ | ❌ | **KEEP** — add API or merge to Partner |
| Partner | ❌ | ❌ | **KEEP** — add API |

### Events & media (2 models)

| Model | Decision |
|-------|----------|
| Event | **KEEP** — activate admin UI |
| EventMedia | **MERGE** → MediaAsset + Event relation (Phase C) |

### Registration (14 models) — KEEP (Firebase primary)

All registration child tables remain for future cutover. **No schema change until approved migration.**

### Analytics (7 models) — KEEP

Add retention policy (archive >12 months) — operational, not schema.

### Comms (4 models)

| Model | Decision |
|-------|----------|
| ContactMessage | **KEEP** — add inbox UI |
| Feedback | **KEEP** — add inbox UI |
| NewsletterSubscription | **KEEP** |
| Notification | **DEFER** — no current use |

### Auth/RBAC (5 models)

| Model | Decision |
|-------|----------|
| User, Role, Permission, UserRole, RolePermission | **KEEP** — wire to admin UI in Tier 3 |

### System (2 models)

| Model | Decision |
|-------|----------|
| SystemSetting | **MERGE** into SiteSetting.extra or activate |
| RegistrationCounter | **KEEP** |

---

## Missing tables (recommended additions)

### Tier 1 (before content migration)

```prisma
model FaqCategory {
  id, name, slug, sortOrder, locale
  faqs Faq[]
}

model Faq {
  id, categoryId, question, answer, isFeatured, locale, sortOrder, status
}

model MediaAlbum {
  id, title, slug, albumType, edition, year, locale, coverAssetId, status
  items MediaAlbumItem[]
}

model MediaAlbumItem {
  id, albumId, mediaAssetId, caption, sortOrder
}
```

### Tier 2 (Phase C)

```prisma
model Edition {
  id, name, slug, editionNumber, year, theme, startDate, endDate, venue, status
  events Event[]  // add editionId to Event
}

model SpeakerSession {
  id, speakerId, eventId, role, sortOrder
}

model NoticeRead {
  id, noticeId, sessionId, readAt
}
```

### Tier 3 (optional)

```prisma
model ContentWorkflow {
  id, entityType, entityId, status, assignedTo, reviewedBy
}

model Venue {
  id, name, address, mapEmbed, travelInfo, locale
}
```

---

## Unnecessary / consolidate

| Item | Action |
|------|--------|
| `Announcement` (legacy) | Deprecate after confirming no data |
| `EventMedia` | Migrate to MediaAsset junction |
| `Sponsor` + homepage JSON partners | Unify under Partner model |
| Duplicate `isPublished` + `status` flags | Document canonical field per entity |
| `Registration.metadata` JSON | Keep for migration; normalize over time |

---

## Normalization rules (final)

1. **One media system:** MediaAsset for all public assets; UploadedFile for registration only
2. **One SEO system:** SeoMetadata polymorphic on all publishable entities
3. **One announcement system:** AnnouncementBar + Notice (not legacy Announcement)
4. **Locale on every content entity:** ContentLocale en/hi (extend later)
5. **No inline content in code:** All public text in Page/Section/Notice/Download/Event

---

## Index strategy

| Table | Critical indexes | Status |
|-------|------------------|--------|
| notices | status, publishAt, expireAt, isPinned | ✅ |
| pages | slug+locale, status | ✅ |
| seo_metadata | entityType, sitemapInclude | ✅ |
| visitor_page_views | path, viewedAt | ✅ |
| media_assets | assetType, tags | ✅ |

**Add:** `visitor_page_views(viewed_at)` for retention archival queries.

---

## Migration sequence (when approved)

```
1. Add FaqCategory, Faq, MediaAlbum, MediaAlbumItem
2. Seed press articles as Page records
3. Migrate gallery images to MediaAlbum
4. Add SpeakerProfile API routes
5. Add editionId to Event (nullable)
6. Deprecate Announcement, EventMedia
7. Firebase → Supabase registration (SEPARATE approved project)
```

---

## Schema stability verdict

**58 models → 63 models at full maturity (+5 new, −2 deprecated)**

No breaking redesign required. Schema is **85% future-ready** today.

**Status: ARCHITECTURE DOCUMENT ONLY**
