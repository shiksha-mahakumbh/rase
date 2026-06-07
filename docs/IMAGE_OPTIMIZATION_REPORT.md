# Image Optimization Report — Phase 8

**Audit date:** 29 May 2026  
**Scope:** All `<img>` in `src/` + hero/event/knowledge surfaces

---

## Summary

| Category | Count | Action |
|----------|------:|--------|
| **Converted (Phase 8)** | 15 | Workshop sliders → `WorkshopSlideImage` / `OptimizedImage` |
| **Already optimized** | — | Hero (`next/image`), past events (`EventImageSlider`), TrustStrip, Committee, Contact, Press1 hero |
| **Skipped** | 26+ | See table below |

---

## Converted

| File | Images | Replacement |
|------|--------|-------------|
| `Teacher_Development_Program.tsx` | 5 slides | `WorkshopSlideImage` |
| `Spoken_English_Workshop.tsx` | 5 slides | `WorkshopSlideImage` |
| `Innovation_and_Entrepreneurship_Dhe_Workshop.tsx` | 5 slides | `WorkshopSlideImage` |

**Benefit:** WebP/AVIF via `next/image`, lazy load, blur placeholder, fixed `h-80` container (CLS-safe).

---

## Skipped (with reason)

| File | Count | Reason |
|------|------:|--------|
| `Registration/TalentForm.tsx` | 1 | `blob:` preview URL — must stay native `<img>` |
| `Registration/DelegateForm.tsx` | 4 | Blob upload preview + small static `/fee.png` icons |
| `RegistrationForm.tsx` | 4 | Legacy form — blob preview + fee icons |
| `Registration/InstitutionForm.tsx` | 1 | Blob preview |
| `Registration/SchoolProjectForm.tsx` | 1 | Static QR `/fee.png` — low priority icon |
| `Registration/HeiProjectForm.tsx` | 1 | Static QR `/fee.png` |
| `Registration/AbstractSubmission.tsx` | 1 | Small fee icon |
| `AbstractSubmission.tsx` | 1 | Legacy fee icon |
| `noticeboard/page.tsx` | 2 | Dynamic Firebase `imageUrl` + `onLoad`/`onError` spinners |
| `noticeboarddata/page.tsx` | 3 | Admin/dynamic URLs |
| `NoticeBoard.tsx` | 0 active | Images commented out |
| `accomodationdata`, `Talentdata`, `Bestpracticedata`, `Conclavedata` | 4 | HTML string templates for print/PDF QR embed |
| Press 2–9 (if present) | ~27 | WhatsApp icons — candidate for `WhatsAppIcon` (P3) |

**Registration path (SMK 6.0 wizard):** Uses `@/components/forms/*` — **not** legacy `DelegateForm.tsx` in `component/Registration/` for main hub; legacy files remain for old routes only.

---

## Knowledge / hero / past events

| Surface | Status |
|---------|--------|
| `HeroSection.tsx` | `next/image` + `priority` ✓ |
| `EventImageSlider.tsx` | `OptimizedImage` ✓ |
| `/knowledge` | No raw `<img>` in hub client |
| Marquee / past_event pages | Migrated in Phase 6 per `PHASE_5_PERFORMANCE_FINDINGS.md` |

---

## Next pass (optional, P3)

1. Replace `/fee.png` icons with `OptimizedImage` width={64} height={64} in active registration forms.
2. Press pages → shared `WhatsAppIcon` component.
3. `noticeboard/page.tsx` → `next/image` with `unoptimized` for external Firebase URLs if domain allowlisted.

---

## Verification

After deploy, PageSpeed Insights → **Improve image delivery** on workshop URLs should show reduced unoptimized bytes.
