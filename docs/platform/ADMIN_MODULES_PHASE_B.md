# Admin Modules — Phase B

Admin authentication: header `x-ops-secret` or `Authorization: Bearer <ADMIN_OPS_SECRET>`

---

## 1. Notice Board Admin

**Base:** `/api/v2/admin/notices`

### Create notice
```http
POST /api/v2/admin/notices
Content-Type: application/json

{
  "title": "Registration Deadline Extended",
  "description": "Full notice body...",
  "categoryId": "<uuid>",
  "isPinned": true,
  "publishAt": "2026-06-01T00:00:00Z",
  "expireAt": "2026-12-31T23:59:59Z",
  "attachments": [{
    "fileName": "circular.pdf",
    "fileUrl": "https://...",
    "mimeType": "application/pdf",
    "mediaAssetId": "<optional-uuid>"
  }],
  "seo": {
    "seoTitle": "...",
    "metaDescription": "..."
  }
}
```

### Publish / archive
```http
PATCH /api/v2/admin/notices/{id}
{ "action": "publish" }
```

### List filters
`?status=published&locale=en&categoryId=<uuid>&limit=25&offset=0`

### Categories
`GET/POST /api/v2/admin/notices/categories`

---

## 2. Homepage CMS Admin

**Base:** `/api/v2/admin/homepage`

### Get homepage structure
```http
GET /api/v2/admin/homepage?locale=en
```
Returns page + `sectionKeys` array.

### Update sections (batch)
```http
PUT /api/v2/admin/homepage
{
  "locale": "en",
  "sections": [
    {
      "sectionKey": "hero",
      "content": {
        "headline": "Shiksha Mahakumbh 2026",
        "subheadline": "...",
        "banners": [{ "imageUrl": "...", "ctaUrl": "/register" }]
      }
    },
    {
      "sectionKey": "stats",
      "content": { "items": [{ "label": "Delegates", "value": "5000+" }] }
    }
  ]
}
```

### Update single section
```http
PUT /api/v2/admin/homepage/sections
{
  "sectionKey": "testimonials",
  "content": { "items": [{ "name": "...", "quote": "..." }] }
}
```

### Publish
```http
PATCH /api/v2/admin/homepage
{ "action": "publish", "locale": "en" }
```

### Section content schemas (recommended JSON shapes)

| Section | Content shape |
|---------|---------------|
| hero | `{ headline, subheadline, banners[] }` |
| stats | `{ items: [{ label, value, icon? }] }` |
| counters | `{ items: [{ label, count, suffix? }] }` |
| featured_events | `{ items: [{ title, date, url, imageUrl? }] }` |
| featured_programs | `{ items: [{ title, description, url }] }` |
| testimonials | `{ items: [{ name, role, quote, photoUrl? }] }` |
| partners | `{ items: [{ name, logoUrl, website? }] }` |
| announcements | `{ items: [{ title, body, url? }] }` |
| cta | `{ headline, body, buttonLabel, buttonUrl }` |

---

## 3. Downloads Center Admin

**Base:** `/api/v2/admin/downloads`

### Upload
```http
POST /api/v2/admin/downloads
Content-Type: multipart/form-data

title, slug, description, category, downloadType, tags (comma-separated), expiresAt, file
```

### Replace file (versioning)
```http
PATCH /api/v2/admin/downloads/{id}
Content-Type: multipart/form-data
file: <new-file>
```

### Update metadata
```http
PATCH /api/v2/admin/downloads/{id}
{
  "title": "...",
  "downloadType": "brochure",
  "tags": ["2026", "conclave"],
  "expiresAt": "2027-01-01T00:00:00Z",
  "status": "published"
}
```

### List
`?status=published&type=brochure&limit=50`

---

## 4. Global Settings Admin

**Base:** `/api/v2/admin/settings`

### Read (no cache)
```http
GET /api/v2/admin/settings?locale=en
```

### Update
```http
PUT /api/v2/admin/settings
{
  "locale": "en",
  "organizationName": "Department of Holistic Education (DHE)",
  "tagline": "Shiksha Mahakumbh Abhiyan",
  "logoUrl": "https://...",
  "contactEmail": "info@rase.co.in",
  "phoneNumbers": ["+91-..."],
  "socialLinks": { "facebook": "...", "twitter": "...", "youtube": "..." },
  "registrationOpen": true,
  "maintenanceMode": false,
  "footerContent": { "columns": [...] }
}
```

Cache invalidates automatically on PUT.

---

## 5. Navigation Admin

**Base:** `/api/v2/admin/menus`

### Seed default menus
```http
POST /api/v2/admin/menus
{ "action": "seed", "locale": "en" }
```

### Add menu item
```http
POST /api/v2/admin/menus/{menuId}/items
{
  "label": "About",
  "url": "/about",
  "sortOrder": 1,
  "parentId": null
}
```

### Reorder / nest
```http
PUT /api/v2/admin/menus/{menuId}/items
{
  "items": [
    { "id": "<uuid>", "sortOrder": 0, "parentId": null },
    { "id": "<uuid>", "sortOrder": 1, "parentId": "<parent-uuid>" }
  ]
}
```

### Delete item
```http
DELETE /api/v2/admin/menus/{menuId}/items?itemId=<uuid>
```

---

## 6. Announcement Bar Admin

**Base:** `/api/v2/admin/announcement-bars`

### Create
```http
POST /api/v2/admin/announcement-bars
{
  "title": "Registration Open",
  "message": "Early bird registration closes June 30",
  "barType": "registration_alert",
  "colorTheme": "warning",
  "ctaLabel": "Register Now",
  "ctaUrl": "/register",
  "isDismissible": true,
  "startsAt": "2026-06-01T00:00:00Z",
  "endsAt": "2026-06-30T23:59:59Z",
  "priority": 10
}
```

### Deactivate
```http
PATCH /api/v2/admin/announcement-bars/{id}
{ "isActive": false }
```

---

## Admin portal integration map

| Admin UI module | API base | Priority |
|-----------------|----------|----------|
| Notice Manager | `/api/v2/admin/notices` | P1 |
| Homepage Editor | `/api/v2/admin/homepage` | P1 |
| Downloads Manager | `/api/v2/admin/downloads` | P1 |
| Site Settings | `/api/v2/admin/settings` | P2 |
| Menu Builder | `/api/v2/admin/menus` | P2 |
| Banner Manager | `/api/v2/admin/announcement-bars` | P2 |

All modules reuse Phase A:
- Media Library (`/api/v2/admin/media-library`) for uploads
- SEO Manager (`/api/v2/admin/seo/{entityType}/{entityId}`) for overrides

---

## Mobile admin considerations

- Touch targets: min 44×44px on reorder drag handles
- Multipart uploads: show progress for download/attachment uploads
- Preview endpoints: use public routes (`/api/v2/notices`, `/api/v2/homepage`) for live preview
