import { ReactNode } from "react";

interface HeroCardProps {
  children: ReactNode;
  className?: string;
}

export default function HeroCard({ children, className = "" }: HeroCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
