# Supabase Auth Migration (Phase F1)

**Date:** 2026-06-11  
**Objective:** Replace Firebase Auth with Supabase Auth for admin access  
**Constraint:** Plan only — not implemented

---

## Current state

| Component | Implementation |
|-----------|----------------|
| Client login | `src/lib/adminAuth.tsx` — Firebase Google `signInWithPopup` |
| Role resolution | `src/lib/resolveAdminRole.ts` — Firestore `adminUsers/{uid}` |
| Bootstrap admins | `NEXT_PUBLIC_ADMIN_EMAILS` → auto `Super Admin` |
| Server verify | `src/server/lib/firebase-admin-auth.ts` — `verifyIdToken()` |
| Session mint | `src/app/api/admin/session/route.ts` — Firebase token → HMAC cookie |
| Route protection | `src/middleware.ts` — HMAC cookie (no Firebase) |
| RBAC schema | Prisma `users`, `roles`, `user_roles`, `permissions` |
| RBAC seed | `scripts/supabase/seed-rbac.mjs` |

---

## Target architecture

```
Browser
  → Supabase Auth (email/password OR Google OAuth)
  → Session stored in HttpOnly cookies via @supabase/ssr
  → POST /api/admin/session
       → verify Supabase JWT
       → lookup users + user_roles (Prisma)
       → mint existing ADMIN_SESSION_COOKIE (HMAC)
  → middleware validates HMAC cookie (unchanged)
  → /api/v2/admin/* uses cookie or service role internally
```

**Preserve:** Existing admin permissions map (`Super Admin`, `Admin`, `Data Entry`, `Coordinator`, etc.) via `roles` table.

**Remove:** Firebase `verifyIdToken`, `onAuthStateChanged`, Firestore `adminUsers` bootstrap writes.

---

## Implementation plan

### F1.1 — Supabase Auth client setup

**New files:**

| File | Purpose |
|------|---------|
| `src/lib/supabase/browser.ts` | `createBrowserClient` from `@supabase/ssr` |
| `src/lib/supabase/server.ts` | `createServerClient` for Route Handlers |
| `src/lib/supabase/middleware.ts` | Cookie refresh helper (optional) |

**Env vars (already on Vercel Production):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### F1.2 — Replace `AdminProvider`

**File:** `src/lib/adminAuth.tsx`

| Current | Target |
|---------|--------|
| `import { auth } from "@/lib/firebase"` | `import { createClient } from "@/lib/supabase/browser"` |
| `signInWithPopup(GoogleAuthProvider)` | `supabase.auth.signInWithOAuth({ provider: 'google' })` OR `signInWithPassword` |
| `onAuthStateChanged` | `supabase.auth.onAuthStateChange` |
| `firebaseUser.getIdToken()` | `supabase.auth.getSession()` → `access_token` |

**Login methods to support:**

1. **Email/password** — primary for ops team
2. **Google OAuth** — parity with current UX (configure in Supabase Dashboard)

### F1.3 — Replace role resolution

**File:** `src/lib/resolveAdminRole.ts` → `src/lib/resolveAdminRole.server.ts` (server-only)

```typescript
// Pseudocode — not implemented
async function resolveAdminRole(authUserId: string, email: string): Promise<AdminRole | null> {
  // 1. Bootstrap: NEXT_PUBLIC_ADMIN_EMAILS → ensure user row + Super Admin role
  // 2. Prisma: users WHERE auth_user_id = authUserId
  //    JOIN user_roles → roles
  // 3. Map role.name → AdminRole enum
}
```

**Bootstrap migration:** For each email in `NEXT_PUBLIC_ADMIN_EMAILS`:
1. Create Supabase Auth user (Dashboard or Admin API)
2. Upsert `users` row with `auth_user_id`
3. Assign `Super Admin` role via `user_roles`

### F1.4 — Replace server auth verification

**Delete:** `src/server/lib/firebase-admin-auth.ts`

**New:** `src/server/lib/supabase-admin-auth.ts`

```typescript
// Pseudocode
export async function verifySupabaseAdmin(request: NextRequest) {
  const token = extractBearerOrCookie(request);
  const supabase = createServerClient(...);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw 401;
  const role = await resolveAdminRole(user.id, user.email);
  if (!role) throw 403;
  return { uid: user.id, email: user.email, role };
}
```

**Update consumers:**

| File | Change |
|------|--------|
| `src/app/api/admin/session/route.ts` | Verify Supabase JWT instead of Firebase |
| `src/app/api/admin/gateway/[...path]/route.ts` | `verifySupabaseAdmin` |
| `src/lib/admin-cms-api.ts` | Remove `auth.currentUser`; rely on cookie for same-origin requests |

### F1.5 — Session cookie (preserve existing)

**Keep unchanged:**

- `src/constants/auth.ts` — `ADMIN_SESSION_COOKIE` name
- `src/lib/security/admin-session.ts` — HMAC signing
- `src/middleware.ts` — edge verification

**Flow:**

```
POST /api/admin/session
  Authorization: Bearer <supabase_access_token>
  → verify user + role
  → signAdminSessionToken({ uid, email, role })
  → Set-Cookie: smk_admin_session=<hmac>; HttpOnly; Secure; SameSite=Lax

DELETE /api/admin/session
  → Clear cookie
  → supabase.auth.signOut() on client
```

### F1.6 — Remove Firebase auth bootstrap

| File | Action |
|------|--------|
| `src/lib/firebase/registration-services.ts` | Remove `getAuth` export |
| `src/lib/firebase/lazy.ts` | Remove `getFirebaseAuth` |
| `src/lib/resolveAdminRole.ts` | Delete Firestore `adminUsers` writes |
| Firestore `adminUsers` collection | Export for audit; stop writes |

---

## Role mapping

| Firebase `adminUsers.role` | Supabase `roles.name` |
|----------------------------|----------------------|
| `Super Admin` | `Super Admin` |
| `Admin` | `Admin` |
| `Data Entry` | `Data Entry` |
| `coordinator` | `Coordinator` |
| `reviewer` | `Reviewer` |

Seed source: `scripts/supabase/seed-rbac.mjs`

---

## Security requirements

| Requirement | Implementation |
|-------------|----------------|
| HttpOnly cookies | HMAC `ADMIN_SESSION_COOKIE` (existing) |
| No Firebase tokens in client storage | Supabase `@supabase/ssr` cookie pattern |
| Legacy cookie `=1` rejected | Already in `middleware.ts` L43 |
| Admin-only API routes | `verifySupabaseAdmin` + RBAC check |
| Rate limit login | Add to `/api/admin/session` (optional) |

---

## Testing checklist (pre-cutover)

- [ ] Email/password login → admin dashboard
- [ ] Google OAuth login → admin dashboard
- [ ] Non-admin user → 403 on session exchange
- [ ] Bootstrap email auto-provisioned with Super Admin
- [ ] Legacy cookie `smk_admin_session=1` → rejected
- [ ] Logout clears cookie + Supabase session
- [ ] `/api/v2/admin/*` CRUD with valid session
- [ ] Protected data routes (`/participantregistrationdatadekh`) require cookie

---

## Rollback

Keep Firebase Auth enabled behind feature flag `ADMIN_AUTH_PROVIDER=firebase|supabase` for one release cycle. Default to `supabase` after validation.

---

**Not implemented — documentation only.**
