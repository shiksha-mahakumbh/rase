import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  action?: ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
  action,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const isDark = theme === "dark";

  return (
    <div className={`mb-8 md:mb-10 max-w-3xl ${alignClass} ${className}`}>
      {eyebrow ? (
        <p
          className={`mb-2 text-xs font-bold uppercase tracking-[0.2em] ${
            isDark ? "text-brand-saffron" : "text-brand-saffron-dark"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl ${
          isDark ? "text-white" : "text-brand-navy"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-3 text-base leading-relaxed md:text-lg ${
            isDark ? "text-slate-200" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
