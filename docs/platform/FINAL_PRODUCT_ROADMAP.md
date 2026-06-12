# Final Product Roadmap — Shiksha Mahakumbh Platform

**Date:** May 2026  
**Horizon:** 20 weeks to 95%+ admin-manageable · 6 months to world-class

---

## Vision

> Any non-technical administrator manages 95%+ of the Shiksha Mahakumbh website without editing code — supporting SMK, Shiksha Kumbh, DHE, and future global education conferences.

---

## Phase map

```
COMPLETED          CURRENT STOP        NEXT (approved)        FUTURE
─────────          ────────────        ───────────────        ──────
B.1–B.7 CMS   →   MASTER REVIEW   →   DEPLOY (S0)      →   Phase D
Phase S (S1)      (this document)     S2 Content           Knowledge
                                      Phase C UI           Full i18n
                                      (approval req)       Registration
                                                           cutover (approval)
```

---

## Priority 1 — Critical (weeks 1–4)

| # | Item | Owner | Outcome |
|---|------|-------|---------|
| 1 | Production deploy + visitor counter verify | DevOps | Live analytics |
| 2 | RLS policy apply on Supabase | DBA | Security 95 |
| 3 | Hindi CMS seed | Content | Global reach 88 |
| 4 | Press articles → CMS (9 routes) | CMS | Admin +12% routes |
| 5 | Legal pages → CMS (5 routes) | CMS | Compliance editable |
| 6 | Contact + feedback admin inbox | Admin | Ops self-service |
| 7 | Gallery → media library wire | CMS | Homepage complete |

**Exit criteria:** Production 91+, admin 90+, zero fallback visitor counter

---

## Priority 2 — High value (weeks 5–10)

| # | Item | Outcome |
|---|------|---------|
| 8 | FAQ dedicated module | Homepage FAQ editable |
| 9 | Introduction/about CMS page | About editable |
| 10 | Department pages CMS (5) | Departments editable |
| 11 | SEO embed in all editors | SEO workflow |
| 12 | Analytics event bridge (GTM→Supabase) | Unified funnel |
| 13 | `/hi/noticeboard`, `/hi/downloads` | Hindi public routes |
| 14 | Admin locale tabs | Hindi editing |
| 15 | BreadcrumbList all shell routes | SEO 96 |

**Exit criteria:** Admin 93+, SEO 96, global 92

---

## Priority 3 — Phase C modules (weeks 11–16) — REQUIRES APPROVAL

| # | Item | Outcome |
|---|------|---------|
| 16 | Committees admin UI | 6 routes CMS |
| 17 | Events admin UI | 14 routes CMS |
| 18 | Speakers API + admin | Keynote page CMS |
| 19 | Partners admin module | Tier management |
| 20 | Media center hub | Gallery + video + press unified |
| 21 | Venue/travel structured CMS | Travel info editable |
| 22 | Audit log viewer | Compliance |

**Exit criteria:** Admin 95+, raw route coverage 46%

---

## Priority 4 — Nice-to-have (weeks 17–24)

| # | Item |
|---|------|
| 23 | Knowledge graph → CMS pages (28 routes) |
| 24 | Proceedings/publications migration |
| 25 | WYSIWYG editor upgrade |
| 26 | Content workflow (draft→review→publish) |
| 27 | RBAC per-role CMS permissions |
| 28 | Newsletter admin |
| 29 | ar/fr/es locale extension |
| 30 | Registration Supabase cutover evaluation |

---

## Explicitly excluded (permanent)

| Item | Reason |
|------|--------|
| MultiTrack Conference backend | User exclusion |
| Abstract Submission backend | User exclusion |
| Paper Submission backend | User exclusion |
| Firebase removal | Until approved cutover |
| Phase C without approval | Current stop |

---

## Milestone scores

| Week | Phase | Overall | Admin | SEO | Global |
|------|-------|--------:|------:|----:|-------:|
| 0 | Phase S complete | 90 | 85 | 93 | 80 |
| 4 | P1 deploy + content | 91 | 90 | 94 | 88 |
| 10 | P2 content wave | 93 | 93 | 96 | 92 |
| 16 | P3 Phase C | 95 | 95 | 97 | 93 |
| 24 | P4 knowledge | 97 | 97 | 97 | 95 |

---

## Resource estimate

| Phase | Dev weeks | Content weeks |
|-------|----------:|--------------:|
| P1 | 4 | 2 |
| P2 | 6 | 4 |
| P3 | 6 | 2 |
| P4 | 8 | 6 |
| **Total** | **24** | **14** |

---

## Decision gates

| Gate | Question | Approver |
|------|----------|----------|
| G1 | Deploy to production? | Product + DevOps |
| G2 | Start S2 content migration? | Product |
| G3 | Start Phase C modules? | Product + CTO |
| G4 | Start Firebase cutover evaluation? | CTO + Legal |
| G5 | Extend to ar/fr/es? | Product |

**Current status: STOPPED at G1 — awaiting approval**
