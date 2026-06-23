import type { FC, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

export const GlobeEducationIcon: FC<IconProps> = ({
  className = "h-6 w-6",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" />
    <path d="M6.5 8h11M6.5 16h11" />
  </svg>
);

export const InnovationIcon: FC<IconProps> = ({
  className = "h-6 w-6",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3 10v2h6v-2a6 6 0 0 0-3-10z" />
    <path d="M8 14h8" />
  </svg>
);

export const KnowledgeIcon: FC<IconProps> = ({
  className = "h-6 w-6",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M4 19V5l8-2 8 2v14l-8 2-8-2z" />
    <path d="M12 3v18M4 5l8 3 8-3" />
  </svg>
);

export const ConferenceIcon: FC<IconProps> = ({
  className = "h-6 w-6",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M8 9h8M8 13h5" />
    <path d="M7 3v2M17 3v2" />
  </svg>
);

export const MediaPartnerIcon: FC<IconProps> = ({
  className = "h-6 w-6",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M4 6h16v12H4z" />
    <path d="M8 10h8M8 14h5" />
    <path d="M18 9l2-1v8l-2-1" />
  </svg>
);

export const SponsorPartnerIcon: FC<IconProps> = ({
  className = "h-6 w-6",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 17.9l.9-5.4L4.2 8.7l5.4-.8L12 3z" />
    <path d="M8 21h8" />
  </svg>
);

export const ExternalLinkIcon: FC<IconProps> = ({
  className = "h-4 w-4",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </svg>
);
