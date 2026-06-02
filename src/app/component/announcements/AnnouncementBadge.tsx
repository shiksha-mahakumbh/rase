import React from "react";
import type { AnnouncementBadge as BadgeType } from "../navbar/types";

const badgeStyles: Record<BadgeType, string> = {
  New: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Important: "bg-rose-100 text-rose-800 border-rose-200",
  Upcoming: "bg-sky-100 text-sky-800 border-sky-200",
  "Registration Open": "bg-amber-100 text-amber-900 border-amber-200",
  Featured: "bg-primary/10 text-primary border-primary/20",
};

interface AnnouncementBadgeProps {
  label: BadgeType;
}

const AnnouncementBadge: React.FC<AnnouncementBadgeProps> = ({ label }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide md:text-xs ${badgeStyles[label]}`}
  >
    {label}
  </span>
);

export default AnnouncementBadge;
