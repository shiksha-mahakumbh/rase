# Phase B.7 — Admin Panel Completion, Staging QA & Production Hardening

**Date:** May 2026  
**Status:** Complete (code)  
**Phase C:** Paused until B.7 staging QA passes

---

## Objective

Build polished admin UIs for all Phase B CMS modules, bridge Firebase admin auth to v2 APIs, seed starter content, and raise production readiness from **83 → 90+**.

---

## B.7A — Admin UI for CMS Modules ✅

### Infrastructure

| Component | Path | Purpose |
|-----------|------|---------|
| Firebase admin auth (server) | `src/server/lib/firebase-admin-auth.ts` | Verify ID token + resolve role |
| API gateway | `src/app/api/admin/gateway/[...path]/route.ts` | Proxy to `/api/v2/admin/*` with `x-ops-secret` |
| Client API helper | `src/lib/admin-cms-api.ts` | `adminCmsFetch()` / `adminCmsUpload()` |
| Admin shell | `src/components/admin/cms/AdminShell.tsx` | Sidebar, mobile nav, sign-out |
| Auth gate | `src/components/admin/cms/AdminGate.tsx` | Google login + role check |
| Shared UI | `src/components/admin/cms/AdminUi.tsx` | Tables, forms, pagination, badges |

**Auth bridge:** Admin UI uses Firebase Google OAuth. Gateway verifies Firebase ID token server-side, then injects `ADMIN_OPS_SECRET` for v2 API calls. Ops secret never exposed to browser.

### Admin routes (`/admin/cms/*`)

| Module | Route | Features |
|--------|-------|----------|
| Dashboard | `/admin/cms` | Module hub cards |
| Homepage | `/admin/cms/homepage` | Section JSON editor, publish |
| Pages | `/admin/cms/pages`, `/[id]` | List, edit, publish, archive |
| Notices | `/admin/cms/notices`, `/new`, `/[id]` | CRUD, publish, bulk actions, schedule |
| Categories | `/admin/cms/notices/categories` | Create, list |
| Downloads | `/admin/cms/downloads` | Upload, search, delete |
| Media Library | `/admin/cms/media` | Folders, upload, search, delete |
| Menus | `/admin/cms/menus` | Seed defaults, add/remove items |
| Settings | `/admin/cms/settings` | Org, contact, social, toggles |
| SEO Manager | `/admin/cms/seo` | Entity SEO + previews |
| Announcement Bars | `/admin/cms/announcement-bars` | CRUD, schedule, activate |
| Analytics | `/admin/cms/analytics` | Visitor dashboard + charts |

**Registration admin** remains at `/admin` with link to CMS Admin.

---

## B.7B — Media Library UI ✅

- Folder sidebar (media, downloads, notices, homepage + custom)
- Drag-drop file input + multipart upload
- Image preview grid; PDF type indicator
- Search by query (`q` param)
- Tags and alt text on upload
- Delete assets

**Future:** Usage tracking modal, signed URL preview, drag-reorder.

---

## B.7C — SEO Manager UI ✅

- Entity picker (page / notice / download)
- Fields: title, description, keywords, canonical, robots, OG, Twitter, JSON-LD
- Live previews: Google, Facebook, Twitter (`SeoPreview.tsx`)

---

## B.7D — Analytics Dashboard UI ✅

- Widgets: total visitors, active users, today, this month
- Charts: day / week / month / year (`VisitorTrafficChart.tsx`)
- Tables: top pages, traffic sources, downloads, devices
- Data from `GET /api/v2/admin/analytics/dashboard`

---

## B.7E — Staging QA

See [STAGING_QA_REPORT.md](./STAGING_QA_REPORT.md).

---

## B.7F — Performance Hardening

See [PERFORMANCE_HARDENING_REPORT.md](./PERFORMANCE_HARDENING_REPORT.md).

| Item | Status |
|------|--------|
| Homepage ISR (`loadCmsPageData` server-side) | ✅ |
| Noticeboard/downloads `revalidate = 300` | ✅ |
| Lazy below-fold homepage sections | ✅ B.6 |
| Image lazy loading | ✅ B.6 |
| API rate limits on v2 routes | ✅ |
| DB query batching in analytics dashboard | ✅ `Promise.all` |

---

## B.7G — Security Hardening

See [SECURITY_HARDENING_REPORT.md](./SECURITY_HARDENING_REPORT.md).

---

## B.7H — Content Seeding ✅

**Script:** `npm run seed:cms` → `scripts/seed-cms-content.mjs`

Seeds:
- Homepage sections (hero, stats, counters, events, programs, testimonials, partners, announcements, cta)
- Homepage SEO metadata
- Site settings (en)
- Notice categories + 2 sample notices
- Announcement bar (global modal)
- Header + footer menu items

---

## Validation

```bash
npx tsc --noEmit   # ✅ passes
npm run seed:cms   # requires DATABASE_URL + migrations applied
```

---

## Phase C gate

Do **not** start Committee, Speakers, Partners, Events, Media Center, or Press until:

1. Staging migrations applied
2. `npm run seed:cms` run on staging
3. Manual QA pass on all `/admin/cms/*` modules
4. User approval
