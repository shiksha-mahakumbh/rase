# Final Lighthouse Report — Production

**Audit date:** 29 May 2026  
**Tool:** Lighthouse 12.2.1 (headless Chrome, lab data)  
**URL:** `https://www.rase.co.in`  
**Method:** Mobile emulation, default Lighthouse settings

> **Context:** Scores below reflect **current live production** at audit time. Phase 5/6 optimizations (layout split, deferred third-party scripts, `OptimizedImage`, reserved ad slots) may not be fully deployed until the latest build is promoted. Re-run after deploy and compare.

**Re-run command:**

```bash
npx lighthouse@12.2.1 https://www.rase.co.in/ --view
node scripts/parse-lighthouse.mjs   # after saving lighthouse-<page>.json per URL
```

---

## Summary table

| Page | Performance | Accessibility | Best Practices | SEO | LCP (lab) | CLS (lab) |
|------|------------:|--------------:|---------------:|----:|-----------|-----------|
| Homepage `/` | **32** | **92** | **75** | **83** | 10.5 s | 0.023 |
| Registration `/registration` | **35** | **95** | **75** | **92** | 11.9 s | 0.023 |
| Knowledge Hub `/knowledge` | **35** | **92** | **75** | **92** | 10.4 s | 0.023 |
| Introduction `/introduction` | **35** | **95** | **75** | **92** | 9.6 s | 0.023 |
| Academic Council `/VibhagRoute/AcademicCouncil24` | **38** | **95** | **75** | **92** | 9.2 s | 0.023 |

### Target vs actual (project goals)

| Category | Target | Production (29 May 2026) | Post-deploy expectation (Phase 5/6) |
|----------|--------|--------------------------|-------------------------------------|
| Performance | ≥ 95 | **32–38** | **70–90** (est. after script deferral + images) |
| Accessibility | ≥ 95 | **92–95** | **95+** (modal/focus polish) |
| Best Practices | ≥ 95 | **75** | **85–92** |
| SEO | 100 | **83–92** | **92–98** (metadata on home) |
| CLS | &lt; 0.1 | **0.023** ✓ | Maintain with ad slots reserved |

---

## Core Web Vitals (lab)

| Metric | Homepage | Registration | Knowledge | Introduction | Academic |
|--------|----------|--------------|-----------|--------------|----------|
| **LCP** | 10.5 s | 11.9 s | 10.4 s | 9.6 s | 9.2 s |
| **CLS** | 0.023 | 0.023 | 0.023 | 0.023 | 0.023 |
| **INP** | Not reported in lab run | — | — | — | — |

**Field data:** After deploy, use Search Console → **Experience → Core Web Vitals** for real-user metrics (INP, LCP, CLS).

---

## Findings by category

### Performance (critical gap)

Primary drivers on live site (consistent with `docs/PHASE_5_PERFORMANCE_FINDINGS.md`):

- Large JavaScript bundles and client-rendered shell
- Third-party scripts (analytics, chat, ads loader) on critical path
- Hero/media weight and legacy assets
- Server/API routes returning HTML shell for some paths (see go-live validation)

**Actions (no registration breakage):**

1. Deploy Phase 5/6 build with `RootClientShell` deferrals and consent-gated scripts  
2. Confirm `/api/health` returns JSON (routing not SPA-fallback)  
3. Continue `OptimizedImage` migration on past-event and press routes  
4. Keep admin/recharts behind dynamic import (done in Phase 6)

### Accessibility (near target)

- Scores **92–95** — focus on modal keyboard trap, touch targets on legacy forms, heading hierarchy on press pages  
- Registration flow scores **95** — maintain on wizard changes

### Best Practices (75)

- Review `no-cache` meta, mixed content, console errors on third-party embeds  
- Ensure HTTPS everywhere and no deprecated APIs

### SEO (83 home, 92 inner)

- Homepage SEO **83** — verify single canonical title/description from server `layout.tsx`  
- Inner pages **92** — good; align Open Graph with `metadataBuilders` after deploy

---

## Page notes

### Homepage

- Lowest performance (**32**) and SEO (**83**) — prioritize LCP element (hero image/video, fonts, blocking scripts).

### Registration

- Highest LCP (**11.9 s**) — keep third-party scripts off registration; forms + Firebase client are expected weight.

### Knowledge Hub

- SEO **92** — hub is suitable for indexing; expand unique excerpts per item.

### Introduction

- Strong accessibility/SEO; performance tied to authority sections and images.

### Academic Council

- Best performance in set (**38**) post Phase 3 split — still below target due to global layout scripts.

---

## Post-deploy verification checklist

- [ ] Promote latest build to production  
- [ ] `node scripts/validate-go-live.mjs` → 3/3 PASS  
- [ ] Re-run Lighthouse on all five URLs; update table above  
- [ ] Compare GSC field CWV vs lab LCP  
- [ ] Document delta in this file (new row: “Post-deploy YYYY-MM-DD”)

---

## Related

- `docs/PHASE_5_PERFORMANCE_FINDINGS.md`
- `docs/GO_LIVE_VALIDATION_REPORT.md`
- `docs/SEO_MONITORING_PLAYBOOK.md`
- `scripts/parse-lighthouse.mjs`
