# Content Operations System — RASE / SMK Platform

Extends Phase 7 templates into a full editorial operating model.

---

## Content types & owners

| Type | Data source | Page owner | Reviewer |
|------|-------------|------------|----------|
| Speakers | `authority-speakers.ts` | Academic Council / Comms | DHE content lead |
| Publications | `ecosystem/registries.ts` + `/proceedings` etc. | RASE publications | Technical editor |
| Research papers | Proceedings pages + future repo | Research cell | Peer reviewer |
| News | `content/registry.ts` | Comms | DHE |
| Articles | Knowledge Hub registry | Editorial | SEO lead |
| Case studies | `ecosystem/registries.ts` | Programmes | Coordinator |
| Success stories | `authority.ts` | Comms | Legal (consent) |

---

## 1. Publishing workflow

```
Draft (template) → PR to repo → Preview deploy → Review → Merge → Production deploy → GSC inspect URL
```

| Step | Action | Tool |
|------|--------|------|
| 1 Draft | Fill `docs/content-templates/*.md` | Markdown |
| 2 Implement | Add TS entry + page copy if needed | Git |
| 3 Preview | Vercel preview URL | Hosting |
| 4 Publish | Merge to main | CI/CD |
| 5 Index | Request indexing in GSC | Search Console |

**Cadence:** Minimum 2 Knowledge items/month during campaign season.

---

## 2. Review workflow

| Gate | Criteria |
|------|----------|
| **Fact** | Names, dates, institutions verified with official list |
| **Legal** | Quotes and photos have consent |
| **Brand** | Hindi/English titles match SMK 6.0 style guide |
| **Technical** | `npm run build` passes; no broken `href` |
| **SEO** | Unique title/description; 300+ words on dedicated URLs |

**Roles:**

- **Author** — fills template
- **Reviewer** — domain expert
- **Approver** — DHE/RASE sign-off for public names

---

## 3. SEO workflow

| Task | Frequency | Owner |
|------|-----------|-------|
| Sitemap check post-publish | Per release | SEO |
| Canonical / OG spot-check | Per new route | Dev |
| Internal links from Knowledge → target | Per article | Author |
| Keyword map (NEP, SMK, Hamirpur) | Quarterly | SEO |
| hreflang when locales promoted | Per i18n milestone | Dev |

See `docs/SEO_MONITORING_PLAYBOOK.md`.

---

## 4. Approval workflow

| Content class | Approver |
|---------------|----------|
| Speaker / VC names | Academic Council chair |
| Government / policy claims | DHE |
| Success stories with names | Legal + Comms |
| Statistics in `impactStatistics` | Data lead with source citation |
| Press releases | Comms director |

**Emergency takedown:** Revert PR + redeploy; remove registry entry.

---

## 5. File reference

| Template | Path |
|----------|------|
| Speaker | `docs/content-templates/SPEAKER_TEMPLATE.md` |
| Publication | `docs/content-templates/PUBLICATION_TEMPLATE.md` |
| Success story | `docs/content-templates/SUCCESS_STORY_TEMPLATE.md` |
| Research output | `docs/content-templates/RESEARCH_OUTPUT_TEMPLATE.md` |
| Partner | `docs/content-templates/PARTNER_INSTITUTION_TEMPLATE.md` |
| Past edition | `docs/content-templates/PAST_EDITION_TEMPLATE.md` |
| Population how-to | `docs/CONTENT_POPULATION_WORKFLOW.md` |

---

## 6. Future CMS (Year 2)

When static TS files limit velocity:

- Headless CMS → webhook → build OR ISR
- Keep Firestore for **registrations only**
- Migrate `CONTENT_REGISTRY` first, then ecosystem

---

## 7. KPIs

| Metric | Target |
|--------|--------|
| Knowledge Hub items | 40+ in 6 months |
| Speaker profiles | 20+ |
| Indexed URLs (GSC) | +30% QoQ |
| Zero thin pages in AdSense review | 100% |

---

## Related

- `docs/POST_LAUNCH_GROWTH_ROADMAP.md`
- `docs/ADSENSE_APPROVAL_CHECKLIST.md`
