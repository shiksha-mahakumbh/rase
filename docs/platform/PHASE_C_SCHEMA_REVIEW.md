# Phase C Schema Review

**Date:** May 2026  
**Principle:** Reuse existing tables · Document every addition · No drops · No breaking FK changes

---

## Existing models inventory

| Model | Rows expected | Admin API | Admin UI | Locale | Status workflow | SEO |
|-------|---------------|-----------|----------|--------|-----------------|-----|
| `Committee` | 5–20 | ✅ Partial | ❌ | ❌ | `isPublished` bool only | ❌ |
| `CommitteeMember` | 200+ | ✅ Partial | ❌ | ❌ | `isActive` | ❌ |
| `SpeakerProfile` | 20–50 | ❌ | ❌ | ❌ | ❌ | ❌ |
| `Partner` | 15–30 | ❌ | ❌ | ❌ | ❌ | ❌ |
| `Event` | 10–30 | ✅ Partial | ❌ | ❌ | `EventStatus` | ❌ |
| `EventMedia` | 50+ | ✅ via `/admin/media` | ❌ | ❌ | ❌ | ❌ |
| `Page` (article) | 9+ | ✅ S2 | ✅ | ✅ | `PageStatus` | ✅ |
| `MediaAlbum` | 5+ | ✅ S2 | ✅ | ✅ | `PageStatus` | Partial |
| `Download` | 20+ | ✅ | ✅ | ❌ | `DownloadStatus` | Partial |
| `SeoMetadata` | — | ✅ | ✅ | ✅ | — | — |
| `PageRevision` | — | ✅ pages only | — | — | — | — |

---

## Schema additions (documented)

### 1. New enum: `PartnerCategory`

```prisma
enum PartnerCategory {
  academic
  knowledge
  industry
  media
  csr
  government
  other
}
```

**Rationale:** Replace free-text `Partner.category` string with typed categories per requirements.

---

### 2. New enum: `SpeakerCategory`

```prisma
enum SpeakerCategory {
  keynote
  plenary
  track_chair
  panelist
  guest
  other
}
```

---

### 3. New enum: `EventCategory`

```prisma
enum EventCategory {
  summit
  conclave
  workshop
  olympiad
  exhibition
  ceremony
  other
}
```

---

### 4. New enum: `MediaCenterCategory`

```prisma
enum MediaCenterCategory {
  news
  press_release      // also surfaced via Page article — cross-link only
  media_mention
  photo_gallery      // also surfaced via MediaAlbum — cross-link only
  video
  interview
  publication
}
```

---

### 5. Extend enum: `CommitteeCategory`

**Add values:**
- `National_Organizing_Committee`
- `Steering_Committee`
- `Advisory_Board` (alias intent for National_Advisory_Board — keep both for backward compat)
- `Event_Committee`

**Keep existing:** `Patrons`, `Chief_Patrons`, `Organizing_Committee`, `Academic_Committee`, etc.

---

### 6. Extend enum: `MediaType` (existing)

**Add:** `interview`, `publication` (if not mapping to document)

*Alternative:* Use `MediaCenterCategory` on EventMedia and keep `MediaType` for file kind only.

---

## Table: `Committee` — column changes

| Column | Action | Type | Notes |
|--------|--------|------|-------|
| `locale` | **ADD** | `ContentLocale` @default(en) | Hindi committees |
| `edition` | **ADD** | `String?` | e.g. `"6.0"`, `"2025"` |
| `status` | **ADD** | `PageStatus` @default(draft) | Replaces bool-only `isPublished` |
| `publishAt` | **ADD** | `DateTime?` | Scheduled publish |
| `slug` | **ALTER** | Remove `@unique` | → composite unique below |
| `isPublished` | **KEEP** | `Boolean` | Derived/synced on publish for backward compat |
| — | **ADD** `@@unique([slug, edition, locale])` | | Edition-scoped slugs |

**No new table.**

---

## Table: `CommitteeMember` — column changes

| Column | Action | Type | Notes |
|--------|--------|------|-------|
| `email` | **ADD** | `String?` | Optional contact |
| `phone` | **ADD** | `String?` | Optional contact |
| `socialLinks` | **ADD** | `Json` @default("{}") | `{ linkedin, twitter, website }` |
| `locale` | **ADD** | `ContentLocale?` | Optional; inherit committee locale |
| `mediaAssetId` | **ADD** | `UUID?` FK → MediaAsset | Photo picker |
| `institution` | **KEEP** | | Maps to "Organization" in requirements |

**No new table.**

---

## Table: `SpeakerProfile` — column changes

| Column | Action | Type | Notes |
|--------|--------|------|-------|
| `slug` | **ADD** | `String` | Profile URL |
| `locale` | **ADD** | `ContentLocale` @default(en) | |
| `title` | **ADD** | `String?` | Speaker title (distinct from designation) |
| `category` | **ADD** | `SpeakerCategory` @default(other) | |
| `edition` | **ADD** | `String?` | SMK edition |
| `status` | **ADD** | `PageStatus` @default(draft) | |
| `publishAt` | **ADD** | `DateTime?` | |
| `socialLinks` | **ADD** | `Json` @default("{}") | |
| `mediaAssetId` | **ADD** | `UUID?` FK → MediaAsset | |
| — | **ADD** `@@unique([slug, locale])` | | |

**No new table.**

---

## Table: `Partner` — column changes

| Column | Action | Type | Notes |
|--------|--------|------|-------|
| `slug` | **ADD** | `String?` | Optional profile slug |
| `locale` | **ADD** | `ContentLocale` @default(en) | |
| `description` | **ADD** | `Text?` | |
| `partnerCategory` | **ADD** | `PartnerCategory` @default(other) | Maps from old `category` string on migrate |
| `isActive` | **ADD** | `Boolean` @default(true) | |
| `status` | **ADD** | `PageStatus` @default(draft) | |
| `mediaAssetId` | **ADD** | `UUID?` FK → MediaAsset | Logo picker |
| `category` | **KEEP** | `String?` | Deprecated; migrate to enum |

**No new table.**

---

## Table: `Event` — column changes

| Column | Action | Type | Notes |
|--------|--------|------|-------|
| `locale` | **ADD** | `ContentLocale` @default(en) | |
| `edition` | **ADD** | `String?` | |
| `category` | **ADD** | `EventCategory` @default(other) | |
| `startDate` | **ADD** | `DateTime?` | Primary schedule |
| `endDate` | **ADD** | `DateTime?` | |
| `highlights` | **ADD** | `Json` @default("[]")` | `[{ title, body }]` |
| `brochureDownloadId` | **ADD** | `UUID?` FK → Download | |
| `publishAt` | **ADD** | `DateTime?` | |
| `eventDate` | **KEEP** | | Backfill `startDate` from `eventDate` in migration |
| `slug` | **ALTER** | Remove `@unique` | → `@@unique([slug, locale])` |

**No new table.**

---

## Table: `EventMedia` — column changes (Media Center backbone)

| Column | Action | Type | Notes |
|--------|--------|------|-------|
| `slug` | **ADD** | `String?` | Detail pages for mentions/interviews |
| `locale` | **ADD** | `ContentLocale` @default(en) | |
| `status` | **ADD** | `PageStatus` @default(draft) | |
| `description` | **ADD** | `Text?` | Body content |
| `excerpt` | **ADD** | `String?` | Card teaser |
| `tags` | **ADD** | `String[]` @default([]) | |
| `publishAt` | **ADD** | `DateTime?` | Schedule |
| `edition` | **ADD** | `String?` | |
| `mediaCenterCategory` | **ADD** | `MediaCenterCategory` | Required for hub filtering |
| `relatedIds` | **ADD** | `Json` @default("[]")` | Related content UUIDs |
| `mediaAssetId` | **ADD** | `UUID?` FK → MediaAsset | |

**No new table.** EventMedia becomes the unified row for news/mentions/videos/interviews; press and galleries remain on Page/MediaAlbum with hub aggregation.

---

## New table: `EntityRevision` (only new table)

```prisma
model EntityRevision {
  id          String   @id @default(uuid()) @db.Uuid
  entityType  String   @map("entity_type")   // committee, speaker, partner, event, media_entry
  entityId    String   @map("entity_id") @db.Uuid
  version     Int
  snapshot    Json
  createdById String?  @map("created_by_id") @db.Uuid
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  @@unique([entityType, entityId, version])
  @@index([entityType, entityId, createdAt])
  @@map("entity_revisions")
}
```

**Rationale:** User requires revision history on all modules. `PageRevision` is page-specific; one generic table avoids five duplicates.

---

## Tables explicitly NOT created

| Proposed | Reason to skip |
|----------|----------------|
| `MediaCenterItem` | Hub aggregates Page + MediaAlbum + EventMedia + Download |
| `SpeakerEvent` junction | Speakers linked via edition string + featured flags |
| `CommitteeEdition` | Edition is a column on `Committee` |
| `PartnerHomepageSlot` | Homepage reads published partners by category |
| Separate revision tables | `EntityRevision` covers all |

---

## Migration file

**Name:** `20250701_phase_c_organizational_cms`

**Order:**
1. Create enums (PartnerCategory, SpeakerCategory, EventCategory, MediaCenterCategory)
2. Alter CommitteeCategory, MediaType (if needed)
3. Alter Committee, CommitteeMember, SpeakerProfile, Partner, Event, EventMedia
4. Create EntityRevision
5. Backfill: `Event.startDate` ← `Event.eventDate`; `Committee.status` ← `isPublished`
6. Drop old unique indexes on Committee.slug, Event.slug; add composite uniques

**Risk:** LOW — additive only, backfill in SQL, no registration FK touches.

---

## SeoMetadata entity types (new)

| entityType | Entity |
|------------|--------|
| `committee` | Committee.id |
| `speaker` | SpeakerProfile.id |
| `partner` | Partner.id |
| `event` | Event.id |
| `media_entry` | EventMedia.id |

Press articles and albums continue using `entityType=page` and album SEO via page pattern or route SEO.

---

## Index plan

| Table | Index | Purpose |
|-------|-------|---------|
| Committee | `[edition, locale, status]` | Public edition pages |
| SpeakerProfile | `[status, locale, isFeatured]` | Homepage highlights |
| Partner | `[partnerCategory, status, locale, sortOrder]` | Partner directory |
| Event | `[status, startDate, locale]` | Event catalog |
| EventMedia | `[mediaCenterCategory, status, publishAt]` | Media hub |
| EntityRevision | `[entityType, entityId, createdAt]` | Revision list |

---

## Row count estimate (post-seed)

| Table | Est. rows |
|-------|----------|
| Committee | 15 |
| CommitteeMember | 250 |
| SpeakerProfile | 40 |
| Partner | 25 |
| Event | 15 |
| EventMedia (media center) | 60 |
| EntityRevision | 500 (grows with edits) |

**Total new columns:** ~45 across 6 existing tables  
**Total new tables:** 1 (`EntityRevision`)  
**Total new enums:** 4 (+ CommitteeCategory extensions)

---

**Approved for implementation in wave C.0.**
