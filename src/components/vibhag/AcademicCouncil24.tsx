"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AcademicCouncilTabId } from "@/data/academic-council-content";
import {
  ACADEMIC_COUNCIL_PATH,
  academicCouncilProgrammeUrl,
  academicCouncilTabFromSlug,
  academicCouncilTabSlug,
} from "@/data/academic-council-hub";
import { NavChevronIcon } from "@/components/layout/navbar/NavMenuIcons";
import OverviewPage from "./academic/AcademicCouncilOverview";
import ConferencePage from "./academic/pages/ConferencePage";
import ConclavePage from "./academic/pages/ConclavePage";
import AwardsPage from "./academic/pages/AwardsPage";
import OlympiadPage from "./academic/pages/OlympiadPage";
import ExhibitionPage from "./academic/pages/ExhibitionPage";
import ProjectsPage from "./academic/pages/ProjectsPage";
import BestPracticesPage from "./academic/pages/BestPracticesPage";
import PatrikaPage from "./academic/pages/PatrikaPage";
import CulturalPage from "./academic/pages/CulturalPage";

const pages: { id: AcademicCouncilTabId; label: string }[] = [
  { id: "OverviewPage", label: "Overview" },
  { id: "ConferencePage", label: "Conference" },
  { id: "ConclavePage", label: "Conclave" },
  { id: "AwardsPage", label: "Awards" },
  { id: "OlympiadPage", label: "Olympiad" },
  { id: "ExhibitionPage", label: "Exhibition" },
  { id: "ProjectsPage", label: "Projects" },
  { id: "BestPracticesPage", label: "Best Practices" },
  { id: "PatrikaPage", label: "Bal Shodh Patrika" },
  { id: "CulturalPage", label: "Cultural Program" },
];

function readTabFromLocation(): AcademicCouncilTabId {
  if (typeof window === "undefined") return "OverviewPage";
  const slug = window.location.hash.replace(/^#/, "");
  return academicCouncilTabFromSlug(slug || null);
}

function renderPage(id: AcademicCouncilTabId, onNavigate: (tabId: AcademicCouncilTabId) => void) {
  switch (id) {
    case "OverviewPage":
      return <OverviewPage onNavigate={onNavigate} />;
    case "ConferencePage":
      return <ConferencePage />;
    case "ConclavePage":
      return <ConclavePage />;
    case "AwardsPage":
      return <AwardsPage />;
    case "OlympiadPage":
      return <OlympiadPage />;
    case "ExhibitionPage":
      return <ExhibitionPage />;
    case "ProjectsPage":
      return <ProjectsPage />;
    case "BestPracticesPage":
      return <BestPracticesPage />;
    case "PatrikaPage":
      return <PatrikaPage />;
    case "CulturalPage":
      return <CulturalPage />;
    default:
      return <OverviewPage onNavigate={onNavigate} />;
  }
}

export default function AcademicCouncilDashboard() {
  const [active, setActive] = useState<AcademicCouncilTabId>("OverviewPage");
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const selectPage = useCallback((id: AcademicCouncilTabId) => {
    setActive(id);
    setMenuOpen(false);
    const slug = academicCouncilTabSlug(id);
    const nextUrl = slug === "overview" ? ACADEMIC_COUNCIL_PATH : `${ACADEMIC_COUNCIL_PATH}#${slug}`;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", nextUrl);
    }
  }, []);

  useEffect(() => {
    setActive(readTabFromLocation());
    const onHashChange = () => setActive(readTabFromLocation());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const panel = mainRef.current;
    if (!panel) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [active]);

  const activeLabel = pages.find((p) => p.id === active)?.label ?? "Programme";

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface lg:flex-row">
      <a
        href="#ac-main-panel"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-[calc(var(--nav-offset,3.5rem)+0.5rem)] focus:z-50 focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to programme content
      </a>

      <aside
        className="hidden w-72 flex-shrink-0 flex-col border-r border-brand-navy/10 bg-white p-5 shadow-lg lg:sticky lg:top-[var(--nav-offset,3.5rem)] lg:z-20 lg:flex lg:max-h-[calc(100dvh-var(--nav-offset,3.5rem))] lg:overflow-y-auto"
        aria-label="Academic Council programmes"
      >
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy-light p-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            शैक्षिक विभाग
          </p>
          <p className="text-xl font-bold">Programme navigator</p>
          <p className="mt-1 text-xs text-white/80">Shiksha Mahakumbh 6.0</p>
        </div>
        <nav className="flex-1 space-y-1" role="tablist" aria-orientation="vertical">
          {pages.map((p) => (
            <a
              key={p.id}
              href={academicCouncilProgrammeUrl(p.id)}
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={active === p.id}
              aria-controls="ac-main-panel"
              onClick={(event) => {
                event.preventDefault();
                selectPage(p.id);
              }}
              className={`flex w-full min-h-[44px] items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron ${
                active === p.id
                  ? "bg-brand-saffron text-brand-navy shadow-md"
                  : "text-slate-700 hover:bg-brand-navy/5"
              }`}
            >
              {p.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="sticky top-[var(--nav-offset,3.5rem)] z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex w-full min-h-[44px] items-center justify-between rounded-xl border border-brand-navy/20 bg-brand-navy/5 px-4 py-2 text-sm font-semibold text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
          aria-expanded={menuOpen}
          aria-controls="ac-mobile-nav"
        >
          <span className="truncate pr-2">{activeLabel}</span>
          <NavChevronIcon
            className={`h-4 w-4 shrink-0 transition ${menuOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {menuOpen ? (
          <nav
            id="ac-mobile-nav"
            className="mt-2 max-h-[min(60vh,360px)] space-y-1 overflow-y-auto rounded-xl border border-slate-100 bg-white p-2 shadow-lg"
            role="tablist"
          >
            {pages.map((p) => (
              <a
                key={p.id}
                href={academicCouncilProgrammeUrl(p.id)}
                role="tab"
                id={`tab-mobile-${p.id}`}
                aria-selected={active === p.id}
                aria-controls="ac-main-panel"
                onClick={(event) => {
                  event.preventDefault();
                  selectPage(p.id);
                }}
                className={`flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron ${
                  active === p.id ? "bg-brand-navy text-white" : "bg-slate-50 text-slate-700"
                }`}
              >
                {p.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      <main
        ref={mainRef}
        id="ac-main-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        aria-live="polite"
        aria-atomic="true"
        className="min-w-0 flex-1 scroll-mt-[calc(var(--nav-offset,3.5rem)+4.5rem)] p-3 pt-4 sm:p-4 lg:scroll-mt-[var(--nav-offset,3.5rem)] lg:p-6 lg:pt-8"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:rounded-3xl">
          {renderPage(active, selectPage)}
        </div>
      </main>
    </div>
  );
}
