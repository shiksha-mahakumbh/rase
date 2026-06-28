"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resolveLocalePaths } from "@/lib/i18n/locale-paths";

type Props = {
  className?: string;
};

function pillClass(active: boolean) {
  return [
    "inline-flex min-h-[2.25rem] items-center rounded-md px-2.5 text-xs font-semibold transition sm:text-sm",
    active
      ? "bg-brand-surface-warm text-brand-navy"
      : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy",
  ].join(" ");
}

/** Lightweight en/hi links — usePathname only, no next-intl client bundle. */
export default function NavLanguageLinks({ className = "" }: Props) {
  const pathname = usePathname() ?? "/";
  const { current, enHref, hiHref } = resolveLocalePaths(pathname);

  return (
    <nav aria-label="Language" className={className}>
      <div className="flex min-h-11 min-w-[7.5rem] items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-1">
        <Link
          href={enHref}
          className={pillClass(current === "en")}
          aria-current={current === "en" ? "page" : undefined}
        >
          English
        </Link>
        <Link
          href={hiHref}
          className={pillClass(current === "hi")}
          aria-current={current === "hi" ? "page" : undefined}
        >
          हिन्दी
        </Link>
      </div>
    </nav>
  );
}
