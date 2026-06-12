# Final Global Reach Plan

**Date:** May 2026  
**Current:** 80 · **Target:** 95 · **Languages:** en + hi (active), ar/fr/es (future)

---

## Architecture (final)

```
┌─────────────────────────────────────────────────┐
│  next-intl routing: /[locale]/*                 │
│  ContentLocale on all CMS entities              │
│  SiteSetting per locale (en, hi, future)        │
│  SeoMetadata per locale per entity              │
│  hreflang en-IN ↔ hi-IN on paired routes       │
└─────────────────────────────────────────────────┘
```

---

## Language matrix

| Language | Code | Routes | CMS | Admin UI | Score |
|----------|------|--------|-----|----------|------:|
| English | en-IN | Default 150+ | ✅ | ✅ | 95 |
| Hindi | hi-IN | 4 + homepage | ⚠️ Loader ready | ⚠️ No locale tabs | 65 |
| French | fr | Config only | Schema ready | — | 5 |
| Spanish | es | Config only | Schema ready | — | 5 |
| Arabic | ar | Config only | RTL ready | — | 5 |

---

## Locale route strategy (final)

| Pattern | Example |
|---------|---------|
| Default English | `/noticeboard` |
| Hindi prefix | `/hi/noticeboard` (to build) |
| Locale homepage | `/hi` |
| hreflang pairs | Documented in `hreflang.ts` |

### Routes requiring Hindi equivalents (P1)

1. `/` ↔ `/hi` ✅
2. `/noticeboard` ↔ `/hi/noticeboard`
3. `/downloads` ↔ `/hi/downloads`
4. `/introduction` ↔ `/hi/introduction` ✅
5. Legal pages (5)

---

## Database requirements

| Requirement | Status |
|-------------|--------|
| `ContentLocale` enum | ✅ en, hi |
| Unique slug per locale | ✅ Page, Notice, Menu |
| SiteSetting per locale | ✅ |
| SeoMetadata per locale | ✅ |
| Hindi seed data | ❌ Needed |
| Extend enum for ar/fr/es | Future migration |

---

## CMS requirements

| Feature | Priority |
|---------|----------|
| Locale tabs on all admin editors | P1 |
| Independent publish per locale | P1 |
| Fallback chain (hi → en) | P2 |
| Translation workflow status | P3 |
| RTL layout for Arabic | P3 |
| Admin UI i18n | P4 |

---

## International SEO

| Item | Action |
|------|--------|
| hreflang on all CMS pages | P1 |
| Hindi meta descriptions | P1 |
| `inLanguage` in JSON-LD | ✅ WebSite |
| Geo targeting India primary | GSC setting |
| UTM campaign tracking | ✅ analytics |

---

## Roadmap to 95

| Phase | Weeks | Score |
|-------|------:|------:|
| Current (Phase S) | — | 80 |
| Hindi seed + 3 routes | 2 | 88 |
| Admin locale tabs | 2 | 92 |
| Full Hindi content top-10 pages | 4 | 95 |
| ar/fr/es enum extension | 8 | 98 infra |

---

## Timezone & regional

| Setting | Value |
|---------|-------|
| Default timezone | Asia/Kolkata |
| Date display | Locale-aware formatter |
| Event dates | IST with UTC storage |
| Currency display | INR only (Razorpay unchanged) |

**Status: PLAN ONLY**
