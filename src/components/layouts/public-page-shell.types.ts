import type { ReactNode } from "react";

export interface PublicPageHero {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "navy" | "saffron" | "emerald" | "brand";
  imageSrc?: string;
  imageAlt?: string;
  /** When false, hero image loads lazily (use on pages with a separate LCP image). */
  imagePriority?: boolean;
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
