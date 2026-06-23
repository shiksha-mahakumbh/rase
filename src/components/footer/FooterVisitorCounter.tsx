"use client";

import { useEffect, useState } from "react";
import { LEGACY_VISITOR_OFFSET } from "@/lib/analytics/visitor-ids";

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
      className="inline-block h-6 w-12 animate-pulse rounded bg-white/20"
      aria-hidden
    />
  );
}

export default function FooterVisitorCounter() {
  const [dailyVisitors, setDailyVisitors] = useState<number | null>(null);
  const [displayTotal, setDisplayTotal] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    async function loadCounts() {
      try {
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
    intervalId = setInterval(loadCounts, 60_000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className="mt-4 w-full max-w-md rounded-xl border border-white/15 bg-white/10 p-4 text-white"
      aria-live="polite"
      aria-label="Visitor statistics"
    >
      {degraded && !loading && (
        <p className="mb-2 text-center text-xs text-amber-200/90" role="status">
          Live counts temporarily unavailable
        </p>
      )}
      <div className="flex items-center justify-around gap-2">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
            Daily Visitors
          </p>
          <p className="text-lg font-extrabold text-brand-saffron md:text-xl">
            {loading ? <CounterSkeleton /> : dailyVisitors}
          </p>
        </div>
        <div className="h-8 w-px bg-white/20" aria-hidden />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
            Total Visitors
          </p>
          <p className="text-lg font-extrabold text-brand-saffron md:text-xl">
            {loading ? <CounterSkeleton /> : displayTotal?.toLocaleString()}
          </p>
        </div>
        <div className="h-8 w-px bg-white/20" aria-hidden />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
            Active Now
          </p>
          <p className="text-lg font-extrabold text-brand-saffron md:text-xl">
            {loading ? <CounterSkeleton /> : activeUsers}
          </p>
        </div>
      </div>
    </div>
  );
}
