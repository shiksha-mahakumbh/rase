import type { ReactNode } from "react";

export type SectionBackground = "default" | "gradient" | "warm" | "cool" | "dark";

export interface SectionShellProps {
  children: ReactNode;
  id?: string;
  className?: string;
  background?: SectionBackground;
  ariaLabel?: string;
}

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export interface ImpactStat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export interface EditionItem {
  title: string;
  date: string;
  theme: string;
  focus: string;
}
