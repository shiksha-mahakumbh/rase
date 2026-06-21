import React from "react";

interface IconProps {
  className?: string;
}

export const NavHomeIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
  </svg>
);

export const NavRegisterIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <path d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavAboutIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
  </svg>
);

export const NavEventsIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M8 3v3M16 3v3M4 10h16" strokeLinecap="round" />
  </svg>
);

export const NavChevronIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const getMenuIcon = (title: string): React.ReactNode => {
  switch (title) {
    case "Home":
      return <NavHomeIcon />;
    case "Registration":
      return <NavRegisterIcon />;
    case "About Us":
    case "About":
      return <NavAboutIcon />;
    case "Brochures":
    case "Speakers":
      return <NavEventsIcon />;
    case "Events":
    case "Publication":
    case "Gallery":
      return <NavEventsIcon />;
    default:
      return null;
  }
};
