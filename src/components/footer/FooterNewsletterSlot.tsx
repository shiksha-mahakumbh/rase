"use client";

import { useState } from "react";

/**
 * Newsletter-ready architecture — UI shell for future mailing-list integration.
 * Currently captures intent locally; wire to ESP/API when backend is ready.
 */
export default function FooterNewsletterSlot() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
    setEmail("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-saffron-dark">
        Stay Informed
      </h3>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Get programme and registration updates by email. List integration is coming soon — this form
        records your interest locally for now.
      </p>
      {status === "submitted" ? (
        <p className="text-sm text-brand-emerald" role="status">
          Thank you — we&apos;ve noted your interest. Full newsletter signup will be enabled soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="footer-newsletter-email" className="sr-only">
            Email for newsletter
          </label>
          <input
            id="footer-newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="min-h-[44px] flex-1 rounded-lg border border-slate-200 bg-brand-surface-warm px-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          />
          <button
            type="submit"
            className="min-h-[44px] rounded-lg bg-brand-saffron px-5 text-sm font-bold text-brand-navy transition hover:bg-brand-saffron-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
