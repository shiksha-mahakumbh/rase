"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConferenceIcon, GlobeEducationIcon } from "./home/icons";
import { REGISTRATION_PATH } from "./UpcomingEvent";

const accordionItems = [
  {
    id: "programmes",
    title: "Programmes @ Shiksha Mahakumbh 6.0",
    summary: "Conclaves, olympiads, exhibitions, awards & more",
    href: "/departments/academic-council",
    cta: "View Programmes",
    icon: ConferenceIcon,
  },
  {
    id: "register",
    title: "Registration Open — Shiksha Mahakumbh 6.0",
    summary: "9–11 Oct 2026 · NIT Hamirpur · All registration types",
    href: REGISTRATION_PATH,
    cta: "Register Now",
    icon: GlobeEducationIcon,
  },
];

const Announcement = () => {
  const [openId, setOpenId] = useState<string | null>(accordionItems[0].id);

  return (
    <div className="w-full px-3 py-4 md:px-4 md:py-5">
      <div className="mx-auto max-w-3xl space-y-2">
        {accordionItems.map((item) => {
          const isOpen = openId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-primary/10 bg-white/90 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-primary/5"
                aria-expanded={isOpen}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-gray-900">
                    {item.title}
                  </span>
                  {!isOpen && (
                    <span className="block truncate text-xs text-gray-500">
                      {item.summary}
                    </span>
                  )}
                </span>
                <span
                  className={`text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 px-4 pb-4 pt-2">
                      <p className="mb-3 text-sm text-gray-600">{item.summary}</p>
                      <Link
                        href={item.href}
                        className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                      >
                        {item.cta}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Announcement;
