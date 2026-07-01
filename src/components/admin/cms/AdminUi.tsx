"use client";

import { ReactNode } from "react";
import { useAdmin } from "@/lib/adminAuth";
import { roleHasPermission } from "@/lib/admin-role-capabilities";
import type { PermissionSlug } from "@/lib/permissions";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  const variants = {
    primary: "bg-brand-navy text-white hover:bg-brand-navy/90",
    secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-brand-navy hover:bg-slate-100",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  return (
    <button
      type="button"
      className={`inline-flex min-h-[44px] items-center justify-center rounded-lg font-semibold transition disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
) {
  const { label, className = "", id, ...rest } = props;
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block text-sm">
      {label && (
        <span className="mb-1 block font-medium text-slate-700">{label}</span>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 ${className}`}
        {...rest}
      />
    </label>
  );
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
) {
  const { label, className = "", id, ...rest } = props;
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block text-sm">
      {label && (
        <span className="mb-1 block font-medium text-slate-700">{label}</span>
      )}
      <textarea
        id={inputId}
        className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 ${className}`}
        {...rest}
      />
    </label>
  );
}

export function AdminSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    options: Array<{ value: string; label: string }>;
  }
) {
  const { label, options, className = "", id, ...rest } = props;
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block text-sm">
      {label && (
        <span className="mb-1 block font-medium text-slate-700">{label}</span>
      )}
      <select
        id={inputId}
        className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20 ${className}`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-800",
    draft: "bg-slate-100 text-slate-700",
    archived: "bg-amber-100 text-amber-800",
    scheduled: "bg-blue-100 text-blue-800",
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-slate-100 text-slate-600",
  };
  const cls = colors[status.toLowerCase()] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-600">
      {message}
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-slate-500">
      Loading…
    </div>
  );
}

export function AdminPagination({
  offset,
  limit,
  total,
  onPage,
}: {
  offset: number;
  limit: number;
  total: number;
  onPage: (nextOffset: number) => void;
}) {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
      <span>
        Page {page} of {pages} · {total} total
      </span>
      <div className="flex gap-2">
        <AdminButton
          size="sm"
          variant="secondary"
          disabled={offset <= 0}
          onClick={() => onPage(Math.max(0, offset - limit))}
        >
          Previous
        </AdminButton>
        <AdminButton
          size="sm"
          variant="secondary"
          disabled={offset + limit >= total}
          onClick={() => onPage(offset + limit)}
        >
          Next
        </AdminButton>
      </div>
    </div>
  );
}

export function AdminLocaleSelect({
  value,
  onChange,
  label = "Locale",
  className = "",
}: {
  value: string;
  onChange: (locale: string) => void;
  label?: string;
  className?: string;
}) {
  return (
    <AdminSelect
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      options={[
        { value: "en", label: "English (en)" },
        { value: "hi", label: "Hindi (hi)" },
      ]}
    />
  );
}

export function CmsReadOnlyBanner() {
  const { role, permissions } = useAdmin();
  if (roleHasPermission(role, "media.manage", permissions)) return null;
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
      View-only access — you can browse CMS content but cannot save or publish. Contact an Admin for
      changes.
    </div>
  );
}

export function useCmsCanMutate(requiredPermission: PermissionSlug = "media.manage"): boolean {
  const { role, permissions } = useAdmin();
  return roleHasPermission(role, requiredPermission, permissions);
}

/** External link that only renders for http(s) URLs from CMS records. */
export function AdminSafeExternalLink({
  href,
  children,
  className = "",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string | null | undefined }) {
  const safe = sanitizeExternalUrl(href);
  if (!safe) {
    return <span className={`text-slate-500 ${className}`}>Unavailable</span>;
  }
  return (
    <a
      href={safe}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
