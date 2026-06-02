import React from "react";

interface IconProps {
  className?: string;
}

export const GlobeEducationIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" />
    <path d="M6.5 8h11M6.5 16h11" />
  </svg>
);

export const ResearchIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 3h6v4l5 9H4l5-9V3z" />
    <path d="M9 7h6M7 21h10" />
    <circle cx="12" cy="14" r="2" />
  </svg>
);

export const InnovationIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3 10v2h6v-2a6 6 0 0 0-3-10z" />
    <path d="M8 14h8" />
  </svg>
);

export const LeadershipIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 15l-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 2z" />
    <path d="M5 20h14M8 22h8" />
  </svg>
);

export const KnowledgeIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 19V5l8-2 8 2v14l-8 2-8-2z" />
    <path d="M12 3v18M4 5l8 3 8-3" />
  </svg>
);

export const SocietyIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <circle cx="9" cy="7" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M14 20c0-2.2 1.8-4 4-4" />
  </svg>
);

export const TimelineIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const ConferenceIcon: React.FC<IconProps> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M8 9h8M8 13h5" />
    <path d="M7 3v2M17 3v2" />
  </svg>
);
