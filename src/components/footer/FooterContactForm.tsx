"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { getCaptchaTokenForAction } from "@/lib/security/recaptcha-client";

const RecaptchaScript = dynamic(
  () => import("@/components/security/RecaptchaProvider"),
  { ssr: false }
);

interface FooterContactFormProps {
  variant?: "light" | "dark";
}

export default function FooterContactForm({
  variant = "dark",
}: FooterContactFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [captchaArmed, setCaptchaArmed] = useState(false);

  const armCaptcha = () => {
    if (!captchaArmed) setCaptchaArmed(true);
  };

  const isDark = variant === "dark";
  const inputClass = isDark
    ? "w-full rounded-lg border border-white/20 bg-white/10 p-2.5 text-sm text-white placeholder:text-gray-500 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
    : "w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron";
  const buttonClass = isDark
    ? "w-full rounded-lg bg-brand-saffron py-2.5 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-saffron-dark disabled:opacity-60"
    : "w-full rounded-lg bg-brand-saffron py-2.5 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-saffron-dark disabled:opacity-60";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    armCaptcha();
    setSubmitting(true);
    try {
      const captchaToken = await getCaptchaTokenForAction("contact");
      if (!captchaToken) {
        toast.error("Security verification failed. Please try again.");
        return;
      }

      const res = await fetch("/api/v2/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captchaToken,
          fullName: "Website visitor (footer)",
          email,
          message,
          subject: "Footer contact",
        }),
      });
      if (!res.ok) {
        throw new Error("Send failed");
      }
      setEmail("");
      setMessage("");
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3" onFocus={armCaptcha}>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
          aria-label="Your email"
        />
        <textarea
          rows={2}
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          required
          aria-label="Your message"
        />
        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting ? "Sending…" : "Send Message"}
        </button>
      </form>
      {captchaArmed ? <RecaptchaScript /> : null}
    </>
  );
}
