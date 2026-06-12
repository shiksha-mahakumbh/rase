"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactUsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/v2/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          subject,
          message,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.error === "string" ? err.error : "Send failed");
      }
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="contact-form-heading"
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg md:p-8"
    >
      <h2
        id="contact-form-heading"
        className="mb-6 text-xl font-bold text-brand-navy md:text-2xl"
      >
        Send Us a Message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full min-h-[44px] rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full min-h-[44px] rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full min-h-[48px] rounded-xl bg-brand-saffron font-bold text-brand-navy transition hover:bg-brand-saffron-dark disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
        >
          {submitting ? "Sending…" : "Send Message"}
        </button>
      </form>
    </section>
  );
}
