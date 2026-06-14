# Admin Registration Lifecycle Management (Phase 3)

End-to-end attendee lifecycle for Shiksha Mahakumbh — registration through check-in, accommodation, certificates, research review, and communications.

## Admin Pages (CMS → Operations)

| Page | Path | Purpose |
|------|------|---------|
| Attendees | `/admin/cms/attendees` | Unified attendee table, filters, bulk actions |
| Event Check-In | `/event/checkin` | Mobile QR / ID lookup, check-in gate |
| Accommodation | `/admin/cms/accommodation-lifecycle` | Approve requests, assign rooms, notify guests |
| Research Submissions | `/admin/cms/research` | Abstract review queue, scoring, acceptance letters |
| Communications | `/admin/cms/communications` | Email / SMS / WhatsApp campaigns |
| Event Analytics | `/admin/cms/event-analytics` | Registrations, check-in %, occupancy, certificates |

**Public:** Certificate verification at `/certificate/verify/{code}`

All admin pages require CMS admin login (`AdminGate` + gateway cookie + `x-ops-secret` on v2 APIs).

## Database Changes

Migration: `prisma/migrations/20250616_lifecycle_management/migration.sql`

**New enums:** `CheckInStatus`, `CertificateLifecycleStatus`, `CertificateType`, `BadgeTemplate`, `ResearchSubmissionStatus`, `CommunicationChannel`, `CampaignStatus`

**registrations** — lifecycle fields:
- `state`, `checkInStatus`, `checkedInAt`, `checkedInByUserId`, `checkInLocation`
- `kitDistributed`, `kitDistributedAt`, `certificateEligible`, `certificateLifecycleStatus`

**New models:**
- `AccommodationRoom`, extended `AccommodationRequest` (room allocation, email sent)
- `CheckInRecord`, `SessionAttendance`
- `AttendeeCertificate`, `AttendeeBadge`
- `ResearchSubmission`, `CommunicationCampaign`, `CommunicationRecipient`

**AuditAction** — extended with lifecycle actions (`check_in_recorded`, `kit_distributed`, `certificate_issued`, `room_allocated`, etc.)

Run: `npx prisma migrate deploy`

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/admin/attendees` | Paginated attendee list with filters |
| GET | `/api/v2/admin/attendees/export` | CSV export |
| POST | `/api/v2/admin/attendees/bulk` | Bulk badges, certificates, email, campaigns |
| GET/POST | `/api/v2/admin/checkin` | QR lookup + check-in actions |
| GET | `/api/v2/admin/badges/[registrationId]` | Badge PDF download |
| GET/POST | `/api/v2/admin/certificates/[registrationId]` | Issue / download certificate PDF |
| GET/POST | `/api/v2/admin/accommodation-lifecycle` | List requests, allocate, update status |
| GET/POST | `/api/v2/admin/accommodation-rooms` | Room inventory CRUD |
| GET/POST | `/api/v2/admin/research` | List / create submissions |
| PATCH | `/api/v2/admin/research/[id]` | Review, score, send acceptance letter |
| GET/POST | `/api/v2/admin/communications` | Campaign list / create & send |
| GET | `/api/v2/admin/lifecycle-analytics` | Event analytics dashboard |
| GET | `/api/certificate/verify/[code]` | **Public** certificate verification |

Gateway proxy: `/api/admin/gateway/{path}` (existing).

## Workflows

### Check-In
1. Admin opens `/event/checkin` on mobile
2. Scan attendee QR or enter Registration ID
3. System shows name, category, institution, payment status
4. **Mark Check-In** — duplicate prevented; shows `FIRST CHECK-IN` or `ALREADY CHECKED-IN`
5. Optional: kit distribution, session attendance, certificate eligibility

### Accommodation
1. Guest registers with accommodation request
2. Admin approves → status `Confirmed`
3. Admin assigns room from inventory (prevents double allocation)
4. Allocation email sent automatically

### Certificates
Rules: registration complete + payment complete + attendance verified (or admin marks eligible).

Types: Participation, Presentation, Volunteer, Reviewer, Speaker, Organizer.

Each certificate gets unique ID + verification QR linking to `/certificate/verify/{code}`.

### Badges
Templates: Delegate, Speaker, Volunteer, Organizer, Student, Exhibitor.

Bulk PDF generation via attendees bulk action.

### Research
Statuses: Submitted → Under Review → Accepted / Rejected / Revision Requested.

Reviewer panel: score (1–10), remarks, recommendation. Acceptance letter email on accept.

### Communications
Channels: Email (live via Brevo queue), SMS / WhatsApp (stub — logs delivery intent).

Target filters: all attendees, delegates, speakers, volunteers, category-specific.

## Testing Checklist

- [ ] Run migration `20250616_lifecycle_management` on staging/production
- [ ] Admin → Attendees: table loads, filters work (category, state, payment, check-in)
- [ ] Export CSV downloads valid file
- [ ] Bulk: generate badges PDF for selected attendees
- [ ] Bulk: issue certificates for eligible attendees
- [ ] `/event/checkin`: lookup paid registration, first check-in succeeds
- [ ] Duplicate check-in shows `ALREADY CHECKED-IN`
- [ ] Kit distributed + certificate eligible flags persist
- [ ] Accommodation: approve request, assign room, confirm no double-book
- [ ] Allocation email queued in email logs
- [ ] Research: update status, save score/remarks, send acceptance letter
- [ ] Communications: create email campaign, verify delivered count
- [ ] Event Analytics: cards and charts render
- [ ] Public `/certificate/verify/{code}` shows valid certificate details
- [ ] Invalid verify code shows error state
- [ ] Mobile layout usable on check-in and accommodation pages

## Deploy Sequence

1. `npx prisma migrate deploy` (includes Phase 1–3 migrations if not yet applied)
2. `npx prisma generate`
3. Deploy application build
4. Seed accommodation rooms if needed via `POST /api/v2/admin/accommodation-rooms`
5. Smoke-test check-in with a test registration QR
