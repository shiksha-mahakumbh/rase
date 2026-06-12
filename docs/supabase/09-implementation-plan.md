# 10. Step-by-Step Implementation Plan

**Rule:** Complete each phase before starting the next. No frontend changes until Phase 10 approval.

---

## Phase 1 — Architecture ✅ (this deliverable)

- [x] Architecture diagram
- [x] Folder structure
- [x] Dual-write strategy
- [ ] **APPROVAL REQUIRED**

## Phase 2 — Database

- [x] Prisma schema (38 tables)
- [x] `npx prisma validate`
- [x] Initial migration `20250609_init`
- [x] Seed: roles, permissions, counter (`supabase/seed.sql`, `scripts/supabase/seed-rbac.mjs`)
- [x] Supabase RLS policies (`supabase/policies/*.sql`)
- [x] `GET /api/v2/health` (connectivity probe)
- [ ] **Apply migration to Supabase project** (requires `DATABASE_URL` from operator)

**Deliverable:** Running PostgreSQL with schema applied.

## Phase 3 — Registration engine ✅

- [x] `src/server/services/registration.service.ts` (counter + type extensions)
- [x] `src/server/backend/index.ts` (firebase | supabase | dual)
- [x] All module services (contact, feedback, newsletter, committee, event, media, download, accommodation, dashboard, payment, email, storage, audit)
- [x] `POST /api/v2/registration/submit`
- [x] `GET /api/v2/registration/[id]`
- [x] `POST /api/v2/registration/upload`
- [x] Admin APIs under `/api/v2/admin/*`
- [x] Test scripts + documentation
- [ ] **Live Supabase connectivity test** (requires operator DATABASE_URL)

**Deliverable:** SMK2026 IDs generated in Supabase; API testable via curl.

## ⏸ PAUSE — Platform audit (June 2026)

Migration and Phase 4+ **paused** until platform audit approved.

Deliverables: `docs/platform/` (8 reports) — see `docs/platform/README.md`

Resume after: Schema V2 approval → Admin expansion → Phase 4 migration.

---

## Phase 4 — File management

- [ ] Create 9 Supabase Storage buckets
- [ ] `src/server/storage/upload.ts`
- [ ] Version tracking in `uploaded_files`
- [ ] `POST /api/v2/registration/upload`
- [ ] Signed URL generation

**Deliverable:** PDF upload → storage object + DB row.

## Phase 5 — Admin portal backend

- [ ] Supabase Auth + Google OAuth
- [ ] RBAC middleware
- [ ] `GET/PATCH /api/v2/admin/registrations`
- [ ] Search, filters, pagination
- [ ] CSV/Excel export
- [ ] Audit log viewer

**Deliverable:** Admin APIs functional (UI still on Firebase until Phase 10).

## Phase 6 — Committee management

- [ ] CRUD APIs for committees + members
- [ ] Reorder endpoint
- [ ] Category enum support

## Phase 7 — Media management

- [ ] Media upload (bulk)
- [ ] Gallery / press / featured toggles
- [ ] Event media linking

## Phase 8 — Contact & feedback

- [ ] Public submit APIs
- [ ] Admin reply + email notification
- [ ] Status tracking

## Phase 9 — Razorpay

- [ ] Order creation via Supabase-backed flow
- [ ] Webhook with duplicate protection
- [ ] `payment_records` + `registrations.payment_status` sync
- [ ] Refund tracking fields

## Phase 10 — Email (Brevo)

- [ ] Brevo SMTP transport
- [ ] Registration confirmation template
- [ ] Payment confirmation template
- [ ] Email queue + retry
- [ ] `email_logs` table population

## Phase 11 — Security hardening

- [ ] RLS policies finalized
- [ ] Rate limits on all v2 routes
- [ ] CSRF on admin
- [ ] IP tracking on submissions
- [ ] Security test suite

## Phase 12 — Migration

- [ ] `migrate-firestore.mjs`
- [ ] `migrate-storage.mjs`
- [ ] `verify-migration.mjs`
- [ ] Staging dry-run
- [ ] Production import
- [ ] Verification PASS

## Phase 13 — Testing

- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] Migration tests
- [ ] Security tests
- [ ] Load tests
- [ ] Playwright admin E2E

## Phase 14 — Deployment & cutover

- [ ] Staging full QA
- [ ] Dual-write window (7 days)
- [ ] Production cutover
- [ ] 48h monitoring
- [ ] Firebase decommission

## Phase 15 — Frontend integration (post-approval only)

- [ ] Switch `useRegistrationSubmit` to `/api/v2/*`
- [ ] Switch admin auth to Supabase
- [ ] Switch noticeboard to Supabase events
- [ ] Remove Firebase imports
- [ ] Final regression

---

## Timeline estimate

| Phase | Duration |
|-------|----------|
| 2–4 (DB + registration + files) | 1–2 weeks |
| 5–8 (Admin + committees + media + contact) | 2 weeks |
| 9–11 (Payments + email + security) | 1 week |
| 12–13 (Migration + testing) | 1 week |
| 14–15 (Deploy + frontend cutover) | 1 week |
| **Total** | **6–7 weeks** |

## Current status

**Phase 1–2 documentation complete. Awaiting architecture approval before writing `src/server/*` code.**
