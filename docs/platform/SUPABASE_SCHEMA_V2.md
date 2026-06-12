# Supabase Schema V2 — Full CMS Platform

**Date:** June 2026  
**Baseline:** Phase 2–3 schema (39 models)  
**Target:** 67 models · translation-ready · SEO-universal  
**Status:** Design only — NOT applied until audit approval

---

## Architecture diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC WEBSITE                           │
│  Next.js App Router (unchanged routes, CMS-driven content)      │
└───────────────────────────┬─────────────────────────────────────┘
                            │ /api/v2/*
┌───────────────────────────▼─────────────────────────────────────┐
│                     SERVICE LAYER (Phase 3+)                      │
│  registration · notice · event · media · cms · seo · analytics  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Prisma
┌───────────────────────────▼─────────────────────────────────────┐
│                   PostgreSQL (Supabase)                         │
│  ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │  CMS    │ │  People  │ │ Registrations│ │ Auth & RBAC    │  │
│  │ tables  │ │  tables  │ │  (existing)  │ │  (existing)    │  │
│  └────┬────┘ └────┬─────┘ └──────────────┘ └──────────────────┘  │
│       └──────┬────┘                                             │
│              ▼                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ seo_metadata (polymorphic) + content_translations (i18n)   │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│              Supabase Storage (10 buckets)                        │
│  registrations · notices · brochures · downloads · media ·        │
│  committee · speakers · testimonials · partners · galleries     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Enum additions

```prisma
enum NoticeStatus { draft scheduled published expired archived }
enum NoticePriority { low normal high urgent }
enum NoticeCategoryType { announcement circular office_order general deadline }
enum EventTypeEnum {
  Mahakumbh Conclave Workshop Webinar Training
  Competition School_Event Cultural Startup_Showcase Exhibition
}
enum MediaItemType {
  news press_release media_coverage video interview podcast image
}
enum PartnerCategory {
  university school ngo government industry international media
}
enum SpeakerType { keynote session guest international_delegate }
enum TeamGroup { core office technical volunteer_leads }
enum ContentLocale { en hi es fr ar ru }
enum HomepageSectionType {
  hero stats announcements notices why_attend timeline
  tracks upcoming_events testimonials gallery partners
  sponsors faq venue cta featured_programs featured_events
}
```

---

## New models (Prisma definitions — summary)

### SEO & i18n (foundation)

```prisma
model SeoMetadata {
  id               String   @id @default(uuid()) @db.Uuid
  entityType       String   @map("entity_type")
  entityId         String   @map("entity_id") @db.Uuid
  locale           ContentLocale @default(en)
  seoTitle         String?  @map("seo_title")
  metaDescription  String?  @map("meta_description") @db.Text
  metaKeywords     String[] @map("meta_keywords")
  canonicalUrl     String?  @map("canonical_url")
  ogTitle          String?  @map("og_title")
  ogDescription    String?  @map("og_description") @db.Text
  ogImageUrl       String?  @map("og_image_url")
  twitterCard      String?  @default("summary_large_image") @map("twitter_card")
  twitterTitle     String?  @map("twitter_title")
  twitterImageUrl  String?  @map("twitter_image_url")
  schemaJsonLd     Json?    @map("schema_json_ld")
  robots           String   @default("index,follow")
  sitemapInclude   Boolean  @default(true) @map("sitemap_include")
  sitemapPriority  Decimal? @map("sitemap_priority") @db.Decimal(2, 1)
  sitemapChangefreq String? @map("sitemap_changefreq")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@unique([entityType, entityId, locale])
  @@map("seo_metadata")
}

model ContentTranslation {
  id          String        @id @default(uuid()) @db.Uuid
  entityType  String        @map("entity_type")
  entityId    String        @map("entity_id") @db.Uuid
  locale      ContentLocale
  title       String?
  slug        String?
  excerpt     String?       @db.Text
  body        String?       @db.Text
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  @@unique([entityType, entityId, locale])
  @@map("content_translations")
}
```

### Notice Board

```prisma
model NoticeCategory {
  id        String              @id @default(uuid()) @db.Uuid
  name      String
  slug      String              @unique
  type      NoticeCategoryType
  sortOrder Int                 @default(0) @map("sort_order")
  notices   Notice[]
  @@map("notice_categories")
}

model Notice {
  id          String         @id @default(uuid()) @db.Uuid
  title       String
  slug        String         @unique
  categoryId  String?        @map("category_id") @db.Uuid
  description String?        @db.Text
  priority    NoticePriority @default(normal)
  status      NoticeStatus   @default(draft)
  isPinned    Boolean        @default(false) @map("is_pinned")
  publishAt   DateTime?      @map("publish_at")
  expiresAt   DateTime?      @map("expires_at")
  viewCount   Int            @default(0) @map("view_count")
  attachmentFileId String?   @map("attachment_file_id") @db.Uuid
  firebaseDocId    String?   @map("firebase_doc_id")
  createdAt   DateTime       @default(now()) @map("created_at")
  updatedAt   DateTime       @updatedAt @map("updated_at")
  deletedAt   DateTime?      @map("deleted_at")

  category    NoticeCategory? @relation(...)
  attachment  UploadedFile?   @relation(...)
  @@index([status, isPinned, publishAt])
  @@map("notices")
}
```

### Events (extended)

```prisma
model EventType {
  id     String @id @default(uuid()) @db.Uuid
  name   String
  slug   String @unique
  enum   EventTypeEnum
  events Event[]
  @@map("event_types")
}

// Extend existing Event model:
// + startDate, endDate, eventTypeId, registrationLink
// + brochureFileId, bannerFileId, venue (exists)
```

### Media & Press

```prisma
model PressArticle {
  id          String   @id @default(uuid()) @db.Uuid
  title       String
  slug        String   @unique
  excerpt     String?  @db.Text
  body        String   @db.Text
  author      String?
  publishedAt DateTime? @map("published_at")
  isPublished Boolean  @default(false) @map("is_published")
  isFeatured  Boolean  @default(false) @map("is_featured")
  heroImageUrl String? @map("hero_image_url")
  sourceUrl   String?  @map("source_url")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")
  @@map("press_articles")
}

model MediaAlbum {
  id          String @id @default(uuid()) @db.Uuid
  title       String
  slug        String @unique
  description String? @db.Text
  coverImageUrl String? @map("cover_image_url")
  sortOrder   Int    @default(0) @map("sort_order")
  isPublished Boolean @default(true) @map("is_published")
  items       MediaAlbumItem[]
  @@map("media_albums")
}

model MediaItem {
  id          String        @id @default(uuid()) @db.Uuid
  title       String
  mediaType   MediaItemType @map("media_type")
  url         String
  storagePath String?       @map("storage_path")
  thumbnailUrl String?      @map("thumbnail_url")
  altText     String?       @map("alt_text")
  category    String?
  isFeatured  Boolean       @default(false) @map("is_featured")
  sortOrder   Int           @default(0) @map("sort_order")
  publishedAt DateTime?     @map("published_at")
  createdAt   DateTime      @default(now()) @map("created_at")
  deletedAt   DateTime?     @map("deleted_at")
  @@map("media_items")
}
```

### Testimonials, Team, FAQ, Homepage

```prisma
model Testimonial {
  id           String  @id @default(uuid()) @db.Uuid
  fullName     String  @map("full_name")
  designation  String?
  organization String?
  photoUrl     String? @map("photo_url")
  quote        String  @db.Text
  rating       Int?
  isApproved   Boolean @default(false) @map("is_approved")
  isFeatured   Boolean @default(false) @map("is_featured")
  sortOrder    Int     @default(0) @map("sort_order")
  source       String? @default("admin")
  @@map("testimonials")
}

model TeamMember {
  id           String    @id @default(uuid()) @db.Uuid
  fullName     String    @map("full_name")
  group        TeamGroup
  designation  String?
  department   String?
  phone        String?   // PII — RBAC restricted
  email        String?
  photoUrl     String?   @map("photo_url")
  bio          String?   @db.Text
  socialLinks  Json      @default("{}") @map("social_links")
  sortOrder    Int       @default(0) @map("sort_order")
  isActive     Boolean   @default(true) @map("is_active")
  @@map("team_members")
}

model Faq {
  id          String  @id @default(uuid()) @db.Uuid
  question    String
  answer      String  @db.Text
  category    String?
  sortOrder   Int     @default(0) @map("sort_order")
  isPublished Boolean @default(true) @map("is_published")
  @@map("faqs")
}

model HomepageSection {
  id          String              @id @default(uuid()) @db.Uuid
  sectionType HomepageSectionType @map("section_type")
  title       String?
  config      Json                @default("{}")
  sortOrder   Int                 @default(0) @map("sort_order")
  isVisible   Boolean             @default(true) @map("is_visible")
  @@unique([sectionType])
  @@map("homepage_sections")
}

model HomepageStat {
  id        String @id @default(uuid()) @db.Uuid
  label     String
  value     String
  suffix    String?
  sortOrder Int    @default(0) @map("sort_order")
  @@map("homepage_stats")
}
```

### Contact offices

```prisma
model ContactOffice {
  id        String  @id @default(uuid()) @db.Uuid
  name      String
  address   String  @db.Text
  city      String?
  state     String?
  pincode   String?
  phone     String?
  email     String?
  mapEmbedUrl String? @map("map_embed_url")
  isPrimary Boolean @default(false) @map("is_primary")
  sortOrder Int     @default(0) @map("sort_order")
  @@map("contact_offices")
}
```

### Analytics

```prisma
model ContentView {
  id         String   @id @default(uuid()) @db.Uuid
  entityType String   @map("entity_type")
  entityId   String   @map("entity_id") @db.Uuid
  viewDate   DateTime @db.Date @map("view_date")
  viewCount  Int      @default(0) @map("view_count")
  @@unique([entityType, entityId, viewDate])
  @@map("content_views")
}

model DownloadVersion {
  id          String @id @default(uuid()) @db.Uuid
  downloadId  String @map("download_id") @db.Uuid
  version     Int
  fileUrl     String @map("file_url")
  storagePath String? @map("storage_path")
  isCurrent   Boolean @default(true) @map("is_current")
  uploadedAt  DateTime @default(now()) @map("uploaded_at")
  @@map("download_versions")
}
```

---

## Existing models — extensions

| Model | New fields |
|-------|------------|
| `Event` | startDate, endDate, eventTypeId, registrationLink, brochureFileId, bannerFileId |
| `SpeakerProfile` | speakerType, socialLinks JSONB, isApproved |
| `Partner` | description, priority, partnerCategory |
| `CommitteeMember` | socialLinks JSONB (photo/bio exist) |
| `Download` | expiresAt, currentVersionId |
| `UploadedFile` | entityType, entityId (polymorphic) |
| `Announcement` | **Deprecate** → migrate to `notices` |

---

## Storage bucket enum (V2)

```prisma
enum StorageBucket {
  registrations notices brochures downloads media
  committee speakers testimonials partners galleries
  awards best_practices documents receipts exports
}
```

---

## RLS policy summary (V2)

| Table | Public read | Admin write |
|-------|-------------|-------------|
| `notices` | Published + non-expired | Service role + RBAC |
| `press_articles` | is_published=true | Admin only |
| `media_items` | is_published=true | Admin only |
| `testimonials` | is_approved=true | Admin only |
| `faqs` | is_published=true | Admin only |
| `homepage_sections` | is_visible=true | Admin only |
| `seo_metadata` | Public read (for SSR) | Admin only |
| `team_members` | is_active=true (no phone) | Admin only |
| `contact_offices` | All active | Admin only |

---

## Migration file

```
prisma/migrations/20250620_schema_v2/migration.sql
```

**Apply order:**
1. Enums
2. New tables (no FKs)
3. FK constraints
4. Data migration scripts (separate)
5. RLS policies (`supabase/policies/v2/`)

---

## Relationship to Phase 3

| Phase 3 table | V2 status |
|---------------|-----------|
| `registrations` + type tables | Unchanged |
| `committees` + members | Extended |
| `events` | Extended |
| `downloads` | Extended + versions |
| `speaker_profiles` | Extended |
| `partners`, `sponsors` | Extended |
| `announcements` | Deprecated → `notices` |
| `contact_messages`, `feedback` | Unchanged |
| `newsletter_subscriptions` | Unchanged |
| `audit_logs`, `email_logs` | Extended actions |

**`REGISTRATION_BACKEND=firebase` until explicit cutover approval.**
