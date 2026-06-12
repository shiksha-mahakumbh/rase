# 3. Folder Structure

New backend code lives alongside Firebase — **no frontend page changes** until approved.

```
rase/
├── prisma/
│   ├── schema.prisma              # Full PostgreSQL schema
│   └── migrations/                # Prisma migrations (generated)
│
├── supabase/
│   ├── config.toml                # Supabase local config
│   ├── seed.sql                   # RBAC seed, counter init
│   └── policies/                  # RLS SQL policies
│       ├── registrations.sql
│       ├── admin.sql
│       └── storage.sql
│
├── src/
│   ├── server/                    # NEW — backend-only (no UI imports)
│   │   ├── db/
│   │   │   └── prisma.ts          # Prisma singleton
│   │   ├── auth/
│   │   │   ├── supabase-server.ts # Service role client
│   │   │   ├── supabase-browser.ts
│   │   │   ├── session.ts
│   │   │   └── rbac.ts
│   │   ├── registration/
│   │   │   ├── engine.ts          # Generic registration engine
│   │   │   ├── counter.ts         # SMK2026 ID generation
│   │   │   ├── types/             # Per-type handlers
│   │   │   │   ├── conclave.ts
│   │   │   │   ├── delegate.ts
│   │   │   │   └── ...
│   │   │   └── schemas/           # Zod schemas per type
│   │   ├── storage/
│   │   │   ├── upload.ts
│   │   │   ├── signed-url.ts
│   │   │   └── buckets.ts
│   │   ├── payments/
│   │   │   ├── razorpay.ts
│   │   │   └── webhook.ts
│   │   ├── email/
│   │   │   ├── brevo.ts
│   │   │   ├── queue.ts
│   │   │   └── templates/
│   │   ├── audit/
│   │   │   └── logger.ts
│   │   ├── admin/
│   │   │   ├── registrations.ts
│   │   │   ├── committees.ts
│   │   │   ├── media.ts
│   │   │   └── exports.ts
│   │   └── migration/
│   │       ├── firestore-import.ts
│   │       └── storage-import.ts
│   │
│   ├── app/api/v2/                # NEW — Supabase-backed routes
│   │   ├── health/route.ts
│   │   ├── registration/
│   │   │   ├── submit/route.ts
│   │   │   ├── [id]/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── send-email/route.ts
│   │   ├── payments/
│   │   │   ├── create-order/route.ts
│   │   │   ├── verify/route.ts
│   │   │   └── webhook/route.ts
│   │   ├── admin/
│   │   │   ├── registrations/route.ts
│   │   │   ├── committees/route.ts
│   │   │   ├── media/route.ts
│   │   │   ├── contact/route.ts
│   │   │   ├── feedback/route.ts
│   │   │   └── exports/route.ts
│   │   └── visitors/route.ts
│   │
│   ├── app/api/                   # EXISTING — Firebase (unchanged)
│   │   └── registration/...
│   │
│   └── lib/                       # EXISTING — Firebase client (unchanged)
│       ├── firebase-admin.ts
│       └── firebase/client.ts
│
├── scripts/
│   ├── supabase/
│   │   ├── migrate-firestore.mjs
│   │   ├── migrate-storage.mjs
│   │   ├── verify-migration.mjs
│   │   └── seed-rbac.mjs
│   └── ...
│
└── docs/supabase/                 # This documentation set
```

## Import rules

| From | To | Allowed |
|------|-----|---------|
| `src/app/api/v2/*` | `src/server/*` | ✅ |
| `src/server/*` | `src/lib/firebase*` | ❌ (during parallel build) |
| Frontend pages | `src/server/*` | ❌ until cutover |
| Frontend pages | `src/lib/firebase*` | ✅ (current) |
