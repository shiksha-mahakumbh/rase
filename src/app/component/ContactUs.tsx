"use client";

import React, { useState } from "react";
import Link from "next/link";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  DHE_ORGANIZATION,
  DHE_MAP_EMBED_URL,
  DHE_MAP_LINK,
} from "@/config/organization";
import { db } from "@/app/firebase";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";

const contactCards = [
  {
    id: "address",
    icon: "📍",
    title: "Office Address",
    content: (
      <address className="not-italic leading-relaxed text-gray-700">
        {DHE_ORGANIZATION.name}
        <br />
        {DHE_ORGANIZATION.address.line1}
        <br />
        {DHE_ORGANIZATION.address.line2},
        <br />
        {DHE_ORGANIZATION.address.line3},
        <br />
        {DHE_ORGANIZATION.address.state} {DHE_ORGANIZATION.address.pincode}
      </address>
    ),
  },
  {
    id: "email",
    icon: "📧",
    title: "Email",
    content: (
      <ul className="space-y-1">
        {DHE_ORGANIZATION.emails.map((email) => (
          <li key={email}>
            <a
              href={`mailto:${email}`}
              className="font-medium text-brand-navy hover:text-brand-saffron-dark hover:underline"
            >
              {email}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "phone",
    icon: "📞",
    title: "Phone / WhatsApp",
    content: (
      <ul className="space-y-1">
        {DHE_ORGANIZATION.phones.map((phone) => (
          <li key={phone}>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="font-medium text-brand-navy hover:text-brand-saffron-dark hover:underline"
            >
              {phone}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "website",
    icon: "🌐",
    title: "Website",
    content: (
      <ul className="space-y-1">
        {DHE_ORGANIZATION.websites.map((site) => (
          <li key={site.href}>
            <a
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-navy hover:text-brand-saffron-dark hover:underline"
            >
              {site.label}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
] as const;

const ContactUs: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        name,
        email,
        subject,
        message,
        timestamp: new Date(),
        source: "contact-page",
      });
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
    <div className="min-h-screen bg-gradient-to-b from-brand-surface via-white to-brand-surface-warm">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy px-4 py-14 text-white md:py-20"
        aria-labelledby="contact-hero-title"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-saffron/15 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.h1
            id="contact-hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold md:text-5xl"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg"
          >
            Shiksha Mahakumbh Abhiyan Administrative Office — Event Management
            Cell, {DHE_ORGANIZATION.name}
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Contact Us" },
          ]}
          className="mb-8"
        />

        {/* Contact cards */}
        <section aria-labelledby="contact-cards-heading" className="mb-12">
          <h2 id="contact-cards-heading" className="sr-only">
            Contact information
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_32px_rgba(11,31,59,0.06)] transition hover:-translate-y-0.5 hover:border-brand-saffron/30 hover:shadow-lg"
              >
                <span className="text-2xl" aria-hidden>
                  {card.icon}
                </span>
                <h3 className="mt-3 text-sm font-bold uppercase tracking-wider text-brand-navy">
                  {card.title}
                </h3>
                <div className="mt-2 text-sm">{card.content}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact form */}
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

          {/* Map */}
          <section aria-labelledby="contact-map-heading">
            <h2
              id="contact-map-heading"
              className="mb-4 text-xl font-bold text-brand-navy md:text-2xl"
            >
              Find Us
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              {DHE_ORGANIZATION.address.formatted}
            </p>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
              <iframe
                title={`${DHE_ORGANIZATION.name} office location map`}
                src={DHE_MAP_EMBED_URL}
                className="h-64 w-full md:h-80 lg:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-center text-sm">
              <a
                href={DHE_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-saffron-dark hover:underline"
              >
                Open in Google Maps →
              </a>
            </p>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          For registration support, visit{" "}
          <Link href="/registration" className="font-semibold text-brand-navy hover:text-brand-saffron-dark">
            Registration
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
