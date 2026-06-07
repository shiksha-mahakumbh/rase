"use client";

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";

export default function BrochureDownloadLink({
  href,
  children,
  className,
  plan,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  plan: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackEvent(ANALYTICS_EVENTS.brochureDownload, { source: plan })
      }
    >
      {children}
    </a>
  );
}
