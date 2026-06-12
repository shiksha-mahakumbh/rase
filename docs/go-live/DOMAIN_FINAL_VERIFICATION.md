# G4 — Domain & SEO Verification (Final)

**Audit date:** 2026-05-29  
**Verdict:** ❌ **FAIL** — live traffic on `www.shikshamahakumbh.com` but SEO/canonical assets point to `www.rase.co.in`

---

## 1. Live Domain Determination

| URL | HTTP | Observation |
|-----|------|-------------|
| `https://www.shikshamahakumbh.com` | **200 OK** | **Primary live site** — serves full homepage |
| `https://shikshamahakumbh.com` | **308** → `https://www.shikshamahakumbh.com/` | Apex redirects to www (correct) |
| `https://shikshamahakumbh.org` | **No response** | Unreachable / not configured in probe |

**Actual live domain:** `https://www.shikshamahakumbh.com`

---

## 2. `robots.txt`

**URL:** `https://www.shikshamahakumbh.com/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://www.rase.co.in/sitemap.xml
```

❌ **Sitemap URL uses wrong domain** (`rase.co.in` not `shikshamahakumbh.com`).

---

## 3. `sitemap.xml`

**URL:** `https://www.shikshamahakumbh.com/sitemap.xml`

Sample entries (all observed URLs use `rase.co.in`):

```xml
<loc>https://www.rase.co.in</loc>
<loc>https://www.rase.co.in/education</loc>
```

❌ **All sitemap locs use `https://www.rase.co.in`**

Lastmod observed: `2026-06-09` — deploy appears **stale** relative to current source audit.

---

## 4. Canonical URLs (Live Homepage)

**URL:** `https://www.shikshamahakumbh.com/`

From live HTML (2026-05-29):

```html
<link rel="canonical" href="https://www.rase.co.in"/>
<meta property="og:url" content="https://www.rase.co.in"/>
<meta property="og:image" content="https://www.rase.co.in/sLogo.png"/>
<meta name="twitter:image" content="https://www.rase.co.in/sLogo.png"/>
```

❌ **Canonical and OpenGraph URLs wrong for live domain.**

---

## 5. JSON-LD URLs (Live Homepage)

Observed in page source:

```json
"url": "https://www.rase.co.in"
"logo": "https://www.rase.co.in/sLogo.png"
```

Breadcrumb / ItemList entries also use `https://www.rase.co.in/...` paths.

❌ **Structured data does not match live domain.**

---

## 6. Source Code Fallback

`src/config/site.ts`:

```typescript
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in";
```

Live production reflects either:
- `NEXT_PUBLIC_SITE_URL` still set to `https://www.rase.co.in`, **or**
- Fallback used because env not applied in deployed build

**Encrypted Vercel value:** UNKNOWN from CLI.

---

## 7. Recommended Canonical Domain

### **ONE canonical domain:** `https://www.shikshamahakumbh.com`

**Rationale:**
1. Live HTTP 200 traffic and user-facing brand domain
2. Apex `shikshamahakumbh.com` already redirects to www
3. Footer/contact copy references `www.shikshamahakumbh.com`
4. `shikshamahakumbh.org` is not serving content

**Required alignment (post-deploy, not implemented in this audit):**
- Set `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` on Production
- Redeploy so `sitemap.ts`, `robots.ts`, metadata, and JSON-LD regenerate
- Verify Search Console property for www.com
- Keep `rase.co.in` as redirect/alias if needed for legacy links

---

## 8. G4 Summary

| Check | Live status |
|-------|-------------|
| Domain resolves | ✅ www.shikshamahakumbh.com |
| robots.txt sitemap | ❌ wrong domain |
| sitemap.xml URLs | ❌ wrong domain |
| canonical link | ❌ wrong domain |
| OpenGraph URLs | ❌ wrong domain |
| JSON-LD URLs | ❌ wrong domain |

**G4 blocker:** SEO split-brain between live domain and `rase.co.in` hurts indexing and social sharing until env + redeploy.

---

*Live probes via curl. No deployment.*
