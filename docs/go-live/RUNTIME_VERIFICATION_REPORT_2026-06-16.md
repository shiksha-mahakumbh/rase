# Runtime Verification Report — Post-Deploy

**Date:** 2026-06-16  
**Production URL:** https://www.shikshamahakumbh.com  
**Commit:** `fc20a36`

---

## Automated Runtime Checks (Executed)

| # | Check | Method | Result |
|---|-------|--------|:------:|
| 1 | Site health | GET `/api/health` | ✅ PASS |
| 2 | Registration page loads | GET `/registration` | ✅ PASS |
| 3 | Success page loads | GET `/registration/success` | ✅ PASS |
| 4 | DHE logo served | HEAD `/images/dhe-logo.png` | ✅ PASS (200) |
| 5 | SMK logo served | HEAD `/images/shiksha-mahakumbh-logo.png` | ✅ PASS (200) |
| 6 | Email path disabled | POST `/api/v2/registration/send-email` | ✅ PASS (410) |
| 7 | Admin entry | GET `/admin` | ✅ PASS |
| 8 | Hindi registration | GET `/hi/registration` | ✅ PASS |
| 9 | Sitemap / robots | GET | ✅ PASS |
| 10 | Homepage content | GET `/` | ✅ PASS |

**Automated score: 10/10 PASS**

---

## Manual E2E Checklist (Not Executed — No Runtime Evidence)

### Free Registration — Conclave

| Step | Verified |
|------|:--------:|
| Registration saved | ⏳ |
| Admin visible | ⏳ |
| One email only | ⏳ |
| receipt.pdf attached | ⏳ |
| qr.png attached | ⏳ |

### Paid Registration — Projects School Student ₹200

| Step | Verified |
|------|:--------:|
| Continue To Payment | ⏳ |
| Razorpay opens | ⏳ |
| Payment success → Step 3 | ⏳ |
| Submit → saved | ⏳ |
| Admin visible | ⏳ |
| One email, PDF + QR | ⏳ |

### Olympiad

| Step | Verified |
|------|:--------:|
| XLSX upload | ⏳ |
| Submit (no payment) | ⏳ |
| Email received | ⏳ |
| Admin visible | ⏳ |

### Admin

| Step | Verified |
|------|:--------:|
| Registrations list | ⏳ |
| View registration | ⏳ |
| Uploaded files visible | ⏳ |

### Receipt Parity

| Output | DHE logo | SMK logo | QR | Same data |
|--------|:--------:|:--------:|:--:|:---------:|
| Screen | ⏳ | ⏳ | ⏳ | ⏳ |
| Print | ⏳ | ⏳ | ⏳ | ⏳ |
| Download PDF | ⏳ | ⏳ | ⏳ | ⏳ |
| Email PDF | ⏳ | ⏳ | ⏳ | ⏳ |

---

## Runtime Verdict

**Automated production checks: PASS**  
**Manual registration/email/receipt E2E: PENDING — no inbox or payment evidence collected**
