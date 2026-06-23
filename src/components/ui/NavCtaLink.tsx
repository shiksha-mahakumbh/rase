"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { resolveNavHref } from "@/lib/security/safe-nav-url";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function NavCtaLink({ href, className, children }: Props) {
  const nav = resolveNavHref(href);

  if (nav.external) {
    return (
      <a
        href={nav.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={nav.href} className={className}>
      {children}
    </Link>
  );
}
