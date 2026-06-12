# Admin Validation — Staging

**Date:** June 2026  
**Method:** Codebase inventory + API route audit (runtime CRUD not executed — DB/server unavailable)

---

## CMS modules inventory

| Module | Admin route | API base | Editor | List |
|--------|-------------|----------|--------|------|
| Homepage | `/admin/cms/homepage` | `/api/v2/admin/homepage` | ✅ | — |
| Pages | `/admin/cms/pages` | `/api/v2/admin/pages` | ✅ `[id]` | ✅ |
| Notices | `/admin/cms/notices` | `/api/v2/admin/notices` | ✅ | ✅ |
| Downloads | `/admin/cms/downloads` | `/api/v2/admin/downloads` | ✅ | ✅ |
| Media Library | `/admin/cms/media` | `/api/v2/admin/media-library` | ✅ | ✅ |
| Menus | `/admin/cms/menus` | `/api/v2/admin/menus` | ✅ | ✅ |
| Settings | `/admin/cms/settings` | `/api/v2/admin/settings` | ✅ | — |
| SEO | `/admin/cms/seo` | `/api/v2/admin/seo` | ✅ | — |
| Analytics | `/admin/cms/analytics` | `/api/v2/admin/analytics` | read | — |
| FAQ | `/admin/cms/faq` | `/api/v2/admin/faq` | ✅ | ✅ |
| Articles | `/admin/cms/articles` | Pages API | ✅ | ✅ |
| Gallery | `/admin/cms/gallery` | `/api/v2/admin/media-albums` | ✅ | ✅ |
| Announcement Bars | `/admin/cms/announcement-bars` | `/api/v2/admin/announcement-bars` | ✅ | ✅ |
| Contact Inbox | `/admin/cms/contact` | `/api/v2/admin/contact` | read | ✅ |
| Feedback Inbox | `/admin/cms/feedback` | `/api/v2/admin/feedback` | read | ✅ |
| **Committees** | `/admin/cms/committees` | `/api/v2/admin/committees` | ✅ | ✅ |
| **Speakers** | `/admin/cms/speakers` | `/api/v2/admin/speakers` | ✅ | ✅ |
| **Partners** | `/admin/cms/partners` | `/api/v2/admin/partners` | ✅ | ✅ |
| **Events** | `/admin/cms/events` | `/api/v2/admin/events` | ✅ | ✅ |
| **Media Center** | `/admin/cms/media-center` | `/api/v2/admin/media-center` | ✅ | ✅ |

**Total: 20 CMS modules** (22 nav entries including dashboard + categories)

---

## CRUD capability matrix (code verified)

| Operation | All Phase C modules | Pre-C modules |
|-----------|--------------------:|-------------:|
| Create | ✅ POST routes | ✅ |
| Edit | ✅ PATCH routes | ✅ |
| Publish | ✅ `action: publish` | ✅ |
| Archive | ✅ `action: archive` | ✅ |
| Delete | ✅ DELETE routes | ✅ |
| Revisions | ✅ Committees (+ EntityRevision service) | Pages only |

**Auth:** All admin APIs use `createApiHandler({ requireAdmin: true })` → Firebase gateway → `x-ops-secret`.

---

## Runtime test status

| Test | Status | Blocker |
|------|--------|---------|
| Firebase admin login | ❌ Not tested | No staging deploy |
| Signed session cookie set | ❌ Not tested | Missing `ADMIN_OPS_SECRET` |
| Homepage section save | ❌ Not tested | DB down |
| Committee CRUD | ❌ Not tested | DB down |
| Speaker publish | ❌ Not tested | DB down |
| Partner upload logo | ❌ Not tested | DB + Supabase keys |
| Event brochure link | ❌ Not tested | DB down |
| Media center entry | ❌ Not tested | DB down |
| SEO metadata save | ❌ Not tested | DB down |

---

## Staging smoke test script (manual)

```
1. Login at /admin with Firebase Google auth
2. Verify POST /api/admin/session returns Set-Cookie (HttpOnly)
3. For each Phase C module:
   a. Create draft entry
   b. Edit content
   c. Publish
   d. Verify on public route
   e. Archive
   f. Delete (or restore from revision)
4. Verify audit log entry created
```

---

## Verdict

| Check | Result |
|-------|--------|
| Admin UI routes exist | ✅ PASS |
| Admin APIs exist + guarded | ✅ PASS |
| Phase C modules complete | ✅ PASS |
| Runtime CRUD tested | ❌ FAIL (blocked) |

**Stage 5: PARTIAL PASS** — code complete; runtime CRUD pending DB + staging deploy.
