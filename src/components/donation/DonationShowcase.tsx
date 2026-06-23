"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import RazorpayCheckout, { type RazorpayPaymentResult } from "@/components/payments/RazorpayCheckout";
import {
  DONATION_80G,
  DONATION_HERO_IMAGE,
  DONATION_HERO_IMAGE_ALT,
  DONATION_HUB_STATS,
  DONATION_IMPACT_AREAS,
  DONATION_MIN_AMOUNT,
  DONATION_PAGE_HERO,
  DONATION_SUCCESS_LINKS,
  DONATION_TIERS,
  donation80GAddressLine,
  type DonationTierId,
} from "@/data/donation-hub";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { normalizePan } from "@/lib/schemas/donationSchema";
import { isValidPan } from "@/lib/registration/validation";

type DonationKind = "donation" | "sponsorship";

type SuccessState = {
  donationId: string;
  receiptToken: string;
  fullName: string;
  amount: number;
  email: string;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy shadow-sm outline-none transition focus:border-brand-saffron focus:ring-2 focus:ring-brand-saffron/20";

export default function DonationShowcase() {
  const [donationKind, setDonationKind] = useState<DonationKind>("donation");
  const [selectedTier, setSelectedTier] = useState<DonationTierId>("supporter");
  const [customAmount, setCustomAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<RazorpayPaymentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  const amount = useMemo(() => {
    if (selectedTier === "custom") {
      const n = Number.parseInt(customAmount.replace(/\D/g, ""), 10);
      return Number.isFinite(n) ? n : 0;
    }
    const tier = DONATION_TIERS.find((t) => t.id === selectedTier);
    return tier?.amount ?? DONATION_MIN_AMOUNT;
  }, [selectedTier, customAmount]);

  const selectedTierData = useMemo(
    () => DONATION_TIERS.find((t) => t.id === selectedTier),
    [selectedTier]
  );

  const formValid = useMemo(() => {
    const panOk = isValidPan(normalizePan(panNumber));
    const orgOk = donationKind !== "sponsorship" || organization.trim().length >= 2;
    return (
      fullName.trim().length >= 2 &&
      email.includes("@") &&
      phone.replace(/\D/g, "").length >= 10 &&
      panOk &&
      orgOk &&
      amount >= DONATION_MIN_AMOUNT
    );
  }, [fullName, email, phone, panNumber, amount, donationKind, organization]);

  const finalizeDonation = useCallback(
    async (paymentResult: RazorpayPaymentResult) => {
      setSubmitting(true);
      try {
        const res = await fetch("/api/donation/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            donationKind,
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            panNumber: normalizePan(panNumber),
            organization: organization.trim() || undefined,
            address: address.trim() || undefined,
            amount,
            tierId: selectedTier !== "custom" ? selectedTier : undefined,
            razorpayPaymentId: paymentResult.razorpay_payment_id,
            razorpayOrderId: paymentResult.razorpay_order_id,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to complete donation");
        }
        setSuccess({
          donationId: data.donationId,
          receiptToken: data.receiptToken,
          fullName: fullName.trim(),
          amount,
          email: email.trim(),
        });
        toast.success("Thank you! Your 80G receipt has been sent to your email.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not finalize donation");
      } finally {
        setSubmitting(false);
      }
    },
    [
      donationKind,
      fullName,
      email,
      phone,
      panNumber,
      organization,
      address,
      amount,
      selectedTier,
    ]
  );

  const onPaymentSuccess = useCallback(
    (result: RazorpayPaymentResult) => {
      setPayment(result);
      void finalizeDonation(result);
    },
    [finalizeDonation]
  );

  const receiptDownloadUrl = success
    ? `/api/donation/receipt?token=${success.receiptToken}`
    : "";
  const receiptPrintUrl = success
    ? `/api/donation/receipt?token=${success.receiptToken}&format=html`
    : "";

  if (success) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-xl md:p-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✓
          </div>
          <h2 className="mt-4 text-2xl font-bold text-brand-navy">Thank You, {success.fullName}!</h2>
          <p className="mt-2 text-slate-600">
            Your {donationKind === "sponsorship" ? "sponsorship" : "donation"} of{" "}
            <strong>₹{success.amount.toLocaleString("en-IN")}</strong> is confirmed.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Donation ID: <strong>{success.donationId}</strong>
          </p>
          <p className="mt-4 text-sm text-slate-600">
            An 80G-eligible receipt has been emailed to <strong>{success.email}</strong>.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={receiptDownloadUrl}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-saffron px-6 py-3 text-sm font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white"
            >
              Download Receipt (PDF)
            </a>
            <a
              href={receiptPrintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-brand-blue/30 bg-white px-6 py-3 text-sm font-bold text-brand-blue shadow-sm transition hover:bg-brand-blue/5"
            >
              Print Receipt
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Section {DONATION_80G.section} — Reg. {DONATION_80G.registrationNumber} (
            {DONATION_80G.orgLegalName})
          </p>
        </motion.div>

        <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-brand-navy">Explore the programme</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {DONATION_SUCCESS_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg border border-slate-100 px-3 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:bg-brand-surface"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 md:space-y-14 md:px-8 md:py-14">
      <HubGradientBanner
        id="donation-hub-banner"
        titleAs="h1"
        eyebrow={DONATION_PAGE_HERO.eyebrow}
        title={DONATION_PAGE_HERO.title}
        subtitle={DONATION_PAGE_HERO.subtitle}
        stats={DONATION_HUB_STATS}
      />

      <section aria-labelledby="donation-impact">
        <h2 id="donation-impact" className="text-lg font-bold text-brand-navy md:text-xl">
          Where Your Support Goes
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {DONATION_IMPACT_AREAS.map((area) => (
            <li
              key={area.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-saffron/30 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {area.icon}
              </span>
              <h3 className="mt-2 font-bold text-brand-navy">{area.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{area.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="relative overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-6 text-white shadow-xl md:p-8">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-saffron/20 blur-3xl"
            aria-hidden
          />
          <Image
            src={DONATION_HERO_IMAGE}
            alt={DONATION_HERO_IMAGE_ALT}
            width={200}
            height={200}
            className="relative mx-auto h-auto w-40 md:w-48"
          />
          <h2 className="relative mt-6 text-center text-xl font-bold md:text-2xl">
            Support Education. Shape the Future.
          </h2>
          <p className="relative mt-3 text-center text-sm leading-relaxed text-white/85">
            Your contribution powers national summits, research programmes, and outreach
            for learners across India and beyond.
          </p>
          <ul className="relative mt-6 space-y-2 text-sm text-white/90">
            <li className="flex items-start gap-2">
              <span aria-hidden>✓</span>
              <span>Secure Razorpay payment — UPI, cards &amp; net banking</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden>✓</span>
              <span>Instant 80G receipt by email</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden>✓</span>
              <span>Download or print your tax receipt anytime</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-brand-blue/15 bg-brand-surface-warm p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-saffron">
            Section {DONATION_80G.section} — Form 10AC Provisional Approval
          </p>
          <h2 className="mt-2 text-xl font-bold text-brand-navy md:text-2xl">
            Tax-Deductible Donations
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{DONATION_80G.note}</p>
          <dl className="mt-4 space-y-2 text-sm text-slate-700">
            <div>
              <dt className="font-semibold text-brand-navy">Registered trust</dt>
              <dd>{DONATION_80G.orgLegalName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">Programme supported</dt>
              <dd>{DONATION_80G.programmeName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">PAN</dt>
              <dd>{DONATION_80G.orgPan}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">80G unique registration no.</dt>
              <dd>{DONATION_80G.registrationNumber}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">Document ID</dt>
              <dd>{DONATION_80G.documentId}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">Approval date</dt>
              <dd>{DONATION_80G.approvalDate}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">Valid for</dt>
              <dd>{DONATION_80G.approvalPeriod}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">Registered address</dt>
              <dd>{donation80GAddressLine()}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-slate-500">
            PAN is mandatory on the donation form for issuing a valid 80G receipt. See our{" "}
            <Link href="/refund-policy" className="font-semibold text-brand-blue hover:underline">
              refund policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section
        id="donate-form"
        aria-labelledby="donate-form-title"
        className="rounded-3xl border border-brand-saffron/20 bg-gradient-to-b from-white to-brand-surface-warm p-5 shadow-xl md:p-8"
      >
        <h2 id="donate-form-title" className="text-xl font-bold text-brand-navy md:text-2xl">
          Donation / Sponsorship Form
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Secure payment via Razorpay · Instant 80G receipt to your email
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Donation type">
          {(["donation", "sponsorship"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              role="tab"
              aria-selected={donationKind === kind}
              onClick={() => setDonationKind(kind)}
              className={`min-h-[44px] rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                donationKind === kind
                  ? "bg-brand-navy text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-saffron"
              }`}
            >
              {kind}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DONATION_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              aria-pressed={selectedTier === tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedTier === tier.id
                  ? "border-brand-saffron bg-brand-saffron/10 shadow-md ring-2 ring-brand-saffron/40"
                  : "border-slate-200 bg-white hover:border-brand-saffron/40"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron">
                {tier.badge}
              </span>
              <p className="mt-1 font-bold text-brand-navy">{tier.name}</p>
              <p className="text-lg font-bold text-brand-blue">
                ₹{tier.amount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-slate-500">{tier.description}</p>
            </button>
          ))}
          <button
            type="button"
            aria-pressed={selectedTier === "custom"}
            onClick={() => setSelectedTier("custom")}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedTier === "custom"
                ? "border-brand-saffron bg-brand-saffron/10 shadow-md ring-2 ring-brand-saffron/40"
                : "border-slate-200 bg-white hover:border-brand-saffron/40"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron">
              Custom
            </span>
            <p className="mt-1 font-bold text-brand-navy">Other Amount</p>
            <p className="text-xs text-slate-500">Min ₹{DONATION_MIN_AMOUNT}</p>
          </button>
        </div>

        {selectedTierData && selectedTier !== "custom" && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${selectedTierData.name} tier benefits`}>
            {selectedTierData.highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-brand-saffron/30 bg-brand-saffron/10 px-3 py-1 text-xs font-semibold text-brand-navy"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        {selectedTier === "custom" && (
          <label className="mt-4 block max-w-xs">
            <span className="text-sm font-semibold text-brand-navy">Amount (INR)</span>
            <input
              type="number"
              min={DONATION_MIN_AMOUNT}
              step={100}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className={inputClass}
              placeholder={`Min ₹${DONATION_MIN_AMOUNT}`}
            />
          </label>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-brand-navy">Full Name *</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
              autoComplete="name"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-brand-navy">Email *</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-brand-navy">Mobile *</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              autoComplete="tel"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-brand-navy">
              PAN Number *{" "}
              <span className="font-normal text-slate-500">(mandatory for 80G receipt)</span>
            </span>
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className={inputClass}
              maxLength={10}
              placeholder="ABCDE1234F"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-brand-navy">
              Organization / Company {donationKind === "sponsorship" ? "*" : "(optional)"}
            </span>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-brand-navy">Address (optional, for receipt)</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputClass} min-h-[80px] resize-y`}
              rows={2}
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Total payable</p>
            <p className="text-3xl font-bold text-brand-navy">
              ₹{amount.toLocaleString("en-IN")}
            </p>
            {!formValid && (
              <p className="mt-1 text-xs text-amber-700">
                Complete all required fields including valid PAN to proceed.
              </p>
            )}
          </div>
          <RazorpayCheckout
            amountInRupees={amount}
            description={
              donationKind === "sponsorship"
                ? "Shiksha Mahakumbh Sponsorship"
                : "Shiksha Mahakumbh Donation"
            }
            receipt={`don_${Date.now()}`.slice(0, 40)}
            customerName={fullName.trim() || undefined}
            customerEmail={email.trim() || undefined}
            customerPhone={phone.trim() || undefined}
            orderNotes={{
              purpose: "donation",
              donationKind,
              email: email.trim(),
              fullName: fullName.trim(),
              panNumber: normalizePan(panNumber),
            }}
            disabled={!formValid || submitting || Boolean(payment?.verified)}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-saffron px-8 py-3 text-base font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            onSuccess={onPaymentSuccess}
          />
        </div>

        {submitting && (
          <p className="mt-4 text-center text-sm text-slate-600">
            Processing your donation and sending receipt…
          </p>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          By donating you agree to receive a tax receipt at the email provided.{" "}
          <Link href={CANONICAL_ROUTES.contact} className="font-semibold text-brand-blue hover:underline">
            Contact us
          </Link>{" "}
          for institutional partnerships ·{" "}
          <Link href="/refund-policy" className="font-semibold text-brand-blue hover:underline">
            Refund policy
          </Link>
        </p>
      </section>

      <blockquote className="rounded-2xl border border-brand-blue/10 bg-brand-blue/5 px-6 py-8 text-center">
        <p className="text-lg font-semibold italic text-brand-navy md:text-xl">
          &ldquo;Let&apos;s make Education a Sacred Movement — a Mahakumbh of Knowledge.&rdquo;
        </p>
        <footer className="mt-3 text-sm text-slate-500">
          <Link
            href={CANONICAL_ROUTES.introduction}
            className="font-semibold text-brand-blue hover:underline"
          >
            Learn about Shiksha Mahakumbh →
          </Link>
        </footer>
      </blockquote>
    </div>
  );
}
