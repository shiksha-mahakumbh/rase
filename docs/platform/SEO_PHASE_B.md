# SEO — Phase B Integration

Phase B modules integrate with the Phase A `seo_metadata` engine and sitemap generator.

---

## Per-module SEO support

| Module | entity_type | JSON-LD | Canonical | Sitemap |
|--------|-------------|---------|-----------|---------|
| Notice Board | `notice` | NewsArticle | `/noticeboard#{slug}` | ✓ |
| Homepage CMS | `page` | WebPage | `/` | ✓ (priority 1.0) |
| Downloads | `download` | WebPage | `/downloads#{slug}` | ✓ |
| Settings | — | Organization (site-level) | — | — |
| Navigation | — | — | — | — |
| Announcement Bar | — | — | — | — |

---

## Auto-generated metadata

### Notices
On create (if `seo` provided) and on publish:
```json
{
  "@type": "NewsArticle",
  "headline": "<title>",
  "datePublished": "<ISO>",
  "url": "/noticeboard#<slug>"
}
```

### Homepage
On publish:
```json
{
  "@type": "WebPage",
  "name": "Shiksha Mahakumbh Abhiyan",
  "url": "/",
  "isPartOf": { "@type": "WebSite", "name": "..." }
}
```

### Downloads
On create (optional `seo`):
```json
{
  "@type": "WebPage",
  "name": "<title>",
  "description": "<description>",
  "url": "/downloads#<slug>"
}
```

---

## Open Graph & Twitter

All modules support via `seo_metadata`:
- `og_title`, `og_description`, `og_image_url`
- `twitter_card` (default: `summary_large_image`)
- `twitter_title`, `twitter_description`, `twitter_image_url`

Admin override: `PUT /api/v2/admin/seo/{entityType}/{entityId}`

Public read: `GET /api/v2/seo/{entityType}/{entityId}?locale=en`

---

## Sitemap integration

`GET /api/v2/seo/sitemap` (via `generateSitemapIndex()`)

Phase B additions:
1. Static routes: `/noticeboard` (0.8, daily), `/downloads` (0.7, weekly)
2. Published notices: `/noticeboard#<slug>` per notice
3. Homepage: via page publish (priority 1.0, daily)
4. Downloads: via `seo_metadata` entries

### hreflang
Notices and pages support `locale` field. `seo_metadata.hreflang_alternates` stores alternate URLs for Hindi/English pairs.

Recommended pattern when Hindi content exists:
```json
[
  { "locale": "en", "url": "https://www.rase.co.in/noticeboard#slug" },
  { "locale": "hi", "url": "https://www.rase.co.in/hi/noticeboard#slug" }
]
```

---

## robots.txt

`GET /api/v2/seo/robots`

Unchanged config with CMS awareness:
- Allow: `/`
- Disallow: `/admin`, `/api/`, sensitive admin paths
- Sitemap: `{SITE_URL}/sitemap.xml`

Entities with `robots: noindex` counted in `cmsNoindexEntities`.

---

## Recommended SEO admin workflow

1. Create content (notice, download, homepage section)
2. Publish content
3. Review auto-generated SEO at `/api/v2/seo/{type}/{id}`
4. Override OG image via Media Library asset URL
5. Set `sitemap_priority` and `sitemap_changefreq` for high-value pages
6. Verify sitemap entry appears in `/api/v2/seo/sitemap`

---

## Google Discover / AI search readiness

| Requirement | Phase B status |
|-------------|----------------|
| Structured data (JSON-LD) | ✓ NewsArticle, WebPage |
| Mobile-first content API | ✓ JSON APIs for all public content |
| Canonical URLs | ✓ per entity |
| Freshness signals | ✓ `updatedAt` in sitemap |
| Image OG tags | ✓ via seo_metadata + Media Library |
| FAQ schema | Phase D (FAQ system) |
| Event schema | Phase D (Event management) |
| Breadcrumb schema | ✓ generator exists (Phase A) |

---

## Frontend SEO wiring (pending)

When frontend connects to v2 APIs:

| Page | Metadata source |
|------|-----------------|
| `/noticeboard` | `GET /api/v2/seo/page/{noticeboard-page-id}` or static + notice list |
| `/downloads` | Page-level SEO + per-download anchors |
| `/` (homepage) | `GET /api/v2/homepage` → attached `seo` object |
| Layout | `GET /api/v2/settings` for Organization JSON-LD |

Use Next.js `generateMetadata()` with v2 API responses. No changes applied in Phase B backend-only delivery.

---

## Mobile SEO verification checklist

- [ ] LCP: hero images served via CDN/cache headers on Media Library URLs
- [ ] CLS: reserve space for announcement bar height
- [ ] Touch targets: notice cards min 48px tap area
- [ ] Responsive images: `og_image_url` at 1200×630
- [ ] Performance: public APIs rate-limited, settings cached 60s
