"use client";

import type { ReactNode } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import PageCtaSection from "./PageCtaSection";
import RelatedContentSectionClient from "@/components/knowledge-graph/RelatedContentSectionClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export interface PublicPageHero {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "navy" | "saffron" | "emerald" | "brand";
  imageSrc?: string;
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
    <div className="min-h-screen bg-white">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbJsonLd items={breadcrumbs} />
      )}
      <NavBar />
      {showHero && hero && (
        <ShowcaseHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          subtitle={hero.subtitle}
          accent={hero.accent ?? "brand"}
          imageSrc={hero.imageSrc}
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
