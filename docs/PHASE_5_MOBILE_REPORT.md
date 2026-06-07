# Phase 5 — Mobile UX Audit Report

**Focus routes:** Home, Registration, Authority (/introduction), Committee, Academic Council, Past events

---

## Method

Static review of layout patterns, Tailwind breakpoints, table overflow, and touch targets. No device lab in CI.

---

## Findings by route

### Home (`/`, `/[locale]`)

| Check | Status | Notes |
|-------|--------|-------|
| Horizontal scroll | ✓ Good | `max-w-7xl`, responsive grids |
| Typography | ✓ Good | Brand tokens, readable base sizes |
| Touch targets | ✓ Good | `CtaButton`, sticky register bar |
| CLS | ⚠ Risk | Announcement modal on first load |
| Nav mobile menu | ✓ Good | Framer-motion drawer |

### Registration (`/registration`)

| Check | Status | Notes |
|-------|--------|-------|
| Horizontal scroll | ✓ Good | `RegistrationShell` constrained |
| Form fields | ✓ Good | Full-width inputs |
| Stepper | ✓ Good | `RegistrationProgress` |
| Tables | N/A | |
| Payment section | ⚠ | Long forms on small screens — scroll length only |

### Authority (`/introduction`)

| Check | Status | Notes |
|-------|--------|-------|
| Layout | ✓ Fixed Phase 4 | Removed 3-column `CompanyInfo` shell |
| Authority sections | ✓ Good | Responsive grids |
| Horizontal scroll | ✓ Good | |

### Committee (`/committeepage`, `/committee/*`)

| Check | Status | Notes |
|-------|--------|-------|
| Tables | ⚠ **Risk** | `CommitteePage` uses `<table>` with `overflow-x-auto` — OK if wrapper present |
| Photos | ✓ | 40×40 avatars |
| Typography | ⚠ | Large `text-3xl` headers on mobile |

### Academic Council (`/VibhagRoute/AcademicCouncil24`)

| Check | Status | Notes |
|-------|--------|-------|
| Sidebar + content | ⚠ | Brand sidebar; verify mobile nav in `AcademicCouncil24.tsx` |
| Text walls | ⚠ | Emoji headings; long accordions |
| Horizontal scroll | ✓ | Split pages < 500 lines |

### Past events (`/past_event/*`, `/pastevent`)

| Check | Status | Notes |
|-------|--------|-------|
| Images | ⚠ | Legacy `<img>` without responsive sizing |
| Layout | ⚠ | Old centered single-column + large images |
| Touch | ✓ | Links generally adequate |

### Press pages (`/Press1`–`9`)

| Check | Status | Notes |
|-------|--------|-------|
| Layout | ⚠ | Still uses `CompanyInfo` 3-column — **empty side columns waste space** |
| Horizontal scroll | ⚠ Possible | `proceeding-container` padding |
| Share buttons | ⚠ | Small tap areas (`p-2`) — below 44px guideline |

---

## Global fixes recommended

1. `overflow-x: hidden` on `html, body` (prevent 1px bleed)
2. `min-h-[44px] min-w-[44px]` utility for legacy buttons
3. Press layout: drop `CompanyInfo` side columns → single column
4. Modal: don't auto-open on viewport `< 768px` or use `sessionStorage`

---

*Before Phase 5 mobile CSS / layout patches.*
