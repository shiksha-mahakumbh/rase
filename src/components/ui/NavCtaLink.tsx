"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { resolveNavHref } from "@/lib/security/safe-nav-url";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function NavCtaLink({ href, className, children, onClick }: Props) {
  const nav = resolveNavHref(href);

  if (nav.external) {
    return (
      <a
        href={nav.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={nav.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
