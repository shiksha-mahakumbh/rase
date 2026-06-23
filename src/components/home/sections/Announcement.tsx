"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { ConferenceIcon, GlobeEducationIcon } from "@/components/icons/home";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionItems } from "@/lib/cms/utils";

const DEFAULT_ITEMS = [
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
    href: CANONICAL_ROUTES.registration,
    cta: "Register Now",
    icon: GlobeEducationIcon,
  },
];

export default function Announcement() {
  const cms = useCms();
  const section = getSection(cms?.homepage, "announcements");
  const cmsItems = sectionItems<{
    title: string;
    body: string;
    url?: string;
    cta?: string;
  }>(section);

  const accordionItems = cmsItems.length
    ? cmsItems.map((item, i) => ({
        id: `announcement-${i}`,
        title: item.title,
        summary: item.body,
        href: item.url ?? CANONICAL_ROUTES.registration,
        cta: item.cta ?? "Learn more",
        icon: i % 2 === 0 ? ConferenceIcon : GlobeEducationIcon,
      }))
    : DEFAULT_ITEMS;

  const [openId, setOpenId] = useState<string | null>(accordionItems[0]?.id ?? null);
  const reduceMotion = useReducedMotion();

  return (
    <GlassCard hover={false} className="h-full p-4 md:p-5">
      <div className="space-y-2">
        {accordionItems.map((item) => {
          const isOpen = openId === item.id;
          const Icon = item.icon;
          const panelId = `announcement-panel-${item.id}`;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-primary/10 bg-white/90 shadow-sm"
            >
              <button
                type="button"
                id={`announcement-trigger-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenId(isOpen ? null : item.id);
                  }
                }}
                className="flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-gray-900">{item.title}</span>
                  {!isOpen && (
                    <span className="block truncate text-xs text-gray-500">{item.summary}</span>
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
                    id={panelId}
                    role="region"
                    aria-labelledby={`announcement-trigger-${item.id}`}
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 px-4 pb-4 pt-2">
                      <p className="mb-3 text-sm text-gray-600">{item.summary}</p>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
    </GlassCard>
  );
}
