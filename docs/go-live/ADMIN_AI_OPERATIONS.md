# AI Operations, Executive Dashboard & Automation (Phase 4)

AI-assisted conference management layer for Shiksha Mahakumbh — executive command center, automation, volunteer/session/speaker ops, participant portal, alumni, WhatsApp, and document generation.

## Admin Pages (CMS → Operations)

| Page | Path | Purpose |
|------|------|---------|
| Executive Dashboard | `/admin/cms/executive-dashboard` | Live metrics + real-time alerts |
| AI Insights | `/admin/cms/ai-insights` | Trends, forecasts, recommendations |
| Workflow Automation | `/admin/cms/workflow-automation` | Visual rule configuration |
| Volunteers | `/admin/cms/volunteers` | Assignments, shifts, rosters |
| Sessions | `/admin/cms/sessions` | Session catalog + QR attendance |
| Speaker Operations | `/admin/cms/speaker-operations` | Travel, honorarium, schedules |
| Alumni | `/admin/cms/alumni` | Post-event alumni database |
| Document Center | `/admin/cms/documents` | Letter generation (bulk) |
| WhatsApp Logs | `/admin/cms/whatsapp-logs` | Delivery tracking |

**Public:** Participant portal at `/dashboard`

## Database Changes

Migration: `prisma/migrations/20250617_ai_operations/migration.sql`

**New models:** `EventSession`, `VolunteerAssignment`, `SpeakerOperations`, `AlumniRecord`, `WorkflowRule`, `AiInsightSnapshot`, `WhatsAppMessageLog`, `GeneratedDocument`

**Extended:** `SessionAttendance.eventSessionId`, `AuditAction` enum

Run: `npx prisma migrate deploy`

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/admin/executive-dashboard` | Command center metrics + alerts |
| GET/POST | `/api/v2/admin/ai-insights` | Generate / cache insights |
| GET/POST | `/api/v2/admin/workflow-rules` | Automation rules CRUD |
| GET/POST | `/api/v2/admin/volunteers` | Volunteer ops + roster |
| GET/POST | `/api/v2/admin/sessions` | Session CRUD + attendance |
| GET/POST | `/api/v2/admin/speaker-operations` | Speaker logistics |
| GET/POST | `/api/v2/admin/alumni` | Alumni list + convert |
| GET/POST | `/api/v2/admin/documents` | Letter generation |
| GET | `/api/v2/admin/documents/[id]/download` | PDF download |
| GET | `/api/v2/admin/whatsapp-logs` | WhatsApp delivery logs |
| POST/PATCH | `/api/participant/dashboard` | Participant portal |
| GET | `/api/participant/download` | Receipt / badge / certificate |

## Workflow Automation

Default rules (seeded in migration):

| Trigger | Action |
|---------|--------|
| `registration_complete` | Welcome email |
| `payment_complete` | Receipt + QR (email + WhatsApp) |
| `accommodation_assigned` | Room details |
| `paper_accepted` | Acceptance letter |
| `certificate_available` | Certificate download link |

Admin can edit templates at **Workflow Automation** using `{{fullName}}`, `{{registrationId}}`, `{{building}}`, etc.

Hooks fire from: registration submit, payment complete, room allocation, paper acceptance, certificate issuance.

## WhatsApp Integration

Environment variables:

```
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_API_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id  # Meta Cloud API
```

Supports Meta Cloud API (text messages) or generic REST fallback. All sends logged in `whatsapp_message_logs`.

## AI Insights Engine

Rule-based analytics (no external API required):

- Week-over-week registration trends
- State-level growth analysis
- Accommodation occupancy forecast
- Volunteer gap detection
- Revenue 30-day forecast
- Actionable recommendations

Cached for 6 hours; force refresh via **Refresh Insights** button.

## Participant Portal

`/dashboard` — authenticate with Registration ID + email.

Features: view status, download receipt/badge/certificate, accommodation details, sessions attended, profile update.

## Testing Checklist

- [ ] Run migration `20250617_ai_operations`
- [ ] Executive Dashboard: metrics load, alerts appear for edge cases
- [ ] AI Insights: generate + refresh
- [ ] Workflow rules: edit template, toggle enable/disable
- [ ] Register test user → welcome workflow fires (check email logs)
- [ ] Complete payment → payment workflow fires
- [ ] Assign room → accommodation workflow fires
- [ ] Accept paper → acceptance workflow fires
- [ ] Issue certificate → certificate workflow fires
- [ ] Volunteers: assign department, generate roster
- [ ] Sessions: create session, mark attendance
- [ ] Speaker ops: update honorarium, generate schedule
- [ ] Alumni: convert checked-in attendees
- [ ] Documents: single + bulk PDF generation
- [ ] WhatsApp: configure env vars, send test campaign
- [ ] Participant portal: login, download receipt, update profile
- [ ] `npm run build` passes

## Deploy Sequence

1. `npx prisma migrate deploy`
2. Set WhatsApp env vars on Vercel (optional)
3. Deploy application
4. Verify executive dashboard + workflow rules seeded
5. Share `/dashboard` link with participants
