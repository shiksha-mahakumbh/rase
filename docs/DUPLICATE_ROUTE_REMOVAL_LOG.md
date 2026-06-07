# Duplicate Route Removal Log (Phase 1)

**Date:** 2026-05-29

## Removed directories

| Removed path | Canonical route | Reason |
|--------------|-----------------|--------|
| `src/app/participantregistrationdatadekh copy/` | `/participantregistrationdatadekh` | Accidental duplicate folder; identical purpose to canonical admin view |
| `src/app/ngoregistrationdatadekh copy/` | `/ngoregistrationdatadekh` | Accidental duplicate folder |

## Pre-deletion checks

- [x] `rg` scan: no TypeScript imports referenced `* copy*` paths
- [x] No `next/link` hrefs to copy paths in `src/`
- [x] Canonical routes retained with existing `layout.tsx` + `datadekhMeta()`

## Redirect strategy (`next.config.js`)

Permanent (301) redirects:

- `/participantregistrationdatadekh copy` → `/participantregistrationdatadekh`
- `/participantregistrationdatadekh%20copy` → `/participantregistrationdatadekh`
- `/ngoregistrationdatadekh copy` → `/ngoregistrationdatadekh`
- `/ngoregistrationdatadekh%20copy` → `/ngoregistrationdatadekh`

## Risk

Low — internal admin-style data views; not part of public registration funnel.
