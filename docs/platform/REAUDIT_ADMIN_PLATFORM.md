# Re-Audit — Admin Platform (Phase S)

**Date:** May 2026  
**Status:** Documentation only — no implementation

---

## Executive summary

| Lens | Score | Notes |
|------|------:|-------|
| CMS module UI completeness | 92/100 | 10/10 B.7 modules functional |
| Platform admin manageability | 78/100 | ~55% routes still code-deploy |
| Registration admin | 85/100 | Firebase-only, intentional |
| Unified admin experience | 65/100 | Two portals, dual data stacks |

The admin platform has two distinct portals sharing Firebase Google OAuth but operating on separate backends.

---

## Admin architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Google OAuth                     │
│              (adminUsers + bootstrap emails)                 │
└──────────────┬──────────────────────────┬─────────────────┘
               │                          │
       ┌───────▼────────┐         ┌───────▼────────┐
       │  /admin        │         │  /admin/cms    │
       │  Firebase ops  │         │  CMS portal    │
       └───────┬────────┘         └───────┬────────┘
               │                          │
       ┌───────▼────────┐         ┌───────▼────────┐
       │  Firestore     │         │  Gateway       │
       │  registrations │         │  → x-ops-secret│
       └────────────────┘         └───────┬────────┘
                                          │
                                  ┌───────▼────────┐
                                  │  Supabase/     │
                                  │  Prisma v2 API │
                                  └────────────────┘
```

---

## Route inventory

### `/admin` — Firebase registration ops (2 routes)

| Route | Manages | Backend |
|-------|---------|---------|
| `/admin` | Registration list, bulk status, CSV export, growth analytics, reports, system health, category breakdown | Firestore |
| `/admin/registrations/[id]` | Single registration detail, status, payment, accommodation, acknowledgement PDF | Firestore |

**Components:** `AdminDashboardOverview`, `RegistrationTable`, `AdminGrowthAnalytics`, `AdminReportsPanel`, `AdminSystemHealth`, `AdminAnalyticsIntelligence`

### `/admin/cms` — Supabase CMS (15 routes)

| Route | Module | CRUD | Gaps |
|-------|--------|------|------|
| `/admin/cms` | Dashboard | — | — |
| `/admin/cms/homepage` | Homepage sections | Edit | JSON editor UX; no drag-reorder |
| `/admin/cms/pages` | Generic pages | List/Edit | **No create UI** |
| `/admin/cms/pages/[id]` | Page editor | Edit/Publish | Sections + revisions |
| `/admin/cms/notices` | Notice board | Full CRUD | — |
| `/admin/cms/notices/new` | Create notice | Create | — |
| `/admin/cms/notices/[id]` | Edit notice | Edit | Attachment picker UX |
| `/admin/cms/notices/categories` | Categories | Create/List | **No edit/delete** |
| `/admin/cms/downloads` | Downloads | Full CRUD | No version history UI |
| `/admin/cms/media` | Media library | Upload/List | No usage tracking UI |
| `/admin/cms/menus` | Header/footer nav | Edit | **No drag-reorder** |
| `/admin/cms/settings` | Site config | Edit | JSON for offices |
| `/admin/cms/announcement-bars` | Ticker/modal | Full CRUD | No live preview |
| `/admin/cms/seo` | SEO metadata | Full CRUD | Not embedded in entity editors |
| `/admin/cms/analytics` | Visitor dashboard | Read | No export CSV |

### `CMS_NAV` groups

| Group | Items |
|-------|-------|
| **Content** (7) | Dashboard, Homepage, Pages, Notices, Categories, Downloads, Media |
| **Site** (4) | Menus, Settings, Announcement Bars, SEO |
| **Insights** (1) | Analytics |
| **Operations** (1) | Registrations → `/admin` |

---

## APIs without admin UI

| API domain | Endpoints | Priority for UI |
|------------|-----------|-----------------|
| **Committees** | Full CRUD + members | Critical (Phase C) |
| **Events** | Full CRUD | Critical (Phase C) |
| **Event media** | Legacy `EventMedia` | High |
| **Contact inbox** | GET only | High |
| **Feedback inbox** | GET only | High |
| **Newsletter** | GET only | Medium |
| **Accommodation** | GET only | Medium |
| **Supabase registrations** | GET only | Low (Firebase primary) |
| **Audit logs** | GET only | Medium |
| **Ops dashboard** | GET only | Low (partial in analytics) |
| **Speakers** | No API | Critical (Phase C) |
| **Sponsors/Partners** | No API (models exist) | High |

---

## Duplicated workflows

| Duplication | Impact | Resolution |
|-------------|--------|------------|
| Firestore `/admin` + Supabase `/api/v2/admin/registrations` | Two registration views | Keep Firebase primary until cutover approved |
| `/api/registration/*` (v1) + `/api/v2/registration/*` (v2) | Dual public APIs | v2 dormant while `REGISTRATION_BACKEND=firebase` |
| Homepage `announcements` JSON + `AnnouncementBar` CMS + legacy `Announcement` model | Three announcement systems | Consolidate to CMS bars + notices |
| Homepage `featured_events` JSON vs `Event` table | Events edited in JSON or API, not UI | Wire events admin UI |
| `MediaAsset` (CMS) vs `EventMedia` (legacy) vs `UploadedFile` (registration) | Three media systems | Unify under media library |
| Homepage `partners` JSON vs `Sponsor`/`Partner` Prisma models | Unused normalized tables | Activate partner module or deprecate models |
| FAQ in homepage `stats.faqs` JSON | No dedicated FAQ module | Extract to FAQ entity |
| SEO manager separate from entity editors | Double workflow for editors | Embed SEO panel in notice/download/page forms |
| Firebase roles vs Supabase `users`/`roles` RLS | RBAC schema unused | Connect or deprecate Supabase RBAC |

---

## Missing modules for 90% manageability

### Critical (no API, no UI)

| Module | Current source | Needed capabilities |
|--------|----------------|---------------------|
| Press / articles | 9 TSX files | CRUD, publish, SEO, attachments |
| Photo galleries | HC `/gallery` | Albums, media picker, publish |
| Video library | HC `/videos` | Media type video, embed URLs |
| Speaker profiles | HC + Firestore | CRUD, bio, social, images, sessions |
| Committee members | HC inline arrays | CRUD, reorder, publish, archive |
| Events catalog | `conference-catalog.ts` | CRUD, publish, archive, schedule |

### High (API exists, no UI)

| Module | API status | Needed UI |
|--------|------------|-----------|
| Contact inbox | GET | Reply, status, assign |
| Feedback inbox | GET | Reply, status, archive |
| Legal pages | Pages API | Create + migrate 5 pages |
| Departments | — | Generic pages or department module |
| FAQ | — | Dedicated module with categories |

### Medium

| Module | Gap |
|--------|-----|
| Newsletter subscribers | List + export |
| Accommodation requests | Inbox view |
| Audit log viewer | Read-only UI |
| Testimonials | Extract from homepage JSON |
| Publications/proceedings | Downloads or pages CMS |

---

## Manual work today (requires developer)

| Task | Who | Frequency |
|------|-----|-----------|
| Edit press article | Developer | Per article |
| Add committee member | Developer | Per edition |
| Update event catalog | Developer | Per event |
| Change department content | Developer | Rare |
| Add knowledge graph page | Developer | Per pillar |
| Update proceedings data | Developer | Per edition |
| Fix SEO on non-CMS routes | Developer | Per page |
| Hindi content | Developer | No admin path |

---

## Future scaling issues

| Issue | Risk at scale |
|-------|---------------|
| JSON editors for homepage sections | Error-prone; non-technical editors blocked |
| No drag-reorder on menus/partners | Manual sortOrder editing |
| No content workflow (draft → review → publish) | Single-step publish only |
| No multi-editor concurrency | Last-write-wins on sections |
| No content versioning UI (revisions API exists) | Rollback requires developer |
| No role-based CMS permissions | All admins have full access |
| No bulk operations | Notices/downloads one-at-a-time |
| No scheduled publishing UI | Schema supports `publishAt` — UI partial |

---

## Admin UX recommendations (Phase S planning)

### Unified shell

- Single `/admin` entry with tabbed portal: **Content · Registrations · Insights · Settings**
- Consistent sidebar across Firebase and CMS portals

### Quick wins (existing APIs)

1. Contact inbox UI
2. Feedback inbox UI
3. Pages create UI
4. Notice category edit/delete
5. Audit log viewer
6. SEO embed in entity editors

### Phase C modules (paused until approval)

Committees, Events, Speakers, Partners, Media Center admin UIs

---

## Admin platform score

| Area | Score |
|------|------:|
| CMS module coverage | 92 |
| API-to-UI coverage | 55 |
| Workflow efficiency | 60 |
| Multi-user readiness | 50 |
| Content self-service | 45 |
| **Platform admin average** | **78** |
