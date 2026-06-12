"use client";

import type { ReactNode } from "react";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import PageCtaSection from "./PageCtaSection";
import RelatedContentSectionClient from "@/components/knowledge-graph/RelatedContentSectionClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export interface PublicPageHero {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "navy" | "saffron" | "emerald";
}

export interface PublicPageShellProps {
  hero?: PublicPageHero;
  showHero?: boolean;
  showCta?: boolean;
  relatedPath?: string;
  relatedTitle?: string;
  breadcrumbs?: { name: string; path: string }[];
  children: ReactNode;
  mainClassName?: string;
  containerClassName?: string;
  skipContainer?: boolean;
}

export default function PublicPageShell({
  hero,
  showHero = true,
  showCta = true,
  relatedPath,
  relatedTitle = "Related programmes & resources",
  breadcrumbs,
  children,
  mainClassName = "",
  containerClassName = "mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20",
  skipContainer = false,
}: PublicPageShellProps) {
  return (
    <div className="min-h-screen bg-brand-surface">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbJsonLd items={breadcrumbs} />
      )}
      <NavBar />
      {showHero && hero && (
        <ShowcaseHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          subtitle={hero.subtitle}
          accent={hero.accent ?? "navy"}
        />
      )}
      <main id="main-content" className={mainClassName}>
        {skipContainer ? children : (
          <div className={containerClassName}>{children}</div>
        )}
      </main>
      {relatedPath && (
        <RelatedContentSectionClient
          path={relatedPath}
          title={relatedTitle}
          className="mx-auto max-w-5xl px-4 py-8"
        />
      )}
      {showCta && <PageCtaSection />}
      <Footer />
    </div>
  );
}
