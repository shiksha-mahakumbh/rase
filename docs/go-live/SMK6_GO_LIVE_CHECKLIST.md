# SMK 6.0 Go-Live Checklist

**Event:** Shiksha Mahakumbh 6.0  
**Dates:** 9–11 October 2026  
**Venue:** NIT Hamirpur  
**Production URL:** https://www.shikshamahakumbh.com  
**Last updated:** 2026-05-29

---

## How to use

Check each item before public launch. Items marked **DEPLOY** require pushing latest code to Vercel. Items marked **MANUAL** require human verification in browser.

---

## Technical Checklist

### Build & deploy

- [ ] Local build passes: `npm run build:clean` (stop Node processes first on OneDrive)
- [ ] Prisma valid: `npx prisma validate`
- [ ] Prisma client generates on Vercel (`postinstall`)
- [ ] Latest commit deployed to Vercel production **DEPLOY**
- [ ] Rollback deploy ID recorded
- [ ] `node scripts/production-smoke-test.mjs https://www.shikshamahakumbh.com` → 10/10 PASS

### Infrastructure

- [ ] Supabase production DB connected (`DATABASE_URL`, `DIRECT_URL`)
- [ ] Supabase daily backups enabled
- [ ] Storage RLS policies applied (`storage-production.sql`)
- [ ] Domain `shikshamahakumbh.com` → Vercel canonical
- [ ] SSL certificate valid
- [ ] `node scripts/verify-env.mjs` — all required vars present on Vercel

### APIs & integrations

- [ ] `/api/health` returns `{ "status": "ok" }`
- [ ] Razorpay live keys configured (not test)
- [ ] Razorpay webhook URL registered + secret matches
- [ ] reCAPTCHA v3 site/secret keys for production domain
- [ ] Brevo SMTP sending from `noreply@shikshamahakumbh.com`
- [ ] WhatsApp API credentials (if using) **MANUAL** test send

### Security

- [ ] `npm run test` → 32/32 PASS
- [ ] `ADMIN_SESSION_SECRET` and `ADMIN_OPS_SECRET` rotated from defaults
- [ ] Admin login tested with production Supabase user
- [ ] Legacy PII export routes blocked without admin session
- [ ] Payment webhook rejects unsigned payloads (401)

### Performance

- [ ] Homepage LCP acceptable on mobile (target < 2.5s)
- [ ] Registration form loads under 3s on 4G
- [ ] No console errors on homepage / registration

---

## Content Checklist

### SMK 6.0 accuracy

- [ ] Homepage shows **6.0**, NIT Hamirpur, **9–11 Oct 2026**
- [ ] Countdown targets **2026-10-09**
- [ ] Registration hub title: **Shiksha Mahakumbh 6.0**
- [ ] `/introduction` — 6.0 dates updated (not "Upcoming") **DEPLOY**
- [ ] `/abhiyan` timeline live with edition 6.0 block **DEPLOY**
- [ ] Upcoming Events uses edition **6.0** label (not year-only "2026")
- [ ] Final event theme published (replace placeholder in SSOT)
- [ ] CMT / research submission URL confirmed for 6.0

### Branding

- [ ] No "Shiksha Kumbh" in nav, cards, or SEO headings (press archives exempt)
- [ ] Edition numbers 1.0–6.0 consistent on timeline
- [ ] Logo displays correctly (no double-encoding 404)
- [ ] Footer social links work

### Media & archives

- [ ] Edition media URLs live: `/media/shiksha-mahakumbh/{1.0–4.0}/{digital|print}` **DEPLOY**
- [ ] Legacy year URLs redirect correctly (47 redirects PASS)
- [ ] Sitemap includes edition media paths **DEPLOY**

### Legal & policies

- [ ] Privacy policy, terms, refund policy, disclaimer accessible
- [ ] Cookie policy linked from footer
- [ ] Refund policy matches Razorpay configuration

---

## Operations Checklist

### Registration

- [ ] Free category E2E in normal browser **MANUAL** (Bal Shodh Patrika)
- [ ] Paid category E2E **MANUAL** (Delegate Teacher ₹1000)
- [ ] Registration ID format SMK2026-XXXXXX
- [ ] Admin can search and view new registration
- [ ] Counter / analytics not throwing P2002 errors

### Payments

- [ ] Razorpay checkout completes on mobile
- [ ] Payment confirmation email received with QR
- [ ] Receipt PDF downloads and QR scans at check-in
- [ ] Webhook updates payment status within 60s
- [ ] Reconciliation process documented for finance team

### Event day

- [ ] Check-in page `/event/checkin` tested with sample QR **MANUAL**
- [ ] Badge/certificate generation tested for sample reg
- [ ] Accommodation assignment workflow tested
- [ ] Admin bulk export (CSV) tested
- [ ] On-call contact list distributed

### Communications

- [ ] Email templates reviewed (`EMAIL_WHATSAPP_TEMPLATE_REVIEW.md`)
- [ ] WhatsApp workflow rules configured (if used)
- [ ] Marquee / announcement bar updated for event week
- [ ] Notice board pinned items current

---

## Communications Checklist

- [ ] Launch announcement copy approved (6.0 branding)
- [ ] Social media links verified (Facebook, Instagram)
- [ ] Press page / media kit accessible
- [ ] Registration CTA links to `/registration`
- [ ] Email signature / footer includes correct dates and venue
- [ ] Volunteer and delegate comms templates ready

---

## SEO Checklist

- [ ] `/sitemap.xml` returns valid urlset (200)
- [ ] `/robots.txt` references sitemap
- [ ] Homepage meta title/description include SMK 6.0 + NIT Hamirpur
- [ ] Remove stale keywords (2025, NIPER Mohali) from global metadata **DEPLOY**
- [ ] JSON-LD Event schema dates: 2026-10-09 to 2026-10-11
- [ ] Canonical URL `https://www.shikshamahakumbh.com`
- [ ] Open Graph images load
- [ ] `/abhiyan` and `/introduction` indexed after deploy
- [ ] Google Search Console sitemap submitted
- [ ] 301 redirects verified: `node scripts/test-redirects.mjs`

---

## Launch Day Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical lead | | | |
| Content lead | | | |
| Operations lead | | | |
| Academic council rep | | | |

---

## Related Documents

| Document | Path |
|----------|------|
| Build Stability Report | `docs/go-live/BUILD_STABILITY_REPORT.md` |
| E2E Test Report | `docs/go-live/E2E_TEST_REPORT.md` |
| SMK6 Data Validation | `docs/go-live/SMK6_DATA_VALIDATION_REPORT.md` |
| Security Review | `docs/go-live/SECURITY_REVIEW_REPORT.md` |
| Backup & Recovery | `docs/go-live/BACKUP_AND_RECOVERY_GUIDE.md` |
| Email/WhatsApp Review | `docs/go-live/EMAIL_WHATSAPP_TEMPLATE_REVIEW.md` |

---

## Critical Path (minimum for launch)

1. **Deploy** latest code (Phase 5A/5B routes + data fixes)
2. **Manual** paid + free registration E2E in real browser
3. **Verify** Razorpay webhook + email delivery
4. **Confirm** Supabase backup + rollback deploy ID
5. **Fix** content gaps in SMK6 Data Validation Report (high-impact items)

**Goal:** Zero critical blockers before public SMK 6.0 launch.
