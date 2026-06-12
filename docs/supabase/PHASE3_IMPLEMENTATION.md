# Phase 3 — Supabase Backend Implementation

**Status:** Complete (backend-only)  
**Rule:** Firebase remains active · No frontend changes · `REGISTRATION_BACKEND=firebase` default

---

## Delivered modules

| Module | Service | API prefix |
|--------|---------|------------|
| Registration engine | `registration.service.ts` | `/api/v2/registration/*` |
| Backend switch | `backend/index.ts` | env `REGISTRATION_BACKEND` |
| File storage | `storage.service.ts` | upload via registration + admin |
| Email queue | `email.service.ts` | `/api/v2/registration/send-email` |
| Contact | `contact.service.ts` | `POST /api/v2/contact` |
| Feedback | `feedback.service.ts` | `POST /api/v2/feedback` |
| Newsletter | `newsletter.service.ts` | `POST /api/v2/newsletter/subscribe` |
| Committees | `committee.service.ts` | `/api/v2/admin/committees/*` |
| Events | `event.service.ts` | `/api/v2/admin/events/*` |
| Media | `media.service.ts` | `/api/v2/admin/media` |
| Downloads | `download.service.ts` | `/api/v2/downloads` + admin |
| Accommodation | `accommodation.service.ts` | `/api/v2/admin/accommodation` |
| Payments (prep) | `payment.service.ts` | not wired to live Razorpay yet |
| Audit logs | `audit.service.ts` | `/api/v2/admin/audit-logs` |
| Dashboard | `dashboard.service.ts` | `/api/v2/admin/dashboard` |

---

## Registration ID generation

Atomic counter in `registration_counters`:

- `year`: 2026
- `prefix`: SMK2026
- `last_number`: incremented in Prisma transaction

Format: `SMK2026-000001`

---

## Supported registration types (v2)

Conclave · Delegate · Exhibition · Accommodation · Volunteer · School Program (→ Participant) · Olympiad · Awards · Best Practices · Talent · NGO

**Excluded:** MultiTrack Conference · Abstract · Paper Submission

---

## Backend switch

```typescript
// src/server/backend/index.ts
REGISTRATION_BACKEND=firebase | supabase | dual
```

| Mode | Behaviour |
|------|-----------|
| `firebase` | v2 submit delegates to `saveRegistration.server.ts` (default) |
| `supabase` | v2 submit writes to PostgreSQL via Prisma |
| `dual` | Firebase primary; Supabase mirror (best-effort) |

---

## Schema changes (Phase 3 migration)

Migration: `prisma/migrations/20250610_phase3/migration.sql`

- `newsletter_subscriptions` table
- `webhook_events` table
- Extended `AuditAction` enum
- `registration_counters.year`
- `committee_members.is_active`
- `events.status`, `venue`, `banner_url`
- `downloads.download_count`

---

## Apply to Supabase

```bash
npm run db:migrate:deploy
npm run db:seed
# Apply RLS policies if not already applied
```

---

## Test scripts

```bash
node scripts/test-supabase-registration.mjs
node scripts/test-supabase-contact.mjs http://localhost:3000
node scripts/test-supabase-feedback.mjs http://localhost:3000
```

---

## Next: Phase 4 migration testing

1. Provision Supabase project + storage buckets
2. Run Firestore → PostgreSQL migration scripts
3. Set `REGISTRATION_BACKEND=dual` on staging
4. Verify record parity before cutover
