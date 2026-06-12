# Seed Readiness Report

**Date:** June 2026  
**Execution status:** ❌ BLOCKED (database unreachable)

---

## Seed scripts inventory

| Script | npm command | `--publish` | Locale |
|--------|-------------|-------------|--------|
| `scripts/seed-cms-content.mjs` | `npm run seed:cms` | No flag (draft) | `en` |
| `scripts/seed-s2-content.mjs` | `node scripts/seed-s2-content.mjs` | ✅ Required | `en` |
| `scripts/seed-s2-hi.mjs` | `node scripts/seed-s2-hi.mjs` | ✅ Required | `hi` |
| `scripts/seed-phase-c-content.mjs` | `node scripts/seed-phase-c-content.mjs` | ✅ Required | `en` + `hi` |

---

## Idempotency analysis

| Script | Pattern | Safe re-run? | Notes |
|--------|---------|--------------|-------|
| `seed-cms-content.mjs` | `upsert` on pages, sections, SEO, menus, notices | ✅ Yes | Homepage `slug=home` |
| `seed-s2-content.mjs` | `upsert` pages by `slug_locale`; `deleteMany` + `createMany` gallery items | ✅ Yes | Gallery items refreshed each run |
| `seed-s2-hi.mjs` | Same upsert pattern, `locale: "hi"` | ✅ Yes | Separate locale keys |
| `seed-phase-c-content.mjs` | `upsert` committees/speakers/events; `findFirst`+update partners/media | ✅ Mostly | Committee members: `deleteMany` then `createMany` each run |

### Duplicate protection

| Entity | Unique constraint | Seed protection |
|--------|-------------------|-----------------|
| Pages | `[slug, locale]` | `upsert` |
| Committees | `[slug, edition, locale]` | `upsert` |
| Speakers | `[slug, locale]` | `upsert` |
| Events | `[slug, locale]` | `upsert` |
| Partners | No unique on slug | `findFirst` by slug+locale — ⚠️ could duplicate if slug null |
| EventMedia | No unique on slug | `findFirst` by slug+locale |

**Warning:** Partner seed uses nullable `slug` without DB unique — re-runs are safe via `findFirst` but manual duplicates possible if slug omitted.

---

## Locale support

| Script | `en` | `hi` |
|--------|------|------|
| `seed-cms-content.mjs` | ✅ | ❌ |
| `seed-s2-content.mjs` | ✅ (includes some hi press in array) | Partial |
| `seed-s2-hi.mjs` | ❌ | ✅ |
| `seed-phase-c-content.mjs` | ✅ | ✅ |

---

## Dependency order (mandatory)

```
1. npm run db:migrate:deploy     # Schema must exist first
2. npm run seed:cms              # Homepage, menus, settings, notices baseline
3. node scripts/seed-s2-content.mjs --publish    # Requires pages table + homepage
4. node scripts/seed-s2-hi.mjs --publish         # Requires homepage from step 2
5. node scripts/seed-phase-c-content.mjs --publish  # Requires Phase C tables
```

**Rationale:**
- Step 2 creates `home` page and menu structure
- Step 3 references homepage for gallery section upsert
- Step 4 updates Hindi homepage sections (needs `home` page with `locale=hi` or section keys)
- Step 5 requires `committees`, `speaker_profiles`, `partners`, `events`, `event_media` tables

---

## Content coverage after full seed

| Module | Seed script | Public route |
|--------|-------------|--------------|
| Homepage | `seed-cms` + `seed-s2-hi` | `/`, `/hi` |
| Notices | `seed-cms` | `/noticeboard` |
| Menus / Settings | `seed-cms` | Global chrome |
| Press / Legal | `seed-s2` | `/press`, `/privacy-policy` |
| FAQ | `seed-s2` | Homepage section |
| Gallery | `seed-s2` | `/gallery` |
| Departments | `seed-s2` | `/departments/*` |
| Committees | `seed-phase-c` | `/committee/organizing-committee-2024` |
| Speakers | `seed-phase-c` | `/speakers` |
| Partners | `seed-phase-c` | `/partners` |
| Events | `seed-phase-c` | `/events` |
| Media Center | `seed-phase-c` | `/media-center` |

---

## Exact execution sequence (copy-paste)

```bash
# After DATABASE_URL points to staging and migrate deploy succeeds:

npm run seed:cms
node scripts/seed-s2-content.mjs --publish
node scripts/seed-s2-hi.mjs --publish
node scripts/seed-phase-c-content.mjs --publish

# Verify counts:
node scripts/staging-db-check.mjs
```

---

## Verdict

| Check | Status |
|-------|--------|
| Scripts syntactically valid | ✅ |
| Idempotency | ✅ (with partner slug caveat) |
| Locale support | ✅ |
| Dependency order documented | ✅ |
| Successfully executed | ❌ BLOCKED |

**Seeds are ready to run immediately after migration deploy succeeds.**
