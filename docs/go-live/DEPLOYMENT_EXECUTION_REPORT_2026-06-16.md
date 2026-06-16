# Shiksha Mahakumbh 2026 — Deployment Execution Report

**Executed:** 2026-06-16 18:47 IST  
**Operator:** Automated deployment pipeline  
**Project:** `dhe-projects/rase-co-in`

---

## 1. Git & Commit

| Field | Value |
|-------|-------|
| **Commit SHA** | `fc20a361bdddbb9c8b57d4bf842e267adf764de9` |
| **Short SHA** | `fc20a36` |
| **Branch** | `main` |
| **Remote** | `origin/main` (pushed) |
| **Message** | `fix(production): final stabilization email receipt olympiad admin upload fixes` |
| **Files changed** | 35 files (+1890 / −473) |

---

## 2. Vercel Deployment

| Field | Value |
|-------|-------|
| **Deployment ID** | `dpl_5Mr9u7QZHLCLsVo5uXAPHRy8zSnc` |
| **Deployment URL** | https://rase-co-2u638e4ya-dhe-projects.vercel.app |
| **Inspector** | https://vercel.com/dhe-projects/rase-co-in/5Mr9u7QZHLCLsVo5uXAPHRy8zSnc |
| **Target** | production |
| **Status** | ● Ready |
| **Build region** | Washington, D.C. (iad1) |
| **Build duration** | ~3 minutes |
| **Build result** | ✅ PASS (Next.js 15.0.7 — compiled, 354 static pages, serverless functions created) |

### Build notes

- Prisma client generated successfully on Vercel
- Non-fatal Prisma pool timeouts during static generation (notice/menu queries) — build completed despite warnings
- Deployment protection: direct deployment URL returns 401 on `/api/health`; production aliases serve traffic normally

---

## 3. Production Aliases

| Alias | Status |
|-------|--------|
| https://www.shikshamahakumbh.com | ✅ Active |
| https://shikshamahakumbh.com | ✅ Active |
| https://www.rase.co.in | ✅ Active |
| https://rase.co.in | ✅ Active |
| https://rase-co-in.vercel.app | ✅ Active |

**Primary production URL:** https://www.shikshamahakumbh.com

---

## 4. Environment Validation

| Check | Result | Evidence |
|-------|:------:|----------|
| Health API | ✅ 200 | `{"status":"ok","service":"rase-web","version":"0.1.0"}` |
| DHE logo asset | ✅ 200 | `/images/dhe-logo.png` |
| SMK logo asset | ✅ 200 | `/images/shiksha-mahakumbh-logo.png` |
| v2 send-email disabled | ✅ 410 | `EMAIL_PATH_DISABLED` |
| Homepage | ✅ 200 | Smoke test |
| Registration hub | ✅ 200 | Smoke test |
| Admin entry | ✅ 200 | Smoke test |

### Smoke test summary (10/10 PASS)

```
health-json, robots-txt, sitemap-xml, homepage, registration,
registration-success, knowledge-hub, introduction, locale-hi-registration, admin-page
```

---

## 5. Deployed Fix Summary

- Email: single path `sendRegistrationCompleteEmail()`; v2 send-email 410; workflow duplicates removed
- Receipt SSOT: `receipt-renderer-core.ts` with DHE + SMK logos + QR in PDF
- Logos: `public/images/dhe-logo.png`, `public/images/shiksha-mahakumbh-logo.png`
- Olympiad: fee=0, XLSX upload MIME fix
- Admin View: public ID lookup + serialization
- Upload: PDF/DOCX/XLSX allowlist

---

## 6. Post-Deploy Manual Certification

| Test | Status | Evidence |
|------|:------:|----------|
| Conclave free registration | ⏳ NOT RUN | Requires browser + inbox |
| Projects ₹200 paid flow | ⏳ NOT RUN | Requires Razorpay live/test |
| Olympiad XLSX submit | ⏳ NOT RUN | Requires file upload E2E |
| Admin View registration | ⏳ NOT RUN | Requires admin auth + live reg |
| Receipt screen/print/download/email parity | ⏳ NOT RUN | Requires completed registration |
| One email only + PDF + QR attachments | ⏳ NOT RUN | Requires inbox verification |

---

*Deployment execution complete. Manual certification pending.*
