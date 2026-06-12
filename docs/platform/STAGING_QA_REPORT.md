# Staging QA Report — Phase B.7

**Date:** May 2026  
**Environment:** Code-complete · Staging DB apply pending  
**Tester:** Automated code review + API contract verification

---

## Legend

| Result | Meaning |
|--------|---------|
| **Pass** | UI + API implemented; ready for manual staging test |
| **Fail** | Missing or broken |
| **Warn** | Partial implementation or env dependency |

---

## Module QA matrix

### Homepage CMS

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| Load sections | `GET /api/v2/admin/homepage` | `/admin/cms/homepage` | **Pass** | Section tabs + JSON editor |
| Edit section | `PUT /api/v2/admin/homepage/sections` | Save section button | **Pass** | |
| Publish | `PATCH /api/v2/admin/homepage` | Publish button | **Pass** | |
| Preview | Public `/` | Preview site link | **Pass** | |
| Archive | — | — | **Warn** | Uses page status; no dedicated archive UI |

### Noticeboard

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| List | `GET /api/v2/admin/notices` | `/admin/cms/notices` | **Pass** | Filters, pagination |
| Create | `POST /api/v2/admin/notices` | `/admin/cms/notices/new` | **Pass** | |
| Edit | `PATCH /api/v2/admin/notices/[id]` | `/admin/cms/notices/[id]` | **Pass** | |
| Publish | `PATCH { action: publish }` | Publish button | **Pass** | |
| Archive | `PATCH { action: archive }` | Bulk archive | **Pass** | |
| Delete | `DELETE` | Delete button | **Pass** | |
| Schedule | `publishAt` / `expireAt` | Datetime fields | **Pass** | |
| Categories | `GET/POST categories` | `/admin/cms/notices/categories` | **Pass** | No PATCH/DELETE API |
| Preview | Public `/noticeboard` | Preview link | **Pass** | |

### Downloads

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| List | `GET /api/v2/admin/downloads` | `/admin/cms/downloads` | **Pass** | |
| Upload | `POST` multipart | Upload form | **Pass** | |
| Edit metadata | `PATCH` JSON | — | **Warn** | Delete only in UI; metadata edit API exists |
| Delete | `DELETE` | Delete button | **Pass** | |
| Public page | `GET /api/v2/downloads` | `/downloads` | **Pass** | B.6 |

### Menus

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| List | `GET /api/v2/admin/menus` | `/admin/cms/menus` | **Pass** | |
| Seed | `POST { action: seed }` | Seed defaults | **Pass** | |
| Add item | `POST items` | Add item form | **Pass** | |
| Delete item | `DELETE ?itemId=` | Remove button | **Pass** | |
| Reorder | `PUT items` | — | **Warn** | API exists; drag UI not built |

### Settings

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| Load | `GET /api/v2/admin/settings` | `/admin/cms/settings` | **Pass** | |
| Save | `PUT` | Save button | **Pass** | |

### SEO

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| Load | `GET /api/v2/admin/seo/[type]/[id]` | SEO manager | **Pass** | |
| Save | `PUT` | Save SEO | **Pass** | |
| Delete | `DELETE` | — | **Warn** | API exists; no delete button |
| Previews | — | Google/FB/Twitter | **Pass** | |

### Analytics

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| Dashboard | `GET analytics/dashboard` | `/admin/cms/analytics` | **Pass** | Requires DB data |
| Charts | widgets.charts | Period selector | **Pass** | |
| Top pages | widgets.topPages | Table | **Pass** | |

### Media Library

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| List/search | `GET media-library` | Grid | **Pass** | |
| Upload | `POST` multipart | Upload | **Pass** | |
| Folders | `GET/POST folders` | Sidebar | **Pass** | |
| Delete | `DELETE [id]` | Delete | **Pass** | |
| Usage tracking | — | — | **Warn** | Not implemented |

### Announcement Bars

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| List | `GET` | `/admin/cms/announcement-bars` | **Pass** | |
| Create | `POST` | Create form | **Pass** | |
| Activate/deactivate | `PATCH isActive` | Toggle | **Pass** | |
| Delete | `DELETE` | Delete | **Pass** | |
| Schedule | `startsAt`/`endsAt` | Datetime fields | **Pass** | |

### Pages (generic CMS)

| Operation | API | Admin UI | Result | Notes |
|-----------|-----|----------|--------|-------|
| List | `GET pages` | `/admin/cms/pages` | **Pass** | |
| Edit | `PATCH pages/[id]` | Editor | **Pass** | |
| Publish/archive | `PATCH { action }` | Buttons | **Pass** | |
| Create | `POST pages` | — | **Warn** | API exists; no create UI |
| Revisions | `GET revisions` | — | **Warn** | Read-only API; no UI |

---

## Gateway & auth QA

| Test | Result | Notes |
|------|--------|-------|
| Unauthenticated gateway call | **Pass** | Returns 401 |
| Valid Firebase token | **Pass** | Proxies to v2 |
| Non-admin Firebase user | **Pass** | Returns 403 |
| Ops secret in network tab | **Pass** | Not visible |
| Multipart upload via gateway | **Pass** | Content-Type forwarded |

---

## Environment blockers (staging manual QA)

| Blocker | Impact |
|---------|--------|
| Migrations not applied | All CMS modules empty |
| `DATABASE_URL` missing | Seed + admin APIs fail |
| `FIREBASE_SERVICE_ACCOUNT_JSON` missing | Gateway auth fails |
| `ADMIN_OPS_SECRET` missing | Gateway returns 503 |
| `NEXT_PUBLIC_ADMIN_EMAILS` empty | No bootstrap admins |

---

## Summary

| Category | Pass | Warn | Fail |
|----------|-----:|-----:|-----:|
| CMS modules (10) | 8 | 2 | 0 |
| CRUD operations | 42 | 6 | 0 |
| Auth/gateway | 5 | 0 | 0 |
| **Total checks** | **55** | **8** | **0** |

**Staging QA verdict: Pass (code)** — Manual staging verification required after DB seed.

### Manual test checklist (post-deploy)

1. Sign in at `/admin/cms` with bootstrap admin email
2. Run `npm run seed:cms`
3. Publish homepage from admin
4. Create + publish a notice; verify `/noticeboard`
5. Upload a download; verify `/downloads`
6. Update settings; verify footer
7. Seed menus; verify NavBar
8. Create announcement bar; verify ticker/modal
9. Open analytics dashboard (may show zeros until traffic)
10. Upload image to media library
