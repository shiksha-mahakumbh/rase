# 7. Security Plan

## Authentication

| Actor | Method |
|-------|--------|
| Public registration | reCAPTCHA v3 + rate limit (no auth) |
| Admin | Supabase Auth + Google OAuth |
| Webhooks | HMAC signature (Razorpay) |
| Ops diagnostics | `ADMIN_OPS_SECRET` header |

## Authorization (RBAC)

```
Super Admin → all permissions
Admin       → registrations.*, committees.*, media.*, contact.*, feedback.*, exports
Data Entry  → registrations.read, registrations.update (status only)
Coordinator → registrations.read, committees.read
```

Enforced at:
1. Next.js middleware (`/admin/*`, `/api/v2/admin/*`)
2. Route handler permission check
3. Supabase RLS (defense in depth)

## Row Level Security (Supabase)

| Table | Public | Authenticated Admin |
|-------|--------|---------------------|
| `registrations` | No direct access | Read/write via service role in API |
| `payment_records` | Deny all | Service role only |
| `audit_logs` | Deny all | Read via admin API |
| `registration_counters` | Deny all | Service role only |
| `contact_messages` | Insert only (via API) | Full admin |
| Storage buckets | No public write | Signed URL read for own uploads |

**Note:** All public access goes through Next.js Route Handlers using `SUPABASE_SERVICE_ROLE_KEY` — never exposed to browser.

## Input validation

- Zod schemas for every API input
- File: MIME whitelist, 10 MB max, extension check
- Email: RFC format + disposable domain block (optional)
- Phone: 10–15 digit validation
- SQL injection: prevented by Prisma parameterized queries
- XSS: sanitize text fields server-side before storage

## Rate limiting

Reuse existing `src/lib/security/rateLimit.ts`:

| Endpoint | Limit |
|----------|-------|
| Registration submit | 15/min/IP |
| Registration upload | 30/min/IP |
| Registration lookup | 60/min/IP |
| Contact form | 5/min/IP |
| Admin login | 10/min/IP |

## CSRF

- Admin mutations: require `Authorization` header (not cookie-only)
- Public forms: reCAPTCHA + SameSite cookies

## Audit & monitoring

Every mutation logs:
- `action`, `actor_user_id`, `ip_address`, `user_agent`, `payload`

Alert on:
- Failed login spikes
- Webhook signature failures
- Upload failures > threshold
- Email delivery failure rate > 5%

## Secrets management

| Secret | Location |
|--------|----------|
| `DATABASE_URL` | Vercel (pooled) |
| `DIRECT_URL` | Vercel (migrations) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel only (never client) |
| `SUPABASE_ANON_KEY` | Vercel + `NEXT_PUBLIC_*` |
| `RAZORPAY_*` | Vercel (existing) |
| `BREVO_SMTP_*` | Vercel |
| `ADMIN_OPS_SECRET` | Vercel |
