# Admin Panel Expansion Plan

**Date:** June 2026  
**Current admin:** `/admin` — Firebase Google OAuth, registrations list/search/export  
**Target:** Full CMS + operations dashboard for global-scale event platform  
**Backend:** Supabase APIs (`/api/v2/admin/*`) — UI expansion after schema V2

---

## Current admin capabilities

| Module | Status | Backend |
|--------|--------|---------|
| Google login | ✅ Live | Firebase Auth |
| Registration list | ✅ Live | Firestore |
| Search / filters | ✅ Live | Client-side |
| CSV / Excel export | ✅ Live | Client-side |
| Registration detail | ✅ Live | `/admin/registrations/[id]` |
| Growth analytics | ✅ Partial | `AdminGrowthAnalytics.tsx` |
| Notice upload | ⚠️ Legacy page | `/noticeboarddata` (Firebase) |
| Speaker add | ⚠️ Legacy page | `/addkeynotespeaker` |
| Wishes add | ⚠️ Legacy page | `/addwishesreceived` |
| Data viewers | ⚠️ Legacy | `*datadekh*` pages (PII) |

---

## Target admin architecture

```
/admin
├── dashboard                 # KPIs, charts, recent activity
├── registrations/          # Existing + Supabase dual-read
├── notices/                # Full notice board CMS
├── events/                 # Event lifecycle management
├── committees/             # Committee + member CRUD
├── media/                  # Media center + press
├── downloads/              # Download center + versions
├── speakers/               # Speaker profiles + sessions
├── testimonials/           # Testimonials + wishes
├── partners/               # Partners + sponsors
├── team/                   # Team + vibhag members
├── faqs/                   # FAQ management
├── homepage/               # Homepage CMS sections
├── contact/                # Messages + office locations
├── feedback/               # Feedback moderation
├── newsletter/             # Subscribers
├── accommodation/          # Lodging requests
├── seo/                    # SEO metadata editor
├── translations/           # en/hi content (future)
├── analytics/              # Deep analytics
├── audit-logs/             # System audit viewer
├── users/                  # RBAC user management
├── settings/               # System settings
└── storage/                # File browser
```

---

## Module specifications

### 1. Dashboard (P0)

**KPIs:**
- Total registrations (by type, status, payment)
- Today's registrations
- Visitor count (daily/total)
- Revenue / payment status breakdown
- Recent registrations (last 10)
- Recent uploads
- Notice views
- Form submissions (contact + feedback)
- Download counts

**Charts:**
- Registration trend (7/30/90 days)
- Payment funnel
- Feedback rating distribution
- Top downloaded files

**API:** `GET /api/v2/admin/dashboard` (exists — expand)

---

### 2. Notice Board (P0)

| Action | UI | API |
|--------|-----|-----|
| List notices (filter: status, category, pinned) | Table + filters | `GET /api/v2/admin/notices` |
| Create notice | Form + rich text + PDF upload | `POST /api/v2/admin/notices` |
| Edit notice | Inline edit | `PATCH /api/v2/admin/notices/[id]` |
| Delete notice | Soft delete | `DELETE /api/v2/admin/notices/[id]` |
| Pin / unpin | Toggle | `PATCH` |
| Schedule | Date pickers | `publish_date`, `expiry_date` |
| Preview | Modal | Public render preview |
| Categories | CRUD | `GET/POST /api/v2/admin/notice-categories` |

**Replaces:** `/noticeboarddata`, static homepage widget.

---

### 3. Events (P0)

| Action | API |
|--------|-----|
| CRUD events | `/api/v2/admin/events` (exists — expand) |
| Publish / unpublish / archive | `PATCH status` |
| Upload banner + brochure | Multipart |
| Link gallery | M:N media |
| SEO editor | Linked `seo_metadata` |
| Event types filter | Conclave, Workshop, Webinar, etc. |

---

### 4. Committees (P1)

| Action | API |
|--------|-----|
| CRUD committees | Exists |
| Add/edit/remove members | Exists |
| Reorder members | Exists |
| Toggle active | Exists |
| Upload photo | Storage `committee` bucket |
| Social links editor | JSONB field |
| Edition filter | SMK 1.0–6.0 |
| Import from edition page | One-time migration tool |

---

### 5. Media Center (P1)

| Action | API |
|--------|-----|
| Upload image/video/PDF | `/api/v2/admin/media` (exists — expand) |
| Create press article | `POST /api/v2/admin/press` |
| Edit article (rich text) | `PATCH /api/v2/admin/press/[id]` |
| Categorize | news, press_release, coverage, video, interview, podcast |
| Feature media | Toggle `is_featured` |
| Gallery albums | CRUD albums + drag-reorder |
| Bulk upload | Multi-file |
| SEO per article | `seo_metadata` link |

---

### 6. Downloads (P1)

| Action | API |
|--------|-----|
| Upload file | Exists |
| Version management | `POST /api/v2/admin/downloads/[id]/versions` |
| Replace file | New version, mark current |
| Set expiry | `expires_at` |
| View download count | Dashboard widget |
| Categories | Brochure, Report, Guideline, Circular, Poster, Proceedings |

---

### 7. Speakers (P1)

| Action | API |
|--------|-----|
| CRUD speakers | `GET/POST /api/v2/admin/speakers` |
| Upload photo | Storage `speakers` |
| Assign to event/session | `speaker_sessions` |
| Approve (if submitted) | Toggle `is_approved` |
| Social links | Twitter, LinkedIn, website |
| Types | Keynote, Session, Guest, International |

**Replaces:** `/addkeynotespeaker`, hardcoded keynote list.

---

### 8. Testimonials & Wishes (P1)

| Action | API |
|--------|-----|
| CRUD testimonials | `/api/v2/admin/testimonials` |
| Approve/reject | Toggle `is_approved` |
| Reorder | `sort_order` |
| Upload photo | Storage `testimonials` |
| Rating | 1–5 stars |
| Import Firebase wishes | Migration tool |

---

### 9. Partners & Sponsors (P1)

| Action | API |
|--------|-----|
| CRUD partners | `/api/v2/admin/partners` |
| Upload logo | Storage `partners` |
| Categories | University, School, NGO, Government, Industry, International, Media |
| Priority ordering | `sort_order` |
| Sponsors (separate or merged) | `/api/v2/admin/sponsors` |

---

### 10. Team (P2)

| Action | API |
|--------|-----|
| CRUD team members | `/api/v2/admin/team` |
| Groups | Core, Office, Technical, Volunteer Leads |
| Department link | Vibhag mapping |
| Reorder | Drag-and-drop |
| ⚠️ PII warning | Phone numbers — access-controlled |

---

### 11. FAQ (P1)

| Action | API |
|--------|-----|
| CRUD FAQs | `/api/v2/admin/faqs` |
| Reorder | Drag-and-drop |
| Categories | General, Registration, Accommodation, etc. |
| Publish toggle | `is_published` |

---

### 12. Homepage CMS (P0)

| Section | Admin control |
|---------|---------------|
| Hero | Title, subtitle, CTAs, background image, dates |
| Stats/counters | Editable numbers + labels |
| Announcements | Linked notices or inline |
| Notice widget | Auto-feed from pinned notices |
| Why attend | Card CRUD |
| Featured events | Pick from events table |
| Featured programs | Card CRUD |
| Testimonials | Pick from approved testimonials |
| Partners row | Pick from partners (featured) |
| Sponsors row | Pick from sponsors |
| FAQ section | Pick from FAQs (top N) |
| CTA blocks | CRUD |

**API:** `/api/v2/admin/homepage/sections`, `/api/v2/cms/homepage` (public read)

---

### 13. Contact (P1)

| Module | API |
|--------|-----|
| Message inbox | `/api/v2/admin/contact` (exists) |
| Reply + status | `PATCH` |
| Office locations CRUD | `/api/v2/admin/contact-offices` |
| Map embed URL | Per office |

---

### 14. SEO Manager (P0)

| Action | API |
|--------|-----|
| Edit SEO for any entity | `/api/v2/admin/seo/[entityType]/[entityId]` |
| Preview OG card | Modal |
| Bulk sitemap review | List entities with `sitemap_include=false` |
| Per-locale SEO | en/hi tabs |

---

### 15. Analytics (P1)

| Widget | Data source |
|--------|-------------|
| Registration funnel | `registrations` |
| Revenue | `payment_records` |
| Visitors | `visitor_analytics` + Firestore (dual) |
| Content views | `content_views` |
| Notice views | `notice_views` |
| Download trends | `download_events` |
| Feedback trends | `feedback` by rating/date |

---

### 16. Users & RBAC (P2)

| Role | Permissions |
|------|-------------|
| Super Admin | All |
| Admin | Content + registrations + exports |
| Content Editor | CMS modules only |
| Data Entry | Registration status updates |
| Coordinator | Read-only registrations + committees |

**API:** `/api/v2/admin/users`, `/api/v2/admin/roles`  
**Auth migration:** Firebase Google OAuth → Supabase Auth (Phase 4+)

---

## UI technology (recommended)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Existing Next.js `/admin` | No new app |
| Components | Extend existing admin components | Consistency |
| Tables | Server-side pagination (existing pattern) | Scale |
| Rich text | TipTap or similar | Press/articles |
| File upload | Supabase signed upload via API | Security |
| Drag reorder | `@dnd-kit` | FAQs, members, homepage |

---

## Implementation phases

| Phase | Modules | Duration est. |
|-------|---------|---------------|
| A | Dashboard expansion, Notices, Homepage CMS | 3 weeks |
| B | Events, SEO manager, Contact offices | 2 weeks |
| C | Committees, Media/Press, Downloads | 3 weeks |
| D | Speakers, Testimonials, Partners, FAQ | 2 weeks |
| E | Team, Analytics, Users/RBAC | 2 weeks |
| F | i18n admin, Translation editor | 2 weeks |

**Total:** ~14 weeks (parallel with Schema V2 + API expansion)

---

## Security requirements

| Requirement | Implementation |
|-------------|----------------|
| Auth | Supabase Auth + Google OAuth |
| RBAC | Existing roles + Content Editor role |
| Audit | Every mutation → `audit_logs` |
| PII access | Team phone numbers — Admin+ only |
| File upload | MIME validation + size limit (exists) |
| CSRF | Authorization header on mutations |

---

## What NOT to build in admin

- MultiTrack Conference management
- Abstract/Paper submission workflows
- Journal/proceedings reviewer workflow
- Firebase rules editor (separate DevOps)

---

## Approval gate

Admin UI work begins only after:
1. `SUPABASE_SCHEMA_V2.md` approved
2. `API_V2_EXPANSION.md` approved
3. Schema V2 migration applied to staging

**Production:** `REGISTRATION_BACKEND=firebase` unchanged throughout admin build.
