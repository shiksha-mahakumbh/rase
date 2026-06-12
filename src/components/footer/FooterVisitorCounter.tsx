"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { shouldTrackAnalytics } from "@/lib/analytics/track-path";
import { getSessionId, getVisitorId, LEGACY_VISITOR_OFFSET } from "@/lib/analytics/visitor-ids";

type VisitorCounts = {
  daily: number;
  total: number;
  displayTotal: number;
  activeUsers?: number;
  source?: string;
  degraded?: boolean;
};

const FALLBACK: VisitorCounts = {
  daily: 0,
  total: 0,
  displayTotal: LEGACY_VISITOR_OFFSET,
  activeUsers: 0,
};

function CounterSkeleton() {
  return (
    <span
      className="inline-block h-6 w-12 animate-pulse rounded bg-gray-300"
      aria-hidden
    />
  );
}

export default function FooterVisitorCounter() {
  const pathname = usePathname();
  const [dailyVisitors, setDailyVisitors] = useState<number | null>(null);
  const [displayTotal, setDisplayTotal] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [degraded, setDegraded] = useState(false);
  const countedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      try {
        const trackVisit = shouldTrackAnalytics(pathname);

        if (trackVisit && !countedRef.current) {
          const postRes = await fetch("/api/visitors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: getSessionId(),
              visitorId: getVisitorId(),
              path: pathname ?? "/",
            }),
          });
          if (postRes.ok) countedRef.current = true;
        }

        const res = await fetch("/api/visitors", { cache: "no-store" });
        const data = (await res.json()) as VisitorCounts;
        if (cancelled) return;

        const isDegraded =
          !res.ok || data.source === "fallback" || data.degraded === true;
        setDegraded(isDegraded);

        if (isDegraded) {
          setDailyVisitors(FALLBACK.daily);
          setDisplayTotal(FALLBACK.displayTotal);
          setActiveUsers(0);
        } else {
          setDailyVisitors(data.daily ?? FALLBACK.daily);
          setDisplayTotal(data.displayTotal ?? FALLBACK.displayTotal);
          setActiveUsers(data.activeUsers ?? 0);
        }
      } catch (error) {
        console.error("Footer visitor counter:", error);
        if (!cancelled) {
          setDegraded(true);
          setDailyVisitors(FALLBACK.daily);
          setDisplayTotal(FALLBACK.displayTotal);
          setActiveUsers(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <div
      className="mt-4 rounded-xl bg-gray-100 p-4 text-black"
      aria-live="polite"
      aria-label="Visitor statistics"
    >
      {degraded && !loading && (
        <p className="mb-2 text-center text-xs text-amber-700" role="status">
          Live counts temporarily unavailable
        </p>
      )}
      <div className="flex items-center justify-around">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Daily Visitors
          </p>
          <p className="text-xl font-extrabold text-primary">
            {loading ? <CounterSkeleton /> : dailyVisitors}
          </p>
        </div>
        <div className="h-10 w-px bg-gray-300" aria-hidden />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Total Visitors
          </p>
          <p className="text-xl font-extrabold text-primary">
            {loading ? <CounterSkeleton /> : displayTotal?.toLocaleString()}
          </p>
        </div>
        <div className="h-10 w-px bg-gray-300" aria-hidden />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Active Now
          </p>
          <p className="text-xl font-extrabold text-primary">
            {loading ? <CounterSkeleton /> : activeUsers}
          </p>
        </div>
      </div>
    </div>
  );
}
