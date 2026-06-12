# Registration Migration (Phase F2)

**Date:** 2026-06-11  
**Objective:** Move all registrations from Firestore to Supabase Postgres via Prisma  
**Constraint:** Plan only — no production migration

---

## Schema mapping

**User-requested models vs existing Prisma schema:**

| Requested model | Existing Prisma model | Status |
|-----------------|----------------------|--------|
| `Registration` | `Registration` (L484-558) | ✅ Exists |
| `RegistrationPayment` | `PaymentRecord` (L765-789) | ✅ Exists (rename not required) |
| `RegistrationAttachment` | `UploadedFile` (L737-761) | ✅ Exists |

**No new schema migration required** — use existing models. Add columns only if Firestore fields lack mapping (track in `metadata` JSON).

### Type-specific extension tables (already exist)

| Registration type | Prisma model |
|-------------------|--------------|
| Conclave | `ConclaveRegistration` |
| Delegate | `DelegateRegistration` |
| Exhibition | `ExhibitionRegistration` |
| Awards | `AwardsRegistration` |
| Best Practices | `BestPracticeRegistration` |
| Olympiad | `OlympiadRegistration` |
| Talent | `TalentRegistration` |
| Volunteer | `VolunteerApplication` |
| NGO | `NgoRegistration` |
| Participant | `ParticipantRegistration` |

### Firestore traceability fields (already exist)

```prisma
firebaseMasterDocId String? @map("firebase_master_doc_id")
firebaseTypeDocId   String? @map("firebase_type_doc_id")
source              String  @default("supabase") // supabase | firebase | migration
```

---

## Current dual-backend architecture

**Switch:** `src/server/backend/index.ts`

```
REGISTRATION_BACKEND=firebase  → saveRegistrationFirebase() → Firestore
REGISTRATION_BACKEND=supabase  → registration.service.ts → Prisma
REGISTRATION_BACKEND=dual      → both (Firebase primary)
```

**Default today:** `firebase`

**Target:** `supabase` only — delete Firebase branch.

---

## Firestore → Postgres field mapping

### Master registration document (`registrations` collection)

| Firestore field | Prisma column | Notes |
|-----------------|---------------|-------|
| `registrationId` | `registrationId` | **Preserve exactly** (SMK2026-NNNNNN) |
| `registrationType` | `registrationType` | Enum mapping via `toPrismaRegistrationType` |
| `fullName` | `fullName` | |
| `email` | `email` | |
| `contactNumber` | `contactNumber` | |
| `institution` | `institution` | |
| `paymentStatus` | `paymentStatus` | |
| `razorpayOrderId` | `razorpayOrderId` | |
| `razorpayPaymentId` | `razorpayPaymentId` | |
| `accommodationRequired` | `accommodationRequired` | YesNo enum |
| `accommodationStatus` | `accommodationStatus` | |
| `createdAt` | `createdAt` | Timestamp → Timestamptz |
| Type-specific fields | Extension table + `metadata` | |
| Document ID | `firebaseMasterDocId` | Migration traceability |

### Counter (`registrationCounters/smk2026`)

| Firestore | Prisma |
|-----------|--------|
| `lastNumber` | `RegistrationCounter.lastNumber` |
| prefix `SMK2026` | `RegistrationCounter.prefix` |

**Critical:** Sync counter to max existing `registrationId` before cutover to avoid ID collisions.

---

## API route migration

| Route | Current backend | Target |
|-------|-----------------|--------|
| `/api/registration/submit` | `backend/index.ts` | Supabase only |
| `/api/v2/registration/submit` | Supabase | Keep |
| `/api/registration/[id]` GET | Dual | Supabase only |
| `/api/v2/registration/[id]` GET | Supabase | Keep |
| `/api/registration/lookup` POST | Dual | Supabase only |
| `/api/registration/send-email` | Firestore update | Prisma `email_logs` |
| `/api/payments/razorpay-webhook` | `payments.server.ts` (Firestore) | `payment.service.ts` (Prisma) |

### Security controls (preserve)

| Control | File | Must keep |
|---------|------|:---------:|
| Anonymous lookup → 401 | `[registrationId]/route.ts` L51-56 | ✅ |
| HMAC lookup token | `registration-lookup.ts` | ✅ |
| Email param verification | `emailsMatch()` | ✅ |
| Rate limit 10/min | `rateLimit()` | ✅ |
| PII stripped from public summary | `toPublicRegistrationSummary` | ✅ |

**No business-logic changes** — only swap data layer from Firestore to Prisma.

---

## Client form migration

### Modern path (already partially Supabase-ready)

`src/lib/useRegistrationSubmit.ts` → API submit → `getRegistrationService()`

**Action:** Set `REGISTRATION_BACKEND=supabase`; remove client Firestore imports.

### Legacy direct Firestore forms (must migrate)

| File | Current | Target |
|------|---------|--------|
| `src/lib/saveRegistration.ts` | Client Firestore write | Delete; use API only |
| `src/app/component/Registration/NGOForm.tsx` | Firestore + Storage | `useRegistrationSubmit` |
| `src/app/component/Registration/OrganizerReg.tsx` | Own Firebase init | API submit |
| All `*Form.tsx` with Firestore imports | Direct writes | Unified submit hook |
| 20+ `*datadekh` pages | Client Firestore reads | `/admin` CMS or API |

---

## Razorpay linkage

### Current (Firebase)

`src/lib/firestore/payments.server.ts`:
1. Webhook receives event
2. Find registration by `razorpayOrderId` in Firestore
3. Update `paymentStatus` on registration doc
4. Write `paymentRecords` collection

### Target (Supabase)

`src/server/services/payment.service.ts`:
1. Webhook receives event
2. Find `Registration` by `razorpayOrderId` (Prisma)
3. Update `paymentStatus` + create `PaymentRecord`
4. Write `WebhookEvent` + `AuditLog`

**Cutover step:** Change `src/app/api/payments/razorpay-webhook/route.ts` import from `payments.server.ts` → `payment.service.ts`.

---

## Registration ID preservation

```sql
-- Pre-cutover: set counter to max existing ID
SELECT MAX(CAST(SPLIT_PART(registration_id, '-', 2) AS INT))
FROM registrations
WHERE registration_id LIKE 'SMK2026-%';
```

Import script must:
1. Insert with explicit `registrationId` (no auto-generate for migrated rows)
2. Set `source = 'migration'`
3. Set `firebaseMasterDocId` = original Firestore doc ID

---

## Cutover sequence

1. Export all Firestore `registrations` (F5 runbook)
2. Import to Postgres with ID preservation
3. Sync `registration_counters` to max ID
4. Set `REGISTRATION_BACKEND=supabase` on staging
5. Rewire Razorpay webhook to Prisma handler
6. Run registration E2E tests (all types)
7. Flip production env var
8. Monitor webhook + lookup security (401 gate)

---

## Validation gates

| Test | Expected |
|------|----------|
| Submit Conclave registration | 200 + `SMK2026-XXXXXX` |
| Anonymous GET lookup | 401 |
| Token GET lookup | 200, no email/phone |
| Razorpay test payment | `paymentStatus = Paid` in Postgres |
| Admin list registrations | Paginated from Prisma |
| Counter monotonic | No duplicate IDs |

---

**Not implemented — documentation only.**
