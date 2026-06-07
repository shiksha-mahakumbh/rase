"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/app/firebase";

interface FooterContactFormProps {
  variant?: "light" | "dark";
}

export default function FooterContactForm({
  variant = "dark",
}: FooterContactFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isDark = variant === "dark";
  const inputClass = isDark
    ? "w-full rounded-lg border border-white/20 bg-white/10 p-2.5 text-sm text-white placeholder:text-gray-500 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
    : "w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron";
  const buttonClass = isDark
    ? "w-full rounded-lg bg-brand-saffron py-2.5 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-saffron-dark"
    : "w-full rounded-lg bg-brand-saffron py-2.5 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-saffron-dark";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contactMessages"), {
        email,
        message,
        timestamp: new Date(),
        source: "footer",
      });
      setEmail("");
      setMessage("");
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
      <button type="submit" className={buttonClass}>
        Send Message
      </button>
    </form>
  );
}
