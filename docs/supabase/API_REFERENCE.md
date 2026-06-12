# API Reference — `/api/v2/*`

All admin routes require header: `x-ops-secret: <ADMIN_OPS_SECRET>`

---

## Health

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v2/health` | Public |

---

## Registration

| Method | Path | Rate limit | Notes |
|--------|------|------------|-------|
| POST | `/api/v2/registration/submit` | 15/min | reCAPTCHA required |
| GET | `/api/v2/registration/[id]` | 60/min | Public lookup by SMK2026-* |
| POST | `/api/v2/registration/upload` | 30/min | multipart: file, bucket, field |
| POST | `/api/v2/registration/send-email` | 10/min | Queued SMTP |

**Submit body:**
```json
{
  "captchaToken": "...",
  "registrationType": "Conclave",
  "data": { "fullName": "...", "email": "...", ... },
  "paymentStatus": "Not Required"
}
```

---

## Public modules

| Method | Path | Body |
|--------|------|------|
| POST | `/api/v2/contact` | fullName, email, phone?, subject?, message, captchaToken? |
| POST | `/api/v2/feedback` | rating?, category?, message, email?, fullName? |
| POST | `/api/v2/newsletter/subscribe` | email, fullName? |
| GET | `/api/v2/downloads` | — |
| POST | `/api/v2/downloads/[id]/track` | increments download count |

---

## Admin — Registrations & dashboard

| Method | Path |
|--------|------|
| GET | `/api/v2/admin/registrations?limit&offset&type&status&search` |
| GET | `/api/v2/admin/dashboard` |
| GET | `/api/v2/admin/audit-logs?limit&offset&action` |
| GET | `/api/v2/admin/accommodation?status` |

---

## Admin — Contact & feedback

| Method | Path |
|--------|------|
| GET | `/api/v2/admin/contact` |
| GET | `/api/v2/admin/feedback` |
| GET | `/api/v2/admin/newsletter` |

---

## Admin — Committees

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/committees` |
| PATCH/DELETE | `/api/v2/admin/committees/[id]` |
| POST | `/api/v2/admin/committees/[id]/members` |
| PUT | `/api/v2/admin/committees/[id]/members` (reorder memberIds) |
| PATCH/DELETE | `/api/v2/admin/committees/members/[memberId]` |

---

## Admin — Events & media

| Method | Path |
|--------|------|
| GET/POST | `/api/v2/admin/events` |
| PATCH/DELETE | `/api/v2/admin/events/[id]` |
| GET/POST | `/api/v2/admin/media` (multipart upload) |
| GET/POST | `/api/v2/admin/downloads` |

---

## Storage buckets

| Bucket | Purpose |
|--------|---------|
| `registrations` | Registration file uploads |
| `brochures` | Brochure PDFs |
| `media` | Gallery images/videos |
| `committee` | Committee photos |
| `downloads` | Public download files |

---

## Error format

```json
{ "error": "Message", "code": "ERROR_CODE" }
```

Common codes: `INVALID_TYPE`, `CAPTCHA_FAILED`, `NOT_FOUND`, `UNAUTHORIZED`, `FILE_TOO_LARGE`
