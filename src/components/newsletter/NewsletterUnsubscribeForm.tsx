"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getCaptchaTokenForAction } from "@/lib/security/recaptcha-client";

const RecaptchaScript = dynamic(
  () => import("@/components/security/RecaptchaProvider"),
  { ssr: false }
);

type SubmitState = "idle" | "loading" | "success" | "error";

export default function NewsletterUnsubscribeForm({
  initialEmail = "",
  initialToken = "",
}: {
  initialEmail?: string;
  initialToken?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [token] = useState(initialToken);
  const [website, setWebsite] = useState("");
  const [captchaArmed, setCaptchaArmed] = useState(false);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const armCaptcha = () => {
    if (!captchaArmed && !token) setCaptchaArmed(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    armCaptcha();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      let captchaToken: string | undefined;
      if (!token) {
        captchaToken = (await getCaptchaTokenForAction("newsletter_unsubscribe")) ?? undefined;
        if (!captchaToken) {
          throw new Error("Security verification failed");
        }
      }

      const res = await fetch("/api/v2/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          token: token || undefined,
          captchaToken,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Unsubscribe failed");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unsubscribe failed");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-emerald/30 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-bold text-brand-navy">You&apos;re unsubscribed</p>
        <p className="mt-2 text-sm text-slate-600">
          We will no longer send programme updates to this address.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-6 text-sm font-bold text-white"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      onFocus={armCaptcha}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      {captchaArmed ? <RecaptchaScript /> : null}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <label htmlFor="unsubscribe-email" className="block text-sm font-semibold text-brand-navy">
        Email address
      </label>
      <input
        id="unsubscribe-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "loading"}
        className="mt-2 w-full min-h-[44px] rounded-lg border border-slate-200 px-3 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 min-h-[44px] rounded-lg bg-brand-navy px-6 text-sm font-bold text-white hover:bg-brand-navy-light disabled:opacity-60"
      >
        {status === "loading" ? "Processing…" : "Unsubscribe"}
      </button>
      {status === "error" && errorMessage ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
