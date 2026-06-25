"use client";

import { useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function FooterNewsletterSlot() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v2/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Subscription failed");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Subscription failed");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-saffron-dark">
        Stay Informed
      </h3>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Get programme and registration updates by email for Shiksha Mahakumbh 6.0.
      </p>
      {status === "success" ? (
        <p className="text-sm text-brand-emerald" role="status">
          Thank you — you&apos;re subscribed to SMK updates.
        </p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-2 sm:flex-row">
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
            disabled={status === "loading"}
            className="min-h-[44px] flex-1 rounded-lg border border-slate-200 bg-brand-surface-warm px-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="min-h-[44px] rounded-lg bg-brand-saffron px-5 text-sm font-bold text-brand-navy transition hover:bg-brand-saffron-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron disabled:opacity-60"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
          {status === "error" && errorMessage ? (
            <p className="text-xs text-red-600 sm:basis-full" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
