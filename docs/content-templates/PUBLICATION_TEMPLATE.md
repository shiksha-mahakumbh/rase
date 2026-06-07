# Publication template

## Editorial

- **Title:**
- **Type:** Proceedings | Journal | Book | Patrika | Policy Brief
- **Edition / year:**
- **Abstract (2–3 sentences):**
- **Canonical URL:** `/proceedings` | `/journals` | `/books` | custom
- **ISBN / DOI:** (if applicable)
- **Download:** PDF link in `public/` or external

## Knowledge Hub entry (`src/lib/ecosystem/registries.ts`)

```ts
{
  id: "pub-unique-id",
  slug: "url-slug",
  kind: "publication",
  title: "Volume Title",
  excerpt: "Two-sentence summary for search cards.",
  tags: ["proceedings", "SMK 5.0"],
  category: "research",
  publishedAt: "2024-06-01",
  href: "/proceedings",
  featured: false,
},
```

## Page depth (AdSense / SEO)

- Minimum **300+ words** of unique text on the destination page
- Avoid duplicate excerpts across multiple URLs
- Link from Knowledge Hub and Introduction research section
