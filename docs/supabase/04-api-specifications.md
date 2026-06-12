# 5. API Specifications

All new Supabase APIs live under `/api/v2/*`. Existing `/api/*` Firebase routes remain until cutover.

## Conventions

- **Auth:** `Authorization: Bearer <supabase_jwt>` for admin routes
- **Validation:** Zod schemas in `src/server/*/schemas`
- **Errors:** `{ error: string, code?: string, details?: object }`
- **Rate limits:** Same keys as current (`registration-submit`, `registration-upload`, etc.)
- **Audit:** Every mutation writes `audit_logs`

---

## Health

### `GET /api/v2/health`
```json
{ "status": "ok", "backend": "supabase", "database": "connected", "timestamp": "..." }
```

### `GET /api/v2/health/supabase` (ops secret required)
```json
{
  "ready": true,
  "database": true,
  "storage": true,
  "auth": true,
  "counter": { "prefix": "SMK2026", "lastNumber": 1 }
}
```

---

## Registration

### `POST /api/v2/registration/submit`

**Body:**
```json
{
  "registrationType": "Conclave",
  "captchaToken": "...",
  "data": { "fullName": "...", "email": "...", ... },
  "paymentStatus": "Not Required"
}
```

**Response 201:**
```json
{
  "success": true,
  "registrationId": "SMK2026-000002",
  "id": "uuid",
  "typeDocId": "uuid"
}
```

**Errors:** 400 validation · 403 captcha · 429 rate limit · 500 server

### `GET /api/v2/registration/[registrationId]`

Public lookup (rate-limited). Same shape as current API.

### `POST /api/v2/registration/upload`

Multipart: `file`, `registrationType`, `field`

**Response 200:**
```json
{
  "success": true,
  "file": {
    "id": "uuid",
    "name": "receipt.pdf",
    "path": "registrations/Delegate/receipt/...",
    "url": "signed-url",
    "contentType": "application/pdf",
    "size": 12345
  }
}
```

### `POST /api/v2/registration/send-email`

Triggers Brevo email + writes `email_logs`.

---

## Payments (Razorpay)

### `POST /api/v2/payments/create-order`
### `POST /api/v2/payments/verify`
### `POST /api/v2/payments/webhook`

Webhook must:
1. Verify `x-razorpay-signature`
2. Check `razorpay_payment_id` uniqueness
3. Update `payment_records` + `registrations.payment_status`
4. Write `audit_logs`

---

## Admin (RBAC required)

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v2/admin/registrations` | `registrations.read` |
| GET | `/api/v2/admin/registrations/[id]` | `registrations.read` |
| PATCH | `/api/v2/admin/registrations/[id]` | `registrations.update` |
| GET | `/api/v2/admin/registrations/export` | `registrations.export` |
| GET/POST/PATCH/DELETE | `/api/v2/admin/committees` | `committees.manage` |
| GET/POST/PATCH/DELETE | `/api/v2/admin/committees/[id]/members` | `committees.manage` |
| GET/POST/PATCH/DELETE | `/api/v2/admin/media` | `media.manage` |
| GET/PATCH | `/api/v2/admin/contact` | `contact.manage` |
| GET/PATCH | `/api/v2/admin/feedback` | `feedback.manage` |
| GET/POST/PATCH/DELETE | `/api/v2/admin/announcements` | `announcements.manage` |
| GET/POST/PATCH | `/api/v2/admin/users` | `users.manage` |
| GET/PATCH | `/api/v2/admin/settings` | `settings.manage` |
| GET | `/api/v2/admin/audit-logs` | `audit.read` |

### Admin registrations list query params
`?type=Conclave&status=Submitted&payment=Paid&email=sent&search=SMK2026&page=1&limit=50&sort=createdAt&order=desc`

---

## Committees

### `POST /api/v2/admin/committees`
### `PATCH /api/v2/admin/committees/[id]`
### `DELETE /api/v2/admin/committees/[id]` (soft)
### `POST /api/v2/admin/committees/[id]/members`
### `PATCH /api/v2/admin/committees/[id]/members/[memberId]`
### `DELETE /api/v2/admin/committees/[id]/members/[memberId]`
### `POST /api/v2/admin/committees/[id]/members/reorder`

---

## Media

### `POST /api/v2/admin/media/upload` (bulk supported)
### `GET /api/v2/admin/media?type=image&category=gallery`
### `PATCH /api/v2/admin/media/[id]` (featured toggle)

---

## Contact & Feedback

### `POST /api/v2/contact` (public)
### `POST /api/v2/feedback` (public)
### `PATCH /api/v2/admin/contact/[id]` (admin reply + email)

---

## Visitors

### `GET /api/v2/visitors`
### `POST /api/v2/visitors` (increment)
