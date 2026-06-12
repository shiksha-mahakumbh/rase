# Final Admin Manageability Plan — 95%+ Target

**Date:** May 2026  
**Goal:** Non-technical administrators manage 95%+ of website without code  
**Current effective manageability:** 85% (traffic-weighted) · **Raw route coverage:** 12%

---

## Measurement model

```
Manageability Score = (
  TrafficWeight × CMSCoverage +
  ChromeWeight × GlobalCMS +
  WorkflowWeight × AdminUX
) / TotalWeight
```

| Milestone | Raw routes | Traffic-weighted | Score |
|-----------|----------:|-----------------:|------:|
| Today (post Phase S) | 12% | 48% | 85 |
| After P1 (S2) | 28% | 72% | 90 |
| After P2 (Phase C UI) | 46% | 85% | 93 |
| After P3 (Knowledge) | 80% | 92% | 95 |
| Target | 90%+ | 95%+ | **95** |

---

## Module roadmap

### Tier 0 — Operational today (no build)

| Module | Admin path | Coverage |
|--------|------------|----------|
| Homepage | `/admin/cms/homepage` | Hero, stats, partners, FAQ, CTA |
| Notices | `/admin/cms/notices` | Full CRUD |
| Downloads | `/admin/cms/downloads` | Full CRUD |
| Media | `/admin/cms/media` | Upload, folders |
| Menus | `/admin/cms/menus` | Header, footer |
| Settings | `/admin/cms/settings` | Contact, social, org |
| Announcement bars | `/admin/cms/announcement-bars` | Ticker, modal |
| SEO | `/admin/cms/seo` | All entities |
| Analytics | `/admin/cms/analytics` | Visitors |
| Registrations | `/admin` | Firebase (unchanged) |

### Tier 1 — Build in S2 (weeks 1–8)

| Module | Entities | Effort | Unlock routes |
|--------|----------|--------|-------------|
| **Articles** | Page type=article | 8d | 9 press |
| **Legal pages** | Page type=legal | 3d | 5 legal |
| **About/Introduction** | Page type=about | 2d | 1 |
| **Contact inbox** | ContactMessage | 3d | ops workflow |
| **Feedback inbox** | Feedback | 3d | ops workflow |
| **Pages create UI** | Page | 2d | unlimited |
| **FAQ module** | FaqCategory + Faq | 5d | homepage + page |
| **Gallery wire** | MediaAlbum (new) | 5d | gallery, glimpses |
| **Notice enhancements** | NoticeCategory CRUD | 2d | workflow |
| **SEO embed** | SeoMetadata panel | 3d | all editors |

### Tier 2 — Phase C UI (weeks 9–14) — requires approval

| Module | API status | Effort |
|--------|------------|--------|
| Committees | ✅ Full | 8d |
| Events | ✅ Full | 5d |
| Speakers | ❌ Need API | 8d |
| Partners | ❌ Need API | 5d |
| Media center hub | Composite | 8d |
| Video library | MediaAsset | 3d |
| Venue/Travel | Page + settings | 5d |

### Tier 3 — Phase D (weeks 15–20)

| Module | Routes unlocked |
|--------|----------------|
| Proceedings/publications | 4+ |
| Knowledge graph pages | 28 |
| Department pages | 5 |
| Edition timeline | cross-cutting |

---

## Admin UX standards (required for 95%)

| Standard | Required by |
|----------|-------------|
| WYSIWYG/block editor for long content | Tier 1 |
| Media picker on all images/PDFs | Tier 1 |
| SEO panel embedded in every editor | Tier 1 |
| Preview before publish | Tier 1 |
| Locale tabs (en/hi) on all entities | Tier 1 |
| Drag-reorder on lists | Tier 2 |
| Scheduled publish UI | Tier 1 (partial exists) |
| Version history + rollback UI | Tier 2 |
| Role-based permissions | Tier 3 |
| Bulk operations | Tier 3 |

---

## Content type → module mapping

| Public content | Admin module | Entity |
|----------------|--------------|--------|
| Press article | Articles | Page + sections |
| Notice | Notices | Notice |
| Brochure/PDF | Downloads | Download |
| Photo album | Gallery | MediaAlbum |
| Video | Videos | MediaAsset type=video |
| Committee member | Committees | CommitteeMember |
| Speaker | Speakers | SpeakerProfile |
| Event | Events | Event |
| Partner/Sponsor | Partners | Partner/Sponsor |
| FAQ item | FAQ | Faq |
| Legal page | Pages | Page |
| Department page | Pages | Page type=department |
| Testimonial | Testimonials | PageSection or Faq-like |
| Office/venue | Settings + Venue | SiteSetting + Page |

---

## Intentionally NOT admin-managed

| Area | Reason |
|------|--------|
| Firebase registration forms | Payment/validation complexity |
| Razorpay payment flow | Security mandate |
| Abstract/paper submission backend | Permanently excluded |
| Datadekh internal tables | Deprecated |
| Custom program validation | Bespoke per program |

---

## Success criteria

- [ ] 95% traffic-weighted content editable without PR
- [ ] Zero inline TSX content arrays on top-20 traffic routes
- [ ] All images/PDFs via media library
- [ ] SEO on every publishable entity
- [ ] Hindi content for homepage, notices, settings
- [ ] Non-technical editor can publish notice in <5 minutes

**Status: PLAN ONLY — no implementation**
