# 1. Architecture Diagram

## High-level system architecture

```mermaid
flowchart TB
  subgraph Client["Frontend (unchanged until cutover)"]
    WEB[Next.js 15 App Router]
    ADMIN[Admin Portal UI]
    REG[Registration UI]
  end

  subgraph Vercel["Vercel Production"]
    RH[Route Handlers /api/v2/*]
    SA[Server Actions]
    MW[Middleware RBAC + Rate Limit]
  end

  subgraph Supabase["Supabase (new backend)"]
    AUTH[Supabase Auth + Google OAuth]
    PG[(PostgreSQL)]
    STOR[Supabase Storage]
    RLS[Row Level Security]
  end

  subgraph External["External Services"]
    RZP[Razorpay]
    BREVO[Brevo SMTP]
    RC[reCAPTCHA]
  end

  subgraph Legacy["Firebase (parallel until cutover)"]
    FS[(Firestore db=default)]
    FBST[Firebase Storage]
    FBAUTH[Firebase Auth]
  end

  WEB --> RH
  ADMIN --> RH
  REG --> RH
  RH --> MW
  MW --> SA
  SA --> PG
  RH --> PG
  RH --> STOR
  RH --> AUTH
  RH --> RZP
  RH --> BREVO
  RH --> RC
  PG --- RLS
  AUTH --- RLS

  WEB -.->|current production| FS
  RH -.->|current production| FS
  ADMIN -.->|current production| FBAUTH
```

## Dual-write / cutover strategy

```mermaid
sequenceDiagram
  participant UI as Frontend
  participant API as Next.js API
  participant FB as Firebase
  participant SB as Supabase
  participant Flag as Feature Flag

  Note over UI,Flag: Phase A — Firebase only (current)
  UI->>API: POST /api/registration/submit
  API->>FB: write
  API-->>UI: registrationId

  Note over UI,Flag: Phase B — Parallel write (migration)
  UI->>API: POST /api/registration/submit
  API->>Flag: REGISTRATION_BACKEND=dual
  API->>FB: write (primary)
  API->>SB: write (shadow)
  API-->>UI: registrationId

  Note over UI,Flag: Phase C — Supabase primary
  UI->>API: POST /api/v2/registration/submit
  API->>SB: write (primary)
  API-->>UI: registrationId

  Note over UI,Flag: Phase D — Firebase disconnected
  API-x FB: removed
```

## Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Next.js Route Handlers** | HTTP API, validation, auth, rate limits |
| **Server Actions** | Admin mutations where form-post fits |
| **Prisma** | Type-safe DB access, transactions, migrations |
| **Supabase Auth** | Google OAuth, JWT, session refresh |
| **Supabase Storage** | File buckets, signed URLs, RLS |
| **PostgreSQL** | Source of truth post-cutover |
| **Zod** | Request/response validation |
| **Audit service** | Immutable activity log on every mutation |

## Registration engine flow

```mermaid
flowchart LR
  A[Submit Request] --> B[Zod Validate]
  B --> C[reCAPTCHA Verify]
  C --> D[Prisma Transaction]
  D --> E[Increment Counter]
  E --> F[Insert registrations]
  F --> G[Insert type table]
  G --> H[Insert audit_logs]
  H --> I[Queue Email]
  I --> J[Return SMK2026-XXXXXX]
```

## Non-goals (explicit)

- Multitrack Conference module
- Abstract / Paper submission
- Reviewer / journal / proceedings workflows
- Manuscript management

Legacy Firebase collections for these remain read-only for migration reference only.
