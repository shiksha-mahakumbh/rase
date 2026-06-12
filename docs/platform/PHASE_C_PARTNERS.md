# Phase C — Partners Module

**Wave:** C.3  
**Service:** `src/server/services/partner.service.ts`

---

## Capabilities

- Partner CRUD with logo (URL or MediaAsset), website, description
- Categories: academic, industry, government, media, ngo, international, technology, research, other
- Featured, active, sort order
- Publish / archive
- Locale (`en`, `hi`)
- Organization schema support via SEO metadata
- Audit + revisions

---

## Admin

| Route | Features |
|-------|----------|
| `/admin/cms/partners` | List, category/featured filters |
| `/admin/cms/partners/new` | Create partner |
| `/admin/cms/partners/[id]` | Edit, publish/archive, logo picker |

**APIs:** `/api/v2/admin/partners`, `/api/v2/admin/partners/[id]`

---

## Public

| Route | Behavior |
|-------|----------|
| `/partners` | CMS partner grid with category grouping |
| Homepage | `Media_Partners` section loads CMS featured partners with static fallback |

**Component:** `PartnersHub.tsx`

---

## SEO

- `generateMetadata()` on `/partners`
- Organization schema for partner entities when SEO metadata configured
- BreadcrumbList: Home → Partners
