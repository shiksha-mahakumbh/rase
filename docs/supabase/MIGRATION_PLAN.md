# Migration Plan — Phase 3 Readiness

> Full migration strategy: [05-migration-plan.md](./05-migration-plan.md)

## Phase 3 completion checklist

- [x] Supabase service layer (`src/server/services/*`)
- [x] `/api/v2/*` routes (parallel to Firebase `/api/*`)
- [x] Backend switch (`REGISTRATION_BACKEND`)
- [x] Audit logging on all mutations
- [x] Payment abstraction (Supabase-ready, not cut over)
- [ ] Supabase project provisioned
- [ ] Phase 3 migration applied (`20250610_phase3`)
- [ ] Storage buckets created in Supabase
- [ ] Firestore historical import (`scripts/supabase/migrate-firestore.mjs` — Phase 4)
- [ ] Staging dual-write validation
- [ ] Production cutover (`REGISTRATION_BACKEND=supabase`)

## Recommended sequence (Phase 4)

1. **Seed counter parity** — set `registration_counters.last_number` to match Firebase `smk2026.lastNumber`
2. **Import Firestore** — preserve `firebase_master_doc_id` on every registration
3. **Import Storage** — map paths to Supabase buckets
4. **Staging dual-write** — `REGISTRATION_BACKEND=dual` for 7 days
5. **Verify** — `scripts/supabase/verify-migration.mjs`
6. **Cutover** — `REGISTRATION_BACKEND=supabase`
7. **Monitor** — compare `/api/v2/health` + admin dashboard stats
8. **Decommission Firebase** — only after 30-day rollback window

## Rollback

Set `REGISTRATION_BACKEND=firebase` on Vercel — instant revert, no frontend changes required.
