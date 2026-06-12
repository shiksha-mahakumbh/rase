# Phase C — Events Module

**Wave:** C.4  
**Service:** `src/server/services/event-cms.service.ts` (extends legacy `event.service.ts`)

---

## Capabilities

- Event CRUD on existing `Event` model
- Banner, venue, location, start/end dates
- Highlights (JSON array)
- Brochure download link (`brochureDownloadId` → `Download`)
- Registration link (external URL or internal path)
- Featured flag, publish workflow
- Locale (`en`, `hi`)
- Event schema via SEO metadata
- Audit + revisions

---

## Admin

| Route | Features |
|-------|----------|
| `/admin/cms/events` | List, status/category filters |
| `/admin/cms/events/new` | Create event |
| `/admin/cms/events/[id]` | Edit, publish, brochure picker |

**APIs:** `/api/v2/admin/events`, `/api/v2/admin/events/[id]`

---

## Public

| Route | Behavior |
|-------|----------|
| `/events` | CMS event listing |
| `/events/[slug]` | Event detail with Event + BreadcrumbList JSON-LD |
| `/upcoming-events` | Redirects/wires to CMS events with fallback |
| Homepage | `UpcomingEvent` section loads CMS featured event |

**Component:** `CmsEventView.tsx`

---

## SEO

- `generateMetadata()` on list and detail
- Event schema (name, startDate, endDate, location, image)
- BreadcrumbList: Home → Events → [Title]

---

## Fallback

Hardcoded upcoming event data preserved in `UpcomingEvent.tsx` until CMS content published with `--publish` seed or admin publish.
