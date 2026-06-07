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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-saffron">
        Stay Informed
      </h3>
      <p className="mb-4 text-xs leading-relaxed text-gray-400">
        Subscribe for updates on Shiksha Mahakumbh programmes, registrations,
        and academic announcements.
      </p>
      {status === "submitted" ? (
        <p className="text-sm text-emerald-400" role="status">
          Thank you. Newsletter integration coming soon — your interest is noted.
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
            className="min-h-[44px] flex-1 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
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
