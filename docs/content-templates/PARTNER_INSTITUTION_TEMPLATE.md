# Partner / institution template

## Participating institution (logo row)

**File:** `src/data/authority.ts` → `participatingInstitutions`

```ts
{
  name: "Institution Name",
  role: "Host Institution · SMK 6.0",
  logoSrc: "/partners/institution.webp", // optional
},
```

## Partner organization (narrative)

**File:** `src/data/authority.ts` → `partnerOrganizations`

```ts
{
  name: "Organization Name",
  category: "Education", // Education | Media | CSR | Government | Industry
  description: "One sentence on collaboration scope.",
},
```

## Checklist

- [ ] MoU / partnership confirmed with communications team
- [ ] Logo rights cleared (SVG/WebP preferred)
- [ ] No duplicate institution rows unless distinct roles
