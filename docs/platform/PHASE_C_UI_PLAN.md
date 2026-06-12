# Phase C Admin UI Plan

**Date:** May 2026  
**Design system:** Existing `AdminUi.tsx` + `AdminShell` + `admin-nav.ts`  
**Rule:** No separate admin architecture — extend S2 patterns only

---

## Navigation update

Add **Organizational** group to `admin-nav.ts`:

```
Content (existing S2 modules…)

Organizational          ← NEW GROUP
  ├── Committees
  ├── Speakers
  ├── Partners
  ├── Events
  └── Media Center

Site / Insights / Operations (unchanged)
```

| Label | Route | Description |
|-------|-------|-------------|
| Committees | `/admin/cms/committees` | Editions, types, members |
| Speakers | `/admin/cms/speakers` | Directory & profiles |
| Partners | `/admin/cms/partners` | Partner organizations |
| Events | `/admin/cms/events` | Event catalog (info only) |
| Media Center | `/admin/cms/media-center` | Unified media hub |

---

## Shared UI patterns (all modules)

Reuse from S2 (`notices/page.tsx`, `faq/page.tsx`, `gallery/page.tsx`):

| Pattern | Component | Notes |
|---------|-----------|-------|
| Page header | `AdminPageHeader` | Title, description, primary actions |
| List filters | `AdminCard` + `AdminSelect` + `AdminInput` | Status, locale, category, search |
| Data table | `<table>` + `caption.sr-only` | Sortable columns, row actions |
| Pagination | `AdminPagination` | `limit=20`, offset-based |
| Status | `StatusBadge` | draft / published / archived |
| Forms | `AdminInput`, `AdminTextarea`, `AdminSelect` | |
| Actions | `AdminButton` variants | Save, Publish, Archive, Delete |
| Loading / empty | `AdminLoading`, `AdminEmpty` | |
| Toasts | `react-hot-toast` | Success/error feedback |
| API | `adminCmsFetch` | Gateway proxy unchanged |

### Required UX features (per module)

| Feature | Implementation |
|---------|----------------|
| Search | Client-side filter on loaded page + server `q` param where list > 100 |
| Filters | Status, locale, category dropdowns |
| Pagination | Server `limit`/`offset` on all list endpoints |
| Bulk actions | Checkbox column + "Publish selected" / "Archive selected" |
| Publish/unpublish | PATCH `{ action: "publish" \| "archive" }` |
| Draft mode | Default `status=draft` on create |
| Revision history | Side panel tab → `GET .../revisions` from `EntityRevision` |
| Audit logging | Server-side only (existing `writeAuditLog`) |
| SEO panel | Collapsible `SeoPreview` embed → `PATCH /api/v2/admin/seo/[entityType]/[entityId]` |

---

## Module 1 — Committees UI

### Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Committee list | `/admin/cms/committees` | All committees with edition/category filters |
| Committee editor | `/admin/cms/committees/[id]` | Metadata + members tab |
| New committee | `/admin/cms/committees/new` | Create form |

### List columns

| Column | Notes |
|--------|-------|
| Name | Link to editor |
| Edition | e.g. 6.0 |
| Category | CommitteeCategory label |
| Locale | en / hi |
| Members | Count badge |
| Status | StatusBadge |
| Order | sortOrder |
| Updated | Relative date |

### Committee editor tabs

**Tab 1 — Details**
- Name, slug (auto), category (select), edition, locale, description (textarea), sort order, status

**Tab 2 — Members**
- Sortable list (drag handles via sort order inputs)
- Per member: name, designation, organization, photo (media picker URL), bio, email, phone, social links JSON fields, active toggle
- Add member inline / bulk import CSV (stretch — optional Phase C.1.1)

**Tab 3 — SEO**
- Embed `SeoPreview` with canonical `/committee/[slug]`

**Tab 4 — Revisions**
- Table: version, date, restore button (PATCH from snapshot)

### Bulk actions
- Publish / Archive / Delete (soft) selected committees

---

## Module 2 — Speakers UI

### Screens

| Screen | Route |
|--------|-------|
| Speaker list | `/admin/cms/speakers` |
| Speaker editor | `/admin/cms/speakers/[id]` |
| New speaker | `/admin/cms/speakers/new` |

### List columns

Name · Category · Edition · Featured · Locale · Status · Actions

### Editor fields

| Field | Control |
|-------|---------|
| Full name | Input |
| Slug | Input (auto) |
| Title | Input |
| Designation | Input |
| Organization | Input |
| Category | Select (SpeakerCategory) |
| Edition | Input |
| Locale | Select en/hi |
| Bio | Textarea |
| Image | Media picker / URL |
| Social links | LinkedIn, Twitter, Website inputs |
| Featured | Checkbox |
| Status | Select |
| SEO tab | SeoPreview → `/speakers/[slug]` |
| Revisions tab | EntityRevision list |

### Bulk actions
- Publish / Archive / Set featured / Remove featured

---

## Module 3 — Partners UI

### Screens

| Screen | Route |
|--------|-------|
| Partner list | `/admin/cms/partners` |
| Partner editor | `/admin/cms/partners/[id]` |
| New partner | `/admin/cms/partners/new` |

### List columns

Name · Category · Website · Active · Locale · Status · Order · Actions

### Editor fields

Name, slug (optional), partner category (enum), description, logo (media picker), website, sort order, isActive, locale, status, SEO tab.

### Filters
- Category: academic, knowledge, industry, media, csr, government
- Active: all / active only / inactive

### Homepage integration note
Admin shows banner: "Published academic partners appear on homepage when homepage `partners` section is empty or set to `source: cms`."

---

## Module 4 — Events UI

### Screens

| Screen | Route |
|--------|-------|
| Event list | `/admin/cms/events` |
| Event editor | `/admin/cms/events/[id]` |
| New event | `/admin/cms/events/new` |

### List columns

Title · Edition · Category · Start date · Venue · Featured · Status · Actions

### Editor sections

| Section | Fields |
|---------|--------|
| Basics | Title, slug, locale, edition, category, status |
| Schedule | Start date, end date, publish at (schedule) |
| Location | Venue, location |
| Content | Description (textarea), highlights (JSON list editor or repeatable fields) |
| Media | Banner image (media picker) |
| Brochure | Download picker (links to existing Downloads) |
| SEO | SeoPreview → `/events/[slug]` |
| Revisions | History panel |

### Bulk actions
- Publish / Archive selected events

---

## Module 5 — Media Center UI

### Concept

Unified **inbox** with category tabs — not a duplicate of Articles/Gallery admins.

| Tab | Source | Admin behavior |
|-----|--------|----------------|
| All | Aggregated | Filter across types |
| News | EventMedia | CRUD in place |
| Press Releases | Page (article) | Link → Articles admin |
| Media Mentions | EventMedia | CRUD |
| Photo Galleries | MediaAlbum | Link → Gallery admin |
| Videos | EventMedia | CRUD |
| Interviews | EventMedia | CRUD |
| Publications | Download / EventMedia | Link or CRUD |

### Primary screen: `/admin/cms/media-center`

**Layout:**
- Top: category tabs + status filter + locale filter + search
- Table: title, category, type, edition, featured, publish date, status, actions
- Create button → modal: pick category → routes to appropriate mini-editor

### Media entry editor (EventMedia-backed)

| Field | Control |
|-------|---------|
| Title | Input |
| Slug | Input |
| Category | MediaCenterCategory select |
| Excerpt | Input |
| Description | Textarea / HTML |
| Media type | image / video / document |
| URL / asset | Media picker |
| Tags | Comma-separated |
| Edition | Input |
| Featured | Checkbox |
| Related content | Multi-select IDs (optional v1: text UUIDs) |
| Publish at | Datetime |
| Locale | Select |
| Status | Select |
| SEO tab | NewsArticle or VideoObject schema preview |

### Cross-links
- Press tab row action: "Edit in Articles →"
- Gallery tab row action: "Edit in Gallery →"

---

## SEO Manager integration

Existing `/admin/cms/seo` remains global search. Each entity editor embeds `SeoPreview` for inline edit (same as pages/notices pattern).

Entity types added to SEO admin filter:
- `committee`, `speaker`, `partner`, `event`, `media_entry`

---

## Component reuse map

| New admin page | Closest S2 template |
|----------------|---------------------|
| committees list | `notices/page.tsx` |
| committees editor | `notices/[id]` + member list |
| speakers list | `articles/page.tsx` |
| speakers editor | `pages/[id]/page.tsx` |
| partners list | `downloads/page.tsx` |
| events list | `articles/page.tsx` |
| events editor | `notices/new` + sections |
| media-center | `faq/page.tsx` tabs + `notices` table |

---

## Accessibility

- Table captions (`sr-only`) on all list views
- Form labels via `AdminInput` label prop
- Keyboard-accessible bulk select checkboxes
- Focus management on tab switches (existing AdminShell)

---

## Mobile admin

- Responsive tables → card stack below `md` breakpoint (match notices list)
- Touch targets ≥ 36px (`AdminButton` default)

---

## Implementation order (UI)

1. `admin-nav.ts` — Organizational group
2. Committees (API exists — UI first for highest hardcoded pain)
3. Events (API exists)
4. Speakers (new API + UI)
5. Partners (new API + UI)
6. Media Center (extend API + unified UI)

---

## Files to create (estimate)

```
src/app/admin/cms/committees/page.tsx
src/app/admin/cms/committees/new/page.tsx
src/app/admin/cms/committees/[id]/page.tsx
src/app/admin/cms/speakers/page.tsx
src/app/admin/cms/speakers/new/page.tsx
src/app/admin/cms/speakers/[id]/page.tsx
src/app/admin/cms/partners/page.tsx
src/app/admin/cms/partners/new/page.tsx
src/app/admin/cms/partners/[id]/page.tsx
src/app/admin/cms/events/page.tsx
src/app/admin/cms/events/new/page.tsx
src/app/admin/cms/events/[id]/page.tsx
src/app/admin/cms/media-center/page.tsx
src/app/admin/cms/media-center/[id]/page.tsx
src/components/admin/cms/MemberListEditor.tsx      (committees)
src/components/admin/cms/RevisionHistoryPanel.tsx  (shared)
src/components/admin/cms/BulkActionBar.tsx         (shared)
```

**No new admin layout or auth shell.**
