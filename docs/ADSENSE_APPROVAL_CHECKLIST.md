# AdSense Approval Checklist — rase.co.in

**Policy:** Ads remain **off** until Google approves the site. Code uses `ReservedAdSlot` + `NEXT_PUBLIC_ADSENSE_ENABLED` (default unset/false).

See also: `docs/ADSENSE_READINESS_REPORT.md` (Phase 6 technical audit).

---

## Pre-application requirements

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | Production site on custom domain | **VERIFY** | `https://www.rase.co.in` |
| 2 | Privacy Policy live | **VERIFY** | `/privacy` or equivalent |
| 3 | Cookie consent before ads | **PASS** | Same gate as analytics when enabling ads |
| 4 | No ads on registration/admin/datadekh | **PASS** | No slots on user flows |
| 5 | Contact / about transparency | **VERIFY** | Introduction, Contact pages |
| 6 | Original content (not scraped) | **PASS** | Academic + SMK editorial |
| 7 | Sufficient content depth | **IN PROGRESS** | Expand Knowledge Hub + proceedings text |
| 8 | Navigation clear | **PASS** | NavBar + footer |
| 9 | CLS-safe ad slots | **PASS** | Fixed min-height reserved areas |
| 10 | HTTPS | **VERIFY** | Hosting SSL |

---

## Page-level content review

### Knowledge Hub (`/knowledge`)

| Check | Target |
|-------|--------|
| Unique excerpts per item | **PASS** (registry-driven) |
| Filter/search functional | **PASS** |
| Minimum visible articles | Add 15+ substantive hub items over time |
| No empty state as only content | Keep seed content + publications |

### Publications cluster

| Route | Depth action |
|-------|----------------|
| `/proceedings` | List volumes + abstracts (300+ words total) |
| `/journals` | Describe Viksit Bharat / Viksit India journals |
| `/books` | Compendium descriptions, not link-only |
| `/abstract` | Submission guidelines (already strong) |

### Past events (`/pastevent`, `/shikshakumbh`, edition pages)

| Check | Status |
|-------|--------|
| Historical narrative per edition | **VERIFY** expand text |
| Images optimized | **PASS** (Phase 6 `OptimizedImage` on key sliders) |
| Reserved ad slot CLS-safe | **PASS** `pastevent-mid` |

### Authority sections (`/introduction`)

| Section | AdSense suitability |
|---------|---------------------|
| Impact statistics | Supporting content |
| Past editions | **PASS** |
| Research outputs | Link to deep pages |
| Partners / government | **PASS** |
| Success stories | **PASS** (expand to 8+ over time) |
| Speakers | **PASS** (8 profiles in data after Phase 7) |

---

## Thin / duplicate content guardrails

- [ ] No two routes with identical `<title>` and meta description
- [ ] Press articles: unique body per `/PressN` page
- [ ] Avoid duplicate institution rows (fixed in `authority.ts`)
- [ ] Locale pages: canonical to primary URL until `hreflang` strategy is live
- [ ] Do not enable AdSense on placeholder-only routes

---

## Technical activation (post-approval only)

1. Google AdSense → Sites → add `www.rase.co.in` → get approval email.
2. Create ad units in AdSense dashboard; note slot IDs.
3. Set env: `NEXT_PUBLIC_ADSENSE_ENABLED=true` (and client ID vars per implementation).
4. Replace `ReservedAdSlot` placeholder with real unit markup inside `RootClientShell` gate.
5. Re-run Lighthouse on `/` and `/knowledge` — CLS must stay &lt; 0.1.
6. Monitor invalid traffic in AdSense + GA4.

---

## Slot inventory (reserved, not live)

| Slot ID | Page |
|---------|------|
| `home-mid` | Homepage |
| `home-footer` | Homepage |
| `knowledge-inline` | Knowledge Hub |
| `pastevent-mid` | Past events |
| `publications-top` | Proceedings |

---

## Sign-off before applying

| Reviewer | Date | Approved |
|----------|------|----------|
| Content lead | | |
| Tech lead | | |

**Recommendation:** Apply after Phase 7 deploy + at least **10** Knowledge Hub items with unique excerpts and expanded proceedings/journal copy.
