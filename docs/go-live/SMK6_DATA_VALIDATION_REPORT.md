# SMK 6.0 Data Validation Report

**Date:** 2026-05-29  
**Edition:** Shiksha Mahakumbh **6.0**  
**Event dates:** 9–11 October 2026  
**Venue:** NIT Hamirpur

---

## Canonical Source of Truth

**File:** `src/data/past-editions.ts` → `UPCOMING_EDITION`

| Field | Canonical value | Status |
|-------|-----------------|--------|
| Edition | 6.0 | ✅ |
| Title | शिक्षा महाकुंभ 6.0 | ✅ |
| Venue | NIT Hamirpur | ✅ |
| Venue full | National Institute of Technology, Hamirpur | ✅ |
| Dates | 9–11 October 2026 | ✅ |
| Theme | Current National Edition | ⚠️ Placeholder — needs final theme copy |
| Registration href | `/registration` | ✅ |
| Event href | `/upcoming-events` | ✅ |

**Mirrors:** `src/config/site.ts` (schema dates 2026-10-09–11), `src/design/tokens.ts`

---

## Registration Categories & Fees

**Source:** `src/types/registration.ts`, `src/lib/registration/fees.ts`, `src/lib/registration/categoryMeta.ts`

### Categories (11 portal types)

| # | Category | Fee | Notes |
|---|----------|-----|-------|
| 1 | Delegate Registration | ₹0–₹8,000 by subcategory | Student free |
| 2 | Multi Track Conference | CMT external | URL still `ShikshaMahakumbh2025` ⚠️ |
| 3 | Conclave | Free | 7 track options |
| 4 | Awards | Free | 7 award types |
| 5 | Olympiad | ₹200/student | 3 olympiad types |
| 6 | Exhibition | Free | |
| 7 | Projects | ₹200–₹400 | School/college tiers |
| 8 | Best Practices | Free | |
| 9 | Bal Shodh Patrika | Free | |
| 10 | Cultural Program | Free | |
| 11 | Accommodation | ₹3,000–₹6,000 | Single/double bed |

### Delegate fee schedule

| Subcategory | Amount (INR) |
|-------------|--------------|
| Student | 0 |
| Teacher | 1,000 |
| Principal | 2,000 |
| Research Scholar | 2,000 |
| Director / VC / Chairperson | 3,000 |
| Industry Delegate | 8,000 |

### Identifiers

| Field | Value | Consistency |
|-------|-------|-------------|
| `EVENT_NAME` (registration) | Shiksha Mahakumbh 6.0 | ✅ |
| `EVENT_NAME` (site.ts) | Shiksha Mahakumbh Abhiyan 6.0 | ⚠️ Minor naming variance |
| Registration ID prefix | SMK2026 | ✅ |
| Razorpay link | `https://rzp.io/rzp/MMLfl4L2` | Verify active for 6.0 |

---

## Edition Numbering (1.0–6.0)

| Edition | Legacy code | Year | Venue | SSOT |
|---------|---------------|------|-------|------|
| 1.0 | SM23 | 2023 | NIT Jalandhar | ✅ |
| 2.0 | SK23 | 2023 | NIT Kurukshetra | ✅ |
| 3.0 | SK24 | 2024 | NIT Srinagar | ✅ |
| 4.0 | SM24 | 2024 | Kurukshetra University | ✅ |
| 5.0 | SM25 | 2025 | NIPER Mohali | ✅ |
| 6.0 | Upcoming | 2026 | NIT Hamirpur | ✅ |

Past event URLs retain legacy slugs (`/past_event/sm23`, etc.) — intentional for deep links.

---

## Content Readiness Audit

### ✅ Aligned with SMK 6.0

| Surface | File(s) | Notes |
|---------|---------|-------|
| Homepage hero | `HeroSection.tsx`, `page.tsx` metadata | 6.0, NIT Hamirpur, Oct 2026 |
| Countdown | `CountdownBanner.tsx` | Targets 2026-10-09 |
| Marquees / announcements | `Marquees.tsx`, `Annoucement.tsx` | 6.0 messaging |
| Registration hub | `RegistrationHub.tsx` | EVENT_NAME 6.0 |
| Authority strip | `authority.ts` | NIT Hamirpur · 6.0 |
| Academic Council pages | `Vibhag/academic/pages/*` | Mostly 6.0 labels |
| FAQ / JSON-LD | `HomeFaqSection.tsx`, `HomeJsonLd.tsx` | Correct dates |

### ⚠️ Needs update before launch

| Surface | Issue | File | Recommended fix |
|---------|-------|------|-----------------|
| Upcoming Events card title | "Shiksha Mahakumbh **2026**" (year not edition) | `UpcomingEvent.tsx` | Use `UPCOMING_EDITION.title` |
| Introduction 6.0 dates | Shows "Upcoming" not Oct 2026 | `Introduction.tsx` | Import SSOT dates |
| Abhiyan upcoming block | Dates not rendered | `abhiyan/page.tsx` | Display `UPCOMING.dates` |
| Past editions blurb | Says "1.0 through **5.0**" | `PastEditionsSection.tsx` | "1.0 through 6.0" |
| Global SEO keywords | `2025`, NIPER Mohali | `metadata.tsx` | Update to 6.0 / NIT Hamirpur |
| CMT portal URL | `ShikshaMahakumbh2025` | `lib/registration/config.ts` | Confirm Microsoft CMT name for 6.0 |
| Legacy registration pages | 2024/2025 copy | `AccomodationReg.tsx`, `OrganizerReg.tsx`, etc. | Redirect to hub or update |
| Upcoming card 2 | 2027 / IIT Jammu speculative | `UpcomingEvent.tsx` | Remove or mark TBA without venue |
| Theme | Placeholder text | `past-editions.ts` | Finalize SMK 6.0 theme |

### Committee pages

Legacy slug URLs (`/committee/shikshamahakumbh2025`, etc.) — labels use edition numbers in CMS; acceptable for bookmarks.

---

## Production vs Source Drift

| Item | Production (live) | Source (local) |
|------|-------------------|----------------|
| `/abhiyan` | 404 | Built |
| Edition media URLs | 404 | `/media/shiksha-mahakumbh/{1.0–4.0}/…` |
| Sitemap media paths | Year-based 2023/2024 | Edition-based 1.0–4.0 |

**Deploy required** to align production with validated source data.

---

## Validation Commands

```bash
npm run test                    # Registration type mapping (7/7)
node scripts/test-redirects.mjs # 47 redirects PASS
npx prisma validate             # Schema PASS
```

---

## Sign-Off Criteria

- [ ] All user-facing SMK 6.0 surfaces show **edition 6.0** (not mixed 2026-only labels)
- [ ] Theme and CMT URL confirmed by academic council
- [ ] Legacy registration sub-routes updated or redirected
- [ ] Production deploy includes `/abhiyan` and edition media paths
- [ ] Razorpay link verified for SMK 6.0 fee schedule
