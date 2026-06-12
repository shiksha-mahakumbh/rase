# Seed Validation — Staging

**Date:** June 2026

---

## Commands attempted

| Command | Result |
|---------|--------|
| `npm run seed:cms` | ❌ FAIL — DB unreachable (`127.0.0.1:54322`) |
| `node scripts/seed-s2-content.mjs --publish` | ❌ NOT RUN (DB down) |
| `node scripts/seed-s2-hi.mjs --publish` | ❌ NOT RUN (DB down) |
| `node scripts/seed-phase-c-content.mjs --publish` | ❌ NOT RUN (DB down) |

**Error:** `PrismaClientInitializationError: Can't reach database server at 127.0.0.1:54322`

---

## Seed scripts inventory

| Script | Content | `--publish` flag |
|--------|---------|------------------|
| `scripts/seed-cms-content.mjs` | Homepage, menus, settings baseline | Optional |
| `scripts/seed-s2-content.mjs` | Press, legal, FAQ, departments, gallery | ✅ Required for public |
| `scripts/seed-s2-hi.mjs` | Hindi press/legal variants | ✅ Required for hi |
| `scripts/seed-phase-c-content.mjs` | Committees, speakers, partners, events, media | ✅ Required for public |

---

## Expected content after seeds

| Module | Seed source | Verify on |
|--------|-------------|-----------|
| Homepage | `seed-cms-content.mjs` | `/` |
| Notices | `seed-cms-content.mjs` | `/noticeboard` |
| Downloads | `seed-cms-content.mjs` | `/downloads` |
| Press/legal | `seed-s2-content.mjs` | `/press`, `/privacy-policy` |
| FAQ | `seed-s2-content.mjs` | Homepage FAQ section |
| Gallery | `seed-s2-content.mjs` | `/gallery` |
| Committees | `seed-phase-c-content.mjs` | `/committee/organizing-committee-2024` |
| Speakers | `seed-phase-c-content.mjs` | `/speakers` |
| Partners | `seed-phase-c-content.mjs` | `/partners` |
| Events | `seed-phase-c-content.mjs` | `/events` |
| Media Center | `seed-phase-c-content.mjs` | `/media-center` |

---

## Staging procedure (when DB available)

```bash
npm run db:migrate:deploy
npm run seed:cms
node scripts/seed-s2-content.mjs --publish
node scripts/seed-s2-hi.mjs --publish
node scripts/seed-phase-c-content.mjs --publish
node scripts/staging-db-check.mjs   # verify counts > 0
```

---

## Verdict

| Module | Seeded | Verified on staging |
|--------|--------|---------------------|
| Homepage | ❌ | ❌ |
| Notices | ❌ | ❌ |
| Downloads | ❌ | ❌ |
| Committees | ❌ | ❌ |
| Speakers | ❌ | ❌ |
| Partners | ❌ | ❌ |
| Events | ❌ | ❌ |
| Media Center | ❌ | ❌ |

**Stage 3: FAIL** — seeds blocked by database connectivity.
