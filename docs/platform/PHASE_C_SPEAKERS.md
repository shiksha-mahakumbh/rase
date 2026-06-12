# Phase C — Speakers Module

**Wave:** C.2  
**Service:** `src/server/services/speaker.service.ts`

---

## Capabilities

- Full speaker profile: bio, designation, institution, country, photo
- Social links (JSON), topics, tags, languages
- Featured flag, sort order
- Publish / archive
- Locale (`en`, `hi`)
- Person schema via `buildPersonSchema` from `@/lib/seo/schema/builders`
- Audit + revisions

---

## Admin

| Route | Features |
|-------|----------|
| `/admin/cms/speakers` | List, search, category/featured filters |
| `/admin/cms/speakers/new` | Create speaker |
| `/admin/cms/speakers/[id]` | Edit, publish/archive, media picker, SEO |

**APIs:** `/api/v2/admin/speakers`, `/api/v2/admin/speakers/[id]`

---

## Public

| Route | Behavior |
|-------|----------|
| `/speakers` | Hub with CMS speakers; fallback to `authority-speakers` |
| `/speakers/[slug]` | Individual profile with Person + BreadcrumbList JSON-LD |

**Components:** `SpeakersHub.tsx`, `CmsSpeakerView.tsx`  
**Homepage:** `SpeakerHighlightsSection` loads CMS featured speakers with fallback.

---

## SEO

- `generateMetadata()` on hub and detail pages
- Person schema (name, jobTitle, affiliation, image, sameAs)
- BreadcrumbList: Home → Speakers → [Name]

---

## Legacy note

`/keynotespeakers` route remains for backward compatibility. Recommend 301 redirect to `/speakers` in a future cleanup phase.
