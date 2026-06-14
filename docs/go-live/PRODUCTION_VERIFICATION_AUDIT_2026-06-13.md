# Production Verification Audit — https://www.shikshamahakumbh.com

**Audited:** 13 June 2026 (UTC)  
**Deployment commit (local):** `73047b7` (pushed to `main`)  
**Method:** Live HTTP probes, JS bundle analysis, Playwright screenshots, read-only API audit (`scripts/_registration-e2e-audit.mjs`)

---

## GO / NO GO Verdict

### **CONDITIONAL GO**

Registration/payment **code fixes are LIVE** on production (bundle + UI evidence). Security controls pass. Multi Track consolidation is live on the registration hub and legacy routes redirect to CMT.

**Full GO is blocked** until manual end-to-end checks complete for: payment-step latency, free-student skip flow, live Razorpay settlement → `payment_records`, registration submit → `email_logs.sent`, and homepage hero CTA cleanup.

---

## PASS / FAIL Matrix

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1 | Payment step opens immediately after Continue | **MANUAL PENDING** | `setCurrentFee` + fee-aware payment gating in prod bundle (`98838-*.js`); timing requires browser stopwatch test |
| 2 | Free Student Delegate skips payment | **MANUAL PENDING** | `Student (Free)` + `setCurrentFee` in bundle; delegate sidebar shows "Student: Free" (`02-registration-delegate.png`); full flow not executed |
| 3 | Project fees ₹200 / ₹400 | **PASS (bundle)** | Strings "School Student", "College Student", `200`, `400` in registration chunks |
| 4 | Accommodation ₹3000 / ₹6000 | **PASS (bundle)** | "Single Bed", "Double Bed", `3000`, `6000`, `ACCOMMODATION_*` in registration chunks |
| 5 | Phone digits only | **PASS (bundle)** | `inputMode` + `numeric` in registration form chunk |
| 6 | PAN optional &lt; ₹2000, mandatory ≥ ₹2000 | **PASS** | `ABCDE1234F`, `2000` threshold in chunk `95113-*.js`; sidebar "PAN (if fee ≥ ₹2000)" in screenshot |
| 7 | Instructions panel for every category | **PASS** | Sidebar shows Fee, Documents Required, Important Notes (`02-registration-delegate.png`); `Eligibility`, `Instructions`, `Documents Required` in prod bundle |
| 8 | Success page: Download + Print only | **PASS** | `03-success-page.png` — only "Download receipt" and "Print receipt"; no calendar/share in bundle or UI |
| 9 | DHE receipt + print receipt only | **PASS (bundle)** | Success page chunk has `registration-receipt`, `@media print`, `Registration Fee Receipt`, `Authorized Signature`, `Department of Holistic Education` |
| 10 | Multi Track Conference only (registration) | **PASS** | Category grid (`06-category-grid.png`) — MTC card only; CMT redirect text; config chunk: `EXTERNAL_REDIRECT_TYPES=["Multi Track Conference"]` |
| 11 | Paper Submission removed | **PASS (hub)** | Not in category grid; `/paper` → 307 CMT |
| 12 | Abstract Submission removed | **PASS (hub)** | Not in category grid; `/abstract` → 307 CMT |
| 13 | Full Length Paper removed | **PASS** | Not in category grid; `/fulllengthpaper` → 307 CMT |
| 14 | Call For Papers removed | **PASS (hub/nav)** | Not in category grid or nav config chunk (0 occurrences "Call for Papers") |
| 15 | Research nav → Multi Track only | **PASS (bundle)** | Nav chunk: `Multi Track Conference` + `cmt3.research.microsoft.com`; 0× "Abstract Submission" in nav chunk |
| 16 | About section no paper links | **PASS** | `/introduction` HTML: no legacy paper strings |
| 16b | Homepage hero still has "Submit Paper" | **FAIL** | `04-homepage-hero.png` / HTML: `<a href="/abstract">Submit Paper</a>` in `HeroSection.tsx` |
| 17 | Email queue → email_logs sent | **MANUAL PENDING** | `sendRegistrationConfirmation` + queue in deployed API; requires test registration + DB query |
| 18 | Razorpay checkout + payment_records | **PARTIAL** | `POST /api/payments/create-order` → **200** with live key `rzp_live_*`; checkout UI + DB row needs live payment test |
| 19 | SMK2026 ID on submit | **MANUAL PENDING** | Success page displays `SMK2026-000001` format; new ID requires completed registration |
| 20 | Security: lookup 401 | **PASS** | `GET /api/registration/SMK2026-000001` → **401** |
| 20 | Security: admin gateway 401 | **PASS** | `GET /api/admin/gateway/registrations` → **401** |
| 20 | Security: webhook 401 | **PASS** | `POST /api/payments/razorpay-webhook` `{}` → **401** Invalid signature |

---

## Screenshots

Captured to `docs/go-live/prod-verification-screenshots/`:

| File | Description |
|------|-------------|
| `01-registration-hub.png` | Step 1 — Multi Track / CMT messaging |
| `02-registration-delegate.png` | Delegate form + instructions sidebar (Fee, PAN rules) |
| `03-success-page.png` | Success — Download/Print receipt only |
| `04-homepage-hero.png` | Welcome modal (Submit Paper behind modal on hero) |
| `05-research-nav.png` | Homepage with nav visible |
| `06-category-grid.png` | Full category list — no Paper/Abstract/CFP |

---

## API / Route Probes (automated)

```
/registration                          200
/abstract                              307 → cmt3.research.microsoft.com/SMK2026/
/paper                                 307 → CMT
/fulllengthpaper                       307 → CMT
/api/v2/health                         200 (supabase connected)
/api/payments/create-order             200 (live Razorpay order created)
```

Full JSON: run `node scripts/_registration-e2e-audit.mjs`

---

## Remaining Blockers

1. **Homepage CTA regression** — `HeroSection.tsx` and `HomeFaqSection.tsx` still link to `/abstract` as "Submit Paper" / "Submit abstract". Route redirects to CMT, but copy violates cleanup spec.
2. **Manual payment E2E** — Confirm payment step &lt;1s, free student skips Razorpay, Razorpay modal opens, `payment_records` row created.
3. **Manual email E2E** — Complete registration → verify inbox + `SELECT * FROM email_logs WHERE registration_id = '...' AND status = 'sent'`.
4. **Print receipt visual** — Browser print preview not captured; bundle confirms print-only CSS.

---

## Recommended Next Actions

1. Fix homepage hero + FAQ links → CMT or "Multi Track Conference" label.
2. Run one paid test (Projects ₹200) and one free test (Student Delegate) on production.
3. Query Supabase: `email_logs`, `payment_records`, `registrations` for test IDs.
4. Re-run this audit after homepage fix → upgrade to **FULL GO**.

---

*Automated audit only — no production data modified.*
