# Post-Launch Growth Roadmap — rase.co.in

Long-term SEO, authority, and content publishing after SMK 6.0 go-live. **No major re-architecture** — extend existing registries, authority data, and editorial routes.

---

## Vision

Position **rase.co.in** as the durable national hub for Shiksha Mahakumbh, DHE programmes, and education research — beyond a single event cycle.

---

## Quarter 1 (launch → SMK 6.0 event)

| Initiative | Deliverable | Owner | SEO impact |
|------------|-------------|-------|------------|
| Speaker profiles | 20+ entries in `authority-speakers.ts` + photos | Content | Named-entity search |
| Registration campaigns | UTM-tagged national drives | Comms | Conversion + attribution |
| Knowledge Hub seed | 25+ `CONTENT_REGISTRY` + ecosystem items | Content | Long-tail discovery |
| Press ↔ hub links | Fix share URLs; link Press to Knowledge | Tech/content | Reduce duplicate signals |
| Search Console | Sitemap + weekly index review | SEO | Indexing |
| Locale HI | Hindi metadata for `/hi/registration` | i18n | Regional reach |

---

## Quarter 2 (event → proceedings)

| Initiative | Deliverable | SEO impact |
|------------|-------------|------------|
| Publication archive | Volume pages under `/proceedings` with abstracts | Scholarly queries |
| Success stories | 10+ attributed stories | Trust / E-E-A-T |
| Past edition SMK 6.0 recap | Photos, outcomes on `/pastevent` | Fresh content |
| Research repository prep | Index papers with title, authors, track, PDF | **High** — citation traffic |
| AdSense (if approved) | Enable slots on home/knowledge only | Revenue |

---

## Year 1 pillars

### 1. Speaker profiles

- Dedicated optional routes `/speakers/[slug]` (future — only when 30+ profiles justify indexable pages).
- Until then: Introduction + Knowledge Hub cards.
- Video embeds from conclave keynotes (YouTube lazy-load).

### 2. Publication archive

- Proceedings by year (SMK 4.0 → 6.0).
- Journal issue tables for Viksit Bharat / Viksit India.
- Books/compendiums with download + citation block.

### 3. Research repository

- Structured list: title, authors, institution, track, DOI optional.
- Link to Bal Shodh Patrika and abstract submission funnel.
- Monthly “featured paper” on Knowledge Hub.

### 4. Education news

- Short news items in `CONTENT_REGISTRY` (category: `news`).
- 400–800 word originals — policy, NEP, SMK announcements.
- RSS optional (future).

### 5. Policy updates

- NEP / NCF / state policy summaries (expert-reviewed).
- Cross-link Academic Council policy pages.
- Tag: `policy` in ecosystem search.

### 6. Annual reports

- PDF annual impact report + HTML summary page.
- Update `impactStatistics` in `authority.ts` yearly with sourced numbers.

---

## SEO & authority metrics (targets)

| Metric | 6 months | 12 months |
|--------|----------|-----------|
| Indexed pages (GSC) | 80+ | 150+ |
| Knowledge Hub items | 40+ | 100+ |
| Referring domains | Baseline +20% | +50% |
| Branded search CTR | &gt; 8% | &gt; 12% |
| CWV “Good” URLs | 75% | 90% |

---

## International visibility

- French / Spanish / Arabic locales: metadata + key landing pages only (no full duplicate site).
- English remains canonical; `hreflang` when sitemap includes locales.
- Outreach: INI partners, diaspora education networks — backlinks to Introduction and registration.

---

## Operational rhythm

| Cadence | Activity |
|---------|----------|
| Weekly | GSC index + registration volume |
| Biweekly | 2 Knowledge Hub articles or news items |
| Monthly | Broken link audit, Lighthouse spot-check |
| Quarterly | Impact stats review, roadmap retrospective |

---

## Dependencies (do not block on)

- Headless CMS (Sanity/Contentful) — optional Year 2
- Razorpay → Firestore payment sync
- Full locale sitemap

---

## Related docs

- `docs/CONTENT_POPULATION_WORKFLOW.md`
- `docs/SEO_MONITORING_PLAYBOOK.md`
- `docs/ADSENSE_APPROVAL_CHECKLIST.md`
