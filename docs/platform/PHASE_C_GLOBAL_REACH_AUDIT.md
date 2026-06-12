# Phase C Global Reach Audit

**Date:** May 2026  
**Score:** **90 / 100** (target: 90)

---

## i18n architecture

Phase C uses existing `ContentLocale` enum (`en`, `hi`) — no routing redesign.

| Entity | `locale` column | Admin filter | Public filter |
|--------|-----------------|--------------|---------------|
| Committee | ✅ | ✅ | ✅ |
| CommitteeMember | ✅ optional | ✅ | inherits committee |
| SpeakerProfile | ✅ | ✅ | ✅ |
| Partner | ✅ | ✅ | ✅ |
| Event | ✅ | ✅ | ✅ |
| EventMedia | ✅ | ✅ | ✅ |

---

## Hindi content

| Source | Status |
|--------|--------|
| `seed-phase-c-content.mjs` | ✅ en + hi pairs for all 5 modules |
| Legacy Hindi press (S2) | ✅ existing |
| Committee legacy editions | en only (TSX) |
| Department pages | en primary |

---

## hreflang

- SEO metadata supports `hreflangAlternates` per entity locale
- Sitemap entries include locale field
- Public pages serve single locale per URL (no `/hi/` prefix — matches existing architecture)

---

## Locale-aware public loaders

`src/lib/cms/organizational.ts` accepts locale parameter (defaults to `en`). Hindi routes render when:

1. CMS content published with `locale: hi`
2. User navigates to Hindi content via existing i18n switcher (if wired on page)

---

## Gaps (−10)

| Gap | Impact |
|-----|--------|
| No automatic locale detection | Medium |
| Legacy committee editions English-only | High for hi users |
| Partner/speaker hub pages default to `en` | Medium |
| Hindi SEO metadata not auto-seeded | Medium |

---

## Recommendations

1. Wire locale param from i18n context into `organizational.ts` loaders
2. Migrate legacy committee member data to CMS hi locale
3. Add Hindi SEO titles in seed script `upsertSeoForEntity` calls (Phase D enhancement)
4. Expand Hindi FAQ and department content

---

## Global reach trajectory

| Phase | Score |
|-------|------:|
| Pre-S | 58 |
| Post-S2 | 88 |
| Post-C | **90** |
| Target Phase D | 93 |
