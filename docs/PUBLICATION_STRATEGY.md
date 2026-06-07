# Publication Strategy — Authority & Schema

**Phase:** 4

---

## Hub model

```
/publications (CollectionPage + ItemList)
├── /reports
├── /whitepapers
├── /policy-papers
├── /research-papers
└── Legacy volumes (unchanged URLs)
    ├── /proceedings
    ├── /proceeding1 | proceeding2 | proceeding3
    ├── /journals
    └── /books
```

`/publications` uses `PublicationAuthorityHub` while preserving `createPillarMetadata("publications")` for title/description parity with Phase 3.

---

## Type pages (catalogue-first)

Subtype routes are **schema-ready catalogues**, not migrated document stores:

| Route | Dataset JSON-LD | Future content |
|-------|-----------------|---------------|
| `/reports` | Dataset placeholder | Annual SMK reports |
| `/whitepapers` | Dataset placeholder | Practice whitepapers |
| `/policy-papers` | Dataset placeholder | NEP / governance papers |
| `/research-papers` | Dataset placeholder | Peer-reviewed uploads |

When a document is published, add `buildScholarlyArticleSchema` on the **detail** route only; keep hub as CollectionPage + ItemList.

---

## Authority flow

1. Proceedings remain the **primary citation surface** (existing volumes).
2. `/publications` hub links type pages + legacy volumes.
3. `RelatedContentSection` on hub and type pages pulls research + media pillar links.
4. `content-map` maps each type to `publications`, `policy`, or `research` pillar for `getInternalLinksForPath()`.

---

## SEO rules

- Do not change `/proceedings` metadata or layout JSON-LD
- Canonical for new types: self (`alternates.canonical`)
- Sitemap: hub + four types included in `sitemap.ts`
- Press articles stay under `/media` pillar; link from publications hub only via internal links

---

## Implementation files

- `publication-catalog.ts` — types + legacy route index
- `PublicationAuthorityHub.tsx`
- `PublicationTypePage.tsx`
- `builders.ts` — `buildDatasetSchema`, `buildScholarlyArticleSchema`
