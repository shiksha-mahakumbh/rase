"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const pageMap = {
  OverviewPage: <OverviewPage />,
  ConferencePage: <ConferencePage />,
  ConclavePage: <ConclavePage />,
  AwardsPage: <AwardsPage />,
  OlympiadPage: <OlympiadPage />,
  ExhibitionPage: <ExhibitionPage />,
  ProjectsPage: <ProjectsPage />,
  BestPracticesPage: <BestPracticesPage />,
  PatrikaPage: <PatrikaPage />,
  CulturalPage: <CulturalPage />,
} as const;

type PageId = keyof typeof pageMap;

const pages: { id: PageId; label: string }[] = [
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

export default function AcademicCouncilDashboard() {
  const [active, setActive] = useState<PageId>("OverviewPage");
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const selectPage = useCallback((id: PageId) => {
    setActive(id);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface lg:flex-row">
      <a
        href="#ac-main-panel"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-50 focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to programme content
      </a>

      {/* Desktop sidebar */}
      <aside
        className="hidden w-72 flex-shrink-0 flex-col border-r border-brand-navy/10 bg-white p-5 shadow-lg lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto"
        aria-label="Academic Council programmes"
      >
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy-light p-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            शैक्षिक विभाग
          </p>
          <h2 className="text-xl font-bold">Academic Council</h2>
          <p className="mt-1 text-xs text-white/80">Shiksha Mahakumbh 6.0</p>
        </div>
        <nav className="flex-1 space-y-1" role="tablist" aria-orientation="vertical">
          {pages.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={active === p.id}
              aria-controls="ac-main-panel"
              onClick={() => selectPage(p.id)}
              className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron ${
                active === p.id
                  ? "bg-brand-saffron text-brand-navy shadow-md"
                  : "text-slate-700 hover:bg-brand-navy/5"
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile programme selector */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex w-full min-h-[44px] items-center justify-between rounded-xl border border-brand-navy/20 bg-brand-navy/5 px-4 py-2 text-sm font-semibold text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-saffron"
          aria-expanded={menuOpen}
          aria-controls="ac-mobile-nav"
        >
          {pages.find((p) => p.id === active)?.label ?? "Menu"}
          <span aria-hidden>{menuOpen ? "▲" : "▼"}</span>
        </button>
        {menuOpen && (
          <nav
            id="ac-mobile-nav"
            className="mt-2 grid max-h-[min(60vh,320px)] grid-cols-2 gap-1.5 overflow-y-auto rounded-xl border border-slate-100 bg-white p-2 shadow-lg"
            role="tablist"
          >
            {pages.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active === p.id}
                onClick={() => selectPage(p.id)}
                className={`min-h-[44px] rounded-lg px-2 py-2 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-saffron ${
                  active === p.id
                    ? "bg-brand-navy text-white"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <main
        ref={mainRef}
        id="ac-main-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="min-w-0 flex-1 p-3 pt-4 sm:p-4 lg:p-6 lg:pt-8"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:rounded-3xl">
          {pageMap[active]}
        </div>
      </main>
    </div>
  );
}
