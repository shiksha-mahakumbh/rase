"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminRole } from "@/types/registration";

type AdminHeaderProps = {
  title: string;
  titleHref?: string;
  userEmail?: string | null;
  role?: AdminRole | null;
  onLogout: () => void;
  menuButton?: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

export default function AdminHeader({
  title,
  titleHref,
  userEmail,
  role,
  onLogout,
  menuButton,
  trailing,
  className = "",
}: AdminHeaderProps) {
  const titleNode = titleHref ? (
    <Link href={titleHref} className="text-sm font-bold text-brand-navy">
      {title}
    </Link>
  ) : (
    <span className="text-sm font-bold text-brand-navy">{title}</span>
  );

  return (
    <header className={`sticky top-0 z-40 border-b border-slate-200 bg-white ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {menuButton}
          {titleNode}
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          <span className="hidden max-w-[220px] truncate text-slate-600 sm:inline" title={userEmail ?? ""}>
            {userEmail}
            {userEmail && role ? " · " : ""}
            {role}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </div>
      {trailing}
    </header>
  );
}
