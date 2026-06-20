"use client";

import type { ReactNode } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import PageCtaSection from "@/components/layouts/PageCtaSection";
import PressShareButtons from "./PressShareButtons";
import RelatedContentSectionClient from "@/components/knowledge-graph/RelatedContentSectionClient";

interface PressArticleShellProps {
  title: string;
  subtitle?: string;
  canonicalPath: string;
  shareUrl: string;
  shareText: string;
  shareImage?: string;
  children: ReactNode;
}

export default function PressArticleShell({
  title,
  subtitle,
  canonicalPath,
  shareUrl,
  shareText,
  shareImage,
  children,
}: PressArticleShellProps) {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <ShowcaseHero
        eyebrow="Press Release"
        title={title}
        subtitle={subtitle}
        accent="navy"
      />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <article className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-saffron">
          {children}
        </article>
        <PressShareButtons
          shareUrl={shareUrl}
          shareText={shareText}
          shareImage={shareImage}
        />
      </main>
      <RelatedContentSectionClient
        path={canonicalPath}
        title="Related programmes & resources"
      />
      <PageCtaSection />
      <Footer />
    </div>
  );
}
