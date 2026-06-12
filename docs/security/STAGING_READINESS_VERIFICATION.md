# Staging Readiness Verification

**Date:** May 2026  
**Scope:** Phase A–C migrations, CMS seeds, admin modules, public routes

---

## Build validation

| Check | Result |
|-------|--------|
| `npx prisma validate` | ✅ Pass |
| `npx tsc --noEmit` | ✅ Pass (post P0 remediation) |
| P0 security code merged | ✅ |

---

## Database migrations (8 total)

| Migration | Phase | Status in repo |
|-----------|-------|----------------|
| `20250609_init` | Init | ✅ Present |
| `20250610_phase3` | Phase 3 | ✅ Present |
| `20250620_phase35_cms_foundation` | Phase 3.5 | ✅ Present |
| `20250621_phase_b_cms` | Phase B | ✅ Present |
| `20250622_phase_b5_analytics` | Phase B.5 | ✅ Present |
| `20250629_phase_s2_foundation` | Phase S2 | ✅ Present |
| `20250701_phase_c_organizational_cms` | Phase C | ✅ Present |

**Staging action required:**
```bash
npx prisma migrate deploy
npx prisma generate
```

---

## CMS seed scripts

| Script | Content | Command |
|--------|---------|---------|
| `scripts/seed-cms-content.mjs` | Phase B CMS baseline | `node scripts/seed-cms-content.mjs --publish` |
| `scripts/seed-s2-content.mjs` | Press, legal, FAQ, departments, gallery | `node scripts/seed-s2-content.mjs --publish` |
| `scripts/seed-s2-hi.mjs` | Hindi variants | `node scripts/seed-s2-hi.mjs --publish` |
| `scripts/seed-phase-c-content.mjs` | Committees, speakers, partners, events, media | `node scripts/seed-phase-c-content.mjs --publish` |

**Staging action required:** Run all seeds with `--publish` after migration.

---

## Admin modules (22)

| Module | Route | API | Status |
|--------|-------|-----|--------|
| Dashboard | `/admin/cms` | ✅ | Ready |
| Homepage | `/admin/cms/homepage` | ✅ | Ready |
| Articles | `/admin/cms/articles` | ✅ | Ready |
| Pages | `/admin/cms/pages` | ✅ | Ready |
| FAQ | `/admin/cms/faq` | ✅ | Ready |
| Notices | `/admin/cms/notices` | ✅ | Ready |
| Downloads | `/admin/cms/downloads` | ✅ | Ready |
| Gallery | `/admin/cms/gallery` | ✅ | Ready |
| Media Library | `/admin/cms/media` | ✅ | Ready |
| Committees | `/admin/cms/committees` | ✅ | Phase C |
| Speakers | `/admin/cms/speakers` | ✅ | Phase C |
| Partners | `/admin/cms/partners` | ✅ | Phase C |
| Events | `/admin/cms/events` | ✅ | Phase C |
| Media Center | `/admin/cms/media-center` | ✅ | Phase C |
| Menus | `/admin/cms/menus` | ✅ | Ready |
| Settings | `/admin/cms/settings` | ✅ | Ready |
| Announcement Bars | `/admin/cms/announcement-bars` | ✅ | Ready |
| SEO Manager | `/admin/cms/seo` | ✅ | Ready |
| Analytics | `/admin/cms/analytics` | ✅ | Ready |
| Contact Inbox | `/admin/cms/contact` | ✅ | Ready |
| Feedback Inbox | `/admin/cms/feedback` | ✅ | Ready |
| Registrations | `/admin` | Firebase | Ready (unchanged) |

---

## Public routes — CMS wired (Phase C)

| Route | Loader | Fallback |
|-------|--------|----------|
| `/committee/[slug]` | CMS | Legacy editions |
| `/speakers`, `/speakers/[slug]` | CMS | authority-speakers |
| `/partners` | CMS | Static logos |
| `/events`, `/events/[slug]` | CMS | Hardcoded |
| `/media-center` | CMS | Media archive client |
| `/noticeboard` | CMS | — |
| `/downloads` | CMS | — |
| `/gallery` | CMS | — |
| `/press`, `/press/[slug]` | CMS | Legacy press |

---

## Staging environment variables (minimum)

| Variable | Required |
|----------|----------|
| `DATABASE_URL` | ✅ |
| `DIRECT_URL` | ✅ (migrations) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ |
| `ADMIN_OPS_SECRET` | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ (recommended) |
| `REGISTRATION_LOOKUP_SECRET` | ✅ (recommended) |
| `REGISTRATION_BACKEND` | `firebase` |
| `RECAPTCHA_*` | ✅ |
| `RAZORPAY_*` | ✅ (test keys for staging) |
| `SMTP_*` | ✅ |

---

## Staging smoke test checklist

### Security (P0)
- [ ] Registration lookup without token → 401
- [ ] Registration lookup with valid token → 200 (summary only)
- [ ] Forgeable cookie `=1` → datadekh blocked
- [ ] Admin login → signed HttpOnly cookie set
- [ ] Firebase strict rules deployed to staging project

### CMS
- [ ] Create/publish committee, speaker, partner, event
- [ ] Public route shows CMS content
- [ ] SEO metadata saves via SEO Manager

### Registration
- [ ] Full registration flow → success page with token
- [ ] PDF download on success page works

---

## Staging readiness verdict

| Criterion | Status |
|-----------|--------|
| Code complete | ✅ |
| Migrations in repo | ✅ |
| Seeds available | ✅ |
| TypeScript valid | ✅ |
| DB migrated on staging | ⚠️ **Pending ops** |
| Seeds run on staging | ⚠️ **Pending ops** |
| Env vars configured | ⚠️ **Pending ops** |
| Firebase rules deployed | ⚠️ **Pending ops** |

**Can enter staging after:** Deploy code + run migration + configure env + deploy Firebase rules.
