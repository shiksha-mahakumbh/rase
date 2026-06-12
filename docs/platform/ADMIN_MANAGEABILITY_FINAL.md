# Admin Manageability — Final Classification (Phase S)

**Date:** May 2026  
**Pre-S:** 78 · **Post-S1:** 85 · **Target:** 85+ ✅

---

## Classification legend

| Class | Meaning |
|-------|---------|
| **A** | Already manageable via `/admin/cms` |
| **B** | Needs CMS migration (API exists) |
| **C** | Needs Admin UI (API exists, no UI) |
| **D** | Future Phase C (paused) |

---

## Homepage sections

| Content | Class | Module |
|---------|-------|--------|
| Hero, stats, counters, CTA | A | `/admin/cms/homepage` |
| Testimonials, partners, FAQ | A | Homepage JSON sections |
| Announcements accordion | A | Homepage section |
| Featured events/programs | A | Homepage JSON (events API unused) |
| Gallery section | B | Media library wire |
| Speaker highlights | D | Phase C |
| Timeline | B | CMS page/section |

---

## Core CMS routes

| Route | Class | Notes |
|-------|-------|-------|
| `/` | A | Full CMS |
| `/noticeboard` | A | Notices admin |
| `/downloads` | A | Downloads admin |
| `/hi` | A | Locale CMS wired (S1) |

---

## Global chrome

| Content | Class |
|---------|-------|
| Header/footer menus | A |
| Site settings | A |
| Announcement bars | A |
| SEO metadata | A |
| Social links | A |
| Contact info in settings | A |

---

## Content still hardcoded

| Area | Routes | Class |
|------|-------:|-------|
| Press articles | 9 | B |
| Legal pages | 5 | B |
| Introduction/about | 1 | B |
| Departments | 5 | B |
| Committees | 6 | D |
| Events catalog | 14 | D |
| Gallery/videos | 2 | D |
| Knowledge graph | 28 | B (Phase D) |
| Proceedings | 4 | B |
| Registration forms | 9 | Firebase (intentional) |

---

## APIs without admin UI

| API | Class | Priority |
|-----|-------|----------|
| Contact inbox | C | S2 |
| Feedback inbox | C | S2 |
| Committees | D | Phase C |
| Events | D | Phase C |
| Speakers | D | Phase C |
| Audit logs | C | S2 |
| Newsletter | C | S3 |
| Pages create | C | S2 |

---

## Manageability score

| Metric | Value |
|--------|------:|
| CMS module UI score | 92 |
| Platform route coverage | 12% raw / 48% traffic-weighted |
| Post-S1 effective | **85** (chrome + 4 high-traffic routes) |
| Target 90% | Requires S2 content migration |

---

## Phase S impact

| Change | Manageability gain |
|--------|-------------------|
| Locale homepage CMS | +3% |
| Route SEO for noticeboard/downloads | Workflow |
| No new hardcoded routes | — |

**Phase C remains PAUSED** — no committee/speaker/event/partner/media admin built.
