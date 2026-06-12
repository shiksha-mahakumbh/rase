# Final Database Audit

**Date:** May 2026  
**Schema:** `prisma/schema.prisma` — **62 models**, 30+ enums  
**Provider:** PostgreSQL via Supabase

---

## Schema health summary

| Aspect | Score | Notes |
|--------|------:|-------|
| Normalization | 78 | Good CMS structure; JSON blobs on registrations |
| Indexing | 72 | CMS well-indexed; registration search gaps |
| Relations | 85 | Clear FK graph; few orphan columns |
| Scalability | 65 | Analytics append-only; audit/revision growth |
| Duplication | 60 | Multiple publish flags, revision systems |
| Unused models | 70 | 4 dead models identified |

**Overall database score: 72 / 100**

---

## Model inventory

| Domain | Models |
|--------|--------|
| Auth/RBAC | User, Role, Permission, UserRole, RolePermission |
| Registration | Registration + 10 type tables, AccommodationRequest, RegistrationStatusHistory, RegistrationCounter |
| Payments | PaymentRecord, WebhookEvent, UploadedFile |
| Communications | EmailLog, ContactMessage, Feedback, NewsletterSubscription |
| CMS core | Page, PageSection, PageRevision, Notice*, Download, Faq*, Menu*, SiteSetting, AnnouncementBar |
| CMS media | MediaFolder, MediaAsset, MediaAlbum, MediaAlbumItem |
| Organizational | Committee, CommitteeMember, Event, EventMedia, SpeakerProfile, Partner |
| SEO | SeoMetadata |
| Analytics | VisitorAnalytics, VisitorSession, VisitorPageView, VisitorEvent, VisitorDevice, VisitorLocation, TrafficSource |
| System | SystemSetting, AuditLog, EntityRevision, Announcement, Notification, Sponsor |

---

## Unused / low-use models

| Model | Evidence | Recommendation |
|-------|----------|----------------|
| `Announcement` | No `prisma.announcement` in `src/` | Deprecate or wire to admin; superseded by `AnnouncementBar` |
| `Notification` | No app usage; no `userId` FK | Remove or implement in Phase D |
| `Sponsor` | Superseded by `Partner`; no indexes | Migrate data to Partner; drop table |
| `SystemSetting` | Only in `seed-rbac.mjs` | Consolidate with `SiteSetting` or document purpose |

---

## Duplicate / redundant fields

| Area | Fields | Risk |
|------|--------|------|
| `Registration` | `razorpayOrderId`, `razorpayPaymentId`, `utrNumber`, `transactionId`, `registrationFee` vs `PaymentRecord` | Snapshot drift |
| `Registration` | `accommodationRequired` + `accommodationStatus` + `AccommodationRequest` | Triple representation |
| `Registration` | `emailDeliveryStatus` vs `EmailLog` | Redundant email state |
| `Event` | `status` + `isPublished`; `eventDate` + `startDate`/`endDate` | Dual semantics |
| `Committee`, `Download` | `status` + `isPublished` | Same pattern |
| CMS enums | `MediaType`, `MediaCenterCategory`, `MediaAssetType` | Overlapping taxonomies |
| Revisions | `PageRevision` + `EntityRevision` | Two revision systems (acceptable for now) |
| Settings | `SystemSetting` vs `SiteSetting` | Two key-value stores |

**Recommendation:** Introduce computed views or service-layer normalization; do not migrate until post-launch stabilization.

---

## Indexing audit

### Well-indexed

- CMS entities: `[slug, locale]` uniques, status/locale composites
- Registration: `registrationId`, `email`, `registrationType`, `registrationStatus`, `createdAt`
- Visitor analytics: session, page view, event indexes
- EntityRevision: `[entityType, entityId, createdAt]`

### Missing / weak indexes

| Model / query | Gap | Priority |
|---------------|-----|----------|
| `Registration` admin list | No composite `[registrationType, registrationStatus, createdAt]` | P1 |
| `Registration` search | `contains` on name/email without trigram/GIN | P2 |
| `Registration` | No index on `accommodationStatus` | P2 |
| `PaymentRecord` | No index on `status` | P2 |
| `EmailLog` | No index on `toEmail` | P3 |
| `AuditLog` | No index on `actorUserId` | P2 |
| `Partner.slug` | Nullable, no unique constraint | P2 |
| `Sponsor`, `Notification` | No indexes | P3 (if kept) |

---

## Relations audit

| Relation | Status |
|----------|--------|
| Committee → CommitteeMember | ✅ Cascade delete |
| Event → EventMedia | ✅ SetNull on event delete |
| MediaAsset → speakers/partners/members | ✅ Phase C wired |
| MediaAlbum.coverAssetId | ⚠️ Column present, no Prisma relation |
| Registration → type tables | ✅ 1:1 optional |
| User → Role (RBAC) | ✅ Schema exists, unused in API |

---

## Scalability concerns

| Concern | Severity | Mitigation |
|---------|----------|------------|
| Visitor analytics append-only | High | Partition/archive job; retention policy |
| `AuditLog.payload` JSON growth | Medium | TTL or archive to cold storage |
| `EntityRevision.snapshot` JSON growth | Medium | Cap versions per entity (e.g. 50) |
| `UploadedFile.signedUrl` persisted | Medium | Generate at read time; don't store URL |
| `Registration.metadata` JSON | Medium | Normalize high-query fields |
| Firebase migration fields | Low | Deprecate post-cutover |

---

## RLS / Supabase alignment

- App uses `SUPABASE_SERVICE_ROLE_KEY` everywhere → **bypasses RLS**
- RLS policies in `supabase/policies/*.sql` are manual-apply artifacts
- `seo_metadata_public_select` uses `USING (true)` — all rows readable via anon key
- Storage policies in `storage.sql` are **commented examples only**

**Recommendation:** Apply policies in Supabase dashboard before launch; treat service role as root access.

---

## Cleanup recommendations (post-launch)

| Action | Risk | Effort |
|--------|------|--------|
| Drop `Sponsor` table (after Partner migration) | Low | 2h |
| Drop or implement `Announcement`, `Notification` | Low | 1 day |
| Consolidate `SystemSetting` → `SiteSetting` | Medium | 1 day |
| Add registration composite index | None | 1h |
| Add trigram index for registration search | None | 2h |
| Cap EntityRevision versions | Low | 4h |
| Add `MediaAlbum.coverAssetId` relation | Low | 1h |
| Unify publish flags behind service layer | Medium | 3 days |

---

## Phase C schema validation

| Check | Status |
|-------|--------|
| `npx prisma validate` | ✅ |
| No duplicate content tables | ✅ |
| EntityRevision generic pattern | ✅ |
| Locale on organizational entities | ✅ |
| Migration file present | ✅ `20250701_phase_c_organizational_cms` |
| Production migration applied | ❌ Per mandate — not deployed |
