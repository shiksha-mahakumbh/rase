# Education Directory Roadmap

**Scope:** Entity directories + conference/publication network (Phase 4 foundation)

---

## Completed (Phase 4)

| Area | Deliverable |
|------|-------------|
| Authority distribution | Visible related-link blocks on Press, proceedings, knowledge, Vibhag, workshops |
| Entity hubs | Six directory routes with shared template |
| Publications | Hub + four type catalogues |
| Conferences | Hub + events / summits / workshops + year archive |
| Graph | `content-map`, `authority-map`, sitemap extensions |
| Schema | ProfilePage, Dataset, expanded CollectionPage / ItemList usage |

---

## Near term (Phase 5)

### Entity profiles

1. Publish 5–10 pilot profiles in `ENTITY_LANDING_REGISTRY` (VCs, keynote speakers)
2. Add optional `/entity/[slug]` detail route reusing `buildPersonSchema` + ProfilePage
3. Cross-link from `/keynotespeakers` and Academic Council pages

### Publications

1. Upload first report PDF → detail page with `ScholarlyArticle` or `Report`
2. ItemList on `/reports` from CMS or static manifest
3. Breadcrumb: Publications → Reports → Document

### Conferences

1. Normalize year slug pattern `/conferences/[year]` (optional; keep legacy `past_event` URLs)
2. Auto-generate ItemList from noticeboard / upcoming events API

---

## Medium term

| Initiative | Benefit |
|------------|---------|
| State-wise school directory | Local SEO clusters |
| University partnership pages | HEI backlink equity |
| Research project detail pages | ResearchProject + Dataset |
| Multilingual directory labels | Hindi UI parity with NavBar intl |

---

## Data governance

- Entity records should not duplicate registration PII
- Editorial approval before `Person` schema with full name
- Firestore collection design deferred until admin UI is specified

---

## Metrics

- Crawl coverage: sitemap URL count vs Search Console indexed pages
- Internal link CTR: monitor once analytics tag on `InternalLinksBlock` (future)
- Rich results: validate JSON-LD in Google Rich Results Test for hub pages

---

## References

- `docs/ENTITY_ARCHITECTURE.md`
- `docs/PUBLICATION_STRATEGY.md`
- `docs/SEO_AUTHORITY_ARCHITECTURE.md`
- `src/lib/knowledge-graph/internal-link-engine.ts`
