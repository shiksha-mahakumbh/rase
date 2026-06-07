# Speaker profile template

## Editorial (draft here first)

- **Full name:**
- **Title / role:** (e.g. Track Chair, Keynote)
- **Organization:**
- **Topic / track:** (one line)
- **Edition:** SMK 6.0
- **Photo:** path under `public/` or URL (optional)
- **Consent:** [ ] Written permission to publish name and photo

## TypeScript entry (`src/data/authority-speakers.ts`)

```ts
{
  name: "Dr. Example Name",
  title: "Track Chair",
  organization: "NIT Hamirpur",
  topic: "Engineering & Technology",
  edition: "SMK 6.0",
  imageSrc: "/speakers/example.webp", // optional
},
```

## Checklist

- [ ] Added to `featuredSpeakers`
- [ ] Appears in Global Search and `/knowledge` (kind: speaker)
- [ ] Introduction `#speakers` section shows card
- [ ] Build passes
