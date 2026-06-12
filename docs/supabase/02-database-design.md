# 4. Database Design

## Design principles

1. **Master + extension pattern** — `registrations` holds common fields; type tables hold specifics (mirrors current Firestore dual-write).
2. **UUID primary keys** — internal IDs; public `registration_id` remains `SMK2026-000001`.
3. **Soft deletes** — `deleted_at` on all user-facing entities.
4. **Audit trail** — `audit_logs` + `registration_status_history` for compliance.
5. **Migration traceability** — `firebase_master_doc_id`, `source` columns preserve lineage.
6. **JSON metadata** — `registrations.metadata` for fields not yet normalized.

## Entity relationship (core)

```
users ──┬── user_roles ── roles ── role_permissions ── permissions
        └── audit_logs

registration_counters (prefix=SMK2026, last_number)

registrations ──┬── conclave_registrations
                ├── delegate_registrations
                ├── exhibition_registrations
                ├── awards_registrations
                ├── best_practice_registrations
                ├── olympiad_registrations
                ├── talent_registrations
                ├── volunteer_applications
                ├── ngo_registrations
                ├── participant_registrations
                ├── accommodation_requests
                ├── uploaded_files
                ├── payment_records
                ├── email_logs
                ├── registration_status_history
                └── audit_logs

committees ── committee_members
events ── event_media
```

## Table inventory (38 tables)

| Table | Purpose |
|-------|---------|
| `users` | Admin/staff mapped to Supabase Auth |
| `roles` | RBAC roles |
| `permissions` | Granular permissions |
| `user_roles` | M:N user↔role |
| `role_permissions` | M:N role↔permission |
| `system_settings` | Key-value config |
| `registration_counters` | SMK2026 sequence |
| `registrations` | Master registration record |
| `registration_status_history` | Status change audit |
| `conclave_registrations` | Conclave-specific |
| `delegate_registrations` | Delegate-specific |
| `exhibition_registrations` | Exhibition-specific |
| `award_registrations` | Awards-specific |
| `best_practice_registrations` | Best Practices-specific |
| `olympiad_registrations` | Olympiad-specific |
| `talent_registrations` | Talent-specific |
| `volunteer_applications` | Volunteer-specific |
| `ngo_registrations` | NGO-specific |
| `participant_registrations` | Participant-specific |
| `accommodation_requests` | Lodging requests |
| `uploaded_files` | File metadata + versioning |
| `payment_records` | Razorpay payments |
| `audit_logs` | System-wide audit |
| `email_logs` | Brevo delivery log |
| `committees` | Committee definitions |
| `committee_members` | Committee members |
| `events` | Notice board / events |
| `event_media` | Gallery, press, media |
| `downloads` | Downloadable documents |
| `contact_messages` | Contact form |
| `feedback` | Feedback form |
| `announcements` | Notice board announcements |
| `notifications` | In-app notifications |
| `speaker_profiles` | Keynote speakers |
| `sponsors` | Sponsors |
| `partners` | Partners |
| `visitor_analytics` | Visitor counter |

## Indexes (critical)

| Table | Index | Reason |
|-------|-------|--------|
| `registrations` | `registration_id` UNIQUE | Public lookup |
| `registrations` | `(registration_type, created_at)` | Admin filters |
| `registrations` | `email` | Search |
| `payment_records` | `razorpay_payment_id` UNIQUE | Webhook idempotency |
| `payment_records` | `razorpay_order_id` | Order lookup |
| `audit_logs` | `(action, created_at)` | Admin audit view |
| `uploaded_files` | `(registration_id, field_name, is_current)` | File version lookup |

## ID generation

```sql
-- Atomic counter (Prisma transaction)
SELECT last_number FROM registration_counters WHERE prefix = 'SMK2026' FOR UPDATE;
UPDATE registration_counters SET last_number = last_number + 1;
-- Format: SMK2026-{last_number padded to 6}
```

## Firebase → Supabase mapping

| Firebase | Supabase |
|----------|----------|
| `registrations` | `registrations` |
| `registrationCounters/smk2026` | `registration_counters` |
| `conclave_registrations` | `conclave_registrations` |
| `delegate_registrations` | `delegate_registrations` |
| `best_practices` | `best_practice_registrations` |
| `paymentRecords` | `payment_records` |
| `audit_logs` | `audit_logs` |
| `adminUsers` | `users` + `user_roles` |
| `events` | `events` |
| `contactMessages` | `contact_messages` |
| `Feedback` | `feedback` |
| `visitors` | `visitor_analytics` |

## Storage buckets

| Bucket | Contents |
|--------|----------|
| `registrations` | General registration uploads |
| `awards` | Award nominations |
| `best-practices` | Supporting PDFs/photos |
| `brochures` | Marketing PDFs |
| `gallery` | Event media |
| `committee` | Committee photos |
| `documents` | Public downloads |
| `receipts` | Payment receipts |
| `exports` | Admin CSV/Excel exports |
