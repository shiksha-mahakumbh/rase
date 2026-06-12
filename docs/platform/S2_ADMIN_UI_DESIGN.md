# S2 Admin UI Design Report

**Date:** May 2026  
**Design system:** Existing `AdminUi.tsx` + `AdminShell` patterns

---

## Navigation updates (`admin-nav.ts`)

```
Content
  ├── Dashboard
  ├── Homepage (+ Gallery tab)
  ├── Articles        ← NEW (pageType=article)
  ├── Pages (+ Create)
  ├── Notices
  ├── Downloads
  ├── Gallery         ← NEW
  ├── FAQ             ← NEW
  └── Media Library

Site
  ├── Menus, Settings, Announcement Bars, SEO

Insights
  └── Analytics

Operations            ← NEW group items
  ├── Contact Inbox   ← NEW
  ├── Feedback Inbox  ← NEW
  └── Registrations → /admin
```

---

## 1. Articles Admin (`/admin/cms/articles`)

**Purpose:** Manage press releases and news articles

| Screen | Components |
|--------|------------|
| List | Table: title, slug, locale, status, publishedAt, actions |
| Create | Link to `/admin/cms/pages/new?pageType=article` |
| Edit | Reuse `/admin/cms/pages/[id]` + Article section editor |

**Section editor fields:**
- Hero image (media picker)
- Excerpt (textarea)
- Sections[]: title, body (markdown), type (text|highlight|contact)

**Actions:** Save · Publish · Preview · SEO panel (embed)

---

## 2. Legal Pages

**No separate module** — use Pages list filtered `pageType=policy`  
**Create:** `/admin/cms/pages/new?pageType=policy`  
**Editor:** Title · Slug (matches route) · Content (HTML/markdown) · Publish

---

## 3. Gallery Admin (`/admin/cms/gallery`)

| Screen | Fields |
|--------|--------|
| Album list | title, slug, type, item count, status, locale |
| Album edit | title, slug, description, cover image, edition, year |
| Items tab | Drag-sort list: image picker, caption, alt text |
| Actions | Publish · Preview public URL |

**Album types:** gallery · homepage · edition · press

---

## 4. Contact Inbox (`/admin/cms/contact`)

| Column | Type |
|--------|------|
| Name, Email, Subject | Read-only |
| Status | Dropdown: new, in_progress, replied, closed, spam |
| Message | Expand row |
| Reply | Textarea + Save |
| Date | createdAt |

**Filters:** status · date range  
**Actions:** Mark replied · Close · Spam

---

## 5. Feedback Inbox (`/admin/cms/feedback`)

Same pattern as Contact + rating column + category filter.

---

## 6. FAQ Admin (`/admin/cms/faq`)

| Tab | UI |
|-----|-----|
| Categories | List + create/edit/delete |
| Questions | Table: question, category, featured, locale, status |
| Editor | Question · Answer · Featured toggle · Category · Locale |

**Homepage sync:** `isFeatured=true` items appear in homepage FAQ section.

---

## 7. Department Pages

Use Pages filter `pageType=department` — no new UI shell.  
**Editor:** Hero fields in sections + main content HTML.

---

## 8. Homepage Gallery Manager

**Location:** Tab on `/admin/cms/homepage` — "Gallery"  
**UI:** Reorderable slide list:
- Image (media picker or URL)
- Alt text
- Legend/caption
- Save to `gallery` section JSON or linked MediaAlbum

---

## 9. Hindi CMS

**Locale selector** on: Homepage · Settings · Notices · FAQ · Articles  
Pattern: `[EN] [HI]` tabs at top of editor (S2.4)

---

## 10. Public Media Integration

**Admin:** Existing media library unchanged  
**New:** "View public albums" link from gallery admin  
**Picker:** Reuse media picker component in gallery + article editors

---

## Shared components (reuse)

| Component | Used in |
|-----------|---------|
| `AdminPageHeader` | All screens |
| `AdminCard` | Forms, tables |
| `StatusBadge` | Lists |
| `AdminPagination` | All lists |
| `MediaPickerModal` | Gallery, articles, homepage (new) |
| `SeoPanelEmbed` | Articles, pages (S2.2) |

---

## UX principles

1. No JSON editors for content editors — forms only (except homepage sections keep JSON until S3)
2. Preview link opens public URL in new tab
3. Publish requires title + slug + minimum content
4. Locale tab defaults to `en`
5. Destructive actions require confirm dialog

**Design approved for S2 implementation**
