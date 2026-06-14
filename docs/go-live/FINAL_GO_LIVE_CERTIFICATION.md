# FINAL GO-LIVE CERTIFICATION — Shiksha Mahakumbh 2025

**Production URL:** https://www.shikshamahakumbh.com  
**Certification run:** 13 June 2026 (UTC)  
**Evidence source:** Fresh production probes only (this run)  
**Local Task 1 fixes:** Implemented in repo — **not yet deployed to production**

---

## Final Verdict: **NO GO**

Production registration UX, security, and free-delegate payment skip are largely working. **Email delivery is failing** (no `email_logs` rows; `emailDeliveryStatus: failed` on recent registrations). **Homepage still shows “Submit Paper”** on the live site. **Full paid Projects E2E** and **fresh registration IDs from this audit** were not completed (reCAPTCHA + no live payment in automated run).

Deploy Task 1 cleanup + fix SMTP, then re-run manual payment/email tests before FULL GO.

---

## PASS / FAIL Matrix

| # | Requirement | Result | Fresh evidence |
|---|-------------|--------|----------------|
| **1** | Payment step opens in &lt;1s | **MANUAL PENDING** | Projects timing probe failed (UI selector timeout). Bundle contains `setCurrentFee`. |
| **2** | Free Student Delegate skips payment | **PASS (UI)** | Step **2 of 2**; green banner “No payment required… Submit directly”; no “Continue for Payment” (`02-delegate-student-free.png`). Full submit not executed (reCAPTCHA). |
| **3** | Projects School ₹200 / College ₹400 | **PASS (bundle)** | `School Student`, `College Student`, `200`, `400` in prod registration JS. UI fee labels not screenshot-verified (Projects click timeout). |
| **4** | Accommodation ₹3000 / ₹6000 | **PASS (bundle)** | `Single Bed`, `Double Bed`, `3000`, `6000` in prod bundles. |
| **5** | Phone digits only | **PASS (bundle)** | `inputMode` present in registration chunks. |
| **6** | PAN rules | **PASS (bundle + UI)** | `ABCDE1234F`, ₹2000 threshold in bundle; sidebar “PAN (if fee ≥ ₹2000)” on delegate form. |
| **7** | Instructions panel all categories | **PASS (UI)** | Sidebar: Instructions, Fee, Eligibility, Documents Required, Important Notes (`02-delegate-student-free.png`). |
| **8** | Success: Download + Print only | **PASS** | `04-success-receipt-buttons.png`; probe: `addToCalendar: false`, download/print true. |
| **9** | DHE receipt + print-only | **PASS (bundle + UI)** | Success chunk: `#registration-receipt`, `@media print`, “Registration Fee Receipt”. Visual PDF not opened in audit. |
| **10** | Multi Track Conference only (registration hub) | **PASS** | Category grid (prior audit `06-category-grid.png`): MTC only for conference; CMT redirect text. |
| **11–14** | Paper / Abstract / Full Length / CFP removed (hub) | **PASS (hub)** | 0× “Paper Submission”, “Abstract Submission”, “Call for Papers” in registration HTML/bundles. |
| **15** | Research nav → Multi Track only | **PASS (bundle)** | Nav chunk: `Multi Track Conference` + CMT; 0× “Abstract Submission” in nav chunk (prior run). |
| **16** | About section clean | **PASS** | `/introduction` — no legacy paper strings (prior HTTP probe). |
| **16b** | Homepage / hero clean | **FAIL (prod)** | Live homepage bundle + UI: **`Submit Paper` still present** (`01-homepage.png`, `bundleStrings.Submit Paper: true`). **Fixed locally, not deployed.** |
| **17** | Email → `email_logs.status = sent` | **FAIL** | DB snapshot: **`email_logs` table empty**; recent registrations `emailDeliveryStatus: "failed"`. |
| **18** | Razorpay + `payment_records` | **PARTIAL** | `POST /api/payments/create-order` → **200** (`order_T1DwVMzp0wW11v`, live key). DB: 1 payment row `pay_T18JCcwJNxqVoi` ₹1000 (delegate, not Projects). No fresh payment in this audit. |
| **19** | SMK2026 ID + counter | **PARTIAL** | Counter `lastNumber: 4`; latest ID `SMK2026-000004`. No new ID created during this audit run. |
| **20** | Security 401s | **PASS** | Lookup **401**, admin gateway **401**, webhook **401** (`final-certification-results.json`). |

---

## Task 1 — Paper reference cleanup

### Production (current live site)
| Check | Result |
|-------|--------|
| “Submit Paper” on homepage | **FAIL** — still in live bundle/UI |
| “Abstract Submission” in public nav | **PASS** — not in nav chunk |
| Legacy routes `/abstract`, `/paper` | Redirect **307** → `https://cmt3.research.microsoft.com/SMK2026/` (old CMT path on prod) |
| Registration category grid | **PASS** — no Paper/Abstract/CFP cards |

### Local codebase (ready to deploy)
| Area | Status |
|------|--------|
| `HeroSection.tsx` | **Fixed** → “Multi Track Conference” → CMT |
| `HomeFaqSection.tsx` | **Fixed** |
| `EventTracksSection.tsx` | **Fixed** |
| `DiscoverStrip`, `authority.ts`, `education-pillars`, `registry`, `content-map` | **Fixed** |
| `config.ts` CMT URL | **Updated** → `https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/` |
| `sitemap.ts` | Removed `abstract`, `paper`, `fulllengthpaper` |
| Public `src/components/**` | **0** matches for Submit Paper / Abstract Submission / CFP |

**Remaining in repo (internal legacy admin only):** `*datadekh*` pages, `AbstractSubmission.tsx`, `FulllengthPaper.tsx` — not linked from public nav.

---

## Registration proof (Task 2)

**Automated UI test — Delegate / Student (Free)**

| Check | Observed |
|-------|----------|
| Fee | Sidebar: “Student: Free” |
| Payment step | **Skipped** — “Step 2 of 2” (not 3) |
| Payment UI | No Razorpay / “Continue for Payment” |
| Submit CTA | “Submit Registration” with green “No payment required” banner |
| New registration ID | **Not created** — submit not clicked (production reCAPTCHA) |
| Counter before/after | Before: `lastNumber: 4` — After: **unchanged** (no submit) |

**Screenshot:** `docs/go-live/final-certification-screenshots/02-delegate-student-free.png`

---

## Payment proof (Task 3)

| Check | Result |
|-------|--------|
| Razorpay create-order API | **200** — `order_T1DwVMzp0wW11v`, amount 20000 paise, `rzp_live_Sz5hsyGHWPtgbT` |
| Projects ₹200 UI flow | **Not completed** — Playwright could not reach Projects category (timeout) |
| `payment_records` (DB) | **1 row** — Delegate ₹1000, `pay_T18JCcwJNxqVoi`, status `Paid`, 2026-06-13 |
| Fresh Projects payment | **Not performed** in this audit |

---

## Email proof (Task 4)

**Database snapshot** (`scripts/_db-certification-snapshot.mjs`):

```json
{
  "emails": [],
  "recent_emailDeliveryStatus": ["failed", "failed", "failed", null]
}
```

| Check | Result |
|-------|--------|
| `email_logs` rows | **0 rows** returned |
| Recent registration email status | **failed** on SMK2026-000002, -000003, -000004 |
| Inbox delivery | **Not verified** — no sent logs |
| SMTP | **Likely misconfigured or failing** — queue writes but no sent records |

**Blocker:** Fix `SMTP_*` / Brevo on Vercel production; confirm `email_logs` receives rows and reaches `sent`.

---

## Receipt proof (Task 5)

**Probe** (`scripts/_success-page-probe.mjs`):

| Metric | Value |
|--------|-------|
| Receipt buttons visible | Download + Print only |
| Add to Calendar | **Absent** |
| Receipt ready time | **454 ms** (target &lt;1s) **PASS** |

**Screenshot:** `docs/go-live/final-certification-screenshots/04-success-receipt-buttons.png`

Print-only CSS confirmed in success page bundle (`#registration-receipt`, `@media print`). PDF download not binary-verified in this run.

---

## Performance metrics (Task 6)

| Metric | Target | Measured | Result |
|--------|--------|----------|--------|
| Continue → Payment visible | &lt;1s | **Not measured** (Projects step failed) | **PENDING** |
| Payment success → Registration success | &lt;3s | **Not measured** (no live payment) | **PENDING** |
| Success page → Receipt ready | &lt;1s | **454 ms** | **PASS** |

---

## Security (Task 20)

| Endpoint | Status |
|----------|--------|
| `GET /api/registration/SMK2026-000001` | **401** |
| `GET /api/admin/gateway/registrations` | **401** |
| `POST /api/payments/razorpay-webhook` | **401** |

---

## Screenshots (this certification run)

| File | Content |
|------|---------|
| `final-certification-screenshots/01-homepage.png` | Homepage — modal (Submit Paper behind modal on live site) |
| `final-certification-screenshots/02-delegate-student-free.png` | Free student delegate — no payment step |
| `final-certification-screenshots/04-success-receipt-buttons.png` | Success — Download + Print receipt only |

Machine-readable: `docs/go-live/final-certification-results.json`

---

## Remaining blockers (must clear for FULL GO)

1. **Deploy Task 1 cleanup** — remove live “Submit Paper”; update CMT URL to `ShikshaMahakumbh2025` on production redirects.
2. **Fix email delivery** — SMTP/Brevo env on Vercel; verify `email_logs.status = sent` after test registration.
3. **Manual paid E2E** — Projects School ₹200: Razorpay test payment → confirm `payment_records` + success &lt;3s.
4. **Manual free delegate submit** — complete form with reCAPTCHA → confirm new `SMK2026-*` ID and counter increment.
5. **Payment step latency** — stopwatch “Continue for Payment” on Projects/Delegate paid (&lt;1s target).

---

## Recommended sequence to reach FULL GO

1. `git push` + `npx vercel --prod` (Task 1 + CMT URL).
2. Set/verify Vercel production: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
3. Register test free student delegate → check email + `email_logs`.
4. Register test Projects ₹200 with Razorpay → check `payment_records`.
5. Re-run: `node scripts/final-go-live-certification.mjs`

---

*Certification performed against live production. Local code changes for Task 1 are implemented but not included in this production evidence until deployed.*
